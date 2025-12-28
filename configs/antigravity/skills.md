---
trigger: always_on
description: Skill Manager 使用规则 - 当识别到 @skills:xxx 格式时自动加载对应 Skill, use zh-CN
---

# Skill Manager 使用规则

## 触发条件

当用户消息中包含以下格式时，**必须**使用 `skill-manager` 加载对应 Skill：

- `@skills:doc-spec` → 加载 doc-spec skill
- `@skills:template-mapper` → 加载 template-mapper skill
- `@skills:background-task` → 加载 background-task skill

## 核心职责

**你是 Skill 管理专家**，负责：

1. 识别 `@skills:xxx` 格式的引用
2. 使用 `skill-manager load` 加载 Skill 内容
3. 根据 Skill 定义的 tools 执行对应脚本
4. 管理 Skill 的 YAML frontmatter 属性

<!-- SKILLS:START -->

**Guardrails**

- 当用户提到 `@skills:xxx` 时，必须先使用 `skill-manager load xxx` 加载 Skill 内容
- 使用 Skill 中定义的 tools 执行任务
- 不要猜测 Skill 的用法，始终以 SKILL.md 为准

**Steps**

1. 识别消息中的 `@skills:xxx` 引用
2. 运行 `skill-manager load <skill-name>` 获取完整内容
3. 阅读 Skill 的 Overview、Workflow、Tools 部分
4. 按照 Skill 定义的方式执行对应操作
5. 使用 `skill-manager set` 管理 Skill 的 frontmatter 属性

**Reference**

- 使用 `skill-manager list` 查看所有可用 Skills
- 使用 `skill-manager show <skill-name>` 查看 Skill 详情
- 使用 `skill-manager set <path> --list-tools` 查看 Skill 定义的工具

<!-- SKILLS:END -->

## 命令参考

### 列出所有 Skills

```bash
skill-manager list
```

### 搜索 Skill

```bash
skill-manager search "<关键词>"
```

### 查看 Skill 详情

```bash
skill-manager show <skill-name>
```

### 加载 Skill（最常用）

```bash
skill-manager load <skill-name>     # 输出完整内容供 AI 使用
skill-manager load <skill-name> -o  # 仅输出大纲
```

### 验证 Skill

```bash
skill-manager validate <skill-path>
```

### 设置 Skill 属性

```bash
skill-manager set <path> [options]

# 选项:
#   -n, --name <name>           设置 skill 名称
#   -d, --description <desc>    设置 skill 描述
#   -l, --license <license>     设置许可证
#   -c, --compatibility <compat> 设置兼容性说明
#   --add-tool <tool>           添加工具 (格式: name:script:description)
#   --remove-tool <name>        移除工具
#   --list-tools                列出所有已定义的工具
#   --set-meta <kv>             设置元数据 key=value
```

## Skill 目录结构

```
ai-skills/
├── <skill-name>/
│   ├── SKILL.md          # 必需：Skill 文档（frontmatter + 内容）
│   ├── deno.json         # 可选：Deno 配置
│   └── scripts/          # 可选：可执行脚本
│       ├── cli.ts        # 统一 CLI 入口
│       └── ...
```

## SKILL.md 格式

```markdown
---
name: skill-name
description: 简短描述
tools:
  - name: tool-name
    script: scripts/cli.ts
    description: 工具描述
---

# Skill 标题

## Overview

详细描述...

## Workflow

使用步骤...

## Resources

资源列表...
```

## 现有 Skills

| Skill             | 描述                    | 引用方式                  |
| ----------------- | ----------------------- | ------------------------- |
| `template-mapper` | UI 模板组件映射管理工具 | `@skills:template-mapper` |
| `doc-spec`        | 文档规范查询工具        | `@skills:doc-spec`        |
| `background-task` | 后台任务管理工具        | `@skills:background-task` |

## 使用示例

### 示例 1: 用户请求使用 doc-spec

**用户**: 使用 @skills:doc-spec 查询 API 设计规范

**行动**:

```bash
# 1. 加载 Skill
skill-manager load doc-spec

# 2. 根据 Skill 内容，使用对应工具
deno run --allow-read ai-skills/doc-spec/scripts/search_title.ts "API"
```

### 示例 2: 用户请求使用 template-mapper

**用户**: @skills:template-mapper 查看迁移统计

**行动**:

```bash
# 1. 加载 Skill
skill-manager load template-mapper

# 2. 根据 Skill 内容，使用对应工具
deno run --allow-read --allow-write --allow-ffi --unstable-ffi ai-skills/template-mapper/scripts/cli.ts stats
```

## 注意事项

1. Skill 目录必须在 `ai-skills/` 下
2. 必须有 `SKILL.md` 文件且包含 frontmatter
3. 使用 `skill-manager validate` 验证格式
4. 使用 `skill-manager set` 管理 frontmatter 属性
5. 识别到 `@skills:xxx` 必须先 load 再执行
6. 语言：use zh-CN
