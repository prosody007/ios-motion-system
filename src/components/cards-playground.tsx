"use client";

import {
  createContext,
  useContext,
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
import { useDevice, type DeviceKind } from "@/components/device-context";
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

/**
 * Device presets — 一组设备共用同一组键，AutoScaledDeviceFrame / DeviceFrame
 * 根据当前 device 选取对应 preset。新设备只需新增一条配置。
 */
type DevicePreset = {
  /** 设备整体尺寸（包含外壳像素） */
  W: number;
  H: number;
  /** 屏幕区域在设备中的偏移与尺寸 */
  SCREEN_OFFSET_X: number;
  SCREEN_OFFSET_Y: number;
  SCREEN_W: number;
  SCREEN_H: number;
  SCREEN_RADIUS: number;
  /** 包裹设备的视觉 padding（用于让 drop-shadow 不被裁剪） */
  VISUAL_PAD_TOP: number;
  VISUAL_PAD_RIGHT: number;
  VISUAL_PAD_BOTTOM: number;
  VISUAL_PAD_LEFT: number;
  /** scale 上限放大系数，用于在小预览区里把设备显示得更大 */
  SCALE_BOOST: number;
  /** 设备水平/垂直微调（外壳与屏幕对齐时的像素修正） */
  BODY_NUDGE_X: number;
  FRAME_NUDGE_Y: number;
  /** 设备外壳 PNG 路径 */
  framePngSrc: string;
  /** 投影（CSS filter: drop-shadow 字符串） */
  dropShadow: string;
};

const PHONE_DROP_SHADOW =
  "drop-shadow(20px 20px 60px rgba(251, 233, 217, 0.7)) drop-shadow(140px 100px 240px rgba(28, 19, 14, 0.4))";
// iPad 投影：x 80 / y 120 / blur 240 / 颜色 #000 24%
const IPAD_DROP_SHADOW = "drop-shadow(80px 120px 240px rgba(0, 0, 0, 0.24))";

const DEVICE_PRESETS: Record<DeviceKind, DevicePreset> = {
  phone: {
    W: 437,
    H: 890,
    SCREEN_OFFSET_X: 22,
    SCREEN_OFFSET_Y: 21,
    SCREEN_W: 393,
    SCREEN_H: 852,
    SCREEN_RADIUS: 54,
    VISUAL_PAD_TOP: 140,
    VISUAL_PAD_RIGHT: 320,
    VISUAL_PAD_BOTTOM: 260,
    VISUAL_PAD_LEFT: 140,
    SCALE_BOOST: 1.43,
    BODY_NUDGE_X: 24,
    FRAME_NUDGE_Y: 2,
    framePngSrc: "/figma/category/phone-frame.png",
    dropShadow: PHONE_DROP_SHADOW,
  },
  ipad: {
    // Figma 1646:23248 — 横屏 iPad，1320×940，屏幕 1210×834 偏移 (55, 53)
    W: 1320,
    H: 940,
    SCREEN_OFFSET_X: 55,
    SCREEN_OFFSET_Y: 53,
    SCREEN_W: 1210,
    SCREEN_H: 834,
    SCREEN_RADIUS: 36,
    VISUAL_PAD_TOP: 140,
    VISUAL_PAD_RIGHT: 320,
    VISUAL_PAD_BOTTOM: 260,
    VISUAL_PAD_LEFT: 140,
    SCALE_BOOST: 1.0,
    BODY_NUDGE_X: 0,
    FRAME_NUDGE_Y: 0,
    framePngSrc: "/figma/category/ipad-frame.png",
    dropShadow: IPAD_DROP_SHADOW,
  },
};

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

// Spring playground 控件需要按 Phone 实际宽度对齐（即便切到 iPad 也保持一致 UI 宽度）
const PHONE_W_FOR_CONTROLS = DEVICE_PRESETS.phone.W;

const cachedDeviceScale: Partial<Record<DeviceKind, number>> = {};

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
                    width: isSpringPlaygroundControls ? "100%" : PHONE_W_FOR_CONTROLS,
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

/**
 * DisplayDevice — 切换动画期间，显示中的设备 ≠ 全局当前设备。
 * AutoScaledPhoneFrame 在切换过渡期间向后代提供 displayDevice，让 PhoneFrame 渲染对应外壳；
 * 全局 device 变化时由 AutoScaledPhoneFrame 内的状态机延迟同步过来，确保动画完整。
 */
const DisplayDeviceContext = createContext<DeviceKind | null>(null);

const DEVICE_SWITCH_OUT_MS = 1100; // 当前设备向上飞出（同时透明度 1 -> 0）
const DEVICE_SWITCH_IN_MS = 1100; // 新设备由下飞入（同时透明度 0 -> 1）
// easeInOutQuint — 慢启动 / 中间快 / 慢落定，最丝滑的 ease-in-out 曲线
const DEVICE_SWITCH_EASE = "cubic-bezier(0.83, 0, 0.17, 1)";

type SwitchPhase = "idle" | "out" | "snap";

function AutoScaledPhoneFrame({ children }: { children: ReactNode }) {
  const { device: globalDevice } = useDevice();
  const [displayDevice, setDisplayDevice] = useState<DeviceKind>(globalDevice);
  const [phase, setPhase] = useState<SwitchPhase>("idle");

  // 切换状态机：idle -> out -> (hold) -> snap (无过渡，瞬移到下方) -> idle (向上飞回)
  useEffect(() => {
    if (globalDevice === displayDevice) return;
    setPhase("out");
    const t1 = window.setTimeout(() => {
      setPhase("snap");
      setDisplayDevice(globalDevice);
      // 双 RAF 等 snap 那一帧渲染完成，再切回 idle 触发"由下向上"的 transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("idle"));
      });
    }, DEVICE_SWITCH_OUT_MS);
    return () => window.clearTimeout(t1);
  }, [globalDevice, displayDevice]);

  const preset = DEVICE_PRESETS[displayDevice];
  const visualW = preset.W + preset.VISUAL_PAD_LEFT + preset.VISUAL_PAD_RIGHT;
  const visualH = preset.H + preset.VISUAL_PAD_TOP + preset.VISUAL_PAD_BOTTOM;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [scaleState, setScaleState] = useState(() => ({
    scale: cachedDeviceScale[displayDevice] ?? 1,
    ready: cachedDeviceScale[displayDevice] !== undefined,
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
        availableWidth / visualW,
        availableHeight / visualH,
      );
      const boostedScale = Math.min(1, nextScale * preset.SCALE_BOOST);
      const resolvedScale = Number.isFinite(boostedScale)
        ? Math.max(0, boostedScale)
        : 1;
      cachedDeviceScale[displayDevice] = resolvedScale;
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
  }, [displayDevice, preset.SCALE_BOOST, visualW, visualH]);

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
          width: preset.W * scale,
          height: preset.H * scale,
          overflow: "visible",
          visibility: scaleState.ready ? "visible" : "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -preset.VISUAL_PAD_LEFT * scale + preset.BODY_NUDGE_X * scale,
            top: -preset.VISUAL_PAD_TOP * scale,
            width: visualW * scale,
            height: visualH * scale,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: visualW,
              height: visualH,
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
                left: preset.VISUAL_PAD_LEFT,
                top: preset.VISUAL_PAD_TOP,
                width: preset.W,
                height: preset.H,
                pointerEvents: "auto",
                // 切换动画：
                // - out: translateY 0 -> -150%，opacity 1 -> 0（飞出同时淡出）
                // - snap: 瞬移到 +150%、opacity 0（无过渡）
                // - idle (飞入): 回到 translateY 0、opacity 1
                transform:
                  phase === "out"
                    ? "translateY(-150%)"
                    : phase === "snap"
                      ? "translateY(150%)"
                      : "translateY(0)",
                opacity: phase === "idle" ? 1 : 0,
                transition:
                  phase === "snap"
                    ? "none"
                    : phase === "out"
                      ? `transform ${DEVICE_SWITCH_OUT_MS}ms ${DEVICE_SWITCH_EASE}, opacity ${DEVICE_SWITCH_OUT_MS}ms ${DEVICE_SWITCH_EASE}`
                      : `transform ${DEVICE_SWITCH_IN_MS}ms ${DEVICE_SWITCH_EASE}, opacity ${DEVICE_SWITCH_IN_MS}ms ${DEVICE_SWITCH_EASE}`,
                willChange: "transform, opacity",
                // 提示浏览器把这一层做成独立合成层，避免动画期间重绘 / 丢帧
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
              }}
            >
              <DisplayDeviceContext.Provider value={displayDevice}>
                {children}
              </DisplayDeviceContext.Provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PhoneFrame — 保持局部自包含：设备外壳与 screen 的尺寸、圆角、层级都写在组件内。
 * 根据 useDevice() 切换 phone / ipad 配置。
 */
function PhoneFrame({ children }: { children: ReactNode }) {
  const { device: globalDevice } = useDevice();
  const ctxDevice = useContext(DisplayDeviceContext);
  const device = ctxDevice ?? globalDevice;
  const preset = DEVICE_PRESETS[device];

  return (
    <div
      className="relative shrink-0"
      style={{
        width: preset.W,
        height: preset.H,
        filter: preset.dropShadow,
      }}
    >
      <div
        className="absolute overflow-hidden bg-white flex items-center justify-center"
        style={{
          left: preset.SCREEN_OFFSET_X,
          top: preset.SCREEN_OFFSET_Y,
          width: preset.SCREEN_W,
          height: preset.SCREEN_H,
          borderRadius: preset.SCREEN_RADIUS,
          zIndex: 1,
          isolation: "isolate",
        }}
      >
        {children}
        {/* 系统级 Home Indicator（所有 demo 共用，反相混合自动适配明暗背景） */}
        <div
          aria-hidden="true"
          className="pointer-events-none"
          style={{
            position: "absolute",
            left: "50%",
            bottom: 8,
            transform: "translateX(-50%)",
            width: 144,
            height: 5,
            borderRadius: 100,
            background: "#FFFFFF",
            mixBlendMode: "difference",
            zIndex: 1000,
          }}
        />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={preset.framePngSrc}
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
          transform: `translateY(${preset.FRAME_NUDGE_Y}px)`,
        }}
      />
    </div>
  );
}
