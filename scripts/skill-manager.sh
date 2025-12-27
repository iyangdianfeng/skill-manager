#!/bin/bash
# Skill Manager CLI 快捷启动脚本

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

deno run --allow-read --allow-write --allow-env --allow-net --allow-run src/main.ts "$@"
