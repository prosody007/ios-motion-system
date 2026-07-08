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
    </div>
  );
}
