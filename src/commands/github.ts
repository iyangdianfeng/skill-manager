/**
 * github 命令 - 从 GitHub 搜索 Skills
 */
import { Command } from "@cliffy/command";
import { searchGitHubSkills, bold, cyan } from "../lib/mod.ts";

export const githubCommand = new Command()
  .name("github")
  .alias("gh").alias("remote")
  .description("从 GitHub 搜索 Skills")
  .arguments("<query:string>")
  .option("-l, --limit <limit:number>", "搜索结果数量限制", { default: 10 })
  .option("--json", "输出 JSON 格式")
  .action(async (options, query: string) => {
    console.log(`🔍 在 GitHub 搜索: "${query}"...\n`);

    try {
      const items = await searchGitHubSkills(query, options.limit);

      if (items.length === 0) {
        console.log(`❌ 未找到匹配 "${query}" 的 Skills`);
        console.log("\n💡 提示: 尝试搜索 'pdf', 'docx', 'claude' 等关键词");
        return;
      }

      if (options.json) {
        console.log(JSON.stringify(items, null, 2));
        return;
      }

      console.log(`📦 找到 ${bold(String(items.length))} 个仓库:\n`);

      for (const repo of items) {
        console.log(`  ${bold(cyan(repo.full_name))} ⭐ ${repo.stargazers_count}`);
        if (repo.description) {
          console.log(
            `    ${repo.description.slice(0, 100)}${repo.description.length > 100 ? "..." : ""}`
          );
        }
        if (repo.topics && repo.topics.length > 0) {
          console.log(`    🏷️  ${repo.topics.slice(0, 5).join(", ")}`);
        }
        console.log(`    🔗 ${repo.html_url}`);
        console.log();
      }

      console.log(`${bold("💡 安装方式:")}`);
      console.log(`  skill-manager install <user>/<repo>        # 安装到项目目录`);
      console.log(`  skill-manager install <user>/<repo> -g     # 全局安装`);
    } catch (e) {
      console.error(`❌ 搜索失败: ${e}`);
    }
  });
