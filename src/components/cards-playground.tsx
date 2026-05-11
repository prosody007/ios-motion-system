"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimationPreview } from "@/components/preview/animation-preview";
import { CardProvider } from "@/components/card-context";
import { getControlsEntry } from "@/components/preview/controls-registry";
import { SpringPlaygroundProvider } from "@/components/preview/spring-playground/context";
import { BorderGlowProvider } from "@/components/preview/border-glow/context";
import type { CardsSection } from "@/types/motion";

/* ----------------------------------------------------------------
 *  Cards Playground
 *
 *  样机结构与 /Users/mac/Documents/预览 项目对齐：
 *    .phone           — 438×894 wrapper，drop-shadow 双层投影
 *      .phone__screen — 393×852 在 (22, 21)，flex column 让 demo 自由布局
 *      .phone__mockup — 透明 PNG，z-index 在 screen 之上
 *
 *  视口自适应：参考项目用 scale(0.3 ~ 1.1) + SAFE_PADDING 80。
 *  这里保留同样思路，仅把上限收到 1.0（不放大），并预留左右两侧
 *  sidebar / demo 列表 的安全边距。
 *
 *  右侧 demo 列表 fixed 距视口最右 40px，垂直居中。
 * ---------------------------------------------------------------- */

const PHONE_W = 437;
const PHONE_H = 890;
const SCREEN_OFFSET_X = 22;
const SCREEN_OFFSET_Y = 21;
const SCREEN_W = 393;
const SCREEN_H = 852;
const SCREEN_RADIUS = 54;
const PHONE_DROP_SHADOW =
  "drop-shadow(20px 20px 60px rgba(251, 233, 217, 0.7)) drop-shadow(120px 100px 240px rgba(28, 19, 14, 0.3))";
const DEMO_LIST_W = 260;
const DEMO_LIST_RIGHT = 40;
const DEMO_LIST_COLUMN_W = DEMO_LIST_W + DEMO_LIST_RIGHT;
const DEMO_OPTION_ACTIVE_COLOR = "rgba(0,0,0,0.88)";
const DEMO_OPTION_INACTIVE_COLOR = "rgba(0,0,0,0.45)";
const DEMO_OPTION_INDICATOR_GAP = 8;
const DEMO_OPTION_INDICATOR_W = 12;
const DEMO_OPTION_INDICATOR_H = 2;
const DEMO_OPTION_INDICATOR_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const PHONE_PREVIEW_GAP = 6;
const PHONE_VISUAL_PAD_TOP = 140;
const PHONE_VISUAL_PAD_RIGHT = 320;
const PHONE_VISUAL_PAD_BOTTOM = 260;
const PHONE_VISUAL_PAD_LEFT = 140;
const PHONE_VISUAL_W = PHONE_W + PHONE_VISUAL_PAD_LEFT + PHONE_VISUAL_PAD_RIGHT;
const PHONE_VISUAL_H = PHONE_H + PHONE_VISUAL_PAD_TOP + PHONE_VISUAL_PAD_BOTTOM;
const PHONE_SCALE_BOOST = 1.43;
const PHONE_BODY_NUDGE_X = 24;
const PHONE_FRAME_NUDGE_Y = 2;
let cachedPhoneScale: number | null = null;

const UnifiedControlsProvider = ({ children }: { children: ReactNode }) => (
  <SpringPlaygroundProvider>
    <BorderGlowProvider>{children}</BorderGlowProvider>
  </SpringPlaygroundProvider>
);

export function CardsPlayground({ section }: { section: CardsSection }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = section.cards[activeIndex] ?? section.cards[0];
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState({ top: 0, left: 0, ready: false });

  const controlsEntry = getControlsEntry(activeCard.controlsId);
  const Controls = controlsEntry?.Controls;
  const isSpringPlaygroundControls =
    activeCard.controlsId === "ios-spring-playground";

  useEffect(() => {
    setActiveIndex(0);
    setIndicator((prev) => ({ ...prev, ready: false }));
  }, [section.title]);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const list = listRef.current;
      const button = buttonRefs.current[activeIndex];
      if (!list || !button) return;

      const listRect = list.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      setIndicator({
        top: buttonRect.top - listRect.top + buttonRect.height / 2,
        left: buttonRect.right - listRect.left + DEMO_OPTION_INDICATOR_GAP,
        ready: true,
      });
    };

    const rafId = window.requestAnimationFrame(updateIndicator);
    const observer = new ResizeObserver(updateIndicator);

    if (listRef.current) observer.observe(listRef.current);
    buttonRefs.current.forEach((button) => {
      if (button) observer.observe(button);
    });

    window.addEventListener("resize", updateIndicator);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeIndex, section.cards.length]);

  return (
    <div
      className="relative left-1/2 grid h-full min-h-0 w-screen max-w-none -translate-x-1/2 lg:w-[calc(100vw-304px)]"
      style={{ gridTemplateColumns: `minmax(0, 1fr) ${DEMO_LIST_COLUMN_W}px` }}
    >
      <div className="flex min-h-0 min-w-0 items-center justify-center">
        <CardProvider>
          <UnifiedControlsProvider>
            {Controls ? (
              <div className="flex h-full w-full min-h-0 min-w-0 flex-col items-center gap-4 py-2">
                <div className="w-full min-h-0 flex-1">
                  <AutoScaledPhoneFrame>
                    <PhoneFrame>
                      <AnimationPreview id={activeCard.previewId} />
                    </PhoneFrame>
                  </AutoScaledPhoneFrame>
                </div>
                <div
                  className="w-full shrink-0"
                  style={{
                    width: isSpringPlaygroundControls ? "100%" : PHONE_W,
                    paddingInline: isSpringPlaygroundControls ? 80 : 0,
                    boxSizing: "border-box",
                    maxHeight: isSpringPlaygroundControls
                      ? "none"
                      : "min(42svh, 360px)",
                    overflowY: isSpringPlaygroundControls ? "visible" : "auto",
                    overscrollBehavior: "contain",
                    position: "relative",
                    zIndex: 20,
                  }}
                >
                  <Controls />
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full min-h-0 min-w-0 flex-col items-center justify-center gap-6">
                <AutoScaledPhoneFrame>
                  <PhoneFrame>
                    <AnimationPreview id={activeCard.previewId} />
                  </PhoneFrame>
                </AutoScaledPhoneFrame>
              </div>
            )}
          </UnifiedControlsProvider>
        </CardProvider>
      </div>

      <div
        className="flex min-h-0 items-center justify-end"
        style={{ paddingRight: DEMO_LIST_RIGHT }}
      >
        <ul
          ref={listRef}
          className="relative flex flex-col items-end gap-10"
          style={{
            width: DEMO_LIST_W,
            zIndex: 30,
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              top: indicator.top,
              left: indicator.left,
              width: DEMO_OPTION_INDICATOR_W,
              height: DEMO_OPTION_INDICATOR_H,
              background: DEMO_OPTION_ACTIVE_COLOR,
              opacity: indicator.ready ? 1 : 0,
              transform: "translateY(-50%)",
              transition: [
                `top 320ms ${DEMO_OPTION_INDICATOR_EASE}`,
                `left 320ms ${DEMO_OPTION_INDICATOR_EASE}`,
                "opacity 160ms ease",
              ].join(", "),
            }}
          />
          {section.cards.map((card, i) => {
            const isActive = i === activeIndex;
            return (
              <li key={card.title} className="block">
                <button
                  ref={(node) => {
                    buttonRefs.current[i] = node;
                  }}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="bg-transparent border-none p-0 text-right cursor-pointer transition-colors"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.5,
                    fontWeight: 500,
                    color: isActive
                      ? DEMO_OPTION_ACTIVE_COLOR
                      : DEMO_OPTION_INACTIVE_COLOR,
                  }}
                >
                  {card.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function AutoScaledPhoneFrame({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scaleState, setScaleState] = useState(() => ({
    scale: cachedPhoneScale ?? 1,
    ready: cachedPhoneScale !== null,
  }));

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let rafId = 0;
    const updateScale = () => {
      const availableWidth = Math.max(
        0,
        viewport.clientWidth - PHONE_PREVIEW_GAP * 2,
      );
      const availableHeight = Math.max(
        0,
        viewport.clientHeight - PHONE_PREVIEW_GAP * 2,
      );
      const nextScale = Math.min(
        1,
        availableWidth / PHONE_VISUAL_W,
        availableHeight / PHONE_VISUAL_H,
      );
      const boostedScale = Math.min(1, nextScale * PHONE_SCALE_BOOST);
      const resolvedScale = Number.isFinite(boostedScale)
        ? Math.max(0, boostedScale)
        : 1;
      cachedPhoneScale = resolvedScale;
      setScaleState((prev) => {
        if (prev.ready && Math.abs(prev.scale - resolvedScale) < 0.0005) {
          return prev;
        }
        return {
          scale: resolvedScale,
          ready: true,
        };
      });
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateScale);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(viewport);
    updateScale();
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const scale = scaleState.scale;

  return (
    <div
      ref={viewportRef}
      className="flex h-full w-full items-center justify-center overflow-visible"
      style={{ padding: `${PHONE_PREVIEW_GAP}px`, pointerEvents: "none" }}
    >
      <div
        className="relative shrink-0"
        style={{
          width: PHONE_W * scale,
          height: PHONE_H * scale,
          overflow: "visible",
          visibility: scaleState.ready ? "visible" : "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -PHONE_VISUAL_PAD_LEFT * scale + PHONE_BODY_NUDGE_X * scale,
            top: -PHONE_VISUAL_PAD_TOP * scale,
            width: PHONE_VISUAL_W * scale,
            height: PHONE_VISUAL_H * scale,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: PHONE_VISUAL_W,
              height: PHONE_VISUAL_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              overflow: "visible",
              willChange: "transform",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: PHONE_VISUAL_PAD_LEFT,
                top: PHONE_VISUAL_PAD_TOP,
                width: PHONE_W,
                height: PHONE_H,
                pointerEvents: "auto",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PhoneFrame — 保持局部自包含：手机外壳与 screen 的尺寸、圆角、层级都写在组件内。
 * 这样不会依赖全局类名，demo 始终被裁在 393×852 预览区里。
 */
function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative shrink-0"
      style={{
        width: PHONE_W,
        height: PHONE_H,
        filter: PHONE_DROP_SHADOW,
      }}
    >
      <div
        className="absolute overflow-hidden bg-white flex items-center justify-center"
        style={{
          left: SCREEN_OFFSET_X,
          top: SCREEN_OFFSET_Y,
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: SCREEN_RADIUS,
          zIndex: 1,
          isolation: "isolate",
        }}
      >
        {children}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/figma/category/phone-frame.png"
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 2,
          transform: `translateY(${PHONE_FRAME_NUDGE_Y}px)`,
        }}
      />
    </div>
  );
}
