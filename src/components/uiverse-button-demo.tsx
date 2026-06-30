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

const uiverseButtonPrompt = `Apply this button motion style to my existing button without changing its product intent or surrounding layout.

Motion/style requirements:
- Keep my button's existing width, height, border radius, padding, layout, typography, text, click handler, accessibility labels, and disabled/loading logic unchanged.
- Do not change the button size or corner radius unless my original button has no explicit values.
- Apply a blue animated light-field visual style based on #007AFF to the existing button surface.
- Add an inner clipped wrapper for the animated light field.
- Inside the wrapper, add multiple blurred color blobs that move continuously with CSS keyframes.
- Use only blue/cyan tones:
  - main outer color: #007AFF
  - inner highlight: #3395FF
  - electric blue: #0A5CFF
  - cyan glow: #18C8FF
  - teal glow: rgba(78, 255, 233, 0.68)
  - bright cyan: rgba(0, 198, 255, 0.72)
- Add subtle white sparkle particles distributed across the full button width. They should drift slowly and twinkle independently from the blurred blobs.
- Add an inset highlight/shadow layer:
  inset 0 3px 12px rgba(142, 202, 255, 0.92),
  inset 0 -3px 4px rgba(0, 78, 210, 0.5)
- Do not use hover-only motion. This is for mobile. Keep the animation running by default.
- On press/tap, add a quick scale press feedback: scale(0.96), then return to normal.
- Keep the implementation self-contained. Do not introduce animation libraries.

Implementation shape:
- Wrap the button label in a relative layer above the animated blobs and sparkles.
- Clip the animated layers inside the rounded button.
- Avoid outer drop shadow on the button itself.`;

const pressButtonPrompt = `Apply this pressed button interaction to my existing button without changing its product intent or surrounding layout.

Motion/style requirements:
- Keep my button's existing width, height, border radius, padding, layout, typography, text, click handler, accessibility labels, and disabled/loading logic unchanged.
- Preserve the button's original text and state logic.
- Add a tactile mobile press effect using a two-layer button structure:
  - a darker base layer behind the button
  - a top button layer in the main color
- The top layer should sit slightly above the base layer by default, leaving a small darker edge visible at the bottom.
- On press/tap, move the top layer downward by the base offset so the button looks physically pressed.
- Use a quick transition around 120ms with a soft ease-out curve.
- Do not use hover-only motion. This is for mobile.
- Do not introduce animation libraries.

Implementation shape:
- Use a wrapper as the base/depth layer.
- Put the real clickable button layer inside it.
- Keep the original size and corner radius unless the original button has no explicit values.`;

const transitionButtonPrompt = `Apply this transition button interaction to my existing button without changing its product intent or surrounding layout.

Motion/style requirements:
- Keep my button's existing width, height, border radius, padding, layout, typography, text, click handler, accessibility labels, and disabled/loading logic unchanged.
- Preserve the button's original text and state logic.
- Create a two-layer text transition inside the button:
  - the default layer is visible first
  - a second layer slides in from the bottom
  - the default layer slides upward and out
- Use transform-based transitions only; do not animate layout properties.
- Use a soft cubic-bezier curve: cubic-bezier(0.23, 1, 0.32, 1).
- Duration should be around 500ms.
- On press/tap, add a quick scale feedback around scale(0.95).
- Keep the implementation self-contained. Do not introduce animation libraries.

Implementation shape:
- The button should be position: relative and overflow: hidden.
- Use two absolutely positioned layers that each fill the button.
- Move the incoming layer from translateY(100%) to translateY(0).
- Move the outgoing layer from translateY(0) to translateY(-100%).`;

const textTransitionButtonPrompt = `Apply this text transition interaction to my existing button without changing its product intent or surrounding layout.

Motion/style requirements:
- Keep my button's existing width, height, border radius, padding, layout, typography, text, click handler, accessibility labels, and disabled/loading logic unchanged.
- Preserve the button's original text and state logic.
- Split the button text into individual characters.
- Render two identical text layers:
  - the default text layer starts visible
  - the second text layer starts above the visible area
- On hover/focus/active state, move the default characters downward and out one by one.
- At the same time, move the second text characters down into place one by one.
- Use a staggered transition per character. Start around 200ms and increase each following character by about 100ms.
- Use transform-only motion; do not animate layout properties.
- Keep the implementation self-contained. Do not introduce animation libraries.

Implementation shape:
- The button should be position: relative and overflow: hidden.
- Each text layer should be flex and clipped.
- Each character should be its own inline element so the stagger can be applied with nth-child or inline transitionDelay.`;

const iconShiftButtonPrompt = `Apply this icon displacement interaction to my existing button without changing its product intent or surrounding layout.

Motion/style requirements:
- Keep my button's existing width, height, border radius, padding, layout, typography, text, click handler, accessibility labels, and disabled/loading logic unchanged.
- Preserve the button's original text, icon, and state logic.
- If the button has an icon, move the icon to the right on hover/focus/active state.
- The icon should keep an angled paper-plane posture by default.
- On hover/focus/active state, move the icon to the center of the button using percentage-based positioning, then rotate it again and scale it up slightly.
- The text should translate to the right and visually move out of the way.
- In the default state, keep the icon and label close together like an inline flex group, with only a small gap around 0.3em.
- On hover/focus/active state, move the icon to the visual center of the button and move the text out of the way.
- Add a small vertical floating motion to the icon wrapper while the active state is held.
- Use transform-only motion; do not animate layout properties.
- Use around 300ms ease-in-out for the icon and text transforms.
- On press/tap, add a quick scale feedback around scale(0.95).
- Keep the implementation self-contained. Do not introduce animation libraries.

Implementation shape:
- Wrap the icon in a small inline container.
- Animate the icon wrapper with a subtle alternating vertical keyframe.
- Animate the icon itself with translateX + rotate + scale.
- Animate the label with translateX.`;

const pressFillButtonPrompt = `Apply this press-fill interaction to my existing button without changing its product intent or surrounding layout.

Motion/style requirements:
- Keep my button's existing width, height, border radius, padding, layout, typography, text, click handler, accessibility labels, and disabled/loading logic unchanged.
- Preserve the button's original text and state logic.
- Add an inner fill layer that starts at width 0 from the left edge.
- On press/tap active state, animate the fill layer to width 100%.
- Change the text color during the fill state so it remains readable.
- Use a transition around 1000ms.
- Use transform or width animation only on the internal fill layer; do not animate surrounding layout.
- On press/tap, add a subtle scale feedback around scale(0.97).
- Keep the implementation self-contained. Do not introduce animation libraries.

Implementation shape:
- The button should be position: relative and overflow: hidden.
- The fill layer should be absolutely positioned behind the label.
- The label should stay above the fill layer with a higher z-index.`;

const waitingButtonPrompt = `Apply this waiting/loading button interaction to my existing button without changing its product intent or surrounding layout.

Motion/style requirements:
- Keep my button's existing width, height, border radius, padding, layout, typography, text, click handler, accessibility labels, and disabled/loading logic unchanged.
- Preserve the button's original default label.
- On tap/click, switch the button into a loading state.
- In loading state, show a small spinner before the label and change the label to Loading.
- Keep the spinner inline with the text and vertically centered.
- The spinner should rotate continuously with a linear animation.
- Prevent repeated taps while loading.
- After the async work completes, restore the original label and normal state.
- If no async callback exists, use a 5 second timeout as a demo fallback.
- Keep the implementation self-contained. Do not introduce animation libraries.

Implementation shape:
- Store a loading boolean in component state.
- Render the spinner only when loading is true.
- Set disabled or aria-busy while loading.
- Use accessible hidden text inside the spinner: Loading...`;

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
      className="w-1/2 rounded-[24px] border-0 bg-[#007AFF] px-4 py-3 text-center text-[16px] font-bold leading-[1.5] tracking-[0.02em] text-white shadow-[0_5px_0_0_#0060C8] outline-none transition-all duration-100 ease-linear active:translate-y-[5px] active:shadow-[0_0_0_0_#0060C8]"
      style={{ textShadow: "none" }}
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
        .icon-shift-button .icon-wrap {
          left: calc(50% - 34px);
          transform: translate(-50%, -50%);
          transition:
            left 300ms ease-in-out,
            transform 300ms ease-in-out;
        }

        .icon-shift-button .icon-label {
          left: calc(50% + 10px);
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
          transform: translateY(-1.5px) rotate(-35deg) scale(1);
          transform-origin: center center;
          transition: transform 300ms ease-in-out;
        }

        .icon-shift-button:hover .icon-wrap {
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .icon-shift-button:hover .icon-glyph {
          transform: translateY(-1.5px) rotate(10deg) scale(1.1);
        }

        .icon-shift-button:hover .icon-float {
          animation: icon-fly 600ms ease-in-out infinite alternate;
        }

        .icon-shift-button:hover .icon-label {
          left: 125%;
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

export function UiverseButtonDemo() {
  return (
    <div className="docs-sidebar-scrollbar h-full w-full overflow-y-auto">
      <div className="grid w-full grid-cols-3 gap-6 pb-24">
      <div className="flex aspect-square flex-col justify-between rounded-[48px] border-2 border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff] p-6 shadow-[0_24px_60px_rgba(13,42,83,0.06)]">
        <div className="flex w-full items-center justify-between">
          <div className="text-[16px] font-bold leading-none tracking-[-0.6px] text-[rgba(0,0,0,0.88)]">
            流光
          </div>
          <CopyCodeTooltipButton prompt={uiverseButtonPrompt} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <UiverseButton label="Button" includeStyle />
        </div>
        <div className="h-8" aria-hidden="true" />
      </div>
      <div className="flex aspect-square flex-col justify-between rounded-[48px] border-2 border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff] p-6 shadow-[0_24px_60px_rgba(13,42,83,0.06)]">
        <div className="flex w-full items-center justify-between">
          <div className="text-[16px] font-bold leading-none tracking-[-0.6px] text-[rgba(0,0,0,0.88)]">
            按压
          </div>
          <CopyCodeTooltipButton prompt={pressButtonPrompt} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <PressDepthButton />
        </div>
        <div className="h-8" aria-hidden="true" />
      </div>
      <div className="flex aspect-square flex-col justify-between rounded-[48px] border-2 border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff] p-6 shadow-[0_24px_60px_rgba(13,42,83,0.06)]">
        <div className="flex w-full items-center justify-between">
          <div className="text-[16px] font-bold leading-none tracking-[-0.6px] text-[rgba(0,0,0,0.88)]">
            转场
          </div>
          <CopyCodeTooltipButton prompt={transitionButtonPrompt} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <TransitionButton />
        </div>
        <div className="h-8" aria-hidden="true" />
      </div>
      <div className="flex aspect-square flex-col justify-between rounded-[48px] border-2 border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff] p-6 shadow-[0_24px_60px_rgba(13,42,83,0.06)]">
        <div className="flex w-full items-center justify-between">
          <div className="text-[16px] font-bold leading-none tracking-[-0.6px] text-[rgba(0,0,0,0.88)]">
            文字转场
          </div>
          <CopyCodeTooltipButton prompt={textTransitionButtonPrompt} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <TextTransitionButton />
        </div>
        <div className="h-8" aria-hidden="true" />
      </div>
      <div className="flex aspect-square flex-col justify-between rounded-[48px] border-2 border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff] p-6 shadow-[0_24px_60px_rgba(13,42,83,0.06)]">
        <div className="flex w-full items-center justify-between">
          <div className="text-[16px] font-bold leading-none tracking-[-0.6px] text-[rgba(0,0,0,0.88)]">
            icon位移
          </div>
          <CopyCodeTooltipButton prompt={iconShiftButtonPrompt} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <IconShiftButton />
        </div>
        <div className="h-8" aria-hidden="true" />
      </div>
      <div className="flex aspect-square flex-col justify-between rounded-[48px] border-2 border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff] p-6 shadow-[0_24px_60px_rgba(13,42,83,0.06)]">
        <div className="flex w-full items-center justify-between">
          <div className="text-[16px] font-bold leading-none tracking-[-0.6px] text-[rgba(0,0,0,0.88)]">
            按压填充
          </div>
          <CopyCodeTooltipButton prompt={pressFillButtonPrompt} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <PressFillButton />
        </div>
        <div className="h-8" aria-hidden="true" />
      </div>
      <div className="flex aspect-square flex-col justify-between rounded-[48px] border-2 border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff] p-6 shadow-[0_24px_60px_rgba(13,42,83,0.06)]">
        <div className="flex w-full items-center justify-between">
          <div className="text-[16px] font-bold leading-none tracking-[-0.6px] text-[rgba(0,0,0,0.88)]">
            等待
          </div>
          <CopyCodeTooltipButton prompt={waitingButtonPrompt} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <WaitingButton />
        </div>
        <div className="h-8" aria-hidden="true" />
      </div>
      </div>
    </div>
  );
}
