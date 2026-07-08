"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const flipCardPrompt = `Create this exact 3D Flip card interaction in my existing UI.

Hard constraints:
- Do not change my surrounding layout, spacing, data model, or business logic.
- Do not install dependencies or animation libraries.
- Preserve my real front/back content if it already exists.
- Only add the 3D flip structure and animation.

Adaptive visual and motion spec:
- Do not hardcode height. Use aspect-ratio: 11 / 15.
- Demo reference width is 240px; the card should also work at other widths.
- Card radius: 16px by default, or inherit the user's existing radius.
- Front face color: #2A57F8.
- Back face color: #F45759.
- Front text: Front. Back text: Back.
- Flip around the Y axis.
- The outer wrapper provides perspective: 1000px.
- The inner layer uses transform-style: preserve-3d.
- The back face starts at rotateY(180deg).
- Both faces use backface-visibility: hidden.
- Duration: 1200ms.
- Easing: cubic-bezier(0.16, 1, 0.3, 1).

Copy-ready React + CSS implementation:
React:
const [flipped, setFlipped] = useState(false);

<button className="flip-card" onClick={() => setFlipped((value) => !value)}>
  <div className={flipped ? "flip-card__inner is-flipped" : "flip-card__inner"}>
    <div className="flip-card__face flip-card__front">Front</div>
    <div className="flip-card__face flip-card__back">Back</div>
  </div>
</button>

CSS:
.flip-card {
  width: min(240px, 100%);
  aspect-ratio: 11 / 15;
  border: 0;
  padding: 0;
  background: transparent;
  perspective: 1000px;
}

.flip-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 1200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.flip-card__inner.is-flipped {
  transform: rotateY(180deg);
}

.flip-card__face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-card__back {
  background: #F45759;
  transform: rotateY(180deg);
}

.flip-card__front {
  background: #2A57F8;
}`;

const backgroundBlurPrompt = `Create a reusable Background Blur image effect in my existing UI.

Hard constraints:
- Do not change my surrounding layout, container size, data model, image source, or business logic.
- Do not install dependencies.
- Keep the same image for both the background layer and the foreground layer.
- Only add the layering, blur mask, and object-fit rules needed for this effect.
- The effect must adapt to my target container size. Do not hardcode this demo's width or height.

Visual spec:
- The outer container keeps my existing size and radius, with overflow hidden.
- Bottom layer: the same image fills the full container with object-fit: cover.
- Middle layer: a translucent overlay with backdrop-filter blur.
- Top layer: the same image is centered above the blur mask and remains sharp.
- The foreground crop should be configurable with --foreground-width. Default: 50%.
- If my design is portrait-like, keep height: 100% and set width via --foreground-width.
- If my design is landscape-like, you may instead use width: 100% and height via a similar variable.

Copy-ready implementation:
CSS:
.background-blur-card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  --foreground-width: 50%;
  --blur-radius: 12px;
  --overlay-color: rgba(0,0,0,.1);
}

.background-blur-card__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.background-blur-card__mask {
  position: absolute;
  inset: 0;
  background: var(--overlay-color);
  backdrop-filter: blur(var(--blur-radius));
  -webkit-backdrop-filter: blur(var(--blur-radius));
}

.background-blur-card__foreground {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 100%;
  width: var(--foreground-width);
  max-width: none;
  transform: translate(-50%, -50%);
  object-fit: cover;
}

HTML/JSX:
<div className="background-blur-card">
  <img className="background-blur-card__backdrop" src={imageSrc} alt="" />
  <div className="background-blur-card__mask" />
  <img className="background-blur-card__foreground" src={imageSrc} alt="" />
</div>`;

function CopyCodeTooltipButton({ prompt }: { prompt: string }) {
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

function FlipCardPreview() {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={() => setFlipped((value) => !value)}
      className="aspect-[11/15] w-[min(240px,100%)] cursor-pointer border-0 bg-transparent p-0 [perspective:1000px]"
    >
      <div
        className={`relative h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#2A57F8] text-[18px] font-bold leading-none tracking-[-0.03em] text-white [backface-visibility:hidden]">
          Front
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#F45759] text-[18px] font-bold leading-none tracking-[-0.03em] text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
          Back
        </div>
      </div>
    </button>
  );
}

function BackgroundBlurPreview() {
  const imageSrc = "/demo-assets/background-blur-figma.png";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[24px]">
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="420px"
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[12px]" />
      <Image
        src={imageSrc}
        alt=""
        width={512}
        height={512}
        className="absolute left-1/2 top-1/2 h-full w-[50.2%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
        priority={false}
      />
    </div>
  );
}

export function CardDemoGrid() {
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
      <DemoCard title="Flip" prompt={flipCardPrompt}>
        <FlipCardPreview />
      </DemoCard>
      <DemoCard title="Background Blur" prompt={backgroundBlurPrompt}>
        <BackgroundBlurPreview />
      </DemoCard>
    </div>
  );
}
