# iOS Motion System

A reference library of production-ready iOS motion patterns — Spring, Sheet, Tab Bar, Card flips, transitions, gestures, skeletons, border glow — each shipped with paste-ready SwiftUI **and** UIKit code.

Browse the demos at **[ios-motion-system.vercel.app](https://ios-motion-system.vercel.app)**, or install it as an Agent Skill so Cursor / Claude Code / Codex can drop the right implementation straight into your project.

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

40 categories, ~80 cards. Every card carries a SwiftUI implementation (iOS 16+, with iOS 17 spring presets noted where relevant) and a UIKit equivalent. A handful of cards (Spring Playground, Border Glow, Carousel) accept runtime parameters; the skill substitutes them via the bundled `templates/dynamic-params.md`.

## Live development

```bash
git clone https://github.com/prosody007/ios-motion-system.git
cd ios-motion-system
npm install

npm run dev            # http://localhost:3000
npm run export-skill   # rebuild ./skill from src/data
npm run build          # production build
```

Catalog data lives in `src/data/<slug>.ts`. After editing, run `npm run export-skill` to regenerate the skill folder, commit, push — anyone running `npx skills update ios-motion-system` will pull the change.

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
