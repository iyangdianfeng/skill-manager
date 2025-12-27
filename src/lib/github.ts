/**
 * GitHub API 操作工具
 */
import type { GitHubSearchResult } from "../types/mod.ts";

/**
 * GitHub API 请求头
 */
function getGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "skill-manager-cli",
  };

  const token = Deno.env.get("GITHUB_TOKEN");
  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  return headers;
}

/**
 * 搜索 GitHub 仓库
 */
export async function searchGitHubSkills(
  query: string,
  limit: number = 10
): Promise<GitHubSearchResult[]> {
  const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    query + " SKILL.md in:path"
  )}&per_page=${limit}&sort=stars`;

  const response = await fetch(searchUrl, {
    headers: getGitHubHeaders(),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub API 速率限制，请稍后再试或设置 GITHUB_TOKEN 环境变量");
    }
    throw new Error(`GitHub API 错误: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * 获取仓库信息
 */
export async function getRepoInfo(
  owner: string,
  repo: string
): Promise<{ default_branch: string } | null> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  const response = await fetch(apiUrl, {
    headers: getGitHubHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`GitHub API 错误: ${response.status}`);
  }

  return await response.json();
}

/**
 * 下载仓库 ZIP 文件
 */
export async function downloadRepoZip(
  owner: string,
  repo: string,
  branch: string
): Promise<ArrayBuffer> {
  const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;

  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(`下载失败: ${response.status}`);
  }

  return await response.arrayBuffer();
}
