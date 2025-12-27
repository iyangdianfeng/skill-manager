/**
 * load 命令 - 输出 Skill 内容供 AI 读取
 */
import { Command } from "@cliffy/command";
import { findSkillsDir, scanSkills, join } from "../lib/mod.ts";
import { parseFrontmatter } from "../lib/parser.ts";

export const loadCommand = new Command()
  .name("load")
  .alias("get")
  .description("输出 Skill 内容供 AI 读取")
  .arguments("<name:string>")
  .option("-o, --output <file:string>", "保存到文件")
  .option("--outline", "仅输出大纲")
  .action(async (options, name: string) => {
    const skillsDir = await findSkillsDir();
    const skills = await scanSkills(skillsDir);

    const skill = skills.find((s) => s.name === name);
    if (!skill) {
      console.log(`❌ 未找到 skill: ${name}`);
      return;
    }

    const skillMdPath = join(skill.path, "SKILL.md");
    const content = await Deno.readTextFile(skillMdPath);

    let output: string;

    if (options.outline) {
      const { body } = parseFrontmatter(content);
      const lines = body.split("\n");
      const headers = lines.filter((l: string) => l.startsWith("#"));

      output = `# Skill: ${skill.name}

## 描述
${skill.description}

## 结构
${headers.join("\n")}

## 完整路径
${skillMdPath}

---
使用 'skill-manager load ${name}' 获取完整内容
`;
    } else {
      output = `<!-- Skill: ${skill.name} -->
<!-- Path: ${skillMdPath} -->

${content}

<!-- End of Skill: ${skill.name} -->
`;
    }

    if (options.output) {
      await Deno.writeTextFile(options.output, output);
      console.log(`✅ 已保存到: ${options.output}`);
    } else {
      console.log(output);
    }
  });
