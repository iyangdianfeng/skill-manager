/**
 * installed 命令 - 列出已安装的 Skills
 */
import { Command } from "@cliffy/command";
import { getSkillsInstallDir, scanSkills, bold, cyan } from "../lib/mod.ts";
import type { InstalledSkillsResult } from "../types/mod.ts";

export const installedCommand = new Command()
  .name("installed")
  .alias("managed")
  .description("列出已安装的 Skills")
  .option("-g, --global", "仅显示全局安装")
  .option("--project", "仅显示项目安装")
  .option("--json", "输出 JSON 格式")
  .action(async (options) => {
    const showGlobal = options.global || (!options.global && !options.project);
    const showProject = options.project || (!options.global && !options.project);

    const results: InstalledSkillsResult[] = [];

    if (showGlobal) {
      const globalDir = getSkillsInstallDir(true);
      try {
        await Deno.stat(globalDir);
        const skills = await scanSkills(globalDir);
        results.push({ location: `全局 (${globalDir})`, skills });
      } catch {
        // 目录不存在
      }
    }

    if (showProject) {
      const projectDir = getSkillsInstallDir(false);
      try {
        await Deno.stat(projectDir);
        const skills = await scanSkills(projectDir);
        results.push({ location: `项目 (${projectDir})`, skills });
      } catch {
        // 目录不存在
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
        console.log("   (无已安装的 Skills)");
      } else {
        for (const skill of skills) {
          console.log(`   ${cyan(skill.name)}`);
          totalCount++;
        }
      }
    }

    if (totalCount === 0) {
      console.log("\n💡 使用 'skill-manager install <source>' 安装 Skills");
    } else {
      console.log(`\n📊 共 ${totalCount} 个已安装的 Skills`);
    }
  });
