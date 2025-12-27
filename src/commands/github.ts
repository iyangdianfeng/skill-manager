/**
 * github command - Search Skills from GitHub
 */
import { Command } from "@cliffy/command";
import { bold, cyan, searchGitHubSkills, t } from "../lib/mod.ts";

export const githubCommand = new Command()
  .name("github")
  .alias("gh")
  .alias("remote")
  .description("Search Skills from GitHub")
  .arguments("<query:string>")
  .option("-l, --limit <limit:number>", "Limit number of results", { default: 10 })
  .option("--json", "Output in JSON format")
  .action(async (options, query: string) => {
    console.log(t("github.searching", { query }));
    console.log();

    try {
      const items = await searchGitHubSkills(query, options.limit);

      if (items.length === 0) {
        console.log(`❌ ${t("github.noMatch", { query })}`);
        console.log(`\n💡 ${t("github.hint")}`);
        return;
      }

      if (options.json) {
        console.log(JSON.stringify(items, null, 2));
        return;
      }

      console.log(`📦 ${t("github.foundRepos", { count: items.length })}:\n`);

      for (const repo of items) {
        console.log(`  ${bold(cyan(repo.full_name))} ⭐ ${repo.stargazers_count}`);
        if (repo.description) {
          console.log(
            `    ${repo.description.slice(0, 100)}${repo.description.length > 100 ? "..." : ""}`,
          );
        }
        if (repo.topics && repo.topics.length > 0) {
          console.log(`    🏷️  ${repo.topics.slice(0, 5).join(", ")}`);
        }
        console.log(`    🔗 ${repo.html_url}`);
        console.log();
      }

      console.log(`${bold(`💡 ${t("github.installHint")}:`)}`);
      console.log(`  skill-manager install <user>/<repo>        # ${t("github.installProject")}`);
      console.log(`  skill-manager install <user>/<repo> -g     # ${t("github.installGlobal")}`);
    } catch (e) {
      console.error(`❌ ${t("error.searchFailed")}: ${e}`);
    }
  });
