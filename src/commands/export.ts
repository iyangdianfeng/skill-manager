/**
 * export command - Export Skill to file
 */
import { Command } from "@cliffy/command";
import { findSkillsDir, join, loadSkillFull, scanSkills, t } from "../lib/mod.ts";

export const exportCommand = new Command()
  .name("export")
  .description("Export Skill to file")
  .arguments("<name:string>")
  .option("-o, --output <file:string>", "Specify output file")
  .option("--format <format:string>", "Export format (md/json)", { default: "md" })
  .action(async (options, name: string) => {
    const skillsDir = await findSkillsDir();
    const skills = await scanSkills(skillsDir);

    const skill = skills.find((s) => s.name === name);
    if (!skill) {
      console.log(`❌ ${t("error.skillNotFound")}: ${name}`);
      return;
    }

    const full = await loadSkillFull(skill.path);
    if (!full) {
      console.log(`❌ ${t("error.skillNotFound")}: ${name}`);
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

## 📁 ${t("export.resources")}

${
        full.scripts.length > 0
          ? `### ${t("common.scripts")}\n${full.scripts.map((s) => `- \`${s}\``).join("\n")}`
          : ""
      }
${
        full.references.length > 0
          ? `### ${t("common.references")}\n${full.references.map((r) => `- \`${r}\``).join("\n")}`
          : ""
      }
${
        full.assets.length > 0
          ? `### ${t("common.assets")}\n${full.assets.map((a) => `- \`${a}\``).join("\n")}`
          : ""
      }
`;
    }

    const outputFile = options.output || `${name}.${options.format}`;
    await Deno.writeTextFile(outputFile, output);
    console.log(`✅ ${t("success.exported")}: ${outputFile}`);
  });
