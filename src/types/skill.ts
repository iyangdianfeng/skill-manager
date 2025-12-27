/**
 * Skill related type definitions
 */

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
