/**
 * 文件系统操作工具
 */
import { walk } from "@std/fs/walk";
import { ensureDir } from "@std/fs/ensure-dir";
import { join, dirname, basename, resolve } from "@std/path";
import { parseFrontmatter } from "./parser.ts";
import type { SkillMeta, SkillFull } from "../types/mod.ts";

/**
 * 查找 Skills 目录
 * 优先级: 环境变量 > 父目录中的 skills 文件夹 > 当前目录
 */
export async function findSkillsDir(): Promise<string> {
  // 首先检查环境变量
  const envDir = Deno.env.get("SKILLS_DIR");
  if (envDir) {
    try {
      await Deno.stat(envDir);
      return envDir;
    } catch {
      // 忽略，继续查找
    }
  }

  // 查找当前目录及父目录中的 skills 文件夹
  let currentDir = Deno.cwd();
  for (let i = 0; i < 5; i++) {
    const skillsPath = join(currentDir, "skills");
    try {
      const stat = await Deno.stat(skillsPath);
      if (stat.isDirectory) {
        return skillsPath;
      }
    } catch {
      // 继续向上查找
    }

    // 检查当前目录是否就是 skills 目录
    const skillMdPath = join(currentDir, "SKILL.md");
    try {
      await Deno.stat(skillMdPath);
      return dirname(currentDir);
    } catch {
      // 继续
    }

    const parent = dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }

  // 默认返回当前目录
  return Deno.cwd();
}

/**
 * 扫描目录中的所有 Skills
 */
export async function scanSkills(skillsDir: string): Promise<SkillMeta[]> {
  const skills: SkillMeta[] = [];

  try {
    for await (const entry of walk(skillsDir, {
      maxDepth: 3,
      includeDirs: false,
      match: [/SKILL\.md$/],
    })) {
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
        console.error(`⚠️  解析失败: ${entry.path}: ${e}`);
      }
    }
  } catch (e) {
    console.error(`❌ 扫描目录失败: ${e}`);
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 加载 Skill 的完整信息
 */
export async function loadSkillFull(skillPath: string): Promise<SkillFull | null> {
  const skillMdPath = join(skillPath, "SKILL.md");

  try {
    const content = await Deno.readTextFile(skillMdPath);
    const { frontmatter, body } = parseFrontmatter(content);

    const scripts: string[] = [];
    const references: string[] = [];
    const assets: string[] = [];

    // 扫描子目录
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
      compatibility: frontmatter.compatibility
        ? String(frontmatter.compatibility)
        : undefined,
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
 * 获取 Skills 安装目录
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
 * 复制目录
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

// 导出常用的路径工具
export { join, dirname, basename, resolve, ensureDir, walk };
