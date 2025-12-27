#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-net --allow-run
/**
 * Skill Manager CLI - 跨平台 AI Skill 管理工具
 *
 * 使用 Cliffy 框架构建的命令行工具
 *
 * @module
 */

import { Command } from "@cliffy/command";
import {
  listCommand,
  searchCommand,
  showCommand,
  loadCommand,
  initCommand,
  validateCommand,
  exportCommand,
  githubCommand,
  installCommand,
  uninstallCommand,
  installedCommand,
} from "./commands/mod.ts";

// 版本信息
const VERSION = "1.0.0";

// 创建主命令
const program = new Command()
  .name("skill-manager")
  .version(VERSION)
  .description("跨平台 AI Skill 管理工具 - 管理和使用 Agent Skills")
  .meta("Author", "Anthropic Skills Community")
  .meta("Repository", "https://github.com/anthropics/skills")
  // 本地管理命令
  .command("list", listCommand)
  .command("search", searchCommand)
  .command("show", showCommand)
  .command("load", loadCommand)
  .command("init", initCommand)
  .command("validate", validateCommand)
  .command("export", exportCommand)
  // GitHub & 安装命令
  .command("github", githubCommand)
  .command("install", installCommand)
  .command("uninstall", uninstallCommand)
  .command("installed", installedCommand);

// 解析命令行参数
await program.parse(Deno.args);
