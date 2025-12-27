/**
 * list command - List locally available Skills
 */
import { Command } from "@cliffy/command";
import { Table } from "@cliffy/table";
import { bold, cyan, findSkillsDir, scanSkills, t } from "../lib/mod.ts";

export const listCommand = new Command()
  .name("list")
  .alias("ls")
  .description("List locally available Skills")
  .option("-v, --verbose", "Show detailed information")
  .option("--json", "Output in JSON format")
  .action(async (options) => {
    const skillsDir = await findSkillsDir();
    console.log(`📂 ${t("list.scanning")}: ${skillsDir}\n`);

    const skills = await scanSkills(skillsDir);

    if (skills.length === 0) {
      console.log(`❌ ${t("list.noSkills")}`);
      return;
    }

    if (options.json) {
      console.log(JSON.stringify(skills, null, 2));
      return;
    }

    console.log(`📚 ${t("list.found", { count: skills.length })}:\n`);

    if (options.verbose) {
      for (const skill of skills) {
        console.log(`  ${bold(cyan(skill.name))}`);
        console.log(
          `    📝 ${skill.description.slice(0, 100)}${skill.description.length > 100 ? "..." : ""}`,
        );
        console.log(`    📁 ${skill.path}`);
        if (skill.license) console.log(`    📜 ${t("common.license")}: ${skill.license}`);
        console.log();
      }
    } else {
      const table = new Table()
        .header([t("common.name"), t("common.description")])
        .body(
          skills.map((s) => [
            cyan(s.name),
            s.description.slice(0, 60) + (s.description.length > 60 ? "..." : ""),
          ]),
        )
        .padding(1)
        .indent(2);
      table.render();
      console.log(`\n💡 ${t("list.useVerbose")}`);
    }
  });
