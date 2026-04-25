"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { springKeyframes } from "@/lib/spring-math";
import {
  STAGE_BALL,
  STAGE_PAD_X,
  useSpringPlayground,
} from "./context";

const BLUE = "#007AFF";
const SUB = "rgba(0,0,0,0.45)";

export function SpringPlaygroundPreview() {
  const {
    response,
    damping,
    props,
    values,
    duration,
    stageW,
    setStageW,
    playToken,
    replay,
  } = useSpringPlayground();

  // 每次 playToken 变化都翻转 on，触发 fwd / bwd 动画
  const [on, setOn] = useState(false);
  const lastTokenRef = useRef(playToken);
  useEffect(() => {
    if (playToken !== lastTokenRef.current) {
      lastTokenRef.current = playToken;
      setOn((v) => !v);
    }
  }, [playToken]);

  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measure = () => {
      if (stageRef.current) setStageW(stageRef.current.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [setStageW]);

  /* 实际可视移动距离 = 用户当前 translate 值（已被 context 限制在 safeMax 内） */
  const visualDistance = props.translate ? values.translate : 0;

  const rawId = useId();
  const id = `sp-play-${rawId.replace(/:/g, "")}`;

  const buildTransform = useCallback(
    (v: number) => {
      const tx = props.translate ? v * visualDistance : 0;
      const sc = props.scale ? 1 + (values.scale - 1) * v : 1;
      const rot = props.rotate ? values.rotate * v : 0;
      return `translateX(${tx}px) scale(${sc}) rotate(${rot}deg)`;
    },
    [
      props.translate,
      props.scale,
      props.rotate,
      visualDistance,
      values.scale,
      values.rotate,
    ]
  );

  const kfCss = useMemo(() => {
    if (stageW === 0) return "";
    const fwd = springKeyframes(buildTransform, {
      response,
      damping,
      duration,
    });
    const bwd = springKeyframes((v) => buildTransform(1 - v), {
      response,
      damping,
      duration,
    });
    return `@keyframes ${id}-fwd{${fwd}}@keyframes ${id}-bwd{${bwd}}`;
  }, [response, damping, duration, stageW, buildTransform, id]);

  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <style>{kfCss}</style>
      <div
        ref={stageRef}
        onClick={replay}
        className="relative w-full h-full cursor-pointer"
        style={{ background: "transparent" }}
      >
        {/* 起点圆点 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: STAGE_PAD_X + STAGE_BALL / 2 - 3,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.18)",
          }}
        />
        {/* 终点目标 — 同尺寸的虚线圆角矩形 */}
        {props.translate && visualDistance > 0 && (
          <div
            className="absolute top-1/2 pointer-events-none"
            style={{
              left: STAGE_PAD_X + visualDistance,
              width: STAGE_BALL,
              height: STAGE_BALL,
              marginTop: -STAGE_BALL / 2,
              borderRadius: 16,
              border: "1.5px dashed rgba(0,0,0,0.2)",
            }}
          />
        )}
        {/* 轨道虚线 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            left: STAGE_PAD_X + STAGE_BALL / 2,
            right: STAGE_PAD_X + STAGE_BALL / 2,
            height: 1,
            borderTop: "1px dashed rgba(0,0,0,0.08)",
          }}
        />
        {/* 动画目标（圆角矩形 + 2px 白色描边） */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: STAGE_PAD_X,
            width: STAGE_BALL,
            height: STAGE_BALL,
            marginTop: -STAGE_BALL / 2,
            borderRadius: 16,
            background: BLUE,
            border: "2px solid #FFFFFF",
            boxShadow: "0 14px 28px rgba(0,122,255,0.22)",
            transform: on ? buildTransform(1) : buildTransform(0),
            animation:
              playToken > 0 && stageW > 0
                ? `${id}-${on ? "fwd" : "bwd"} ${duration}s linear both`
                : undefined,
            willChange: "transform",
          }}
        />
        {/* 右下角 Replay 提示 */}
        <div
          className="absolute bottom-2.5 right-3 flex items-center gap-1 text-xs font-mono pointer-events-none"
          style={{ color: SUB }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          tap to replay
        </div>
      </div>
    </div>
  );
}
