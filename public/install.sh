#!/usr/bin/env bash
# iOS Motion System — one-line installer.
#
# Usage:
#   curl -fsSL https://ios-motion-system.vercel.app/install.sh | bash
#
# What it does
#   1. git clone (or pull) the repo into ~/.local/share/ios-motion-system
#   2. symlink skill/ into ~/.cursor/skills-cursor, ~/.claude/skills,
#      and ~/.codex/skills (whichever skill dirs make sense for your setup)
#   3. tell you to restart the client
#
# Env overrides
#   IOS_MOTION_SYSTEM_DIR    where the source lives (default: ~/.local/share/ios-motion-system)
#   IOS_MOTION_SYSTEM_REPO   git remote (default: github.com/prosody007/ios-motion-system)

set -euo pipefail

REPO_URL="${IOS_MOTION_SYSTEM_REPO:-https://github.com/prosody007/ios-motion-system.git}"
INSTALL_DIR="${IOS_MOTION_SYSTEM_DIR:-$HOME/.local/share/ios-motion-system}"
SKILL_NAME="ios-motion-system"

c_cyan()  { printf "\033[36m%s\033[0m" "$1"; }
c_green() { printf "\033[32m%s\033[0m" "$1"; }
c_red()   { printf "\033[31m%s\033[0m" "$1"; }
c_dim()   { printf "\033[2m%s\033[0m" "$1"; }

echo "$(c_cyan "[ios-motion-system]") Installing the Skill"
echo

# 1. Clone or update
if [ -d "$INSTALL_DIR/.git" ]; then
  echo "→ Updating $(c_dim "$INSTALL_DIR")"
  git -C "$INSTALL_DIR" pull --quiet --ff-only || {
    echo "$(c_red "✗") git pull failed in $INSTALL_DIR"
    exit 1
  }
else
  echo "→ Cloning to $(c_dim "$INSTALL_DIR")"
  mkdir -p "$(dirname "$INSTALL_DIR")"
  git clone --depth 1 --quiet "$REPO_URL" "$INSTALL_DIR" || {
    echo "$(c_red "✗") git clone failed"
    exit 1
  }
fi

if [ ! -d "$INSTALL_DIR/skill" ]; then
  echo "$(c_red "✗") $INSTALL_DIR/skill not found in the cloned repo"
  exit 1
fi

# 2. Symlink into each known client's skills directory
link_for_client() {
  local target_dir="$1"
  local client_name="$2"
  mkdir -p "$target_dir"
  local link="$target_dir/$SKILL_NAME"
  if [ -L "$link" ] || [ -e "$link" ]; then
    rm -rf "$link"
  fi
  ln -s "$INSTALL_DIR/skill" "$link"
  echo "→ Linked into $(c_cyan "$client_name") $(c_dim "$link")"
}

link_for_client "$HOME/.cursor/skills-cursor" "Cursor"
link_for_client "$HOME/.claude/skills"        "Claude Code"
link_for_client "$HOME/.codex/skills"         "Codex"

echo
echo "$(c_green "✓") Done. Restart your client to load the Skill."
echo
echo "Try:"
echo "  $(c_dim "\"实现 iOS 风格的按钮按压反馈\"")"
echo "  $(c_dim "\"卡片翻转效果，要真 3D 透视\"")"
echo "  $(c_dim "\"给我一段流光边框 CSS\"")"
