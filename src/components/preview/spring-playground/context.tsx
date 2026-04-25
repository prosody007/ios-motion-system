"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useCardParams } from "@/components/card-context";

/* preview 与 controls 共用的舞台常量 */
export const STAGE_BALL = 64;
export const STAGE_PAD_X = 32;

export type Preset = {
  key: string;
  label: string;
  response: number;
  damping: number;
};

export const SPRING_PRESETS: Preset[] = [
  { key: "smooth", label: ".smooth", response: 0.6, damping: 1.0 },
  { key: "snappy", label: ".snappy", response: 0.35, damping: 0.85 },
  { key: "bouncy", label: ".bouncy", response: 0.5, damping: 0.7 },
  { key: "interactive", label: ".interactive", response: 0.28, damping: 0.86 },
  { key: "critical", label: "critical", response: 0.5, damping: 1.0 },
  { key: "overshoot", label: "overshoot", response: 0.5, damping: 0.3 },
];

export type Prop = "translate" | "scale" | "rotate";

export type PropValues = {
  translate: number; // px
  scale: number; // multiplier at endpoint
  rotate: number; // degrees at endpoint
};

export const PROP_RANGES: Record<
  Prop,
  { min: number; max: number; step: number; unit: string; defaultValue: number }
> = {
  /* translate.max / defaultValue 是占位 — 实际由舞台宽度动态计算 */
  translate: { min: 0, max: 240, step: 4, unit: "px", defaultValue: 0 },
  scale: { min: 1.0, max: 1.6, step: 0.02, unit: "×", defaultValue: 1.2 },
  rotate: { min: -180, max: 180, step: 1, unit: "°", defaultValue: 10 },
};

export function formatPropValue(prop: Prop, v: number) {
  const r = PROP_RANGES[prop];
  if (prop === "scale") return `${v.toFixed(2)}${r.unit}`;
  if (prop === "rotate") return `${v.toFixed(0)}${r.unit}`;
  return `${v.toFixed(0)}${r.unit}`;
}

interface PlaygroundCtx {
  response: number;
  damping: number;
  props: Record<Prop, boolean>;
  values: PropValues;
  duration: number;
  stiffness: number;
  dampingCoef: number;
  bounce: number;
  activePreset: Preset | undefined;
  /** 当前舞台 px 宽度（由 preview 测量并回报） */
  stageW: number;
  /** translate 滑杆的最大值 = 舞台允许的最远移动距离（已扣除 ball × 当前 scale） */
  safeMaxTranslate: number;
  setStageW: (w: number) => void;
  // 触发动画播放的计数器（每变一次，preview 重放一次）
  playToken: number;
  setResponse: (n: number) => void;
  setDamping: (n: number) => void;
  setPropValue: (k: Prop, v: number) => void;
  toggleProp: (k: Prop) => void;
  pickPreset: (p: Preset) => void;
  replay: () => void;
}

const Ctx = createContext<PlaygroundCtx | null>(null);

export function SpringPlaygroundProvider({ children }: { children: ReactNode }) {
  const [response, setResponse] = useState(0.5);
  const [damping, setDamping] = useState(0.7);
  const [props, setProps] = useState<Record<Prop, boolean>>({
    translate: true,
    scale: true,
    rotate: false,
  });
  const [values, setValues] = useState<PropValues>({
    translate: PROP_RANGES.translate.defaultValue,
    scale: PROP_RANGES.scale.defaultValue,
    rotate: PROP_RANGES.rotate.defaultValue,
  });
  const [stageW, setStageW] = useState(0);
  const [playToken, setPlayToken] = useState(0);

  /* 欠阻尼弹簧的最大过冲比例（标准 2 阶系统公式）：
     overshoot = exp(-d·π / √(1-d²))
     · damping 0.3 → 1.37  · damping 0.7 → 1.05  · damping ≥ 1.0 → 1.0 */
  const overshootFactor = useMemo(() => {
    if (damping >= 1) return 1;
    const ratio = Math.exp(
      (-damping * Math.PI) /
        Math.sqrt(Math.max(0.0001, 1 - damping * damping))
    );
    return 1 + Math.min(0.5, ratio);
  }, [damping]);

  /* 舞台允许的最远 translate：
     按基础球径计算 → 静止时球的左右边距严格等于 STAGE_PAD_X，
     再除以 overshoot 把弹抖控制在视图内（scale 引发的临时膨胀
     由外层 preview 容器的 padding 缓冲，不参与几何） */
  const safeMaxTranslate = useMemo(() => {
    if (stageW <= 0) return 0;
    const rawHeadroom = stageW - STAGE_PAD_X * 2 - STAGE_BALL;
    return Math.max(0, rawHeadroom / overshootFactor);
  }, [stageW, overshootFactor]);

  /* 首次拿到舞台宽度时，把默认 translate 设为 safeMax（终点贴右侧）；
     若用户没手动调过、并且 scale 让 safeMax 缩小，自动回缩贴齐 */
  const userTouchedTranslateRef = useRef(false);
  useEffect(() => {
    if (safeMaxTranslate <= 0) return;
    setValues((v) => {
      if (!userTouchedTranslateRef.current) {
        return v.translate === safeMaxTranslate
          ? v
          : { ...v, translate: safeMaxTranslate };
      }
      // 用户已调过 → 仅在超出新上限时回缩
      return v.translate > safeMaxTranslate
        ? { ...v, translate: safeMaxTranslate }
        : v;
    });
  }, [safeMaxTranslate]);

  const duration = useMemo(
    () => Math.min(2.8, Math.max(0.7, response * 2.6 + 0.3)),
    [response]
  );

  const omega = (2 * Math.PI) / response;
  const stiffness = Math.round(omega * omega);
  const dampingCoef = Math.round(2 * damping * omega * 10) / 10;
  const bounce = Math.max(0, 1 - damping);

  const activePreset = useMemo(
    () =>
      SPRING_PRESETS.find(
        (p) =>
          Math.abs(p.response - response) < 0.015 &&
          Math.abs(p.damping - damping) < 0.015
      ),
    [response, damping]
  );

  const toggleProp = useCallback(
    (k: Prop) => setProps((p) => ({ ...p, [k]: !p[k] })),
    []
  );
  const setPropValue = useCallback((k: Prop, v: number) => {
    if (k === "translate") userTouchedTranslateRef.current = true;
    setValues((prev) => (prev[k] === v ? prev : { ...prev, [k]: v }));
  }, []);
  const pickPreset = useCallback((p: Preset) => {
    setResponse(p.response);
    setDamping(p.damping);
  }, []);
  const replay = useCallback(() => setPlayToken((t) => t + 1), []);

  // 参数变化时自动回放（带轻微 debounce，避免拖滑杆时狂闪）
  useEffect(() => {
    const t = window.setTimeout(() => setPlayToken((v) => v + 1), 160);
    return () => clearTimeout(t);
  }, [
    response,
    damping,
    props.translate,
    props.scale,
    props.rotate,
    values.translate,
    values.scale,
    values.rotate,
  ]);

  // ---- 把当前参数注入 code template ----
  const swiftProps = useMemo(() => {
    const lines: string[] = [];
    if (props.translate)
      lines.push(`    .offset(x: moved ? ${values.translate.toFixed(0)} : 0)`);
    if (props.scale)
      lines.push(
        `    .scaleEffect(moved ? ${values.scale.toFixed(2)} : 1.0)`
      );
    if (props.rotate)
      lines.push(
        `    .rotationEffect(.degrees(moved ? ${values.rotate.toFixed(0)} : 0))`
      );
    return lines.join("\n");
  }, [
    props.translate,
    props.scale,
    props.rotate,
    values.translate,
    values.scale,
    values.rotate,
  ]);

  const uikitProps = useMemo(() => {
    const ops: string[] = [];
    if (props.translate)
      ops.push(`        .translatedBy(x: ${values.translate.toFixed(0)}, y: 0)`);
    if (props.scale)
      ops.push(
        `        .scaledBy(x: ${values.scale.toFixed(2)}, y: ${values.scale.toFixed(2)})`
      );
    if (props.rotate)
      ops.push(
        `        .rotated(by: .pi * ${values.rotate.toFixed(0)} / 180)`
      );
    if (ops.length === 0) return "    // 无勾选的属性";
    return `    self.box.transform = CGAffineTransform.identity\n${ops.join("\n")}`;
  }, [
    props.translate,
    props.scale,
    props.rotate,
    values.translate,
    values.scale,
    values.rotate,
  ]);

  const { setParam } = useCardParams();
  useEffect(() => {
    setParam("response", response.toFixed(2));
    setParam("damping", damping.toFixed(2));
    setParam("bounce", bounce.toFixed(2));
    setParam("stiffness", String(stiffness));
    setParam("dampingCoef", dampingCoef.toFixed(1));
    setParam("duration", duration.toFixed(2));
    setParam("swiftProps", swiftProps);
    setParam("uikitProps", uikitProps);
  }, [
    response,
    damping,
    bounce,
    stiffness,
    dampingCoef,
    duration,
    swiftProps,
    uikitProps,
    setParam,
  ]);

  const value: PlaygroundCtx = {
    response,
    damping,
    props,
    values,
    duration,
    stiffness,
    dampingCoef,
    bounce,
    activePreset,
    stageW,
    safeMaxTranslate,
    setStageW,
    playToken,
    setResponse,
    setDamping,
    setPropValue,
    toggleProp,
    pickPreset,
    replay,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSpringPlayground() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSpringPlayground must be used inside SpringPlaygroundProvider");
  return v;
}
