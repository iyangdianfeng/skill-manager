/**
 * install command - Install Skill
 */
import { Command } from "@cliffy/command";
import {
  basename,
  copyDir,
  dirname,
  ensureDir,
  getSkillsInstallDir,
  join,
  resolve,
  t,
  walk,
} from "../lib/mod.ts";
import { downloadRepoZip, getRepoInfo } from "../lib/github.ts";
import { parseFrontmatter } from "../lib/parser.ts";

export const installCommand = new Command()
  .name("install")
  .alias("add")
  .description("Install Skill (from GitHub or local directory)")
  .arguments("<source:string>")
  .option("-g, --global", "Install globally")
  .option("-f, --force", "Force overwrite installation")
  .action(async (options, source: string) => {
    const isGlobal = options.global || false;
    const installDir = getSkillsInstallDir(isGlobal);

    console.log(`📦 ${t("install.installing")}: ${source}`);
    console.log(`   ${t("install.targetDir")}: ${installDir}`);
    console.log(
      `   ${t("install.mode")}: ${isGlobal ? t("common.global") : t("common.project")}\n`,
    );

    await ensureDir(installDir);

    const isLocalPath = source.startsWith("/") ||
      source.startsWith("./") ||
      source.startsWith("../");

    if (isLocalPath) {
      await installFromLocal(source, installDir, options.force);
    } else {
      await installFromGitHub(source, installDir, options.force);
    }
  });

async function installFromLocal(
  sourcePath: string,
  installDir: string,
  force?: boolean,
) {
  const resolvedPath = resolve(sourcePath);
  const skillMdPath = join(resolvedPath, "SKILL.md");

  try {
    await Deno.stat(skillMdPath);
  } catch {
    console.log(`❌ ${t("install.invalidDir")}: ${resolvedPath}`);
    console.log(`   ${t("install.mustContain")}`);
    return;
  }

  const content = await Deno.readTextFile(skillMdPath);
  const { frontmatter } = parseFrontmatter(content);
  const skillName = String(frontmatter.name || basename(resolvedPath));

  const targetPath = join(installDir, skillName);

  try {
    await Deno.stat(targetPath);
    if (!force) {
      console.log(`⚠️  ${t("install.alreadyExists", { name: skillName })}`);
      console.log(`   ${t("install.useForce")}`);
      return;
    }
    await Deno.remove(targetPath, { recursive: true });
  } catch {
    // Directory doesn't exist, continue
  }

  await copyDir(resolvedPath, targetPath);
  console.log(`✅ ${t("success.installed")}: ${skillName}`);
  console.log(`   ${t("common.path")}: ${targetPath}`);
}

async function installFromGitHub(
  repo: string,
  installDir: string,
  force?: boolean,
) {
  const parts = repo.split("/");
  if (parts.length < 2) {
    console.log(`❌ ${t("install.invalidRepo")}: ${repo}`);
    console.log(`   ${t("install.repoHint")}`);
    return;
  }

  const owner = parts[0];
  const repoName = parts[1];
  const subPath = parts.slice(2).join("/");

  console.log(
    `⬇️  ${t("install.downloading")}: ${owner}/${repoName}${subPath ? "/" + subPath : ""}...`,
  );

  try {
    const repoInfo = await getRepoInfo(owner, repoName);
    if (!repoInfo) {
      console.log(`❌ ${t("install.repoNotFound")}: ${owner}/${repoName}`);
      return;
    }

    const defaultBranch = repoInfo.default_branch || "main";

    console.log(`⬇️  Downloading...`);
    const zipData = await downloadRepoZip(owner, repoName, defaultBranch);

    const tempDir = await Deno.makeTempDir({ prefix: "skill-install-" });
    const zipPath = join(tempDir, "repo.zip");

    await Deno.writeFile(zipPath, new Uint8Array(zipData));

    console.log(`📦 ${t("install.unzipping")}`);
    const unzipProcess = new Deno.Command("unzip", {
      args: ["-q", zipPath, "-d", tempDir],
    });
    const unzipResult = await unzipProcess.output();

    if (!unzipResult.success) {
      throw new Error(t("error.unzipFailed"));
    }

    const extractedDir = join(tempDir, `${repoName}-${defaultBranch}`);
    const sourceDir = subPath ? join(extractedDir, subPath) : extractedDir;

    const skillMdPath = join(sourceDir, "SKILL.md");
    try {
      await Deno.stat(skillMdPath);
    } catch {
      console.log(`⚠️  ${t("install.noSkillMdRoot")}`);

      let foundSkills = 0;
      for await (
        const entry of walk(sourceDir, {
          maxDepth: 2,
          includeDirs: false,
          match: [/SKILL\.md$/],
        })
      ) {
        const skillDir = dirname(entry.path);
        await installFromLocal(skillDir, installDir, force);
        foundSkills++;
      }

      if (foundSkills === 0) {
        console.log(`❌ ${t("install.noSkillMdFound")}`);
      } else {
        console.log(`\n✅ ${t("install.totalInstalled", { count: foundSkills })}`);
      }

      await Deno.remove(tempDir, { recursive: true });
      return;
    }

    await installFromLocal(sourceDir, installDir, force);
    await Deno.remove(tempDir, { recursive: true });
  } catch (e) {
    console.error(`❌ ${t("error.installFailed")}: ${e}`);
  }
}
