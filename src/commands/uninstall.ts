/**
 * uninstall 命令 - 卸载 Skill
 */
import { Command } from "@cliffy/command";
import { getSkillsInstallDir, join } from "../lib/mod.ts";

export const uninstallCommand = new Command()
  .name("uninstall")
  .alias("remove").alias("rm")
  .description("卸载已安装的 Skill")
  .arguments("<name:string>")
  .option("-g, --global", "从全局卸载")
  .action(async (options, name: string) => {
    const isGlobal = options.global || false;
    const installDir = getSkillsInstallDir(isGlobal);
    const skillPath = join(installDir, name);

    console.log(`🗑️  卸载 Skill: ${name}`);
    console.log(`   模式: ${isGlobal ? "全局" : "项目"}`);

    try {
      await Deno.stat(skillPath);
    } catch {
      console.log(`❌ Skill 不存在: ${name}`);
      console.log(`   路径: ${skillPath}`);

      // 尝试在另一个位置查找
      const otherDir = getSkillsInstallDir(!isGlobal);
      const otherPath = join(otherDir, name);
      try {
        await Deno.stat(otherPath);
        console.log(`\n💡 在${!isGlobal ? "全局" : "项目"}目录中找到该 Skill:`);
        console.log(`   ${otherPath}`);
        console.log(`   使用 ${!isGlobal ? "-g" : ""} 参数卸载`);
      } catch {
        // 都不存在
      }
      return;
    }

    await Deno.remove(skillPath, { recursive: true });
    console.log(`\n✅ 已卸载: ${name}`);
  });
