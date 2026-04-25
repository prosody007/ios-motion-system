#!/usr/bin/env node

const { spawn } = require("node:child_process");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const entry = path.join(repoRoot, "src", "mcp", "server.ts");

const child = spawn(
  process.execPath,
  ["--import", "tsx", entry],
  {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env,
  },
);

child.on("error", (error) => {
  console.error("Failed to start ios-motion-system MCP server:", error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
