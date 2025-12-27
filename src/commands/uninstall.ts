/**
 * uninstall command - Uninstall Skill
 */
import { Command } from "@cliffy/command";
import { getSkillsInstallDir, join, t } from "../lib/mod.ts";

export const uninstallCommand = new Command()
  .name("uninstall")
  .alias("remove")
  .alias("rm")
  .description("Uninstall an installed Skill")
  .arguments("<name:string>")
  .option("-g, --global", "Uninstall from global")
  .action(async (options, name: string) => {
    const isGlobal = options.global || false;
    const installDir = getSkillsInstallDir(isGlobal);
    const skillPath = join(installDir, name);

    console.log(`🗑️  ${t("uninstall.uninstalling")}: ${name}`);
    console.log(`   ${t("install.mode")}: ${isGlobal ? t("common.global") : t("common.project")}`);

    try {
      await Deno.stat(skillPath);
    } catch {
      console.log(`❌ ${t("uninstall.notFound")}: ${name}`);
      console.log(`   ${t("common.path")}: ${skillPath}`);

      // Try to find in other location
      const otherDir = getSkillsInstallDir(!isGlobal);
      const otherPath = join(otherDir, name);
      try {
        await Deno.stat(otherPath);
        const location = !isGlobal ? t("common.global") : t("common.project");
        console.log(`\n💡 ${t("uninstall.foundIn", { location })}:`);
        console.log(`   ${otherPath}`);
        console.log(`   ${t("uninstall.useFlag", { flag: !isGlobal ? "-g" : "" })}`);
      } catch {
        // Neither exists
      }
      return;
    }

    await Deno.remove(skillPath, { recursive: true });
    console.log(`\n✅ ${t("success.uninstalled")}: ${name}`);
  });
