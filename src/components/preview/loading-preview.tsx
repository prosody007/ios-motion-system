"use client";

import { useEffect, useRef, useState } from "react";

const PERCENT_RING_RADIUS = 82;
const PERCENT_RING_CIRCUMFERENCE = 2 * Math.PI * PERCENT_RING_RADIUS;

export function LoadingPreview() {
  return (
    <svg
      className="h-10 w-10 animate-spin"
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke="rgba(23,23,23,0.10)"
        strokeWidth="5"
      />
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke="rgba(23,23,23,0.82)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="30 100"
      />
    </svg>
  );
}

function ShinyText({
  text,
  color = "#000000",
  shineColor = "rgba(255,255,255,0.8)",
  speed = 1.15,
  delay = 0.5,
  spread = 90,
  direction = "left",
  disabled = false,
}: {
  text: string;
  color?: string;
  shineColor?: string;
  speed?: number;
  delay?: number;
  spread?: number;
  direction?: "left" | "right";
  disabled?: boolean;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let frameId = 0;
    const animationDuration = speed * 1000;
    const delayDuration = delay * 1000;
    const cycleDuration = animationDuration + delayDuration;
    const directionSign = direction === "left" ? 1 : -1;

    const update = (time: number) => {
      if (disabled) {
        lastTimeRef.current = null;
        frameId = window.requestAnimationFrame(update);
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        frameId = window.requestAnimationFrame(update);
        return;
      }

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;
      elapsedRef.current += deltaTime;

      const cycleTime = elapsedRef.current % cycleDuration;
      const progress =
        cycleTime < animationDuration
          ? (cycleTime / animationDuration) * 100
          : 100;
      const resolvedProgress =
        directionSign === 1 ? progress : 100 - progress;

      if (textRef.current) {
        textRef.current.style.backgroundPosition = `${150 - resolvedProgress * 2}% center, 0 0`;
      }

      frameId = window.requestAnimationFrame(update);
    };

    elapsedRef.current = 0;
    lastTimeRef.current = null;
    frameId = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(frameId);
  }, [delay, direction, disabled, speed]);

  return (
    <span
      ref={textRef}
      className="inline-block select-none text-[16px] font-semibold tracking-[-0.02em]"
      style={{
        backgroundImage: `linear-gradient(${spread}deg, rgba(255,255,255,0) 25%, ${shineColor} 50%, rgba(255,255,255,0) 75%), linear-gradient(0deg, ${color}, ${color})`,
        backgroundBlendMode: "plus-lighter, normal",
        backgroundSize: "200% auto, 100% 100%",
        backgroundPosition: "150% center, 0 0",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {text}
    </span>
  );
}

export function ShinyTextPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ShinyText
        text="Shiny Text Effect"
        speed={1.15}
        delay={0.5}
        spread={90}
        direction="left"
      />
    </div>
  );
}

export function ShinyTextDarkPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ShinyText
        text="Shiny Text Effect"
        speed={1.15}
        delay={0.5}
        spread={90}
        direction="left"
        color="rgba(255,255,255,0.7)"
        shineColor="rgba(255,255,255,0.88)"
      />
    </div>
  );
}

export function LoadingGrowPreview() {
  const [runId, setRunId] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setCompleted(true), 3000);
    return () => window.clearTimeout(timer);
  }, [runId]);

  const reset = () => {
    setCompleted(false);
    setRunId((value) => value + 1);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{`
        @keyframes loading-grow-ring {
          0% { stroke-dasharray: 0 113.1; stroke-dashoffset: 0; }
          100% { stroke-dasharray: 113.1 0; stroke-dashoffset: 0; }
        }
      `}</style>
      <svg key={runId} width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <circle
          cx="20"
          cy="20"
          r="17.5"
          fill="none"
          stroke="rgba(23,23,23,0.10)"
          strokeWidth="5"
        />
        <circle
          cx="20"
          cy="20"
          r="17.5"
          fill="none"
          stroke="rgba(23,23,23,0.82)"
          strokeWidth="5"
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
          style={{
            animation:
              "loading-grow-ring 3s cubic-bezier(0.32, 0.72, 0, 1) forwards",
          }}
        />
      </svg>
      {completed ? (
        <button
          type="button"
          className="absolute left-1/2 top-[calc(50%+48px)] -translate-x-1/2 cursor-pointer rounded-full border-0 bg-[rgba(0,122,255,0.10)] px-3 py-1 text-[11px] font-medium text-[#007AFF]"
          onClick={reset}
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}

export function LoadingProgressPreview() {
  const [runId, setRunId] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setCompleted(true), 3000);
    return () => window.clearTimeout(timer);
  }, [runId]);

  const reset = () => {
    setCompleted(false);
    setRunId((value) => value + 1);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <style>{`
        @keyframes loading-progress-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
      <div className="h-[5px] w-1/2 overflow-hidden rounded-full bg-[rgba(23,23,23,0.10)]">
        <div
          key={runId}
          className="h-full w-full origin-left rounded-full bg-[rgba(23,23,23,0.82)]"
          style={{
            transform: "scaleX(0)",
            animation:
              "loading-progress-fill 3s cubic-bezier(0.23, 1, 0.32, 1) forwards",
          }}
        />
      </div>
      {completed ? (
        <button
          type="button"
          className="absolute left-1/2 top-[calc(50%+32px)] -translate-x-1/2 cursor-pointer rounded-full border-0 bg-[rgba(0,122,255,0.10)] px-3 py-1 text-[11px] font-medium text-[#007AFF]"
          onClick={reset}
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}

export function LoadingPercentRingPreview() {
  const [runId, setRunId] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [completed, setCompleted] = useState(false);
  const progressRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frameId = 0;
    const duration = 3000;
    const targetPercent = 100;
    let startTime: number | null = null;
    let lastRoundedPercent = -1;

    if (progressRef.current) {
      progressRef.current.style.strokeDasharray = `${PERCENT_RING_CIRCUMFERENCE}`;
      progressRef.current.style.strokeDashoffset = `${PERCENT_RING_CIRCUMFERENCE}`;
    }

    const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

    const update = (time: number) => {
      if (startTime === null) {
        startTime = time;
      }

      const elapsed = Math.min(time - startTime, duration);
      const progress = easeOut(elapsed / duration);
      const currentPercent = targetPercent * progress;

      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = `${PERCENT_RING_CIRCUMFERENCE * (1 - currentPercent / 100)}`;
      }

      const roundedPercent = Math.round(currentPercent);
      if (roundedPercent !== lastRoundedPercent) {
        lastRoundedPercent = roundedPercent;
        setDisplayPercent(roundedPercent);
      }

      if (elapsed < duration) {
        frameId = window.requestAnimationFrame(update);
        return;
      }

      setCompleted(true);
    };

    frameId = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frameId);
  }, [runId]);

  const reset = () => {
    setCompleted(false);
    setDisplayPercent(0);
    setRunId((value) => value + 1);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-[180px] w-[180px]">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 180 180"
          aria-hidden="true"
        >
          <circle
            cx="90"
            cy="90"
            r="82"
            fill="none"
            stroke="rgba(23,23,23,0.10)"
            strokeWidth="12"
          />
          <circle
            ref={progressRef}
            cx="90"
            cy="90"
            r="82"
            fill="none"
            stroke="rgba(23,23,23,0.82)"
            strokeWidth="12"
            strokeLinecap="round"
            style={{
              strokeDasharray: PERCENT_RING_CIRCUMFERENCE,
              strokeDashoffset: PERCENT_RING_CIRCUMFERENCE,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="min-w-[76px] text-center text-[32px] font-semibold leading-none tracking-[-0.6px] text-[rgba(0,0,0,0.88)] tabular-nums">
            {displayPercent}%
          </span>
        </div>
      </div>
      {completed ? (
        <button
          type="button"
          className="absolute left-1/2 top-[calc(50%+118px)] -translate-x-1/2 cursor-pointer rounded-full border-0 bg-[rgba(0,122,255,0.10)] px-3 py-1 text-[11px] font-medium text-[#007AFF]"
          onClick={reset}
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}

const IMAGE_GENERATION_DOT_COLUMNS = 29;
const IMAGE_GENERATION_DOT_ROWS = 29;
const IMAGE_GENERATION_DOTS = Array.from(
  { length: IMAGE_GENERATION_DOT_COLUMNS * IMAGE_GENERATION_DOT_ROWS },
  (_, index) => ({
    x: index % IMAGE_GENERATION_DOT_COLUMNS,
    y: Math.floor(index / IMAGE_GENERATION_DOT_COLUMNS),
  }),
);

const IMAGE_GENERATION_PATH = [
  { x: 0.52, y: 0.74 },
  { x: 0.78, y: 0.28 },
  { x: 0.62, y: 0.66 },
  { x: 0.18, y: 0.5 },
  { x: 0.2, y: 0.22 },
  { x: 0.52, y: 0.74 },
];

function interpolateImageGenerationPath(progress: number) {
  const position = progress * (IMAGE_GENERATION_PATH.length - 1);
  const index = Math.min(Math.floor(position), IMAGE_GENERATION_PATH.length - 2);
  const localProgress = position - index;
  const eased = localProgress * localProgress * (3 - 2 * localProgress);
  const start = IMAGE_GENERATION_PATH[index];
  const end = IMAGE_GENERATION_PATH[index + 1];

  return {
    x: start.x + (end.x - start.x) * eased,
    y: start.y + (end.y - start.y) * eased,
  };
}

export function ImageGenerationPreview() {
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    let frameId = 0;
    let startTime: number | null = null;
    const duration = 13433;

    const updateDots = (progress: number) => {
      const center = interpolateImageGenerationPath(progress);
      const secondaryCenter = {
        x: 0.76 - center.x * 0.34,
        y: 0.2 + center.y * 0.38,
      };

      dotRefs.current.forEach((dot, index) => {
        if (!dot) return;

        const point = IMAGE_GENERATION_DOTS[index];
        const x = point.x / (IMAGE_GENERATION_DOT_COLUMNS - 1);
        const y = point.y / (IMAGE_GENERATION_DOT_ROWS - 1);
        const primaryDistance = Math.hypot(
          (x - center.x) / 0.46,
          (y - center.y) / 0.42,
        );
        const secondaryDistance = Math.hypot(
          (x - secondaryCenter.x) / 0.36,
          (y - secondaryCenter.y) / 0.34,
        );
        const primaryField = Math.exp(-primaryDistance * primaryDistance * 2.2);
        const secondaryField = Math.exp(-secondaryDistance * secondaryDistance * 2.8) * 0.45;
        const field = Math.min(1, primaryField + secondaryField);
        const scale = 0.78 + field * 1.62;
        const opacity = 0.2 + field * 0.7;

        dot.style.transform = `scale(${scale})`;
        dot.style.opacity = String(opacity);
      });
    };

    const tick = (time: number) => {
      if (startTime === null) startTime = time;
      const progress = ((time - startTime) % duration) / duration;
      updateDots(progress);

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[24px] [container-type:size]"
      role="status"
      aria-label="正在生成图片"
    >
      <div className="absolute inset-0 grid grid-cols-[repeat(29,minmax(0,1fr))] grid-rows-[repeat(29,minmax(0,1fr))] items-center justify-items-center">
        {IMAGE_GENERATION_DOTS.map((_, index) => (
          <span
            key={index}
            ref={(node) => {
              dotRefs.current[index] = node;
            }}
            className="size-[clamp(2px,0.75cqmin,3px)] rounded-full bg-[#4F8DEB] opacity-20 will-change-transform"
          />
        ))}
      </div>
    </div>
  );
}

const RECORDING_BARS = [
  { height: 14, delay: "-0.42s", minScale: 0.45 },
  { height: 24, delay: "-0.28s", minScale: 0.5 },
  { height: 38, delay: "-0.14s", minScale: 0.55 },
  { height: 24, delay: "0s", minScale: 0.5 },
  { height: 14, delay: "0.14s", minScale: 0.45 },
];

export function LoadingRecordingBarsPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <style>{`
        @keyframes recording-bars-wave {
          0%, 100% {
            transform: scaleY(var(--min-scale));
            opacity: 0.72;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
      <div className="flex h-14 items-center justify-center gap-[6px] rounded-full bg-white px-6 shadow-[0_10px_40px_rgba(38,81,149,0.16)]">
        {RECORDING_BARS.map((bar, index) => (
          <span
            key={index}
            className="w-[4px] rounded-full bg-[#007AFF]"
            style={{
              height: bar.height,
              transformOrigin: "center center",
              animation:
                "recording-bars-wave 1s ease-in-out infinite",
              animationDelay: bar.delay,
              "--min-scale": bar.minScale,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonPreview({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className="h-full w-full"
      style={
        {
          "--skeleton-gradient-from": dark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0)",
          "--skeleton-gradient-to": dark
            ? "rgba(255,255,255,0.16)"
            : "rgba(0,0,0,0.08)",
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes skeleton-shimmer {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0 50%;
          }
        }

        .skeleton-shimmer {
          overflow: hidden;
          background: linear-gradient(
            90deg,
            var(--skeleton-gradient-from) 25%,
            var(--skeleton-gradient-to) 37%,
            var(--skeleton-gradient-from) 63%
          );
          background-size: 400% 100%;
          animation: skeleton-shimmer 1.4s ease infinite;
        }
      `}</style>
      <div className="skeleton-shimmer h-full w-full rounded-[24px]" />
    </div>
  );
}
