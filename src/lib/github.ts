/**
 * GitHub API utilities
 */
import type { GitHubSearchResult } from "../types/mod.ts";

/**
 * Get GitHub API request headers
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
 * Search GitHub repositories for Skills
 */
export async function searchGitHubSkills(
  query: string,
  limit: number = 10,
): Promise<GitHubSearchResult[]> {
  const searchUrl = `https://api.github.com/search/repositories?q=${
    encodeURIComponent(
      query + " SKILL.md in:path",
    )
  }&per_page=${limit}&sort=stars`;

  const response = await fetch(searchUrl, {
    headers: getGitHubHeaders(),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Try again later or set GITHUB_TOKEN");
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Get repository information
 */
export async function getRepoInfo(
  owner: string,
  repo: string,
): Promise<{ default_branch: string } | null> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  const response = await fetch(apiUrl, {
    headers: getGitHubHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return await response.json();
}

/**
 * Download repository ZIP file
 */
export async function downloadRepoZip(
  owner: string,
  repo: string,
  branch: string,
): Promise<ArrayBuffer> {
  const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.zip`;

  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  return await response.arrayBuffer();
}
