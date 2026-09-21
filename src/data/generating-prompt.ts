// Match ImageGenerationPreview; gallery backgrounds belong only to LoadingGeneratingCard.
export const generatingPrompt = `Implement the “Generating” animation below in my existing project. Match the supplied reference implementation exactly; use its code and equations as the source of truth. This prompt is self-contained and does not require a screenshot, video, or access to the original project.

Scope and integration
- Add only a transparent animation layer and animated dots. Preserve the host layout, content, background, loading lifecycle, and business logic. Do not add a demo card, heading, status text, progress display, copy button, replay button, glow, blur, random motion, or extra padding.
- The background belongs entirely to the host. Leave its existing solid color, gradient, image, and theme behavior untouched. Do not copy the gallery preview backgrounds, set a replacement background, or use background: inherit on the animation layer. Keep the animation wrappers transparent so the original host background shows through in both modes.
- Use the project's existing framework and theme state. The React + TypeScript and plain CSS files below are the complete reference; they require no Tailwind, Next.js APIs, images, or animation library. In a non-React project, port the exact layout, time equations, colors, and formulas to its native rendering API instead of substituting a similar animation.
- The parent owns the actual width and height. Fill its available area with 100% width and height; do not impose a square, fixed dimensions, max-width, min-height, or additional aspect ratio. The host must already have a resolved height. If it does not, resolve the intended loading bounds from the existing layout rather than inventing dimensions. For an overlay, the host can provide a positioned wrapper with inset: 0.
- The reference radius is 24 CSS pixels. Keep that default for an exact demo match; pass the existing host radius (or "inherit") only when integrating with a different container. Do not copy the gallery's outer card or controls.
- Keep the same mounted component when toggling dark mode or resizing. Never use the theme or dimensions as a React key or animation-effect dependency. Theme changes only affect colors. Mount while the host is loading and unmount when loading ends; cancel the scheduled animation frame on unmount.

Exact spatial and color contract
- Render 841 circles in row-major order, 29 columns by 29 rows, with zero grid gap. Each circle is centered in its cell. For host width W and height H, center positions are ((column + 0.5) * W / 29, (row + 0.5) * H / 29). Keep the count fixed across landscape, portrait, and square hosts; horizontal and vertical spacing may differ, but dots remain circular.
- Base diameter is clamp(2 CSS px, 0.0075 * min(W, H), 3 CSS px), BEFORE animated scaling. It is based on the container's short side, not the viewport. The full range of displayed diameter is this base multiplied by 0.78 to 2.4. Do not replace container query units with viewport units or stretch a square bitmap.
- Light-mode dot fill: #4F8DEB. Dark-mode dot fill: #8FB8FF. Both modes use a transparent animation layer over the host's own background. The same scale and opacity formulas apply in both modes.
- Resting dots remain present at scale >= 0.78 and opacity >= 0.20. Active dots reach scale 2.4 and opacity 0.90. Use ordinary alpha compositing; no masks, blend modes, cutoff thresholds, or filtering.
- Only dot colors transition for 300ms with cubic-bezier(0.4, 0, 0.2, 1). The animation must not change or animate the host background. Do not apply a CSS transition to transform or opacity: those are assigned directly every animation frame. The supplied reduced-motion rule matches the reference's dot-color transition behavior; it does not alter the dot-field timeline.

Exact time and field contract
- Start time is the first requestAnimationFrame callback. Every cycle is exactly 11681ms, already including the requested 15% speed increase. Use elapsed time, not frame count or a timer increment. Loop indefinitely: progress = ((time - startTime) % 11681) / 11681.
- PATH has six entries and five equal-duration segments (2336.2ms each). The last center repeats the first. Within a segment, t is normalized 0..1 and the interpolation is smoothstep t*t*(3-2*t), not CSS ease, a spring, or a different spline.
- Dot field coordinates are x=column/28 and y=row/28. These normalized field coordinates deliberately differ from the cell-center rendering coordinates above. Keep the field normalized to the container axes; do not add aspect-ratio distance correction.
- Let the interpolated primary center be (cx, cy). The secondary center is (0.76 - cx*0.34, 0.2 + cy*0.38).
- d1 = hypot((x-cx)/0.46, (y-cy)/0.42).
- d2 = hypot((x-secondaryX)/0.36, (y-secondaryY)/0.34).
- field = min(1, exp(-d1*d1*2.2) + exp(-d2*d2*2.8)*0.45).
- scale = 0.78 + field*1.62; opacity = 0.20 + field*0.70.
- Dot centers never move. The apparent moving cloud is produced exclusively by smooth changes in each dot's scale and opacity. Do not change these constants or add an additional delay, phase offset, fade-in, or loop pause.

File 1: Generating.tsx
\`\`\`tsx
"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./generating.css";

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

type GeneratingProps = {
  dark?: boolean;
  radius?: CSSProperties["borderRadius"];
};

export function Generating({ dark = false, radius = 24 }: GeneratingProps) {
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    let frameId = 0;
    let startTime: number | null = null;
    const duration = 11681;

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

        dot.style.transform = \`scale(\${scale})\`;
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
      className="generating-surface"
      data-mode={dark ? "dark" : "light"}
      style={{ borderRadius: radius }}
    >
      <div className="generating-field" role="status" aria-label="正在生成图片">
        <div className="generating-grid" aria-hidden="true">
          {IMAGE_GENERATION_DOTS.map((_, index) => (
            <span
              key={index}
              ref={(node) => {
                dotRefs.current[index] = node;
              }}
              className="generating-dot"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
\`\`\`

File 2: generating.css
\`\`\`css
.generating-surface {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0;
  border: 0;
  --generating-dot-color: #4F8DEB;
}

.generating-surface[data-mode="dark"] {
  --generating-dot-color: #8FB8FF;
}

.generating-field {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  box-sizing: border-box;
  padding: 0;
  border: 0;
  container-type: size;
}

.generating-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(29, minmax(0, 1fr));
  grid-template-rows: repeat(29, minmax(0, 1fr));
  place-items: center;
  gap: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
}

.generating-dot {
  display: block;
  width: clamp(2px, 0.75cqmin, 3px);
  height: clamp(2px, 0.75cqmin, 3px);
  padding: 0;
  border: 0;
  margin: 0;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: var(--generating-dot-color);
  opacity: 0.2;
  transform-origin: center;
  will-change: transform;
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  .generating-dot {
    transition-duration: 1ms;
  }
}
\`\`\`

Integration (use existing parent dimensions and theme state):
\`\`\`tsx
import { Generating } from "./Generating";

// In the existing, already-sized loading container:
<Generating dark={isDarkMode} />
// For a host with a different radius, pass its radius explicitly:
// <Generating dark={isDarkMode} radius="inherit" />
\`\`\`
The host owns isDarkMode. Use its existing theme control; only add a toggle if the host needs one. Put any toggle outside the animation surface. In Next.js, keep the component client-side; if the project centralizes global CSS imports, import generating.css there instead of importing it twice.

Verification before finishing
1. Confirm exactly 841 circles, no visible copy or progress, and a transparent layer fully covering the existing loading area. Test over the host's own solid color, gradient, or image; it must remain visible and unchanged when the animation mounts or switches modes.
2. Check square, wide, tall, and small host sizes (for example 320x320, 520x180, 180x520, and 80x40 CSS pixels). These are verification fixtures, not production dimensions. Confirm circular dots, per-cell centers, the exact diameter clamp, inherited bounds, and no size changes to the host.
3. At fixed elapsed times 0, 1168.1, 2336.2, 5840.5, 11680, 11681, and 23362ms, compare every dot's scale and opacity to the reference equations. At 11681 and 23362ms the values repeat time 0. Observe beyond two cycles to verify it does not stop or jump.
4. Switch between light and dark during playback. Verify the two exact dot colors, 300ms dot-color transition, transparent wrappers, unchanged host background, stable dimensions and dot nodes, and uninterrupted timeline. Small dots must remain visible in both modes.
5. Verify unmounting stops its frame loop and remounting starts one fresh loop, without duplicate animation callbacks.
Deliver the working animation and report actual validation results. If the target platform cannot reproduce a rule, identify the specific difference; do not silently approximate it or claim unverified pixel equality.
`;
