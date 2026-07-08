"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const circleClasses = [
  "circle-12",
  "circle-11",
  "circle-9",
  "circle-8",
  "circle-7",
  "circle-6",
  "circle-5",
  "circle-4",
  "circle-3",
  "circle-2",
];

const sparkleClasses = [
  "sparkle-1",
  "sparkle-2",
  "sparkle-3",
  "sparkle-4",
  "sparkle-5",
  "sparkle-6",
  "sparkle-7",
  "sparkle-8",
];

const uiverseButtonPrompt = `Apply this blue light-field motion to the user's existing button.

Hard constraints:
- Do not change the existing button width, height, border radius, padding, layout, typography, label, icon, click handler, accessibility attributes, disabled state, or loading state.
- Do not replace the product component. Add only the visual/motion layers needed for the effect.
- Do not introduce animation libraries.
- Keep my original classes/styles. Treat the CSS below as additive animation CSS.

Effect:
- Keep the button running by default; do not rely on hover-only motion.
- Clip animated layers inside the button's existing rounded shape.
- Add multiple blurred blue/cyan blobs moving continuously behind the label.
- Add subtle white sparkle particles distributed across the full button width. Sparkle drift and sparkle twinkle should use independent durations/delays so they do not blink in sync.
- Add inset highlights only, not an outer drop shadow.
- On press/tap, scale the button to 0.96 and return to normal.

Use these colors:
- main: #007AFF
- inner highlight: #3395FF
- electric blue: #0A5CFF
- cyan: #18C8FF
- teal glow: rgba(78, 255, 233, 0.68)
- bright cyan: rgba(0, 198, 255, 0.72)
- inset shadow: inset 0 3px 12px rgba(142,202,255,.92), inset 0 -3px 4px rgba(0,78,210,.5)

Copy-ready core implementation:
CSS:
.button { position: relative; overflow: hidden; transform-origin: center; transition: transform 120ms cubic-bezier(.2,.8,.2,1); }
.button:active { transform: scale(.96); }
.button::after { content: ''; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 3px 12px rgba(142,202,255,.92), inset 0 -3px 4px rgba(0,78,210,.5); pointer-events: none; z-index: 2; }
.motion-layer { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; pointer-events: none; z-index: 0; }
.button-label { position: relative; z-index: 3; }
.blob { position: absolute; width: var(--blob-size, clamp(28px, 38%, 40px)); aspect-ratio: 1; border-radius: 999px; filter: blur(var(--blur, 8px)); background: var(--color); animation: blob-move var(--duration, 7s) linear infinite; }
.sparkle { position: absolute; width: var(--size, 3px); height: var(--size, 3px); opacity: var(--opacity,.55); animation: sparkle-drift var(--drift, 15s) ease-in-out infinite, sparkle-twinkle var(--twinkle, 3.3s) ease-in-out infinite; }
@keyframes sparkle-twinkle { 0%,100% { transform: scale(.75); opacity: .38; } 45% { transform: scale(1.18); opacity: 1; } 70% { transform: scale(.92); opacity: .58; } }

HTML/JSX shape:
<button className="button existing-classes">
  <span className="motion-layer" aria-hidden="true">/* blobs + sparkles */</span>
  <span className="button-label">Existing label</span>
</button>`;

const pressButtonPrompt = `Apply this tactile depth press interaction to the user's existing button.

Hard constraints:
- Do not change the existing button width, height, border radius, padding, typography, label, click handler, accessibility attributes, disabled state, or loading state.
- Preserve the button's visual style except for adding a depth layer and press motion.
- Do not introduce animation libraries.
- Keep my original classes/styles. Treat the CSS below as additive interaction CSS.

Effect:
- Add a darker base/depth layer behind the button.
- The top layer sits above the base by --press-depth, default 5px, leaving a visible bottom edge.
- On press/tap, the top layer translates downward by the same depth and the depth shadow/base visually collapses.
- Use a short 100-120ms transition.

Copy-ready core implementation:
CSS:
.depth-button { --press-depth: 5px; position: relative; border: 0; border-radius: inherit; box-shadow: 0 var(--press-depth) 0 0 var(--depth-color, #0060C8); transition: transform 100ms linear, box-shadow 100ms linear; }
.depth-button:active { transform: translateY(var(--press-depth)); box-shadow: 0 0 0 0 var(--depth-color, #0060C8); }

HTML/JSX shape:
<button className="depth-button existing-classes" style={{ '--depth-color': '#0060C8' }}>
  Existing label
</button>`;

const transitionButtonPrompt = `Apply this two-panel button transition to the user's existing button.

Hard constraints:
- Do not change the existing button width, height, border radius, padding, typography, label meaning, click handler, accessibility attributes, disabled state, or loading state.
- Keep the component self-contained and do not introduce animation libraries.
- Keep my original classes/styles. Treat the CSS below as additive transition CSS.

Effect:
- The button has two full-size internal layers.
- Default layer is visible first.
- Incoming layer starts below the button.
- On hover/focus/active state, default layer moves up and out; incoming layer moves up into place.
- Use transform only. Do not animate layout properties.
- Duration: 500ms.
- Curve: cubic-bezier(0.23, 1, 0.32, 1).
- Add press feedback: scale(0.95).

Copy-ready core implementation:
CSS:
.transition-button { position: relative; overflow: hidden; border-radius: inherit; }
.transition-button:active { transform: scale(.95); }
.transition-button .layer { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transition: transform 500ms cubic-bezier(.23,1,.32,1); }
.transition-button .layer-a { transform: translateY(0); }
.transition-button .layer-b { transform: translateY(100%); background: #007AFF; }
.transition-button:hover .layer-a { transform: translateY(-100%); }
.transition-button:hover .layer-b { transform: translateY(0); }

HTML/JSX shape:
<button className="transition-button existing-classes">
  <span className="layer layer-a">Existing label</span>
  <span className="layer layer-b">Existing label</span>
</button>`;

const textTransitionButtonPrompt = `Apply this character-by-character text transition to the user's existing button.

Hard constraints:
- Do not change the existing button width, height, border radius, padding, background, typography, click handler, accessibility attributes, disabled state, or loading state.
- Preserve the original label meaning. You may duplicate the label internally for the animation.
- Do not introduce animation libraries.
- Keep my original classes/styles. Treat the CSS below as additive text animation CSS.

Effect:
- The visible text position must stay fixed in the center of the button.
- Split the label into characters.
- Render two identical character layers inside a fixed-size text slot.
- Default character layer starts visible.
- Second character layer starts above the slot.
- On hover/focus/active state, default characters move down and out one by one; second-layer characters move down into place one by one.
- Stagger duration starts at 200ms and increases by about 100ms per following character.
- Use transform-only motion.

Copy-ready core implementation:
JSX:
const chars = label.split('');
<span className="text-slot">
  <span className="text-layer text-out">{chars.map((c,i)=><span style={{transitionDuration: (200 + i * 100) + 'ms'}}>{c}</span>)}</span>
  <span className="text-layer text-in">{chars.map((c,i)=><span style={{transitionDuration: (200 + i * 100) + 'ms'}}>{c}</span>)}</span>
  <span className="text-measure" aria-hidden="true">{label}</span>
</span>

CSS:
.text-slot { position: relative; display: inline-flex; height: 1.5em; overflow: hidden; align-items: center; justify-content: center; }
.text-layer { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.text-layer span { display: inline-block; transition-property: transform; transition-timing-function: ease-out; }
.text-in span { transform: translateY(-1.2em); }
.button:hover .text-out span { transform: translateY(1.2em); }
.button:hover .text-in span { transform: translateY(0); }
.text-measure { visibility: hidden; }`;

const iconShiftButtonPrompt = `Apply this icon displacement interaction to the user's existing icon button.

Hard constraints:
- Do not change the existing button width, height, border radius, padding, typography, label, click handler, accessibility attributes, disabled state, or loading state.
- Preserve the original icon and label. Do not replace them unless there is no icon.
- Do not introduce animation libraries.
- Keep my original classes/styles. Treat the CSS below as additive icon motion CSS.

Effect:
- Default state: icon and text are a compact inline group with a small gap around 0.3em. The icon may keep its natural angled posture.
- On hover/focus/active state: icon moves to the visual center of the button; label moves fully out of the button.
- Icon also rotates slightly, scales to about 1.1, and has a subtle vertical float while active.
- Use percentage-based positions for the icon and label so the animation adapts to button width changes.
- Use transform-only motion.
- Around 300ms ease-in-out for icon and text transforms.
- Add press feedback: scale(0.95).

Copy-ready core implementation:
CSS:
.icon-shift-button { --icon-offset: 1.9em; --label-offset: 0.55em; position: relative; overflow: hidden; }
.icon-wrap { position: absolute; top: 50%; left: calc(50% - var(--icon-offset)); transform: translate(-50%, -50%); transition: left 300ms ease-in-out, transform 300ms ease-in-out; }
.icon-label { position: absolute; top: 50%; left: calc(50% + var(--label-offset)); transform: translate(-50%, -50%); transition: left 300ms ease-in-out, transform 300ms ease-in-out; }
.icon-glyph { transform: translateY(-0.075em) rotate(-35deg); transform-origin: center; transition: transform 300ms ease-in-out; }
.icon-shift-button:hover .icon-wrap { left: 50%; transform: translate(-50%, -50%); }
.icon-shift-button:hover .icon-glyph { transform: translateY(-0.075em) rotate(10deg) scale(1.1); }
.icon-shift-button:hover .icon-label { left: 150%; }
@keyframes icon-fly { from { transform: translateY(.1em); } to { transform: translateY(-.1em); } }`;

const pressFillButtonPrompt = `Apply this press-and-hold fill interaction to the user's existing button.

Hard constraints:
- Do not change the existing button width, height, border radius, padding, layout, typography, label, click handler, accessibility attributes, disabled state, or loading state.
- Preserve the default visual style as much as possible.
- Do not introduce animation libraries.
- Keep my original classes/styles. Treat the CSS below as additive press-fill CSS.

Effect:
- Add an internal fill layer behind the label.
- Fill starts at width 0 from the left edge.
- While the button is actively pressed/tapped, animate fill width to 100%.
- Release returns fill width to 0.
- Text color changes during active fill so it remains readable.
- Duration: 1000ms.
- Do not add scale press feedback for this effect.

Copy-ready core implementation:
CSS:
.press-fill { position: relative; overflow: hidden; }
.press-fill .fill-layer { position: absolute; inset-block: 0; left: 0; width: 0; border-radius: inherit; background: #212121; transition: width 1000ms; z-index: 0; }
.press-fill .label { position: relative; z-index: 1; }
.press-fill:active .fill-layer { width: 100%; }
.press-fill:active { color: #fff; }`;

const waitingButtonPrompt = `Apply this waiting/loading button interaction to the user's existing button.

Hard constraints:
- Do not change the existing button width, height, border radius, padding, layout, typography, default label, click handler, accessibility attributes, disabled state, or loading state.
- Preserve the original default label.
- Do not introduce animation libraries.
- Keep my original classes/styles. Treat the CSS below as additive loading-state CSS.

Effect:
- On tap/click, switch the button into a loading state.
- In loading state, show a small inline spinner before the label and change the visible label to Loading.
- Spinner is vertically centered with the text and rotates continuously.
- Prevent repeated taps while loading.
- Restore original state when async work completes. If no async callback exists, use a 5 second timeout as demo fallback.

Copy-ready core implementation:
JSX:
<button disabled={loading} aria-busy={loading} onClick={handleClick}>
  {loading && <span role="status" className="spinner"><span className="sr-only">Loading...</span></span>}
  {loading ? 'Loading' : originalLabel}
</button>

CSS:
.spinner { display: inline-block; width: 1em; height: 1em; margin-right: .5em; border: 2px solid currentColor; border-right-color: transparent; border-radius: 999px; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }`;

const borderGlowButtonPrompt = `Create this border-glow effect on my existing pill button.

Rules:
- Do not change my button layout, click logic, label, disabled state, or accessibility attributes.
- Do not install dependencies.
- Use the oversized rotating-gradient technique: a large conic-gradient rotates behind a clipped pill border, while an inner blocker covers the center.
- Keep the button body empty for this demo. In a real button, place content above the visual layers.

CSS:
@keyframes border-glow-spin {
  to { transform: rotate(1turn); }
}

.border-glow-button {
  position: relative;
  width: 240px;
  height: 58px;
  border: 0;
  padding: 0;
  border-radius: 999px;
  cursor: pointer;
  background: transparent;
  isolation: isolate;
  overflow: visible;
}

.border-glow-button__shadow,
.border-glow-button__border {
  position: absolute;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}

.border-glow-button__shadow {
  inset: -16px;
  z-index: 0;
  opacity: 0.105;
  filter: blur(16px);
}

.border-glow-button__border {
  inset: 0;
  z-index: 1;
}

.border-glow-button__shadow::before,
.border-glow-button__border::before {
  content: "";
  position: absolute;
  left: -50%;
  top: -180%;
  width: 200%;
  height: 500%;
  background: conic-gradient(
    #FFD60A,
    #FF9F0A,
    #FF375F,
    #BF5AF2,
    #0A84FF,
    #FFD60A
  );
  animation: border-glow-spin 3.75s linear infinite;
}

.border-glow-button__blocker,
.border-glow-button__inner {
  position: absolute;
  inset: 3px;
  border-radius: inherit;
  pointer-events: none;
}

.border-glow-button__blocker {
  z-index: 2;
  background: #EAEBEF;
}

.border-glow-button__inner {
  z-index: 3;
  border: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.1));
}

HTML/JSX:
<button className="border-glow-button" type="button" aria-label="Record voice">
  <span className="border-glow-button__shadow" aria-hidden="true" />
  <span className="border-glow-button__border" aria-hidden="true" />
  <span className="border-glow-button__blocker" aria-hidden="true" />
  <span className="border-glow-button__inner" aria-hidden="true" />
</button>`;

function CopyCodeTooltipButton({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const tooltipState = copied ? "is-copied" : "";
  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  return (
    <button
      type="button"
      aria-label="Copy code snippet"
      className="group relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-0 bg-transparent p-0 text-[rgba(0,0,0,0.88)] transition-colors duration-150 hover:bg-[rgba(0,0,0,0.06)] active:bg-[rgba(0,0,0,0.08)]"
      onClick={copyPrompt}
    >
      <Image
        src="/figma/button/copy-code-icon@3x.png"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <span
        className={`copy-tooltip pointer-events-none absolute bottom-10 left-1/2 z-10 whitespace-nowrap rounded-[10px] bg-[rgba(17,17,17,0.92)] px-3 py-2 text-[12px] font-medium leading-none text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] ${tooltipState}`}
      >
        {copied ? (
          <>
            <span className="text-[#34C759]">✓</span> Done
          </>
        ) : (
          "Copy code snippet"
        )}
      </span>
    </button>
  );
}

function UiverseButton({
  label,
  animated = true,
  includeStyle = false,
}: {
  label: string;
  animated?: boolean;
  includeStyle?: boolean;
}) {
  return (
    <>
      {includeStyle ? (
        <style>{`
        .uiverse {
          width: 50%;
          --duration: 7s;
          --easing: linear;
          --c-color: #fff;
          -webkit-tap-highlight-color: transparent;
          -webkit-appearance: none;
          outline: none;
          position: relative;
          cursor: pointer;
          border: none;
          display: table;
          border-radius: 24px;
          padding: 0;
          margin: 0;
          text-align: center;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.02em;
          line-height: 1.5;
          color: var(--c-color);
          background: radial-gradient(
            circle,
            var(--c-radial-inner),
            var(--c-radial-outer) 80%
          );
          box-shadow: none;
          transition: transform 120ms cubic-bezier(0.2, 0.8, 0.2, 1);
          transform-origin: center;
          transform: translateZ(0);
          will-change: transform;
          backface-visibility: hidden;
        }

        .uiverse {
          --c-color-1: rgba(78, 255, 233, 0.68);
          --c-color-2: #0A5CFF;
          --c-color-3: #18C8FF;
          --c-color-4: rgba(0, 198, 255, 0.72);
          --c-shadow: rgba(0, 122, 255, 0.34);
          --c-shadow-inset-top: rgba(142, 202, 255, 0.92);
          --c-shadow-inset-bottom: rgba(0, 78, 210, 0.5);
          --c-radial-inner: #3395FF;
          --c-radial-outer: #007AFF;
        }

        .copy-tooltip {
          visibility: hidden;
          transform: translate(-50%, -8px);
          transition: none;
        }

        .group:hover .copy-tooltip,
        .copy-tooltip.is-copied {
          visibility: visible;
          transform: translate(-50%, 0);
          transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .uiverse.is-static .circle,
        .uiverse.is-static .sparkle {
          animation-play-state: paused;
        }

        .uiverse:active {
          transform: scale(0.96);
        }

        .uiverse:before {
          content: "";
          position: absolute;
          z-index: 3;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          box-shadow:
            inset 0 3px 12px var(--c-shadow-inset-top),
            inset 0 -3px 4px var(--c-shadow-inset-bottom);
        }

        .uiverse .wrapper {
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          overflow: hidden;
          border-radius: 24px;
          width: 100%;
          padding: 12px 0;
          isolation: isolate;
        }

        .uiverse .wrapper span {
          display: inline-block;
          position: relative;
          z-index: 2;
        }

        .uiverse .wrapper .circle {
          position: absolute;
          left: var(--x, 0);
          top: var(--y, 0);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          filter: blur(var(--blur, 8px));
          background: var(--background, transparent);
          transform: translate(0, 0) translateZ(0);
          animation: var(--animation, none) var(--duration) var(--easing) infinite;
          transition: filter 180ms ease;
        }

        .uiverse .wrapper .sparkle {
          position: absolute;
          left: var(--x);
          top: var(--y);
          width: var(--size, 3px);
          height: var(--size, 3px);
          z-index: 1;
          opacity: var(--opacity, .55);
          transform: translateZ(0);
          animation:
            var(--sparkle-move) var(--sparkle-duration) ease-in-out infinite,
            sparkle-twinkle 3300ms ease-in-out infinite;
          transition: opacity 160ms ease;
        }

        .uiverse .wrapper .sparkle::before,
        .uiverse .wrapper .sparkle::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 1.5px;
          border-radius: 999px;
          background: rgba(255, 255, 255, .95);
          transform: translate(-50%, -50%);
          box-shadow: 0 0 5px rgba(255,255,255,.85);
        }

        .uiverse .wrapper .sparkle::after {
          transform: translate(-50%, -50%) rotate(90deg);
        }

        .uiverse .wrapper .circle.circle-1,
        .uiverse .wrapper .circle.circle-9,
        .uiverse .wrapper .circle.circle-10 {
          --background: var(--c-color-4);
        }

        .uiverse .wrapper .circle.circle-3,
        .uiverse .wrapper .circle.circle-4 {
          --background: var(--c-color-2);
          --blur: 14px;
        }

        .uiverse .wrapper .circle.circle-5,
        .uiverse .wrapper .circle.circle-6 {
          --background: var(--c-color-3);
          --blur: 16px;
        }

        .uiverse .wrapper .circle.circle-2,
        .uiverse .wrapper .circle.circle-7,
        .uiverse .wrapper .circle.circle-8,
        .uiverse .wrapper .circle.circle-11,
        .uiverse .wrapper .circle.circle-12 {
          --background: var(--c-color-1);
          --blur: 12px;
        }

        .uiverse .wrapper .sparkle.sparkle-1 { --x: 10%; --y: 12px; --size: 3px; --opacity: .62; --sparkle-duration: 15200ms; --sparkle-move: sparkle-drift-1; }
        .uiverse .wrapper .sparkle.sparkle-2 { --x: 24%; --y: 28px; --size: 2.5px; --opacity: .48; --sparkle-duration: 18800ms; --sparkle-move: sparkle-drift-2; }
        .uiverse .wrapper .sparkle.sparkle-3 { --x: 39%; --y: 10px; --size: 3.5px; --opacity: .58; --sparkle-duration: 16400ms; --sparkle-move: sparkle-drift-3; }
        .uiverse .wrapper .sparkle.sparkle-4 { --x: 56%; --y: 26px; --size: 2.25px; --opacity: .5; --sparkle-duration: 20400ms; --sparkle-move: sparkle-drift-4; }
        .uiverse .wrapper .sparkle.sparkle-5 { --x: 70%; --y: 12px; --size: 3px; --opacity: .52; --sparkle-duration: 17600ms; --sparkle-move: sparkle-drift-5; }
        .uiverse .wrapper .sparkle.sparkle-6 { --x: 83%; --y: 22px; --size: 2px; --opacity: .42; --sparkle-duration: 22200ms; --sparkle-move: sparkle-drift-6; }
        .uiverse .wrapper .sparkle.sparkle-7 { --x: 92%; --y: 30px; --size: 2.5px; --opacity: .46; --sparkle-duration: 19400ms; --sparkle-move: sparkle-drift-7; }
        .uiverse .wrapper .sparkle.sparkle-8 { --x: 4%; --y: 22px; --size: 2px; --opacity: .42; --sparkle-duration: 23600ms; --sparkle-move: sparkle-drift-8; }

        .uiverse .wrapper .circle.circle-1 {
          --x: 0%;
          --y: -40px;
          --animation: circle-1;
        }

        .uiverse .wrapper .circle.circle-2 {
          --x: 82%;
          --y: 8px;
          --animation: circle-2;
        }

        .uiverse .wrapper .circle.circle-3 {
          --x: 6%;
          --y: -12px;
          --animation: circle-3;
        }

        .uiverse .wrapper .circle.circle-4 {
          --x: 74%;
          --y: -12px;
          --animation: circle-4;
        }

        .uiverse .wrapper .circle.circle-5 {
          --x: 18%;
          --y: -4px;
          --animation: circle-5;
        }

        .uiverse .wrapper .circle.circle-6 {
          --x: 52%;
          --y: 16px;
          --animation: circle-6;
        }

        .uiverse .wrapper .circle.circle-7 {
          --x: 10%;
          --y: 28px;
          --animation: circle-7;
        }

        .uiverse .wrapper .circle.circle-8 {
          --x: 30%;
          --y: -4px;
          --animation: circle-8;
        }

        .uiverse .wrapper .circle.circle-9 {
          --x: 40%;
          --y: -12px;
          --animation: circle-9;
        }

        .uiverse .wrapper .circle.circle-10 {
          --x: 66%;
          --y: 16px;
          --animation: circle-10;
        }

        .uiverse .wrapper .circle.circle-11 {
          --x: 24%;
          --y: 4px;
          --animation: circle-11;
        }

        .uiverse .wrapper .circle.circle-12 {
          --blur: 14px;
          --x: 58%;
          --y: 4px;
          --animation: circle-12;
        }

        @keyframes circle-1 {
          33% { transform: translate(0, 56px) translateZ(0); }
          66% { transform: translate(12px, 104px) translateZ(0); }
        }

        @keyframes circle-2 {
          33% { transform: translate(-16px, -18px) translateZ(0); }
          66% { transform: translate(-24px, -56px) translateZ(0); }
        }

        @keyframes circle-3 {
          33% { transform: translate(32px, 24px) translateZ(0); }
          66% { transform: translate(18px, 16px) translateZ(0); }
        }

        @keyframes circle-4 {
          33% { transform: translate(-12px, 0) translateZ(0); }
          66% { transform: translate(26px, 4px) translateZ(0); }
        }

        @keyframes circle-5 {
          33% { transform: translate(46px, 32px) translateZ(0); }
          66% { transform: translate(12px, -28px) translateZ(0); }
        }

        @keyframes circle-6 {
          33% { transform: translate(-22px, -32px) translateZ(0); }
          66% { transform: translate(26px, -72px) translateZ(0); }
        }

        @keyframes circle-7 {
          33% { transform: translate(6px, 0) translateZ(0); }
          66% { transform: translate(14px, -88px) translateZ(0); }
        }

        @keyframes circle-8 {
          33% { transform: translate(16px, 0) translateZ(0); }
          66% { transform: translate(34px, -16px) translateZ(0); }
        }

        @keyframes circle-9 {
          33% { transform: translate(-20px, 0) translateZ(0); }
          66% { transform: translate(34px, 4px) translateZ(0); }
        }

        @keyframes circle-10 {
          33% { transform: translate(8px, 4px) translateZ(0); }
          66% { transform: translate(34px, 12px) translateZ(0); }
        }

        @keyframes circle-11 {
          33% { transform: translate(-18px, 0) translateZ(0); }
          66% { transform: translate(28px, 16px) translateZ(0); }
        }

        @keyframes circle-12 {
          33% { transform: translate(8px, -4px) translateZ(0); }
          66% { transform: translate(12px, -36px) translateZ(0); }
        }

        @keyframes sparkle-twinkle {
          0%, 100% { scale: .75; opacity: .38; }
          45% { scale: 1.18; opacity: 1; }
          70% { scale: .92; opacity: .58; }
        }

        @keyframes sparkle-drift-1 {
          50% { transform: translate(28px, -6px) rotate(24deg); }
        }

        @keyframes sparkle-drift-2 {
          50% { transform: translate(-24px, 7px) rotate(-18deg); }
        }

        @keyframes sparkle-drift-3 {
          50% { transform: translate(24px, 10px) rotate(32deg); }
        }

        @keyframes sparkle-drift-4 {
          50% { transform: translate(-28px, -8px) rotate(-26deg); }
        }

        @keyframes sparkle-drift-5 {
          50% { transform: translate(22px, 12px) rotate(20deg); }
        }

        @keyframes sparkle-drift-6 {
          50% { transform: translate(-26px, 6px) rotate(-34deg); }
        }

        @keyframes sparkle-drift-7 {
          50% { transform: translate(-22px, -10px) rotate(28deg); }
        }

        @keyframes sparkle-drift-8 {
          50% { transform: translate(26px, 8px) rotate(-20deg); }
        }

        @keyframes icon-fly {
          from { transform: translateY(0.1em); }
          to { transform: translateY(-0.1em); }
        }
      `}</style>
      ) : null}
      <button className={`uiverse ${animated ? "" : "is-static"}`} type="button">
        <div className="wrapper">
          <span>{label}</span>
          {circleClasses.map((circleClass) => (
            <div key={circleClass} className={`circle ${circleClass}`} />
          ))}
          {sparkleClasses.map((sparkleClass) => (
            <div key={sparkleClass} className={`sparkle ${sparkleClass}`} />
          ))}
        </div>
      </button>
    </>
  );
}

function PressDepthButton() {
  return (
    <button
      type="button"
      className="w-1/2 rounded-[24px] border-0 bg-[#007AFF] px-4 py-3 text-center text-[16px] font-bold leading-[1.5] tracking-[0.02em] text-white shadow-[0_var(--press-depth)_0_0_#0060C8] outline-none transition-all duration-100 ease-linear active:translate-y-[var(--press-depth)] active:shadow-[0_0_0_0_#0060C8]"
      style={
        {
          "--press-depth": "5px",
          textShadow: "none",
        } as React.CSSProperties
      }
    >
      Button
    </button>
  );
}

function TransitionButton() {
  return (
    <button
      type="button"
      className="group relative h-[48px] w-1/2 overflow-hidden rounded-[24px] border-0 bg-[#1F2937] p-0 text-[16px] font-bold leading-[1.5] tracking-[0.02em] text-white outline-none transition-transform duration-150 active:scale-95"
    >
      <span className="absolute inset-0 flex items-center justify-center bg-[#1F2937] transition-transform duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-full">
        Button
      </span>
      <span className="absolute inset-0 flex translate-y-full items-center justify-center bg-[#007AFF] transition-transform duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-y-0">
        Button
      </span>
    </button>
  );
}

function TextTransitionButton() {
  const defaultLetters = "Button".split("");
  const nextLetters = "Start".split("");

  return (
    <button
      type="button"
      className="group relative h-[48px] w-1/2 overflow-hidden rounded-full border-0 bg-[#007AFF] px-4 text-center text-[16px] font-bold leading-[1.5] tracking-[0.02em] text-white outline-none transition-transform duration-150 active:scale-95"
    >
      <span className="relative flex h-[1.5em] min-w-max items-center justify-center overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center">
          {defaultLetters.map((letter, index) => (
            <span
              key={`out-${letter}-${index}`}
              className="inline-block translate-y-0 transition-transform ease-out group-hover:translate-y-[1.2em]"
              style={{ transitionDuration: `${200 + index * 100}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          {nextLetters.map((letter, index) => (
            <span
              key={`in-${letter}-${index}`}
              className="inline-block -translate-y-[1.2em] transition-transform ease-out group-hover:translate-y-0"
              style={{ transitionDuration: `${200 + index * 100}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
        <span className="invisible flex" aria-hidden="true">
          {defaultLetters.map((letter, index) => (
            <span key={`measure-${letter}-${index}`}>{letter}</span>
          ))}
        </span>
      </span>
    </button>
  );
}

function SendIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.6 20.4L21 12L3.6 3.6L6.4 10.8L13.8 12L6.4 13.2L3.6 20.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconShiftButton() {
  return (
    <>
      <style>{`
        .icon-shift-button {
          --icon-offset: 1.9em;
          --label-offset: 0.55em;
        }

        .icon-shift-button .icon-wrap {
          left: calc(50% - var(--icon-offset));
          transform: translate(-50%, -50%);
          transition:
            left 300ms ease-in-out,
            transform 300ms ease-in-out;
        }

        .icon-shift-button .icon-label {
          left: calc(50% + var(--label-offset));
          transform: translate(-50%, -50%);
          display: inline-flex;
          align-items: center;
          height: 20px;
          line-height: 1;
          transition:
            left 300ms ease-in-out,
            transform 300ms ease-in-out;
        }

        .icon-shift-button .icon-wrap,
        .icon-shift-button .icon-float,
        .icon-shift-button .icon-glyph {
          align-items: center;
          justify-content: center;
          height: 20px;
          width: 20px;
        }

        .icon-shift-button .icon-glyph {
          transform: translateY(-0.075em) rotate(-35deg) scale(1);
          transform-origin: center center;
          transition: transform 300ms ease-in-out;
        }

        .icon-shift-button:hover .icon-wrap {
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .icon-shift-button:hover .icon-glyph {
          transform: translateY(-0.075em) rotate(10deg) scale(1.1);
        }

        .icon-shift-button:hover .icon-float {
          animation: icon-fly 600ms ease-in-out infinite alternate;
        }

        .icon-shift-button:hover .icon-label {
          left: 150%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      <button
        type="button"
        className="icon-shift-button group relative h-[48px] w-1/2 overflow-hidden rounded-[24px] border-0 bg-[#007AFF] px-4 text-[16px] font-bold leading-none tracking-[0.02em] text-white outline-none transition-transform duration-150 active:scale-95"
      >
        <span className="icon-wrap absolute top-1/2 flex origin-center">
          <span className="icon-float flex">
            <span className="icon-glyph flex">
              <SendIcon />
            </span>
          </span>
        </span>
        <span className="icon-label absolute top-1/2 whitespace-nowrap">
          Button
        </span>
      </button>
    </>
  );
}

function PressFillButton() {
  return (
    <button
      type="button"
      className="group relative h-[48px] w-1/2 overflow-hidden rounded-[24px] border-0 bg-[#E8E8E8] px-4 text-center text-[16px] font-bold leading-[1.5] tracking-[0.02em] text-[#212121] outline-none transition-colors duration-[1000ms] active:text-white"
    >
      <span className="absolute inset-y-0 left-0 z-0 w-0 rounded-[24px] bg-[#212121] transition-[width] duration-[1000ms] group-active:w-full" />
      <span className="relative z-10">Button</span>
    </button>
  );
}

function WaitingButton() {
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => setLoading(false), 5000);
  };

  return (
    <button
      type="button"
      aria-busy={loading}
      disabled={loading}
      onClick={startLoading}
      className="inline-flex h-[48px] w-1/2 items-center justify-center rounded-[24px] border-0 bg-[#007AFF] px-4 text-center text-[16px] font-bold leading-[1.5] tracking-[0.02em] text-white outline-none transition-transform duration-150 active:scale-95 disabled:active:scale-100"
    >
      {loading ? (
        <span
          role="status"
          className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
        >
          <span className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </span>
      ) : null}
      {loading ? "Loading" : "Button"}
    </button>
  );
}

function BorderGlowButton() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[24px] bg-[#EAEBEF]">
      <style>{`
        @keyframes border-glow-spin {
          to { transform: rotate(1turn); }
        }

        .border-glow-button {
          position: relative;
          width: 240px;
          height: 58px;
          --glow-inset: 3px;
          --glow-stroke: 3px;
          --glow-shadow-spread: 16px;
          border: 0;
          padding: 0;
          border-radius: 999px;
          cursor: pointer;
          background: transparent;
          isolation: isolate;
          overflow: visible;
        }

        .border-glow-button__shadow,
        .border-glow-button__border {
          position: absolute;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
        }

        .border-glow-button__shadow {
          inset: -16px;
          z-index: 0;
          opacity: 0.105;
          filter: blur(16px);
        }

        .border-glow-button__border {
          inset: 0;
          z-index: 1;
        }

        .border-glow-button__shadow::before,
        .border-glow-button__border::before {
          content: "";
          position: absolute;
          left: -50%;
          top: -180%;
          width: 200%;
          height: 500%;
          background: conic-gradient(
            #FFD60A,
            #FF9F0A,
            #FF375F,
            #BF5AF2,
            #0A84FF,
            #FFD60A
          );
          animation: border-glow-spin 3.75s linear infinite;
        }

        .border-glow-button__blocker,
        .border-glow-button__inner {
          position: absolute;
          inset: 3px;
          border-radius: inherit;
          pointer-events: none;
        }

        .border-glow-button__blocker {
          z-index: 2;
          background: #EAEBEF;
        }

        .border-glow-button__inner {
          z-index: 3;
          border: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.1));
        }
      `}</style>
      <button className="border-glow-button" type="button" aria-label="Record voice">
        <span className="border-glow-button__shadow" aria-hidden="true" />
        <span className="border-glow-button__border" aria-hidden="true" />
        <span className="border-glow-button__blocker" aria-hidden="true" />
        <span className="border-glow-button__inner" aria-hidden="true" />
      </button>
    </div>
  );
}

function DemoCard({
  title,
  prompt,
  children,
}: {
  title: string;
  prompt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex aspect-square flex-col gap-4 rounded-[48px] border-2 border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff] p-[26px] shadow-[0_100px_100px_rgba(13,42,83,0.02)]">
      <div className="flex w-full items-center justify-between">
        <div className="text-[16px] font-bold leading-none tracking-[-0.6px] text-[rgba(0,0,0,0.88)]">
          {title}
        </div>
        <CopyCodeTooltipButton prompt={prompt} />
      </div>
      <div className="min-h-0 w-full flex-1">
        <div className="flex h-full w-full items-center justify-center rounded-[24px] bg-transparent">
          {children}
        </div>
      </div>
    </div>
  );
}

export function UiverseButtonDemo() {
  return (
    <div className="grid w-full grid-cols-3 gap-6 pb-24">
      <DemoCard title="流光" prompt={uiverseButtonPrompt}>
        <UiverseButton label="Button" includeStyle />
      </DemoCard>
      <DemoCard title="按压" prompt={pressButtonPrompt}>
        <PressDepthButton />
      </DemoCard>
      <DemoCard title="转场" prompt={transitionButtonPrompt}>
        <TransitionButton />
      </DemoCard>
      <DemoCard title="文字转场" prompt={textTransitionButtonPrompt}>
        <TextTransitionButton />
      </DemoCard>
      <DemoCard title="icon位移" prompt={iconShiftButtonPrompt}>
        <IconShiftButton />
      </DemoCard>
      <DemoCard title="按压填充" prompt={pressFillButtonPrompt}>
        <PressFillButton />
      </DemoCard>
      <DemoCard title="等待" prompt={waitingButtonPrompt}>
        <WaitingButton />
      </DemoCard>
      <DemoCard title="Border Glow" prompt={borderGlowButtonPrompt}>
        <BorderGlowButton />
      </DemoCard>
    </div>
  );
}
