/**
 * File system utilities
 */
import { walk } from "@std/fs/walk";
import { ensureDir } from "@std/fs/ensure-dir";
import { basename, dirname, join, resolve } from "@std/path";
import { parseFrontmatter } from "./parser.ts";
import type { SkillFull, SkillMeta } from "../types/mod.ts";

/**
 * Find Skills directory
 * Priority: Environment variable > skills folder in parent directories > current directory
 */
export async function findSkillsDir(): Promise<string> {
  // First check environment variable
  const envDir = Deno.env.get("SKILLS_DIR");
  if (envDir) {
    try {
      await Deno.stat(envDir);
      return envDir;
    } catch {
      // Ignore, continue searching
    }
  }

  // Search for skills folder in current and parent directories
  let currentDir = Deno.cwd();
  for (let i = 0; i < 5; i++) {
    const skillsPath = join(currentDir, "skills");
    try {
      const stat = await Deno.stat(skillsPath);
      if (stat.isDirectory) {
        return skillsPath;
      }
    } catch {
      // Continue searching upward
    }

    // Check if current directory is a skills directory
    const skillMdPath = join(currentDir, "SKILL.md");
    try {
      await Deno.stat(skillMdPath);
      return dirname(currentDir);
    } catch {
      // Continue
    }

    const parent = dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }

  // Default to current directory
  return Deno.cwd();
}

/**
 * Scan directory for all Skills
 */
export async function scanSkills(skillsDir: string): Promise<SkillMeta[]> {
  const skills: SkillMeta[] = [];

  try {
    for await (
      const entry of walk(skillsDir, {
        maxDepth: 3,
        includeDirs: false,
        match: [/SKILL\.md$/],
      })
    ) {
      try {
        const content = await Deno.readTextFile(entry.path);
        const { frontmatter } = parseFrontmatter(content);

        if (frontmatter.name && frontmatter.description) {
          skills.push({
            name: String(frontmatter.name),
            description: String(frontmatter.description),
            path: dirname(entry.path),
            license: frontmatter.license ? String(frontmatter.license) : undefined,
            compatibility: frontmatter.compatibility
              ? String(frontmatter.compatibility)
              : undefined,
            metadata: frontmatter.metadata as Record<string, string> | undefined,
          });
        }
      } catch (e) {
        console.error(`⚠️  Parse failed: ${entry.path}: ${e}`);
      }
    }
  } catch (e) {
    console.error(`❌ Failed to scan directory: ${e}`);
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Load full Skill information
 */
export async function loadSkillFull(skillPath: string): Promise<SkillFull | null> {
  const skillMdPath = join(skillPath, "SKILL.md");

  try {
    const content = await Deno.readTextFile(skillMdPath);
    const { frontmatter, body } = parseFrontmatter(content);

    const scripts: string[] = [];
    const references: string[] = [];
    const assets: string[] = [];

    // Scan subdirectories
    for await (const entry of walk(skillPath, { maxDepth: 2, includeDirs: false })) {
      const relPath = entry.path.replace(skillPath + "/", "");
      if (relPath.startsWith("scripts/")) scripts.push(relPath);
      else if (relPath.startsWith("references/")) references.push(relPath);
      else if (relPath.startsWith("assets/")) assets.push(relPath);
    }

    return {
      name: String(frontmatter.name || basename(skillPath)),
      description: String(frontmatter.description || ""),
      path: skillPath,
      license: frontmatter.license ? String(frontmatter.license) : undefined,
      compatibility: frontmatter.compatibility ? String(frontmatter.compatibility) : undefined,
      metadata: frontmatter.metadata as Record<string, string> | undefined,
      body,
      scripts,
      references,
      assets,
    };
  } catch {
    return null;
  }
}

/**
 * Get Skills installation directory
 */
export function getSkillsInstallDir(global: boolean): string {
  if (global) {
    const home = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || "";
    return join(home, ".claude", "skills");
  } else {
    return join(Deno.cwd(), ".claude", "skills");
  }
}

/**
 * Copy directory recursively
 */
export async function copyDir(src: string, dest: string): Promise<void> {
  await ensureDir(dest);

  for await (const entry of Deno.readDir(src)) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory) {
      await copyDir(srcPath, destPath);
    } else {
      await Deno.copyFile(srcPath, destPath);
    }
  }
}

// Export common path utilities
export { basename, dirname, ensureDir, join, resolve, walk };
