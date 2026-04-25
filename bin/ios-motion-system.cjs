#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const PACKAGE_NAME = "ios-motion-system";
const repoRoot = path.resolve(__dirname, "..");

function printUsage() {
  console.log(`Usage:
  ios-motion-system mcp
  ios-motion-system mcp init --client <cursor|claude|vscode|codex> [--local] [--print]
`);
}

function spawnMcpServer() {
  const entry = path.join(repoRoot, "src", "mcp", "server.ts");
  const child = spawn(process.execPath, ["--import", "tsx", entry], {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env,
  });

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
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--local") {
      args.local = true;
      continue;
    }
    if (token === "--print" || token === "--dry-run") {
      args.print = true;
      continue;
    }
    if (token === "--client") {
      args.client = argv[i + 1];
      i += 1;
      continue;
    }
  }
  return args;
}

function getCommandConfig({ local }) {
  if (local) {
    return {
      command: "node",
      args: [path.join(repoRoot, "scripts", "mcp-stdio.cjs")],
    };
  }

  return {
    command: "npx",
    args: [`${PACKAGE_NAME}@latest`, "mcp"],
  };
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeJsonConfig(filePath, rootKey, serverName, config, printOnly) {
  const existing = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf8"))
    : {};

  const next = {
    ...existing,
    [rootKey]: {
      ...(existing[rootKey] ?? {}),
      [serverName]: config,
    },
  };

  if (printOnly) {
    console.log(formatJson(next));
    return;
  }

  ensureDir(filePath);
  fs.writeFileSync(filePath, formatJson(next), "utf8");
  console.log(`Updated ${filePath}`);
}

function writeCodexConfig(serverName, config, printOnly) {
  const filePath = path.join(os.homedir(), ".codex", "config.toml");
  const block = `[mcp_servers.${serverName}]
command = "${config.command}"
args = [${config.args.map((arg) => JSON.stringify(arg)).join(", ")}]
`;

  if (printOnly) {
    console.log(block);
    return;
  }

  ensureDir(filePath);
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const pattern = new RegExp(
    String.raw`\[mcp_servers\.${serverName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\][\s\S]*?(?=\n\[|$)`,
    "m",
  );
  const next = pattern.test(current)
    ? current.replace(pattern, block.trimEnd())
    : `${current.trimEnd()}${current.trim() ? "\n\n" : ""}${block.trimEnd()}\n`;

  fs.writeFileSync(filePath, next, "utf8");
  console.log(`Updated ${filePath}`);
}

function initClientConfig(client, options) {
  const config = getCommandConfig(options);
  const serverName = PACKAGE_NAME;
  const cwd = process.cwd();

  switch (client) {
    case "cursor":
      writeJsonConfig(
        path.join(cwd, ".cursor", "mcp.json"),
        "mcpServers",
        serverName,
        config,
        options.print,
      );
      break;
    case "claude":
      writeJsonConfig(
        path.join(cwd, ".mcp.json"),
        "mcpServers",
        serverName,
        config,
        options.print,
      );
      break;
    case "vscode":
      writeJsonConfig(
        path.join(cwd, ".vscode", "mcp.json"),
        "servers",
        serverName,
        config,
        options.print,
      );
      break;
    case "codex":
      writeCodexConfig(serverName, config, options.print);
      break;
    default:
      console.error(`Unsupported client: ${client}`);
      process.exit(1);
  }
}

const [command, subcommand, ...rest] = process.argv.slice(2);

if (command !== "mcp") {
  printUsage();
  process.exit(1);
}

if (!subcommand) {
  spawnMcpServer();
} else if (subcommand === "init") {
  const options = parseArgs(rest);
  if (!options.client) {
    console.error("Missing --client option");
    printUsage();
    process.exit(1);
  }
  initClientConfig(options.client, options);
} else {
  printUsage();
  process.exit(1);
}
