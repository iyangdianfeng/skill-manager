/**
 * search 命令 - 本地搜索 Skills
 */
import { Command } from "@cliffy/command";
import { findSkillsDir, scanSkills, bold, cyan } from "../lib/mod.ts";

export const searchCommand = new Command()
  .name("search")
  .alias("find")
  .description("本地搜索匹配的 Skill")
  .arguments("<query:string>")
  .option("--json", "输出 JSON 格式")
  .action(async (options, query: string) => {
    const skillsDir = await findSkillsDir();
    const skills = await scanSkills(skillsDir);

    const queryLower = query.toLowerCase();
    const matches = skills.filter(
      (s) =>
        s.name.toLowerCase().includes(queryLower) ||
        s.description.toLowerCase().includes(queryLower)
    );

    if (matches.length === 0) {
      console.log(`❌ 未找到匹配 "${query}" 的 skill`);
      return;
    }

    if (options.json) {
      console.log(JSON.stringify(matches, null, 2));
      return;
    }

    console.log(`🔍 找到 ${bold(String(matches.length))} 个匹配的 skills:\n`);

    for (const skill of matches) {
      console.log(`  ${bold(cyan(skill.name))}`);
      console.log(
        `    ${skill.description.slice(0, 120)}${skill.description.length > 120 ? "..." : ""}`
      );
      console.log(`    📁 ${skill.path}\n`);
    }
  });
