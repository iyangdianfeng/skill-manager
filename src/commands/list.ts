/**
 * list 命令 - 列出本地可用的 Skills
 */
import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { findSkillsDir, scanSkills, bold, cyan } from "../lib/mod.ts";

export const listCommand = new Command()
  .name("list")
  .alias("ls")
  .description("列出本地可用的 Skills")
  .option("-v, --verbose", "显示详细信息")
  .option("--json", "输出 JSON 格式")
  .action(async (options) => {
    const skillsDir = await findSkillsDir();
    console.log(`📂 扫描目录: ${skillsDir}\n`);

    const skills = await scanSkills(skillsDir);

    if (skills.length === 0) {
      console.log("❌ 未找到任何 skills");
      return;
    }

    if (options.json) {
      console.log(JSON.stringify(skills, null, 2));
      return;
    }

    console.log(`📚 找到 ${bold(String(skills.length))} 个 skills:\n`);

    if (options.verbose) {
      for (const skill of skills) {
        console.log(`  ${bold(cyan(skill.name))}`);
        console.log(
          `    📝 ${skill.description.slice(0, 100)}${skill.description.length > 100 ? "..." : ""}`
        );
        console.log(`    📁 ${skill.path}`);
        if (skill.license) console.log(`    📜 License: ${skill.license}`);
        console.log();
      }
    } else {
      const table = new Table()
        .header(["名称", "描述"])
        .body(
          skills.map((s) => [
            cyan(s.name),
            s.description.slice(0, 60) + (s.description.length > 60 ? "..." : ""),
          ])
        )
        .padding(1)
        .indent(2);
      table.render();
      console.log(`\n💡 使用 ${cyan("--verbose")} 查看详细信息`);
    }
  });
