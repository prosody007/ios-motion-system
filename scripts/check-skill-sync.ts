import { spawnSync } from "node:child_process";

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCapture(command: string, args: string[]) {
  return spawnSync(command, args, {
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    shell: process.platform === "win32",
  });
}

run("npm", ["run", "export-skill"]);

const unstaged = runCapture("git", ["diff", "--name-only", "--", "skill"]);
if (unstaged.status !== 0) {
  process.stderr.write(unstaged.stderr || "Failed to read git diff.\n");
  process.exit(unstaged.status ?? 1);
}

const untracked = runCapture("git", [
  "ls-files",
  "--others",
  "--exclude-standard",
  "--",
  "skill",
]);
if (untracked.status !== 0) {
  process.stderr.write(untracked.stderr || "Failed to read untracked files.\n");
  process.exit(untracked.status ?? 1);
}

const drift = [unstaged.stdout.trim(), untracked.stdout.trim()]
  .filter(Boolean)
  .join("\n");

if (drift.length > 0) {
  process.stderr.write(
    [
      "\n[skill-sync] Detected generated skill drift.",
      "Run `npm run export-skill` and commit updated files under `skill/`.",
      "",
    ].join("\n"),
  );
  process.stderr.write(`${drift}\n`);
  process.exit(1);
}

process.stdout.write("[skill-sync] skill/ is up to date.\n");
