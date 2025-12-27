/**
 * install 命令 - 安装 Skill
 */
import { Command } from "@cliffy/command";
import {
  getSkillsInstallDir,
  ensureDir,
  resolve,
  join,
  basename,
  dirname,
  copyDir,
  walk,
} from "../lib/mod.ts";
import { getRepoInfo, downloadRepoZip } from "../lib/github.ts";
import { parseFrontmatter } from "../lib/parser.ts";

export const installCommand = new Command()
  .name("install")
  .alias("add")
  .description("安装 Skill (GitHub 或本地目录)")
  .arguments("<source:string>")
  .option("-g, --global", "全局安装")
  .option("-f, --force", "强制覆盖安装")
  .action(async (options, source: string) => {
    const isGlobal = options.global || false;
    const installDir = getSkillsInstallDir(isGlobal);

    console.log(`📦 安装 Skill: ${source}`);
    console.log(`   目标目录: ${installDir}`);
    console.log(`   模式: ${isGlobal ? "全局" : "项目"}\n`);

    await ensureDir(installDir);

    const isLocalPath =
      source.startsWith("/") ||
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
  force?: boolean
) {
  const resolvedPath = resolve(sourcePath);
  const skillMdPath = join(resolvedPath, "SKILL.md");

  try {
    await Deno.stat(skillMdPath);
  } catch {
    console.log(`❌ 无效的 Skill 目录: ${resolvedPath}`);
    console.log("   目录中必须包含 SKILL.md 文件");
    return;
  }

  const content = await Deno.readTextFile(skillMdPath);
  const { frontmatter } = parseFrontmatter(content);
  const skillName = String(frontmatter.name || basename(resolvedPath));

  const targetPath = join(installDir, skillName);

  try {
    await Deno.stat(targetPath);
    if (!force) {
      console.log(`⚠️  Skill "${skillName}" 已存在`);
      console.log(`   使用 --force 覆盖安装`);
      return;
    }
    await Deno.remove(targetPath, { recursive: true });
  } catch {
    // 目录不存在，继续
  }

  await copyDir(resolvedPath, targetPath);
  console.log(`✅ 已安装: ${skillName}`);
  console.log(`   路径: ${targetPath}`);
}

async function installFromGitHub(
  repo: string,
  installDir: string,
  force?: boolean
) {
  const parts = repo.split("/");
  if (parts.length < 2) {
    console.log(`❌ 无效的仓库格式: ${repo}`);
    console.log("   格式: <user>/<repo> 或 <user>/<repo>/<path>");
    return;
  }

  const owner = parts[0];
  const repoName = parts[1];
  const subPath = parts.slice(2).join("/");

  console.log(
    `⬇️  从 GitHub 下载: ${owner}/${repoName}${subPath ? "/" + subPath : ""}...`
  );

  try {
    const repoInfo = await getRepoInfo(owner, repoName);
    if (!repoInfo) {
      console.log(`❌ 仓库不存在: ${owner}/${repoName}`);
      return;
    }

    const defaultBranch = repoInfo.default_branch || "main";

    console.log(`⬇️  下载中...`);
    const zipData = await downloadRepoZip(owner, repoName, defaultBranch);

    const tempDir = await Deno.makeTempDir({ prefix: "skill-install-" });
    const zipPath = join(tempDir, "repo.zip");

    await Deno.writeFile(zipPath, new Uint8Array(zipData));

    console.log(`📦 解压中...`);
    const unzipProcess = new Deno.Command("unzip", {
      args: ["-q", zipPath, "-d", tempDir],
    });
    const unzipResult = await unzipProcess.output();

    if (!unzipResult.success) {
      throw new Error("解压失败");
    }

    const extractedDir = join(tempDir, `${repoName}-${defaultBranch}`);
    const sourceDir = subPath ? join(extractedDir, subPath) : extractedDir;

    const skillMdPath = join(sourceDir, "SKILL.md");
    try {
      await Deno.stat(skillMdPath);
    } catch {
      console.log(`⚠️  根目录没有 SKILL.md，尝试查找子目录...`);

      let foundSkills = 0;
      for await (const entry of walk(sourceDir, {
        maxDepth: 2,
        includeDirs: false,
        match: [/SKILL\.md$/],
      })) {
        const skillDir = dirname(entry.path);
        await installFromLocal(skillDir, installDir, force);
        foundSkills++;
      }

      if (foundSkills === 0) {
        console.log(`❌ 未找到任何 SKILL.md 文件`);
      } else {
        console.log(`\n✅ 共安装 ${foundSkills} 个 Skills`);
      }

      await Deno.remove(tempDir, { recursive: true });
      return;
    }

    await installFromLocal(sourceDir, installDir, force);
    await Deno.remove(tempDir, { recursive: true });
  } catch (e) {
    console.error(`❌ 安装失败: ${e}`);
  }
}
