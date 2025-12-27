/**
 * Skill 相关类型定义
 */

/**
 * Skill 元数据（基础信息）
 */
export interface SkillMeta {
  /** Skill 名称 */
  name: string;
  /** Skill 描述 */
  description: string;
  /** Skill 本地路径 */
  path: string;
  /** 许可证 */
  license?: string;
  /** 兼容性说明 */
  compatibility?: string;
  /** 自定义元数据 */
  metadata?: Record<string, string>;
}

/**
 * Skill 完整信息（包含资源列表）
 */
export interface SkillFull extends SkillMeta {
  /** SKILL.md 的正文内容 */
  body: string;
  /** scripts/ 目录下的文件列表 */
  scripts: string[];
  /** references/ 目录下的文件列表 */
  references: string[];
  /** assets/ 目录下的文件列表 */
  assets: string[];
}

/**
 * GitHub 搜索结果
 */
export interface GitHubSearchResult {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  topics: string[];
}

/**
 * 已安装 Skills 的扫描结果
 */
export interface InstalledSkillsResult {
  location: string;
  skills: SkillMeta[];
}
