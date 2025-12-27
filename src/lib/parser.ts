/**
 * YAML Frontmatter 解析工具
 */
import { parse as parseYaml } from "@std/yaml";

/**
 * 解析 SKILL.md 文件的 frontmatter 和 body
 */
export function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const yamlContent = match[1];
  const body = match[2];

  try {
    const frontmatter = parseYaml(yamlContent) as Record<string, unknown>;
    return { frontmatter: frontmatter || {}, body };
  } catch (e) {
    console.error(`⚠️  YAML 解析错误: ${e}`);
    return { frontmatter: {}, body };
  }
}
