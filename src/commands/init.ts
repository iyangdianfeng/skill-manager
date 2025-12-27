/**
 * init 命令 - 创建新的 Skill
 */
import { Command } from "@cliffy/command";
import { findSkillsDir, ensureDir, join } from "../lib/mod.ts";

export const initCommand = new Command()
  .name("init")
  .alias("new").alias("create")
  .description("创建新的 Skill")
  .arguments("<name:string>")
  .option("-p, --path <dir:string>", "指定创建目录")
  .action(async (options, name: string) => {
    // 验证 skill name
    if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(name) && name.length > 1) {
      console.log("❌ skill name 格式错误");
      console.log("   要求: 小写字母、数字和连字符，不能以连字符开头或结尾");
      return;
    }

    const basePath = options.path || (await findSkillsDir());
    const skillPath = join(basePath, name);

    // 检查是否已存在
    try {
      await Deno.stat(skillPath);
      console.log(`❌ 目录已存在: ${skillPath}`);
      return;
    } catch {
      // 目录不存在，继续创建
    }

    // 创建目录结构
    await ensureDir(skillPath);
    await ensureDir(join(skillPath, "scripts"));
    await ensureDir(join(skillPath, "references"));
    await ensureDir(join(skillPath, "assets"));

    // 生成 SKILL.md
    const skillTitle = name
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const template = `---
name: ${name}
description: [TODO: 描述这个 skill 的功能以及何时应该使用它]
---

# ${skillTitle}

## 概述

[TODO: 1-2 句话描述这个 skill 的核心功能]

## 使用场景

- [TODO: 场景 1]
- [TODO: 场景 2]

## 工作流程

### 步骤 1: [TODO]

[TODO: 详细说明]

### 步骤 2: [TODO]

[TODO: 详细说明]

## 资源

- \`scripts/\` - 可执行脚本
- \`references/\` - 参考文档
- \`assets/\` - 模板和资源文件

## 示例

\`\`\`
[TODO: 添加使用示例]
\`\`\`
`;

    await Deno.writeTextFile(join(skillPath, "SKILL.md"), template);

    // 创建示例文件
    await Deno.writeTextFile(
      join(skillPath, "scripts", "example.py"),
      `#!/usr/bin/env python3
"""
Example script for ${name}
"""

def main():
    print("Hello from ${name}!")

if __name__ == "__main__":
    main()
`
    );

    await Deno.writeTextFile(
      join(skillPath, "references", "README.md"),
      `# 参考文档

在此目录中放置详细的参考文档，这些文档会在需要时被 AI 加载。
`
    );

    console.log(`\n✅ Skill 创建成功: ${skillPath}\n`);
    console.log("📁 目录结构:");
    console.log(`  ${name}/`);
    console.log(`  ├── SKILL.md`);
    console.log(`  ├── scripts/`);
    console.log(`  │   └── example.py`);
    console.log(`  ├── references/`);
    console.log(`  │   └── README.md`);
    console.log(`  └── assets/`);
    console.log(`\n💡 下一步:`);
    console.log(`  1. 编辑 ${join(skillPath, "SKILL.md")} 完善内容`);
    console.log(`  2. 运行 skill-manager validate ${skillPath} 验证格式`);
  });
