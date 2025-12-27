/**
 * load command - Output Skill content for AI reading
 */
import { Command } from "@cliffy/command";
import { findSkillsDir, join, scanSkills, t } from "../lib/mod.ts";
import { parseFrontmatter } from "../lib/parser.ts";

export const loadCommand = new Command()
  .name("load")
  .alias("get")
  .description("Output Skill content for AI reading")
  .arguments("<name:string>")
  .option("-o, --output <file:string>", "Save to file")
  .option("--outline", "Output outline only")
  .action(async (options, name: string) => {
    const skillsDir = await findSkillsDir();
    const skills = await scanSkills(skillsDir);

    const skill = skills.find((s) => s.name === name);
    if (!skill) {
      console.log(`❌ ${t("error.skillNotFound")}: ${name}`);
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

## ${t("common.description")}
${skill.description}

## Structure
${headers.join("\n")}

## ${t("load.fullPath")}
${skillMdPath}

---
${t("load.useLoad", { name })}
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
      console.log(`✅ ${t("success.saved")}: ${options.output}`);
    } else {
      console.log(output);
    }
  });
