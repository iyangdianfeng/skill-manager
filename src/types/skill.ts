/**
 * Skill related type definitions
 */

/**
 * Tool script definition
 */
export interface SkillTool {
  /** Tool name (identifier) */
  name: string;
  /** Script path relative to skill directory */
  script: string;
  /** Tool description */
  description: string;
}

/**
 * Skill metadata (basic information)
 */
export interface SkillMeta {
  /** Skill name */
  name: string;
  /** Skill description */
  description: string;
  /** Skill local path */
  path: string;
  /** License */
  license?: string;
  /** Compatibility notes */
  compatibility?: string;
  /** Custom metadata */
  metadata?: Record<string, string>;
  /** Tool scripts */
  tools?: SkillTool[];
}

/**
 * Full Skill information (includes resource lists)
 */
export interface SkillFull extends SkillMeta {
  /** SKILL.md body content */
  body: string;
  /** Files in scripts/ directory */
  scripts: string[];
  /** Files in references/ directory */
  references: string[];
  /** Files in assets/ directory */
  assets: string[];
}

/**
 * GitHub search result
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
 * Installed Skills scan result
 */
export interface InstalledSkillsResult {
  location: string;
  skills: SkillMeta[];
}
