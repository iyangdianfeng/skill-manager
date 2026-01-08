/**
 * search command - Local search for Skills
 */
import { Command } from "@cliffy/command";
import { bold, cyan, scanSkills, t } from "../lib/mod.ts";

export const searchCommand = new Command()
  .name("search")
  .alias("find")
  .description("Search for matching Skills locally")
  .arguments("<query:string>")
  .option("--json", "Output in JSON format")
  .action(async (options, query: string) => {
    const skills = await scanSkills(Deno.cwd());

    const queryLower = query.toLowerCase();
    const matches = skills.filter(
      (s) =>
        s.name.toLowerCase().includes(queryLower) ||
        s.description.toLowerCase().includes(queryLower),
    );

    if (matches.length === 0) {
      console.log(`❌ ${t("search.noMatch", { query })}`);
      return;
    }

    if (options.json) {
      console.log(JSON.stringify(matches, null, 2));
      return;
    }

    console.log(`🔍 ${t("search.found", { count: matches.length })}:\n`);

    for (const skill of matches) {
      console.log(`  ${bold(cyan(skill.name))}`);
      console.log(
        `    ${skill.description.slice(0, 120)}${skill.description.length > 120 ? "..." : ""}`,
      );
      console.log(`    📁 ${skill.path}\n`);
    }
  });
