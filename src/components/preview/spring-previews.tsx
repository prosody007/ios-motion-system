"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------- Matched Geometry Spring（按 Figma 稿：小さな習慣…卡片） ---------------- */
export function SpringMatchedGeometryPreview() {
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const [fullH, setFullH] = useState(0);
  const [availH, setAvailH] = useState(0);

  // 测完整正文自然高度 + 可用高度（受预览容器约束）
  useEffect(() => {
    const measure = () => {
      if (fullRef.current) setFullH(fullRef.current.scrollHeight);
      if (wrapperRef.current) setAvailH(wrapperRef.current.clientHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (fullRef.current) ro.observe(fullRef.current);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  // iOS 动画规则：入场要看清，出场要果断但柔和
  // 出场用 Apple 招牌的 (0.32, 0.72, 0, 1)：起手贴合、收尾平滑，不会硬切
  const DUR_OPEN = 0.4;
  const DUR_CLOSE = 0.24;
  const EASE_OPEN = "cubic-bezier(0.22, 1, 0.36, 1)";
  const EASE_CLOSE = "cubic-bezier(0.32, 0.72, 0, 1)";
  const dur = open ? DUR_OPEN : DUR_CLOSE;
  const ease = open ? EASE_OPEN : EASE_CLOSE;

  // 卡片受预览容器约束：减去 32×2 padding + 标题 28 + gap 32
  const CARD_CHROME = 32 * 2 + 28 + 32;
  const expandedBodyH = availH > 0 ? Math.max(60, availH - CARD_CHROME) : 0;
  const targetH = Math.min(fullH || 0, expandedBodyH || 0);

  // 一行正文高度 = 16px * 1.6 ≈ 25.6px
  const LINE_H = 26;

  const onToggle = () => {
    setAnimating(true);
    setOpen((o) => !o);
  };
  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === "max-height") setAnimating(false);
  };

  const bodyFont: React.CSSProperties = {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif",
    fontWeight: 300,
    fontSize: 16,
    lineHeight: 1.6,
    letterSpacing: "-0.01em",
    color: "#111111",
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full flex items-center justify-center select-none"
    >
      <div
        className="cursor-pointer w-full max-w-[528px]"
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          boxShadow:
            "0 1px 2px rgba(17,17,17,0.04), 0 12px 28px rgba(17,17,17,0.06)",
          contain: "layout paint",
          maxHeight: "100%",
        }}
        onClick={onToggle}
      >
        <div
          style={{
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            gap: open ? 32 : 16,
            transition: `gap ${dur}s ${ease}`,
          }}
        >
          {/* 标题 —— matched geometry 的"锚"，始终不变 */}
          <div
            style={{
              fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif",
              fontWeight: 600,
              fontSize: 24,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "#111111",
            }}
          >
            小さな習慣が、人生の輪郭をつくる
          </div>

          {/* 正文区：CSS Grid 同格叠放，max-height 单一动画 */}
          <div
            onTransitionEnd={onTransitionEnd}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "auto",
              maxHeight: open ? targetH : LINE_H,
              overflow: "hidden",
              transition: `max-height ${dur}s ${ease}`,
              willChange: animating ? "max-height" : "auto",
              contain: "layout paint",
            }}
          >
            {/* 单行截断 */}
            <div
              style={{
                gridColumn: "1 / 2",
                gridRow: "1 / 2",
                ...bodyFont,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                opacity: open ? 0 : 1,
                transition: open
                  ? `opacity ${DUR_OPEN * 0.4}s ${EASE_OPEN}`
                  : `opacity ${DUR_CLOSE * 0.5}s ${EASE_CLOSE} ${DUR_CLOSE * 0.5}s`,
              }}
            >
              私たちは大きな決断や劇的な変化に目を向けがちですが、実際に日々を形づくっているのは...
            </div>

            {/* 展开完整正文 */}
            <div
              ref={fullRef}
              style={{
                gridColumn: "1 / 2",
                gridRow: "1 / 2",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                opacity: open ? 1 : 0,
                transition: open
                  ? `opacity ${DUR_OPEN * 0.6}s ${EASE_OPEN} ${DUR_OPEN * 0.4}s`
                  : `opacity ${DUR_CLOSE * 0.5}s ${EASE_CLOSE}`,
              }}
            >
              <p style={{ ...bodyFont, margin: 0 }}>
                私たちは大きな決断や劇的な変化に目を向けがちですが、実際に日々を形づくっているのは、目立たない小さな習慣です。朝起きてから最初に手に取るもの、移動中に何を考えるか、寝る前にどんな言葉を自分にかけるか――それらの積み重ねが、数ヶ月後、数年後の自分を静かに方向づけていきます。
              </p>
              <p style={{ ...bodyFont, margin: 0 }}>
                習慣は一度に変える必要はありません。むしろ、一気に変えようとすると続かないことが多いです。大切なのは、「これなら毎日できる」と思える最小単位に分解することです。たとえば「毎日1時間勉強する」ではなく、「毎日5分だけ机に向かう」と決める。その5分がやがて10分になり、気づけば習慣として根付いていきます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
