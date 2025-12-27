/**
 * installed command - List installed Skills
 */
import { Command } from "@cliffy/command";
import { bold, cyan, getSkillsInstallDir, scanSkills, t } from "../lib/mod.ts";
import type { InstalledSkillsResult } from "../types/mod.ts";

export const installedCommand = new Command()
  .name("installed")
  .alias("managed")
  .description("List installed Skills")
  .option("-g, --global", "Show global installations only")
  .option("--project", "Show project installations only")
  .option("--json", "Output in JSON format")
  .action(async (options) => {
    const showGlobal = options.global || (!options.global && !options.project);
    const showProject = options.project || (!options.global && !options.project);

    const results: InstalledSkillsResult[] = [];

    if (showGlobal) {
      const globalDir = getSkillsInstallDir(true);
      try {
        await Deno.stat(globalDir);
        const skills = await scanSkills(globalDir);
        results.push({ location: `${t("common.global")} (${globalDir})`, skills });
      } catch {
        // Directory doesn't exist
      }
    }

    if (showProject) {
      const projectDir = getSkillsInstallDir(false);
      try {
        await Deno.stat(projectDir);
        const skills = await scanSkills(projectDir);
        results.push({ location: `${t("common.project")} (${projectDir})`, skills });
      } catch {
        // Directory doesn't exist
      }
    }

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    let totalCount = 0;
    for (const { location, skills } of results) {
      console.log(`\n📁 ${bold(location)}`);
      if (skills.length === 0) {
        console.log(`   ${t("installed.noInstalled")}`);
      } else {
        for (const skill of skills) {
          console.log(`   ${cyan(skill.name)}`);
          totalCount++;
        }
      }
    }

    if (totalCount === 0) {
      console.log(`\n💡 ${t("installed.useInstall")}`);
    } else {
      console.log(`\n📊 ${t("installed.total", { count: totalCount })}`);
    }
  });
