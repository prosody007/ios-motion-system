"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { BASE_SCREEN_W, BASE_SCREEN_H } from "./device-layout";

/**
 * DemoCanvas — demo 自适应外壳。
 *
 * 用法：把 demo 现有内容包在 `<DemoCanvas>` 内，`children` 仍按 393×852（默认）
 * 设计稿坐标编写，DemoCanvas 会：
 *   1. 测量 demo 容器（PhoneFrame screen 区域）实际尺寸
 *   2. 计算 `scale = min(W/baseW, H/baseH)` 等比缩放，保证内容不裁切
 *   3. 把内容居中到 device screen 内
 *
 * 这样每个 demo 不用改内部一行，就能在 phone / iPad 横竖屏自动适配；
 * 同时所有动画的 transform / left / top 数值（基于 baseW × baseH）都不需要改。
 */
export function DemoCanvas({
  children,
  baseW = BASE_SCREEN_W,
  baseH = BASE_SCREEN_H,
  background,
  className,
  style,
}: {
  children: ReactNode;
  baseW?: number;
  baseH?: number;
  background?: CSSProperties["background"];
  className?: string;
  style?: CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;
      const next = Math.min(w / baseW, h / baseH);
      if (Number.isFinite(next) && next > 0) setScale(next);
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [baseW, baseH]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 flex items-center justify-center overflow-hidden ${className ?? ""}`.trim()}
      style={{ background, ...style }}
    >
      <div
        style={{
          width: baseW,
          height: baseH,
          flexShrink: 0,
          position: "relative",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
