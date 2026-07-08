"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  LoadingGrowPreview,
  LoadingPercentRingPreview,
  LoadingPreview,
  LoadingProgressPreview,
  SkeletonPreview,
  ShinyTextDarkPreview,
  ShinyTextPreview,
} from "@/components/preview/loading-preview";

type LoadingDemo = {
  title: string;
  prompt: string;
  Preview: React.ComponentType;
  dark?: boolean;
};

const loadingDemos: LoadingDemo[] = [
  {
    title: "Skeleton",
    prompt: `Create this exact light-mode Skeleton loading animation in my existing UI.

Hard constraints:
- Do not change my existing layout, container size, spacing, radius, data flow, or loading logic.
- Do not install dependencies or animation libraries.
- Only add the skeleton visual layer and its CSS animation.
- If my project already has a placeholder element, apply these styles to that element instead of replacing the component.

Visual spec:
- The preview surface behind the skeleton is #E6E7E9.
- The skeleton itself fills the whole available box.
- The skeleton card radius is 24px.
- The animation follows the Ant Design active Skeleton pattern: animate background-position across a 90deg gradient.
- Use only pure black with alpha for the light-mode gradient.
- Duration: 1.4s.
- Timing: ease.

Copy-ready implementation:
CSS:
@keyframes skeleton-shimmer {
  from { background-position: 100% 50%; }
  to { background-position: 0 50%; }
}

.skeleton-surface {
  width: 100%;
  height: 100%;
  background: #E6E7E9;
  border-radius: 24px;
}

.skeleton-card {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0) 25%,
    rgba(0,0,0,.08) 37%,
    rgba(0,0,0,0) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
}

HTML/JSX:
<div className="skeleton-surface">
  <div className="skeleton-card" />
</div>`,
    Preview: SkeletonPreview,
  },
  {
    title: "Activity Indicator",
    prompt: `Apply a compact circular activity indicator to my existing loading state.

Hard constraints:
- Do not change the surrounding layout, loading container size, spacing, or business logic.
- Preserve existing loading text if present.
- Do not introduce animation libraries.

Effect:
- Use a 40px circular SVG spinner with a neutral track and darker active segment.
- The darker active segment must have rounded ends.
- Rotate continuously with a linear infinite animation.
- Duration: around 1s per rotation.

Copy-ready core implementation:
CSS:
.spinner { width: 40px; height: 40px; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

JSX:
<svg role="status" className="spinner" viewBox="0 0 40 40" aria-label="Loading">
  <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(23,23,23,0.10)" strokeWidth="5" />
  <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(23,23,23,0.82)" strokeWidth="5" strokeLinecap="round" strokeDasharray="30 100" />
</svg>`,
    Preview: LoadingPreview,
  },
  {
    title: "Grow Ring",
    prompt: `Apply a grow-ring progress loading effect to my existing loading state.

Hard constraints:
- Do not change the surrounding layout, container size, spacing, text, or business logic.
- Do not introduce animation libraries.

Effect:
- Render a 40px circular base track.
- Render a foreground ring that grows from 0 to full progress.
- Use a rounded stroke cap.
- Track and progress stroke width: 5px.
- Duration: around 3s.
- Use a smooth forward curve: cubic-bezier(0.32, 0.72, 0, 1).

Copy-ready core implementation:
SVG/CSS:
<svg viewBox="0 0 40 40" className="grow-ring" width="40" height="40">
  <circle cx="20" cy="20" r="17.5" className="track" />
  <circle cx="20" cy="20" r="17.5" className="progress" />
</svg>

.track { fill: none; stroke: rgba(0,0,0,.1); stroke-width: 5; }
.progress { fill: none; stroke: currentColor; stroke-width: 5; stroke-linecap: round; transform: rotate(-90deg); transform-origin: center; animation: ring-grow 3s cubic-bezier(.32,.72,0,1) forwards; }
@keyframes ring-grow { from { stroke-dasharray: 0 110; } to { stroke-dasharray: 110 0; } }`,
    Preview: LoadingGrowPreview,
  },
  {
    title: "Progress",
    prompt: `Create this exact animated progress bar loading state in my existing UI.

Hard constraints:
- Do not change my existing layout, container size, spacing, data flow, or loading logic.
- Do not install dependencies or animation libraries.
- Only add the progress bar visual layer and its CSS animation.
- Use transform animation for the fill instead of animating width.

Visual spec:
- The progress track width is 50% of the preview/container width.
- The progress track height is 5px.
- Track color: rgba(23,23,23,0.10), matching Grow Ring.
- Fill color: rgba(23,23,23,0.82), matching Grow Ring.
- Track and fill are fully rounded.
- Fill grows from left to right.
- The fill progresses continuously from 0 to 100% without intermediate keyframe pauses.
- Duration: 3s.
- Easing: cubic-bezier(0.23, 1, 0.32, 1).
- Demo behavior: show a small Reset button after completion so the animation can replay.

Copy-ready implementation:
CSS:
@keyframes loading-progress-fill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.progress-track {
  width: 50%;
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(23,23,23,0.10);
}

.progress-fill {
  width: 100%;
  height: 100%;
  transform-origin: left center;
  transform: scaleX(0);
  border-radius: inherit;
  background: rgba(23,23,23,0.82);
  animation: loading-progress-fill 3s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

HTML/JSX:
<div className="progress-track">
  <div className="progress-fill" />
</div>`,
    Preview: LoadingProgressPreview,
  },
  {
    title: "Percent Ring",
    prompt: `Create this exact animated percent ring loading state in my existing UI.

Hard constraints:
- Do not change my surrounding layout, container size, spacing, data flow, or loading logic.
- Do not install dependencies or animation libraries.
- Drive the ring progress and the numeric percentage from the same animation progress value.
- Prevent number layout shift while the value changes.

Visual spec:
- Ring size: 180px by 180px.
- Track stroke: rgba(23,23,23,0.10), matching Grow Ring.
- Progress stroke: rgba(23,23,23,0.82), matching Grow Ring.
- Stroke width: 12px.
- Stroke line cap: round.
- Target value: 100%.
- Center number: 32px, semibold, text color rgba(0,0,0,0.88), letter spacing -0.6px.
- Number must use tabular numerals and a fixed width so digits do not jump while changing.
- Duration: 3s.
- Easing: easeOutCubic.
- Default visual state must be 0% before the animation starts; set strokeDasharray and strokeDashoffset on the progress circle immediately.
- Demo behavior: show a small Reset button after completion so the animation can replay.

Copy-ready React implementation:
const [runId, setRunId] = useState(0);
const [displayPercent, setDisplayPercent] = useState(0);
const [completed, setCompleted] = useState(false);
const progressRef = useRef(null);
const radius = 82;
const circumference = 2 * Math.PI * radius;

useEffect(() => {
  let frameId = 0;
  const duration = 3000;
  const targetPercent = 100;
  let startTime = null;
  let lastRoundedPercent = -1;

  setCompleted(false);
  setDisplayPercent(0);

  if (progressRef.current) {
    progressRef.current.style.strokeDasharray = String(circumference);
    progressRef.current.style.strokeDashoffset = String(circumference);
  }

  const easeOut = value => 1 - Math.pow(1 - value, 3);

  const update = time => {
    if (startTime === null) startTime = time;
    const elapsed = Math.min(time - startTime, duration);
    const progress = easeOut(elapsed / duration);
    const currentPercent = targetPercent * progress;

    if (progressRef.current) {
      progressRef.current.style.strokeDashoffset = String(circumference * (1 - currentPercent / 100));
    }

    const roundedPercent = Math.round(currentPercent);
    if (roundedPercent !== lastRoundedPercent) {
      lastRoundedPercent = roundedPercent;
      setDisplayPercent(roundedPercent);
    }

    if (elapsed < duration) {
      frameId = requestAnimationFrame(update);
      return;
    }

    setCompleted(true);
  };

  frameId = requestAnimationFrame(update);
  return () => cancelAnimationFrame(frameId);
}, [runId]);

HTML/JSX:
<div className="percent-ring">
  <svg className="percent-ring__svg" viewBox="0 0 180 180" aria-hidden="true">
    <circle cx="90" cy="90" r="82" className="percent-ring__track" />
    <circle
      ref={progressRef}
      cx="90"
      cy="90"
      r="82"
      className="percent-ring__progress"
      style={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
    />
  </svg>
  <span className="percent-ring__value">{displayPercent}%</span>
</div>

CSS:
.percent-ring { position: relative; width: 180px; height: 180px; }
.percent-ring__svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.percent-ring__track { fill: none; stroke: rgba(23,23,23,.10); stroke-width: 12; }
.percent-ring__progress { fill: none; stroke: rgba(23,23,23,.82); stroke-width: 12; stroke-linecap: round; }
.percent-ring__value { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; min-width: 76px; text-align: center; font-size: 32px; font-weight: 600; line-height: 1; letter-spacing: -0.6px; color: rgba(0,0,0,.88); font-variant-numeric: tabular-nums; }`,
    Preview: LoadingPercentRingPreview,
  },
  {
    title: "Shiny Text",
    prompt: `Apply a shiny text loading/highlight effect to my existing text.

Hard constraints:
- Do not change the text content, font family, font size, font weight, line height, letter spacing, layout, or surrounding structure.
- Only apply the shiny visual treatment to the text rendering.
- Prefer a lightweight requestAnimationFrame implementation. Do not add motion dependencies unless the project already uses them.

Effect:
- Use background-clip: text with transparent text fill.
- Demo reference text: Shiny Text Effect.
- Demo reference style: 16px, semibold, base color #000000.
- In a user's project, keep their existing text, size, weight, and layout unchanged unless they ask otherwise.
- Base text color: #000000 or the existing text color.
- Shine color: #ffffff.
- Use the shine as a white alpha band: transparent at the edges and around rgba(255,255,255,0.88) at the center.
- The highlight band sweeps across the text continuously.
- Duration: around 1.15s.
- Let the highlight fully travel off the text, then wait about 500ms before the next sweep.
- Direction: left-to-right or right-to-left based on existing UI needs.

Copy-ready core implementation:
React:
function ShinyText({ text, speed = 1.15, delay = 0.5, color = '#000', shineColor = 'rgba(255,255,255,.88)', spread = 90 }) {
  const textRef = useRef(null);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    let frameId = 0;
    const duration = speed * 1000;
    const delayDuration = delay * 1000;
    const cycleDuration = duration + delayDuration;
    const tick = time => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        frameId = requestAnimationFrame(tick);
        return;
      }
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      elapsedRef.current += delta;
      const cycleTime = elapsedRef.current % cycleDuration;
      const progress = cycleTime < duration ? (cycleTime / duration) * 100 : 100;
      if (textRef.current) {
        textRef.current.style.backgroundPosition = (150 - progress * 2) + '% center, 0 0';
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [speed, delay]);

  return (
    <span
      ref={textRef}
      style={{
        backgroundImage: \`linear-gradient(\${spread}deg, rgba(255,255,255,0) 25%, \${shineColor} 50%, rgba(255,255,255,0) 75%), linear-gradient(0deg, \${color}, \${color})\`,
        backgroundBlendMode: 'plus-lighter, normal',
        backgroundSize: '200% auto, 100% 100%',
        backgroundPosition: '150% center, 0 0',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}
    >
      {text}
    </span>
  );
}`,
    Preview: ShinyTextPreview,
  },
  {
    title: "Shiny Text Dark",
    dark: true,
    prompt: `Apply a shiny text loading/highlight effect to my existing text on a dark background.

Hard constraints:
- Do not change the text content, font family, font size, font weight, line height, letter spacing, layout, or surrounding structure.
- Only apply the shiny visual treatment to the text rendering.
- Prefer a lightweight requestAnimationFrame implementation. Do not add motion dependencies unless the project already uses them.

Effect:
- Use background-clip: text with transparent text fill.
- Demo reference text: Shiny Text Effect.
- Demo reference style: 16px, semibold, base color rgba(255,255,255,0.7).
- In a user's project, keep their existing text, size, weight, and layout unchanged unless they ask otherwise.
- Base text color: rgba(255,255,255,0.7) or the existing text color.
- Use a bright white shine band: transparent at the edges and around rgba(255,255,255,0.88) at the center.
- The highlight band sweeps across the text continuously.
- Duration: around 1.15s.
- Let the highlight fully travel off the text, then wait about 500ms before the next sweep.

Copy-ready core implementation:
React:
function ShinyText({ text, speed = 1.15, delay = 0.5, color = 'rgba(255,255,255,.7)', shineColor = 'rgba(255,255,255,.88)', spread = 90 }) {
  const textRef = useRef(null);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    let frameId = 0;
    const duration = speed * 1000;
    const delayDuration = delay * 1000;
    const cycleDuration = duration + delayDuration;
    const tick = time => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        frameId = requestAnimationFrame(tick);
        return;
      }
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      elapsedRef.current += delta;
      const cycleTime = elapsedRef.current % cycleDuration;
      const progress = cycleTime < duration ? (cycleTime / duration) * 100 : 100;
      if (textRef.current) {
        textRef.current.style.backgroundPosition = (150 - progress * 2) + '% center, 0 0';
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [speed, delay]);

  return (
    <span
      ref={textRef}
      style={{
        backgroundImage: \`linear-gradient(\${spread}deg, rgba(255,255,255,0) 25%, \${shineColor} 50%, rgba(255,255,255,0) 75%), linear-gradient(0deg, \${color}, \${color})\`,
        backgroundBlendMode: 'screen, normal',
        backgroundSize: '200% auto, 100% 100%',
        backgroundPosition: '150% center, 0 0',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}
    >
      {text}
    </span>
  );
}`,
    Preview: ShinyTextDarkPreview,
  },
];

const skeletonDarkPrompt = `Create this exact dark-mode Skeleton loading animation in my existing UI.

Hard constraints:
- Do not change my existing layout, container size, spacing, radius, data flow, or loading logic.
- Do not install dependencies or animation libraries.
- Only add the skeleton visual layer and its CSS animation.
- If my project already has a placeholder element, apply these styles to that element instead of replacing the component.

Visual spec:
- The preview surface behind the skeleton is #3A3D43.
- The skeleton itself fills the whole available box.
- The skeleton card radius is 24px.
- The animation follows the Ant Design active Skeleton pattern: animate background-position across a 90deg gradient.
- Use only pure white with alpha for the dark-mode gradient.
- Duration: 1.4s.
- Timing: ease.

Copy-ready implementation:
CSS:
@keyframes skeleton-shimmer {
  from { background-position: 100% 50%; }
  to { background-position: 0 50%; }
}

.skeleton-surface {
  width: 100%;
  height: 100%;
  background: #3A3D43;
  border-radius: 24px;
}

.skeleton-card {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,.08) 25%,
    rgba(255,255,255,.16) 37%,
    rgba(255,255,255,.08) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
}

HTML/JSX:
<div className="skeleton-surface">
  <div className="skeleton-card" />
</div>`;

function CopyCodeTooltipButton({
  prompt,
  dark = false,
}: {
  prompt: string;
  dark?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  return (
    <button
      type="button"
      aria-label="Copy code snippet"
      className={`group relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border-0 bg-transparent p-0 transition-colors duration-150 ${
        dark
          ? "text-white hover:bg-[rgba(255,255,255,0.12)] active:bg-[rgba(255,255,255,0.16)]"
          : "text-[rgba(0,0,0,0.88)] hover:bg-[rgba(0,0,0,0.06)] active:bg-[rgba(0,0,0,0.08)]"
      }`}
      onClick={copyPrompt}
    >
      <Image
        src="/figma/button/copy-code-icon@3x.png"
        alt=""
        width={32}
        height={32}
        className={`h-8 w-8 ${dark ? "invert brightness-0" : ""}`}
      />
      <span
        className={`copy-tooltip pointer-events-none absolute bottom-10 left-1/2 z-10 whitespace-nowrap rounded-[10px] bg-[rgba(17,17,17,0.92)] px-3 py-2 text-[12px] font-medium leading-none text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] ${
          copied ? "is-copied" : ""
        }`}
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

function LoadingDemoCard({
  title,
  prompt,
  children,
  dark = false,
}: {
  title: string;
  prompt: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex aspect-square flex-col gap-4 rounded-[48px] border-2 p-[26px] shadow-[0_100px_100px_rgba(13,42,83,0.02)] ${
        dark
          ? "border-[rgba(255,255,255,0.08)] bg-black"
          : "border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff]"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <div
          className={`text-[16px] font-bold leading-none tracking-[-0.6px] ${
            dark ? "text-white" : "text-[rgba(0,0,0,0.88)]"
          }`}
        >
          {title}
        </div>
        <CopyCodeTooltipButton prompt={prompt} dark={dark} />
      </div>
      <div className="min-h-0 w-full flex-1">
        <div className={`flex h-full w-full items-center justify-center rounded-[24px] ${dark ? "bg-black" : "bg-transparent"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ShinyModeToggle({
  dark,
  onToggle,
}: {
  dark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      onClick={onToggle}
      className={`relative flex h-8 w-[68px] shrink-0 cursor-pointer items-center rounded-full border-0 p-0.5 transition-colors duration-200 ${
        dark ? "bg-black" : "bg-[rgba(0,0,0,0.06)]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 h-7 w-8 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          dark
            ? "translate-x-8 bg-[rgba(255,255,255,0.2)]"
            : "translate-x-0 bg-white"
        }`}
      />
      <span
        className="relative z-10 flex h-7 w-8 items-center justify-center overflow-hidden rounded-full"
      >
        <Image
          src="/figma/loading/moon-fill-light.svg"
          alt=""
          width={20}
          height={20}
          className={`h-5 w-5 transition-[opacity,filter] duration-300 ${
            dark ? "opacity-30 invert" : "opacity-100"
          }`}
        />
      </span>
      <span
        className="relative z-10 flex h-7 w-8 items-center justify-center overflow-hidden rounded-full"
      >
        <Image
          src="/figma/loading/sun-fill-dark.svg"
          alt=""
          width={20}
          height={20}
          className={`h-5 w-5 transition-[opacity,filter] duration-300 ${
            dark ? "opacity-100" : "opacity-35 invert"
          }`}
        />
      </span>
    </button>
  );
}

function LoadingSkeletonCard() {
  const [dark, setDark] = useState(false);
  const lightDemo = loadingDemos.find((demo) => demo.title === "Skeleton");
  const activePrompt = dark ? skeletonDarkPrompt : lightDemo?.prompt ?? "";

  return (
    <div
      className={`flex aspect-square flex-col gap-4 rounded-[48px] border-2 p-[26px] shadow-[0_100px_100px_rgba(13,42,83,0.02)] transition-[background,border-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        dark
          ? "border-[rgba(255,255,255,0.5)] bg-gradient-to-b from-[#26282c] to-[#32353a]"
          : "border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff]"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <div
          className={`text-[16px] font-bold leading-none tracking-[-0.6px] transition-colors duration-300 ${
            dark ? "text-white" : "text-[rgba(0,0,0,0.88)]"
          }`}
        >
          Skeleton
        </div>
        <div className="flex items-center gap-4">
          <ShinyModeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
          <CopyCodeTooltipButton prompt={activePrompt} dark={dark} />
        </div>
      </div>
      <div className="min-h-0 w-full flex-1">
        <div
          className={`flex h-full w-full items-center justify-center rounded-[24px] transition-colors duration-300 ${
            dark ? "bg-[#3A3D43]" : "bg-[#E6E7E9]"
          }`}
        >
          <SkeletonPreview dark={dark} />
        </div>
      </div>
    </div>
  );
}

function LoadingShinyTextCard() {
  const [dark, setDark] = useState(false);
  const lightDemo = loadingDemos.find((demo) => demo.title === "Shiny Text");
  const darkDemo = loadingDemos.find((demo) => demo.title === "Shiny Text Dark");
  const activeDemo = dark ? darkDemo : lightDemo;
  const Preview = dark ? ShinyTextDarkPreview : ShinyTextPreview;

  return (
    <div
      className={`flex aspect-square flex-col gap-4 rounded-[48px] border-2 p-[26px] shadow-[0_100px_100px_rgba(13,42,83,0.02)] transition-[background,border-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        dark
          ? "border-[rgba(255,255,255,0.5)] bg-gradient-to-b from-[#26282c] to-[#32353a]"
          : "border-white bg-gradient-to-b from-[#f4f5f7] to-[#fafcff]"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <div
          className={`text-[16px] font-bold leading-none tracking-[-0.6px] transition-colors duration-300 ${
            dark ? "text-white" : "text-[rgba(0,0,0,0.88)]"
          }`}
        >
          Shiny Text
        </div>
        <div className="flex items-center gap-4">
          <ShinyModeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
          <CopyCodeTooltipButton prompt={activeDemo?.prompt ?? ""} dark={dark} />
        </div>
      </div>
      <div className="min-h-0 w-full flex-1">
        <div className="flex h-full w-full items-center justify-center rounded-[24px] bg-transparent">
          <Preview />
        </div>
      </div>
    </div>
  );
}

export function LoadingDemoGrid() {
  return (
    <div className="grid w-full grid-cols-3 gap-6 pb-24">
      <style>{`
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
      `}</style>
      <LoadingSkeletonCard />
      <LoadingShinyTextCard />
      {loadingDemos
        .filter((demo) => demo.title !== "Skeleton" && demo.title !== "Shiny Text" && demo.title !== "Shiny Text Dark")
        .map(({ title, prompt, Preview, dark }) => (
        <LoadingDemoCard
          key={title}
          title={title}
          prompt={prompt}
          dark={dark}
        >
          <Preview />
        </LoadingDemoCard>
      ))}
    </div>
  );
}
