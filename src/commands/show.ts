/**
 * show 命令 - 显示 Skill 详情
 */
import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { findSkillsDir, scanSkills, loadSkillFull, bold, cyan } from "../lib/mod.ts";

export const showCommand = new Command()
  .name("show")
  .alias("info")
  .description("显示 Skill 详细信息")
  .arguments("<name:string>")
  .action(async (_options, name: string) => {
    const skillsDir = await findSkillsDir();
    const skills = await scanSkills(skillsDir);

    const skill = skills.find((s) => s.name === name);
    if (!skill) {
      console.log(`❌ 未找到 skill: ${name}`);
      console.log(`\n💡 使用 'skill-manager list' 查看所有可用的 skills`);
      return;
    }

    const full = await loadSkillFull(skill.path);
    if (!full) {
      console.log(`❌ 无法加载 skill: ${name}`);
      return;
    }

    console.log(`\n${bold("═".repeat(60))}`);
    console.log(`${bold(cyan(`  📦 ${full.name}`))}`);
    console.log(`${bold("═".repeat(60))}\n`);

    console.log(`${bold("📝 描述:")}`);
    console.log(`  ${full.description}\n`);

    console.log(`${bold("📁 路径:")} ${full.path}\n`);

    if (full.license) {
      console.log(`${bold("📜 许可证:")} ${full.license}\n`);
    }

    if (full.compatibility) {
      console.log(`${bold("⚙️  兼容性:")} ${full.compatibility}\n`);
    }

    if (full.scripts.length > 0) {
      console.log(`${bold("📜 脚本:")}`);
      full.scripts.forEach((s) => console.log(`  - ${s}`));
      console.log();
    }

    if (full.references.length > 0) {
      console.log(`${bold("📚 参考文档:")}`);
      full.references.forEach((r) => console.log(`  - ${r}`));
      console.log();
    }

    if (full.assets.length > 0) {
      console.log(`${bold("🎨 资源文件:")}`);
      full.assets.forEach((a) => console.log(`  - ${a}`));
      console.log();
    }

    console.log(`${bold("─".repeat(60))}`);
    console.log(`${bold("💡 使用方式:")}`);
    console.log(`  skill-manager load ${name}     # 输出完整内容供 AI 读取`);
    console.log(`  skill-manager load ${name} -o  # 仅输出指令部分`);
  });
