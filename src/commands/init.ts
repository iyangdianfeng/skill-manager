/**
 * init command - Create a new Skill
 */
import { Command } from "@cliffy/command";
import { ensureDir, findSkillsDir, join, t } from "../lib/mod.ts";

export const initCommand = new Command()
  .name("init")
  .alias("new")
  .alias("create")
  .description("Create a new Skill")
  .arguments("<name:string>")
  .option("-p, --path <dir:string>", "Specify creation directory")
  .action(async (options, name: string) => {
    // Validate skill name
    if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(name) && name.length > 1) {
      console.log(`❌ ${t("init.nameError")}`);
      console.log(`   ${t("init.nameHint")}`);
      return;
    }

    const basePath = options.path || (await findSkillsDir());
    const skillPath = join(basePath, name);

    // Check if already exists
    try {
      await Deno.stat(skillPath);
      console.log(`❌ ${t("error.directoryExists")}: ${skillPath}`);
      return;
    } catch {
      // Directory doesn't exist, continue creation
    }

    // Create directory structure
    await ensureDir(skillPath);
    await ensureDir(join(skillPath, "scripts"));
    await ensureDir(join(skillPath, "references"));
    await ensureDir(join(skillPath, "assets"));

    // Generate SKILL.md
    const skillTitle = name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const template = `---
name: ${name}
description: [TODO: Describe this skill's functionality and when it should be used]
---

# ${skillTitle}

## Overview

[TODO: 1-2 sentences describing this skill's core functionality]

## Use Cases

- [TODO: Use case 1]
- [TODO: Use case 2]

## Workflow

### Step 1: [TODO]

[TODO: Detailed description]

### Step 2: [TODO]

[TODO: Detailed description]

## Resources

- \`scripts/\` - Executable scripts
- \`references/\` - Reference documentation
- \`assets/\` - Templates and resource files

## Examples

\`\`\`
[TODO: Add usage examples]
\`\`\`
`;

    await Deno.writeTextFile(join(skillPath, "SKILL.md"), template);

    // Create example files
    await Deno.writeTextFile(
      join(skillPath, "scripts", "example.ts"),
      `#!/usr/bin/env -S deno run
/**
 * Example script for ${name}
 */

function main(): void {
  console.log("Hello from ${name}!");
}

if (import.meta.main) {
  main();
}
`,
    );

    await Deno.writeTextFile(
      join(skillPath, "references", "README.md"),
      `# Reference Documentation

Place detailed reference documentation in this directory. These documents will be loaded by AI when needed.
`,
    );

    console.log(`\n✅ ${t("success.created")}: ${skillPath}\n`);
    console.log(`📁 ${t("init.structure")}:`);
    console.log(`  ${name}/`);
    console.log(`  ├── SKILL.md`);
    console.log(`  ├── scripts/`);
    console.log(`  │   └── example.ts`);
    console.log(`  ├── references/`);
    console.log(`  │   └── README.md`);
    console.log(`  └── assets/`);
    console.log(`\n💡 ${t("init.nextSteps")}:`);
    console.log(`  1. ${t("init.editSkillMd", { path: join(skillPath, "SKILL.md") })}`);
    console.log(`  2. ${t("init.runValidate", { path: skillPath })}`);
  });
