/**
 * set command - Manage SKILL.md YAML frontmatter
 */
import { Command } from "@cliffy/command";
import { stringify as stringifyYaml } from "@std/yaml";
import { join, resolve, t } from "../lib/mod.ts";
import { parseFrontmatter } from "../lib/parser.ts";
import type { SkillTool } from "../types/skill.ts";

/**
 * Regenerate SKILL.md with updated frontmatter
 */
async function updateSkillMd(
  skillPath: string,
  frontmatter: Record<string, unknown>,
  body: string,
): Promise<void> {
  const yamlStr = stringifyYaml(frontmatter, { lineWidth: -1 });
  const content = `---\n${yamlStr}---\n${body}`;
  await Deno.writeTextFile(join(skillPath, "SKILL.md"), content);
}

export const setCommand = new Command()
  .name("set")
  .alias("config")
  .description("Manage SKILL.md YAML frontmatter fields")
  .arguments("<path:string>")
  .option("-n, --name <name:string>", "Set skill name")
  .option("-d, --description <desc:string>", "Set skill description")
  .option("-l, --license <license:string>", "Set license")
  .option("-c, --compatibility <compat:string>", "Set compatibility notes")
  .option("--add-tool <tool:string>", "Add a tool (format: name:script:description)")
  .option("--remove-tool <name:string>", "Remove a tool by name")
  .option("--list-tools", "List all defined tools")
  .option("--set-meta <kv:string>", "Set metadata key=value")
  .action(async (options, path: string) => {
    const resolvedPath = resolve(path);
    const skillMdPath = join(resolvedPath, "SKILL.md");

    // Check if SKILL.md exists
    try {
      await Deno.stat(skillMdPath);
    } catch {
      console.log(`❌ ${t("error.noSkillMd")}: ${skillMdPath}`);
      Deno.exit(1);
    }

    const content = await Deno.readTextFile(skillMdPath);
    const { frontmatter, body } = parseFrontmatter(content);
    let modified = false;

    // Set name
    if (options.name) {
      frontmatter.name = options.name;
      modified = true;
      console.log(`✅ ${t("set.nameUpdated", { name: options.name })}`);
    }

    // Set description
    if (options.description) {
      frontmatter.description = options.description;
      modified = true;
      console.log(`✅ ${t("set.descUpdated")}`);
    }

    // Set license
    if (options.license) {
      frontmatter.license = options.license;
      modified = true;
      console.log(`✅ ${t("set.licenseUpdated", { license: options.license })}`);
    }

    // Set compatibility
    if (options.compatibility) {
      frontmatter.compatibility = options.compatibility;
      modified = true;
      console.log(`✅ ${t("set.compatUpdated")}`);
    }

    // Set metadata
    if (options.setMeta) {
      const [key, ...valueParts] = options.setMeta.split("=");
      const value = valueParts.join("=");
      if (!key || !value) {
        console.log(`❌ ${t("set.invalidMeta")}`);
      } else {
        if (!frontmatter.metadata) {
          frontmatter.metadata = {};
        }
        (frontmatter.metadata as Record<string, string>)[key] = value;
        modified = true;
        console.log(`✅ ${t("set.metaUpdated", { key, value })}`);
      }
    }

    // Add tool
    if (options.addTool) {
      const parts = options.addTool.split(":");
      if (parts.length < 3) {
        console.log(`❌ ${t("set.invalidToolFormat")}`);
        console.log(`   ${t("set.toolFormatHint")}`);
      } else {
        const [name, script, ...descParts] = parts;
        const description = descParts.join(":");
        const newTool: SkillTool = { name, script, description };

        if (!frontmatter.tools) {
          frontmatter.tools = [];
        }
        const tools = frontmatter.tools as SkillTool[];

        // Check if tool with same name exists
        const existingIndex = tools.findIndex((t) => t.name === name);
        if (existingIndex >= 0) {
          tools[existingIndex] = newTool;
          console.log(`✅ ${t("set.toolUpdated", { name })}`);
        } else {
          tools.push(newTool);
          console.log(`✅ ${t("set.toolAdded", { name })}`);
        }
        modified = true;
      }
    }

    // Remove tool
    if (options.removeTool) {
      if (frontmatter.tools && Array.isArray(frontmatter.tools)) {
        const tools = frontmatter.tools as SkillTool[];
        const initialLength = tools.length;
        frontmatter.tools = tools.filter((t) => t.name !== options.removeTool);

        if ((frontmatter.tools as SkillTool[]).length < initialLength) {
          modified = true;
          console.log(`✅ ${t("set.toolRemoved", { name: options.removeTool })}`);
        } else {
          console.log(`⚠️  ${t("set.toolNotFound", { name: options.removeTool })}`);
        }
      } else {
        console.log(`⚠️  ${t("set.noTools")}`);
      }
    }

    // List tools
    if (options.listTools) {
      console.log(`\n🔧 ${t("set.toolsList")}:\n`);
      if (frontmatter.tools && Array.isArray(frontmatter.tools)) {
        const tools = frontmatter.tools as SkillTool[];
        if (tools.length === 0) {
          console.log(`   ${t("set.noTools")}`);
        } else {
          tools.forEach((tool, index) => {
            console.log(`   ${index + 1}. ${tool.name}`);
            console.log(`      ${t("common.scripts")}: ${tool.script}`);
            console.log(`      ${t("common.description")}: ${tool.description}`);
            console.log();
          });
        }
      } else {
        console.log(`   ${t("set.noTools")}`);
      }
    }

    // Show current config if no options provided
    if (!modified && !options.listTools) {
      console.log(`\n📋 ${t("set.currentConfig")}:\n`);
      console.log(`   ${t("common.name")}: ${frontmatter.name || "-"}`);
      console.log(`   ${t("common.description")}: ${frontmatter.description || "-"}`);
      console.log(`   ${t("common.license")}: ${frontmatter.license || "-"}`);
      console.log(`   ${t("common.compatibility")}: ${frontmatter.compatibility || "-"}`);

      if (frontmatter.tools && Array.isArray(frontmatter.tools)) {
        console.log(
          `   ${t("common.scripts")}: ${(frontmatter.tools as SkillTool[]).length} tools`,
        );
      }

      if (frontmatter.metadata) {
        console.log(`\n   Metadata:`);
        for (const [k, v] of Object.entries(frontmatter.metadata as Record<string, string>)) {
          console.log(`     ${k}: ${v}`);
        }
      }

      console.log(`\n💡 ${t("set.usageHint")}`);
    }

    // Save if modified
    if (modified) {
      await updateSkillMd(resolvedPath, frontmatter, body);
      console.log(`\n💾 ${t("set.saved", { path: skillMdPath })}`);
    }
  });
