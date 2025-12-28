/**
 * Skill Manager CLI - Cross-platform AI Skill Management Tool
 *
 * Built with Cliffy command framework
 *
 * @module
 */

import { Command } from "@cliffy/command";
import {
  exportCommand,
  githubCommand,
  initCommand,
  installCommand,
  installedCommand,
  listCommand,
  loadCommand,
  searchCommand,
  setCommand,
  showCommand,
  uninstallCommand,
  validateCommand,
} from "./commands/mod.ts";

// Version info
const VERSION = "1.0.0";

// Create main command
const program = new Command()
  .name("skill-manager")
  .version(VERSION)
  .description("Cross-platform AI Skill Management Tool - Manage and use Agent Skills")
  .meta("Author", "Anthropic Skills Community")
  .meta("Repository", "https://github.com/anthropics/skills")
  // Local management commands
  .command("list", listCommand)
  .command("search", searchCommand)
  .command("show", showCommand)
  .command("load", loadCommand)
  .command("init", initCommand)
  .command("validate", validateCommand)
  .command("set", setCommand)
  .command("export", exportCommand)
  // GitHub & installation commands
  .command("github", githubCommand)
  .command("install", installCommand)
  .command("uninstall", uninstallCommand)
  .command("installed", installedCommand);

// Parse command line arguments
await program.parse(Deno.args);
