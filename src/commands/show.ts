/**
 * show command - Display Skill details
 */
import { Command } from "@cliffy/command";
import { bold, cyan, loadSkillFull, scanSkills, t } from "../lib/mod.ts";

export const showCommand = new Command()
  .name("show")
  .alias("info")
  .description("Display Skill details")
  .arguments("<name:string>")
  .action(async (_options, name: string) => {
    const skills = await scanSkills(Deno.cwd());

    const skill = skills.find((s) => s.name === name);
    if (!skill) {
      console.log(`❌ ${t("error.skillNotFound")}: ${name}`);
      console.log(`\n💡 ${t("show.useList")}`);
      return;
    }

    const full = await loadSkillFull(skill.path);
    if (!full) {
      console.log(`❌ ${t("error.skillNotFound")}: ${name}`);
      return;
    }

    console.log(`\n${bold("═".repeat(60))}`);
    console.log(`${bold(cyan(`  📦 ${full.name}`))}`);
    console.log(`${bold("═".repeat(60))}\n`);

    console.log(`${bold(`📝 ${t("common.description")}:`)}`);
    console.log(`  ${full.description}\n`);

    console.log(`${bold(`📁 ${t("common.path")}:`)} ${full.path}\n`);

    if (full.license) {
      console.log(`${bold(`📜 ${t("common.license")}:`)} ${full.license}\n`);
    }

    if (full.compatibility) {
      console.log(`${bold(`⚙️  ${t("common.compatibility")}:`)} ${full.compatibility}\n`);
    }

    if (full.scripts.length > 0) {
      console.log(`${bold(`📜 ${t("common.scripts")}:`)}`);
      full.scripts.forEach((s) => console.log(`  - ${s}`));
      console.log();
    }

    if (full.references.length > 0) {
      console.log(`${bold(`📚 ${t("common.references")}:`)}`);
      full.references.forEach((r) => console.log(`  - ${r}`));
      console.log();
    }

    if (full.assets.length > 0) {
      console.log(`${bold(`🎨 ${t("common.assets")}:`)}`);
      full.assets.forEach((a) => console.log(`  - ${a}`));
      console.log();
    }

    console.log(`${bold("─".repeat(60))}`);
    console.log(`${bold(`💡 ${t("show.usage")}:`)}`);
    console.log(`  skill-manager load ${name}     # Output full content for AI`);
    console.log(`  skill-manager load ${name} -o  # Output outline only`);
  });
