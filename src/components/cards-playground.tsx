"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { AnimationPreview } from "@/components/preview/animation-preview";
import { CardProvider } from "@/components/card-context";
import { getControlsEntry } from "@/components/preview/controls-registry";
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

const PHONE_W = 438;
const PHONE_H = 894;
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

const FragmentProvider = ({ children }: { children: ReactNode }) => (
  <Fragment>{children}</Fragment>
);

export function CardsPlayground({ section }: { section: CardsSection }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = section.cards[activeIndex] ?? section.cards[0];
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState({ top: 0, left: 0, ready: false });

  const controlsEntry = getControlsEntry(activeCard.controlsId);
  const Provider: ComponentType<{ children: ReactNode }> =
    controlsEntry?.Provider ?? FragmentProvider;
  const Controls = controlsEntry?.Controls;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;

    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;
    const prevBodyPosition = body.style.position;
    const prevBodyInset = body.style.inset;
    const prevBodyWidth = body.style.width;
    const prevBodyTop = body.style.top;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    html.style.height = "100svh";
    body.style.overflow = "hidden";
    body.style.height = "100svh";
    body.style.position = "fixed";
    body.style.inset = "0";
    body.style.width = "100%";
    body.style.top = `${-scrollY}px`;
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      body.style.position = prevBodyPosition;
      body.style.inset = prevBodyInset;
      body.style.width = prevBodyWidth;
      body.style.top = prevBodyTop;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overscrollBehavior = prevBodyOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, []);

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
          <Provider>
            {Controls ? (
              <div className="flex flex-col items-center gap-6">
                <AutoScaledPhoneFrame>
                  <PhoneFrame>
                    <AnimationPreview id={activeCard.previewId} />
                  </PhoneFrame>
                </AutoScaledPhoneFrame>
                <div style={{ width: PHONE_W }}>
                  <Controls />
                </div>
              </div>
            ) : (
              <AutoScaledPhoneFrame>
                <PhoneFrame>
                  <AnimationPreview id={activeCard.previewId} />
                </PhoneFrame>
              </AutoScaledPhoneFrame>
            )}
          </Provider>
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
  const [scaleState, setScaleState] = useState({ scale: 0, ready: false });

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
      setScaleState({
        scale: Number.isFinite(boostedScale) ? Math.max(0, boostedScale) : 1,
        ready: true,
      });
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateScale);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(viewport);
    scheduleUpdate();
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
      style={{ padding: `${PHONE_PREVIEW_GAP}px` }}
    >
      <div
        className="relative shrink-0"
        style={{
          width: PHONE_W * scale,
          height: PHONE_H * scale,
          overflow: "visible",
          visibility: scaleState.ready ? "visible" : "hidden",
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
            }}
          >
            <div
              style={{
                position: "absolute",
                left: PHONE_VISUAL_PAD_LEFT,
                top: PHONE_VISUAL_PAD_TOP,
                width: PHONE_W,
                height: PHONE_H,
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
        }}
      />
    </div>
  );
}
