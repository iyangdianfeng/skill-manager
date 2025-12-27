# Skill Manager CLI

跨平台 AI Skill 管理工具，用于管理和使用
[Agent Skills](https://agentskills.io/)。

> **完全开源** - 比 `@kotrotsos/skill-cli` 功能更丰富，且完全开源！

## ✨ 功能特性

### 本地 Skill 管理

- **list** - 列出本地可用的 skills
- **search** - 本地搜索匹配的 skill
- **show** - 显示 skill 详细信息
- **load** - 输出 skill 内容供 AI 读取
- **init** - 创建新的 skill
- **validate** - 验证 skill 格式
- **export** - 导出 skill 为文件

### GitHub & 安装

- **github** - 从 GitHub 搜索 Skills
- **install** - 安装 Skill (GitHub 或本地目录)
- **uninstall** - 卸载已安装的 Skill
- **installed** - 列出已安装的 Skills

## 📦 安装

### 方式 1：直接运行

```bash
cd tools/skill-manager
deno task run <command>
```

### 方式 2：全局安装（推荐）

```bash
cd tools/skill-manager
deno task install

# 确保 ~/.deno/bin 在 PATH 中
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 然后可以直接使用
skill-manager <command>
```

### 方式 3：编译为可执行文件

```bash
cd tools/skill-manager
deno task compile

# 生成 skill-manager 可执行文件
./skill-manager <command>
```

## 📖 使用方法

### 本地 Skill 管理

```bash
# 列出所有本地 skills
skill-manager list
skill-manager list --verbose   # 显示详细信息
skill-manager list --json      # 输出 JSON 格式

# 本地搜索 skill
skill-manager search pdf
skill-manager search "document processing"

# 显示 skill 详情
skill-manager show pdf
skill-manager show docx

# 加载 skill 内容（供 AI 读取）
skill-manager load pdf                    # 输出到终端
skill-manager load pdf -o pdf-skill.md    # 保存到文件
skill-manager load pdf --outline          # 仅输出大纲

# 创建新 skill
skill-manager init my-new-skill
skill-manager init my-skill --path ./custom-skills

# 验证 skill 格式
skill-manager validate ./skills/my-skill

# 导出 skill
skill-manager export pdf
skill-manager export pdf --format json
skill-manager export pdf -o ./exports/pdf-skill.md
```

### GitHub 搜索 & 安装

```bash
# 从 GitHub 搜索 Skills
skill-manager github claude
skill-manager github pdf --limit 20
skill-manager github anthropic --json

# 从 GitHub 安装 Skill
skill-manager install anthropics/skills              # 安装仓库中的所有 skills
skill-manager install anthropics/skills/skills/pdf   # 安装特定路径的 skill
skill-manager install user/repo -g                   # 全局安装
skill-manager install user/repo --force              # 强制覆盖

# 从本地目录安装
skill-manager install ./my-skill                     # 安装到项目目录
skill-manager install ./my-skill -g                  # 全局安装

# 列出已安装的 Skills
skill-manager installed                              # 显示全部
skill-manager installed -g                           # 仅显示全局
skill-manager installed --project                    # 仅显示项目

# 卸载 Skill
skill-manager uninstall pdf                          # 从项目卸载
skill-manager uninstall pdf -g                       # 从全局卸载
```

## 🔧 命令参数

| 参数              | 简写 | 说明               |
| ----------------- | ---- | ------------------ |
| `--verbose`       | `-v` | 显示详细信息       |
| `--json`          |      | 输出 JSON 格式     |
| `--path <dir>`    | `-p` | 指定 skills 目录   |
| `--output <file>` | `-o` | 指定输出文件       |
| `--format <fmt>`  |      | 导出格式 (md/json) |
| `--global`        | `-g` | 全局安装/卸载      |
| `--force`         | `-f` | 强制覆盖安装       |
| `--limit <n>`     | `-l` | 搜索结果数量限制   |
| `--help`          | `-h` | 显示帮助           |

## 🌍 环境变量

| 变量           | 说明                                   |
| -------------- | -------------------------------------- |
| `SKILLS_DIR`   | 指定本地 skills 目录路径               |
| `GITHUB_TOKEN` | GitHub API Token（可选，提高速率限制） |

## 📁 安装目录结构

```
# 全局安装位置
~/.claude/skills/
├── pdf/
│   └── SKILL.md
└── docx/
    └── SKILL.md

# 项目安装位置
.claude/skills/
├── my-skill/
│   └── SKILL.md
└── another-skill/
    └── SKILL.md
```

## 🔌 在 AI 工具中使用

### OpenCode / Cursor / 其他工具

1. 找到需要的 skill：
   ```bash
   skill-manager search "你需要的功能"
   ```

2. 加载 skill 内容：
   ```bash
   skill-manager load <skill-name> -o /tmp/skill.md
   ```

3. 让 AI 读取生成的文件：
   ```
   请阅读 /tmp/skill.md 文件，然后按照其中的指导帮我完成任务
   ```

### 自动化集成

在 `.agent/rules/` 中创建规则文件，自动加载相关 skill：

```markdown
---
description: 自动加载 PDF 处理能力
---

当用户请求处理 PDF 文件时，先运行： skill-manager load pdf

然后按照输出的指导完成任务。
```

## 🆚 与其他工具对比

| 功能               | skill-manager   | @kotrotsos/skill-cli |
| ------------------ | --------------- | -------------------- |
| 开源               | ✅ **完全开源** | ❌ 闭源              |
| GitHub 搜索        | ✅              | ✅                   |
| 安装/卸载          | ✅              | ✅                   |
| 全局/项目隔离      | ✅              | ✅                   |
| 显示详情           | ✅ **独有**     | ❌                   |
| 加载内容供 AI 读取 | ✅ **独有**     | ❌                   |
| 创建新 Skill       | ✅ **独有**     | ❌                   |
| 验证格式           | ✅ **独有**     | ❌                   |
| 导出 Skill         | ✅ **独有**     | ❌                   |
| 运行时             | Deno            | Node.js              |

## 🛠️ 开发

```bash
# 开发模式（热重载）
deno task dev

# 运行测试
deno task run list

# 类型检查
deno check mod.ts
```

## 📜 协议

Apache-2.0
