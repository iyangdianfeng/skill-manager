/**
 * validate 命令 - 验证 Skill 格式
 */
import { Command } from "@cliffy/command";
import { resolve, join, basename } from "../lib/mod.ts";
import { parseFrontmatter } from "../lib/parser.ts";

export const validateCommand = new Command()
  .name("validate")
  .alias("check")
  .description("验证 Skill 格式")
  .arguments("<path:string>")
  .action(async (_options, path: string) => {
    const resolvedPath = resolve(path);
    const skillMdPath = join(resolvedPath, "SKILL.md");

    const errors: string[] = [];
    const warnings: string[] = [];

    // 检查 SKILL.md 是否存在
    try {
      await Deno.stat(skillMdPath);
    } catch {
      errors.push("SKILL.md 文件不存在");
      console.log(`\n❌ 验证失败:\n  - ${errors.join("\n  - ")}`);
      Deno.exit(1);
    }

    const content = await Deno.readTextFile(skillMdPath);
    const { frontmatter, body } = parseFrontmatter(content);

    // 验证 name
    if (!frontmatter.name) {
      errors.push("缺少必需字段: name");
    } else {
      const name = String(frontmatter.name);
      if (name.length > 64) errors.push("name 超过 64 字符限制");
      if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(name) && name.length > 1) {
        errors.push(
          "name 格式错误: 只能包含小写字母、数字和连字符，不能以连字符开头或结尾"
        );
      }
      if (name.includes("--")) errors.push("name 不能包含连续的连字符");
      if (basename(resolvedPath) !== name) {
        warnings.push(
          `目录名 '${basename(resolvedPath)}' 与 skill name '${name}' 不匹配`
        );
      }
    }

    // 验证 description
    if (!frontmatter.description) {
      errors.push("缺少必需字段: description");
    } else {
      const desc = String(frontmatter.description);
      if (desc.length > 1024) errors.push("description 超过 1024 字符限制");
      if (desc.length < 20) warnings.push("description 太短，建议至少 20 字符");
    }

    // 验证 body
    if (body.trim().length < 50) {
      warnings.push("SKILL.md body 内容太少，建议添加更多指令");
    }

    // 检查 TODO 占位符
    if (body.includes("[TODO:")) {
      warnings.push("存在未完成的 TODO 占位符");
    }

    // 输出结果
    console.log(`\n📋 验证 Skill: ${resolvedPath}\n`);

    if (errors.length === 0 && warnings.length === 0) {
      console.log(`✅ 验证通过！Skill 格式正确。`);
    } else {
      if (errors.length > 0) {
        console.log(`❌ 错误 (${errors.length}):`);
        errors.forEach((e) => console.log(`  - ${e}`));
      }
      if (warnings.length > 0) {
        console.log(`⚠️  警告 (${warnings.length}):`);
        warnings.forEach((w) => console.log(`  - ${w}`));
      }
    }

    if (errors.length > 0) {
      Deno.exit(1);
    }
  });
