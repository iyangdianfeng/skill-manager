/**
 * validate command - Validate Skill format
 */
import { Command } from "@cliffy/command";
import { basename, join, resolve, t } from "../lib/mod.ts";
import { parseFrontmatter } from "../lib/parser.ts";

export const validateCommand = new Command()
  .name("validate")
  .alias("check")
  .description("Validate Skill format")
  .arguments("<path:string>")
  .action(async (_options, path: string) => {
    const resolvedPath = resolve(path);
    const skillMdPath = join(resolvedPath, "SKILL.md");

    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if SKILL.md exists
    try {
      await Deno.stat(skillMdPath);
    } catch {
      errors.push(t("error.noSkillMd"));
      console.log(`\n❌ ${t("validate.errors")}:\n  - ${errors.join("\n  - ")}`);
      Deno.exit(1);
    }

    const content = await Deno.readTextFile(skillMdPath);
    const { frontmatter, body } = parseFrontmatter(content);

    // Validate name
    if (!frontmatter.name) {
      errors.push(`${t("error.missingField")}: name`);
    } else {
      const name = String(frontmatter.name);
      if (name.length > 64) errors.push(t("validate.nameTooLong"));
      if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(name) && name.length > 1) {
        errors.push(t("validate.nameFormat"));
      }
      if (name.includes("--")) errors.push(t("validate.nameConsecutive"));
      if (basename(resolvedPath) !== name) {
        warnings.push(t("validate.nameMismatch", { dir: basename(resolvedPath), name }));
      }
    }

    // Validate description
    if (!frontmatter.description) {
      errors.push(`${t("error.missingField")}: description`);
    } else {
      const desc = String(frontmatter.description);
      if (desc.length > 1024) errors.push(t("validate.descTooLong"));
      if (desc.length < 20) warnings.push(t("validate.descTooShort"));
    }

    // Validate body
    if (body.trim().length < 50) {
      warnings.push(t("validate.bodyTooShort"));
    }

    // Check for TODO placeholders
    if (body.includes("[TODO:")) {
      warnings.push(t("validate.hasTodo"));
    }

    // Output results
    console.log(`\n📋 ${t("validate.validating")}: ${resolvedPath}\n`);

    if (errors.length === 0 && warnings.length === 0) {
      console.log(`✅ ${t("success.valid")}`);
    } else {
      if (errors.length > 0) {
        console.log(`❌ ${t("validate.errors")} (${errors.length}):`);
        errors.forEach((e) => console.log(`  - ${e}`));
      }
      if (warnings.length > 0) {
        console.log(`⚠️  ${t("validate.warnings")} (${warnings.length}):`);
        warnings.forEach((w) => console.log(`  - ${w}`));
      }
    }

    if (errors.length > 0) {
      Deno.exit(1);
    }
  });
