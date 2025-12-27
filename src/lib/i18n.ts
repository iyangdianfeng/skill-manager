/**
 * Internationalization (i18n) module
 * Provides multi-language support for CLI messages
 */

type MessageKey = keyof typeof messages.en;

const messages = {
  en: {
    // Common
    "common.skill": "Skill",
    "common.skills": "Skills",
    "common.path": "Path",
    "common.name": "Name",
    "common.description": "Description",
    "common.license": "License",
    "common.compatibility": "Compatibility",
    "common.scripts": "Scripts",
    "common.references": "References",
    "common.assets": "Assets",
    "common.global": "Global",
    "common.project": "Project",

    // Errors
    "error.notFound": "Not found",
    "error.skillNotFound": "Skill not found",
    "error.invalidFormat": "Invalid format",
    "error.directoryExists": "Directory already exists",
    "error.missingField": "Missing required field",
    "error.searchFailed": "Search failed",
    "error.installFailed": "Installation failed",
    "error.downloadFailed": "Download failed",
    "error.unzipFailed": "Unzip failed",
    "error.noSkillMd": "SKILL.md file not found",
    "error.parseError": "YAML parse error",
    "error.scanFailed": "Failed to scan directory",
    "error.rateLimited": "GitHub API rate limit exceeded. Try again later or set GITHUB_TOKEN",

    // Success
    "success.installed": "Installed",
    "success.uninstalled": "Uninstalled",
    "success.created": "Created successfully",
    "success.exported": "Exported to",
    "success.saved": "Saved to",
    "success.valid": "Validation passed! Skill format is correct.",

    // List command
    "list.scanning": "Scanning directory",
    "list.found": "Found {count} skills",
    "list.noSkills": "No skills found",
    "list.useVerbose": "Use --verbose for details",

    // Search command
    "search.searching": "Searching",
    "search.found": "Found {count} matching skills",
    "search.noMatch": "No skills matching \"{query}\" found",

    // Show command
    "show.usage": "Usage",
    "show.useList": "Use 'skill-manager list' to see all available skills",

    // Load command
    "load.fullPath": "Full path",
    "load.useLoad": "Use 'skill-manager load {name}' to get full content",

    // Init command
    "init.nameError": "Skill name format error",
    "init.nameHint": "Required: lowercase letters, numbers, and hyphens. Cannot start or end with hyphen",
    "init.structure": "Directory structure",
    "init.nextSteps": "Next steps",
    "init.editSkillMd": "Edit {path} to complete content",
    "init.runValidate": "Run skill-manager validate {path} to verify format",

    // Validate command
    "validate.validating": "Validating Skill",
    "validate.errors": "Errors",
    "validate.warnings": "Warnings",
    "validate.nameTooLong": "name exceeds 64 character limit",
    "validate.nameFormat": "name format error: only lowercase letters, numbers, and hyphens allowed",
    "validate.nameConsecutive": "name cannot contain consecutive hyphens",
    "validate.nameMismatch": "Directory name '{dir}' does not match skill name '{name}'",
    "validate.descTooLong": "description exceeds 1024 character limit",
    "validate.descTooShort": "description too short, recommend at least 20 characters",
    "validate.bodyTooShort": "SKILL.md body too short, recommend adding more content",
    "validate.hasTodo": "Contains incomplete TODO placeholders",

    // Export command
    "export.resources": "Resources",

    // GitHub command
    "github.searching": "Searching GitHub for \"{query}\"...",
    "github.foundRepos": "Found {count} repositories",
    "github.noMatch": "No Skills matching \"{query}\" found",
    "github.hint": "Tip: Try searching for 'pdf', 'docx', 'claude', etc.",
    "github.installHint": "Installation",
    "github.installProject": "Install to project directory",
    "github.installGlobal": "Install globally",

    // Install command
    "install.installing": "Installing Skill",
    "install.targetDir": "Target directory",
    "install.mode": "Mode",
    "install.downloading": "Downloading from GitHub",
    "install.unzipping": "Unzipping...",
    "install.invalidDir": "Invalid Skill directory",
    "install.mustContain": "Directory must contain SKILL.md file",
    "install.alreadyExists": "Skill \"{name}\" already exists",
    "install.useForce": "Use --force to overwrite",
    "install.invalidRepo": "Invalid repository format",
    "install.repoHint": "Format: <user>/<repo> or <user>/<repo>/<path>",
    "install.repoNotFound": "Repository not found",
    "install.noSkillMdRoot": "No SKILL.md in root, searching subdirectories...",
    "install.noSkillMdFound": "No SKILL.md files found",
    "install.totalInstalled": "Total {count} Skills installed",

    // Uninstall command
    "uninstall.uninstalling": "Uninstalling Skill",
    "uninstall.notFound": "Skill does not exist",
    "uninstall.foundIn": "Found in {location} directory",
    "uninstall.useFlag": "Use {flag} flag to uninstall",

    // Installed command
    "installed.noInstalled": "(No installed Skills)",
    "installed.useInstall": "Use 'skill-manager install <source>' to install Skills",
    "installed.total": "Total {count} installed Skills",
  },
  zh: {
    // Common
    "common.skill": "Skill",
    "common.skills": "Skills",
    "common.path": "路径",
    "common.name": "名称",
    "common.description": "描述",
    "common.license": "许可证",
    "common.compatibility": "兼容性",
    "common.scripts": "脚本",
    "common.references": "参考文档",
    "common.assets": "资源文件",
    "common.global": "全局",
    "common.project": "项目",

    // Errors
    "error.notFound": "未找到",
    "error.skillNotFound": "未找到 skill",
    "error.invalidFormat": "格式无效",
    "error.directoryExists": "目录已存在",
    "error.missingField": "缺少必需字段",
    "error.searchFailed": "搜索失败",
    "error.installFailed": "安装失败",
    "error.downloadFailed": "下载失败",
    "error.unzipFailed": "解压失败",
    "error.noSkillMd": "SKILL.md 文件不存在",
    "error.parseError": "YAML 解析错误",
    "error.scanFailed": "扫描目录失败",
    "error.rateLimited": "GitHub API 速率限制，请稍后再试或设置 GITHUB_TOKEN 环境变量",

    // Success
    "success.installed": "已安装",
    "success.uninstalled": "已卸载",
    "success.created": "创建成功",
    "success.exported": "已导出到",
    "success.saved": "已保存到",
    "success.valid": "验证通过！Skill 格式正确。",

    // List command
    "list.scanning": "扫描目录",
    "list.found": "找到 {count} 个 skills",
    "list.noSkills": "未找到任何 skills",
    "list.useVerbose": "使用 --verbose 查看详细信息",

    // Search command
    "search.searching": "搜索中",
    "search.found": "找到 {count} 个匹配的 skills",
    "search.noMatch": "未找到匹配 \"{query}\" 的 skill",

    // Show command
    "show.usage": "使用方式",
    "show.useList": "使用 'skill-manager list' 查看所有可用的 skills",

    // Load command
    "load.fullPath": "完整路径",
    "load.useLoad": "使用 'skill-manager load {name}' 获取完整内容",

    // Init command
    "init.nameError": "skill name 格式错误",
    "init.nameHint": "要求: 小写字母、数字和连字符，不能以连字符开头或结尾",
    "init.structure": "目录结构",
    "init.nextSteps": "下一步",
    "init.editSkillMd": "编辑 {path} 完善内容",
    "init.runValidate": "运行 skill-manager validate {path} 验证格式",

    // Validate command
    "validate.validating": "验证 Skill",
    "validate.errors": "错误",
    "validate.warnings": "警告",
    "validate.nameTooLong": "name 超过 64 字符限制",
    "validate.nameFormat": "name 格式错误: 只能包含小写字母、数字和连字符",
    "validate.nameConsecutive": "name 不能包含连续的连字符",
    "validate.nameMismatch": "目录名 '{dir}' 与 skill name '{name}' 不匹配",
    "validate.descTooLong": "description 超过 1024 字符限制",
    "validate.descTooShort": "description 太短，建议至少 20 字符",
    "validate.bodyTooShort": "SKILL.md body 内容太少，建议添加更多指令",
    "validate.hasTodo": "存在未完成的 TODO 占位符",

    // Export command
    "export.resources": "资源文件",

    // GitHub command
    "github.searching": "在 GitHub 搜索: \"{query}\"...",
    "github.foundRepos": "找到 {count} 个仓库",
    "github.noMatch": "未找到匹配 \"{query}\" 的 Skills",
    "github.hint": "提示: 尝试搜索 'pdf', 'docx', 'claude' 等关键词",
    "github.installHint": "安装方式",
    "github.installProject": "安装到项目目录",
    "github.installGlobal": "全局安装",

    // Install command
    "install.installing": "安装 Skill",
    "install.targetDir": "目标目录",
    "install.mode": "模式",
    "install.downloading": "从 GitHub 下载",
    "install.unzipping": "解压中...",
    "install.invalidDir": "无效的 Skill 目录",
    "install.mustContain": "目录中必须包含 SKILL.md 文件",
    "install.alreadyExists": "Skill \"{name}\" 已存在",
    "install.useForce": "使用 --force 覆盖安装",
    "install.invalidRepo": "无效的仓库格式",
    "install.repoHint": "格式: <user>/<repo> 或 <user>/<repo>/<path>",
    "install.repoNotFound": "仓库不存在",
    "install.noSkillMdRoot": "根目录没有 SKILL.md，尝试查找子目录...",
    "install.noSkillMdFound": "未找到任何 SKILL.md 文件",
    "install.totalInstalled": "共安装 {count} 个 Skills",

    // Uninstall command
    "uninstall.uninstalling": "卸载 Skill",
    "uninstall.notFound": "Skill 不存在",
    "uninstall.foundIn": "在{location}目录中找到该 Skill",
    "uninstall.useFlag": "使用 {flag} 参数卸载",

    // Installed command
    "installed.noInstalled": "(无已安装的 Skills)",
    "installed.useInstall": "使用 'skill-manager install <source>' 安装 Skills",
    "installed.total": "共 {count} 个已安装的 Skills",
  },
};

type Locale = keyof typeof messages;

/**
 * Detect system locale
 */
function detectLocale(): Locale {
  const lang = Deno.env.get("LANG") || Deno.env.get("LANGUAGE") || "en";
  if (lang.startsWith("zh")) {
    return "zh";
  }
  return "en";
}

let currentLocale: Locale = detectLocale();

/**
 * Set current locale
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

/**
 * Get current locale
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Get localized message
 */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
  let message = messages[currentLocale][key] || messages.en[key] || key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      message = message.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }

  return message;
}

/**
 * Export messages type for external use
 */
export type { MessageKey, Locale };
