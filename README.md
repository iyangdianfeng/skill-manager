# Skill Manager CLI

Cross-platform AI Skill management tool for managing and using
[Agent Skills](https://agentskills.io/).

> **Fully Open Source** - More feature-rich than `@kotrotsos/skill-cli`, and completely open source!

[中文文档](./README.zh.md)

## ✨ Features

### Local Skill Management

- **list** - List locally available skills
- **search** - Search for matching skills locally
- **show** - Display skill details
- **load** - Output skill content for AI reading
- **init** - Create a new skill
- **validate** - Validate skill format
- **set** - Manage SKILL.md YAML frontmatter
- **export** - Export skill to file

### GitHub & Installation

- **github** - Search Skills from GitHub
- **install** - Install Skill (from GitHub or local directory)
- **uninstall** - Uninstall an installed Skill
- **installed** - List installed Skills

## 📦 Installation

### Method 1: Run Directly

```bash
cd tools/skill-manager
deno task run <command>
```

### Method 2: Global Installation (Recommended)

```bash
cd tools/skill-manager
deno task install

# Ensure ~/.deno/bin is in your PATH
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Then use directly
skill-manager <command>
```

### Method 3: Compile to Executable

```bash
cd tools/skill-manager
deno task compile

# Creates skill-manager executable
./skill-manager <command>
```

## 📖 Usage

### Local Skill Management

```bash
# List all local skills
skill-manager list
skill-manager list --verbose   # Show detailed information
skill-manager list --json      # Output in JSON format

# Search for skills locally
skill-manager search pdf
skill-manager search "document processing"

# Show skill details
skill-manager show pdf
skill-manager show docx

# Load skill content (for AI reading)
skill-manager load pdf                    # Output to terminal
skill-manager load pdf -o pdf-skill.md    # Save to file
skill-manager load pdf --outline          # Output outline only

# Create new skill
skill-manager init my-new-skill
skill-manager init my-skill --path ./custom-skills

# Validate skill format
skill-manager validate ./skills/my-skill

# Manage SKILL.md frontmatter
skill-manager set ./my-skill                                  # View current config
skill-manager set ./my-skill --name "new-name"                # Set name
skill-manager set ./my-skill --description "New description"  # Set description
skill-manager set ./my-skill --license "MIT"                  # Set license
skill-manager set ./my-skill --add-tool "build:scripts/build.ts:Build project"  # Add tool
skill-manager set ./my-skill --remove-tool example            # Remove tool
skill-manager set ./my-skill --list-tools                     # List all tools
skill-manager set ./my-skill --set-meta "author=your-name"    # Set metadata

# Export skill
skill-manager export pdf
skill-manager export pdf --format json
skill-manager export pdf -o ./exports/pdf-skill.md
```

### GitHub Search & Installation

```bash
# Search Skills from GitHub
skill-manager github claude
skill-manager github pdf --limit 20
skill-manager github anthropic --json

# Install Skill from GitHub
skill-manager install anthropics/skills              # Install all skills from repo
skill-manager install anthropics/skills/skills/pdf   # Install specific path skill
skill-manager install user/repo -g                   # Install globally
skill-manager install user/repo --force              # Force overwrite

# Install from local directory
skill-manager install ./my-skill                     # Install to project directory
skill-manager install ./my-skill -g                  # Install globally

# List installed Skills
skill-manager installed                              # Show all
skill-manager installed -g                           # Show global only
skill-manager installed --project                    # Show project only

# Uninstall Skill
skill-manager uninstall pdf                          # Uninstall from project
skill-manager uninstall pdf -g                       # Uninstall from global
```

## 🔧 Command Options

| Option            | Short | Description              |
| ----------------- | ----- | ------------------------ |
| `--verbose`       | `-v`  | Show detailed info       |
| `--json`          |       | Output in JSON format    |
| `--path <dir>`    | `-p`  | Specify skills dir       |
| `--output <file>` | `-o`  | Specify output file      |
| `--format <fmt>`  |       | Export format (md/json)  |
| `--global`        | `-g`  | Global install/uninstall |
| `--force`         | `-f`  | Force overwrite          |
| `--limit <n>`     | `-l`  | Limit search results     |
| `--help`          | `-h`  | Show help                |

## 🌍 Environment Variables

| Variable       | Description                                       |
| -------------- | ------------------------------------------------- |
| `SKILLS_DIR`   | Specify local skills directory path               |
| `GITHUB_TOKEN` | GitHub API Token (optional, increases rate limit) |

## 📁 Installation Directory Structure

```
# Global installation location
~/.claude/skills/
├── pdf/
│   └── SKILL.md
└── docx/
    └── SKILL.md

# Project installation location
.claude/skills/
├── my-skill/
│   └── SKILL.md
└── another-skill/
    └── SKILL.md
```

## 🔌 Using with AI Tools

### OpenCode / Cursor / Other Tools

1. Find the skill you need:
   ```bash
   skill-manager search "feature you need"
   ```

2. Load skill content:
   ```bash
   skill-manager load <skill-name> -o /tmp/skill.md
   ```

3. Have AI read the generated file:
   ```
   Please read /tmp/skill.md and follow its guidance to complete the task
   ```

### Automation Integration

Create a rule file in `.agent/rules/` to automatically load relevant skills:

```markdown
---
description: Auto-load PDF processing capability
---

When user requests PDF file processing, first run: skill-manager load pdf

Then follow the output guidance to complete the task.
```

## 🆚 Comparison with Other Tools

| Feature              | skill-manager     | @kotrotsos/skill-cli |
| -------------------- | ----------------- | -------------------- |
| Open Source          | ✅ **Fully Open** | ❌ Closed            |
| GitHub Search        | ✅                | ✅                   |
| Install/Uninstall    | ✅                | ✅                   |
| Global/Project Scope | ✅                | ✅                   |
| Show Details         | ✅ **Unique**     | ❌                   |
| Load for AI          | ✅ **Unique**     | ❌                   |
| Create New Skill     | ✅ **Unique**     | ❌                   |
| Validate Format      | ✅ **Unique**     | ❌                   |
| Manage Frontmatter   | ✅ **Unique**     | ❌                   |
| Export Skill         | ✅ **Unique**     | ❌                   |
| Runtime              | Deno              | Node.js              |

## 🌐 Internationalization

The CLI automatically detects your system language:

- Chinese systems (`LANG=zh_*`) → Chinese messages
- All other systems → English messages

## 🛠️ Development

```bash
# Development mode (hot reload)
deno task dev

# Run tests
deno task run list

# Type check
deno task check

# Lint
deno task lint

# Format
deno task fmt
```

## 📜 License

AGPL-3.0
