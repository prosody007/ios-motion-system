# iOS Motion System

A reference library of production-ready iOS motion patterns for React/TSX — Spring, Sheet, Tab Bar, Card flips, transitions, gestures, skeletons, border glow.

This site is publicly available at **[ios-motion-system.vercel.app](https://ios-motion-system.vercel.app)**, and anyone can directly install the Skill into Cursor / Claude Code / Codex.

## Install

```bash
npx skills add prosody007/ios-motion-system
```

The [skills.sh](https://skills.sh) CLI clones the repo and symlinks the skill into the appropriate directories for Cursor, Claude Code, and Codex. Restart your client and ask things like:

```
implement an iOS-style button press feedback with a spring
add a swipeable card stack that snaps back if released early
real 3D card flip, no fade
spring 参数怎么选？我想要轻微回弹
```

The assistant resolves the matching pattern from the skill, adapts naming and state bindings to your project, and writes the code into the right file.

For project-local installs, single-agent installs, copy-instead-of-symlink, or the `curl` fallback, see the [install page](https://ios-motion-system.vercel.app/skills).

## Public access & direct skill onboarding

- Website (public): `https://ios-motion-system.vercel.app`
- Skills install docs (public): `https://ios-motion-system.vercel.app/skills`
- Direct install command: `npx skills add prosody007/ios-motion-system`

## What's included

| Group | Sections |
|---|---|
| Foundations | Duration & Curve · Spring & Timing |
| Component Reactions | Button · Toggle · Checkbox · Segmented Control · Slider · Text Field · Tab Bar · Pull to Refresh |
| Spring | Spring Animations |
| Lists & Content | Reorder · Stagger · Expandable · Card · Carousel |
| Loading & Status | Loading · Skeleton · Progress · Success & Error · Toast |
| Overlays | Sheet · Alert · Action Sheet · Tooltip · Dropdown · Notification Banner |
| Gestures | Swipe to Dismiss · Swipe Cards |
| Transitions | Navigation · Page Transitions · Custom Transitions · Hero Transition |
| Haptics | Haptics |
| Advanced | Counter · Scroll-Driven · Keyframes · Phase Animator · Lottie · Border Glow |

40 categories, ~80 cards. Cards are exported into the `skill/` package that AI clients consume. A handful of cards (Spring Playground, Border Glow, Carousel) accept runtime parameters; the skill substitutes them via the bundled `templates/dynamic-params.md`.

## Live development

```bash
git clone https://github.com/prosody007/ios-motion-system.git
cd ios-motion-system
npm install

npm run dev            # http://localhost:3000
npm run export-skill   # rebuild ./skill from src/data
npm run check-skill-sync  # fail if generated ./skill is stale
npm run setup-hooks    # enable local pre-commit guard
npm run build          # production build
```

Catalog data lives in `src/data/<slug>.ts`. After editing, run `npm run export-skill` to regenerate the skill folder, commit, push — anyone running `npx skills update ios-motion-system` will pull the change.

Guardrails in this repo:

- **Display layer**: website skills page reads from `skill/README.md` (single-source display).
- **Production layer**: generated `skill/` remains the published package consumed by AI clients.
- **Automation**: CI workflow `.github/workflows/skill-sync.yml` runs `npm run check-skill-sync` and blocks stale generated artifacts.
- **Local hook (optional)**: `.githooks/pre-commit` runs the same check to avoid forgetting export before commit.

## Project layout

```
src/
  app/                       Next.js App Router pages
  components/preview/        Live demo for each animation
  data/
    categories.ts            Sidebar / home grid order
    navigation.ts            Sidebar metadata
    skills.ts                Install-page docs
    <slug>.ts                Per-category cards
    index.ts                 sectionMap
  types/motion.ts            Shared types
scripts/
  export-skill.ts            Builds skill/ from src/data
public/
  install.sh                 Alternative one-line installer
skill/                       Generated Agent Skill (committed)
.githooks/
  pre-commit                 Optional local guard for skill sync
.github/workflows/
  skill-sync.yml             CI guard: generated skill must stay in sync
```

## Contributing

Patterns are kept small on purpose — one card per file, copy-paste size, no app shell. To add or refine a pattern:

1. Add or edit a card in `src/data/<slug>.ts`.
2. Add or update the matching live preview in `src/components/preview/`.
3. Verify visually with `npm run dev`.
4. Regenerate the skill with `npm run export-skill`.
5. Open a pull request.

Bug reports and small additions are welcome via Issues.

## License

MIT — see [LICENSE](./LICENSE).
