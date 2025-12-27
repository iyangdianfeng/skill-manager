/**
 * export 命令 - 导出 Skill 为文件
 */
import { Command } from "@cliffy/command";
import { findSkillsDir, scanSkills, loadSkillFull, join } from "../lib/mod.ts";

export const exportCommand = new Command()
  .name("export")
  .description("导出 Skill 为文件")
  .arguments("<name:string>")
  .option("-o, --output <file:string>", "指定输出文件")
  .option("--format <format:string>", "导出格式 (md/json)", { default: "md" })
  .action(async (options, name: string) => {
    const skillsDir = await findSkillsDir();
    const skills = await scanSkills(skillsDir);

    const skill = skills.find((s) => s.name === name);
    if (!skill) {
      console.log(`❌ 未找到 skill: ${name}`);
      return;
    }

    const full = await loadSkillFull(skill.path);
    if (!full) {
      console.log(`❌ 无法加载 skill: ${name}`);
      return;
    }

    let output: string;

    if (options.format === "json") {
      output = JSON.stringify(full, null, 2);
    } else {
      const content = await Deno.readTextFile(join(skill.path, "SKILL.md"));
      output = `# ${full.name}

> ${full.description}

---

${content.replace(/^---[\s\S]*?---\s*/, "")}

---

## 📁 资源文件

${full.scripts.length > 0 ? `### Scripts\n${full.scripts.map((s) => `- \`${s}\``).join("\n")}` : ""}
${full.references.length > 0 ? `### References\n${full.references.map((r) => `- \`${r}\``).join("\n")}` : ""}
${full.assets.length > 0 ? `### Assets\n${full.assets.map((a) => `- \`${a}\``).join("\n")}` : ""}
`;
    }

    const outputFile = options.output || `${name}.${options.format}`;
    await Deno.writeTextFile(outputFile, output);
    console.log(`✅ 已导出到: ${outputFile}`);
  });
