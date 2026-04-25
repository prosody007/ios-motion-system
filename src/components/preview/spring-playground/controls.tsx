"use client";

import {
  PROP_RANGES,
  SPRING_PRESETS,
  formatPropValue,
  useSpringPlayground,
  type Prop,
} from "./context";

const BLUE = "#007AFF";
const INK = "rgba(0,0,0,0.82)";
const SUB = "rgba(0,0,0,0.5)";

export function SpringPlaygroundControls() {
  const {
    response,
    damping,
    props,
    values,
    stiffness,
    dampingCoef,
    bounce,
    activePreset,
    setResponse,
    setDamping,
    setPropValue,
    toggleProp,
    pickPreset,
  } = useSpringPlayground();

  return (
    <div className="flex flex-col gap-4">
      <CustomizePanel
        response={response}
        damping={damping}
        props={props}
        values={values}
        stiffness={stiffness}
        dampingCoef={dampingCoef}
        bounce={bounce}
        activePreset={activePreset}
        setResponse={setResponse}
        setDamping={setDamping}
        setPropValue={setPropValue}
        toggleProp={toggleProp}
        pickPreset={pickPreset}
      />
      <ReferencePanel />
    </div>
  );
}

/* ============ Customize Panel ============ */
type CustomizeProps = ReturnType<typeof useSpringPlayground>;

function CustomizePanel({
  response,
  damping,
  props,
  values,
  stiffness,
  dampingCoef,
  bounce,
  activePreset,
  setResponse,
  setDamping,
  setPropValue,
  toggleProp,
  pickPreset,
}: Pick<
  CustomizeProps,
  | "response"
  | "damping"
  | "props"
  | "values"
  | "stiffness"
  | "dampingCoef"
  | "bounce"
  | "activePreset"
  | "setResponse"
  | "setDamping"
  | "setPropValue"
  | "toggleProp"
  | "pickPreset"
>) {
  return (
    <div
      className="rounded-xl px-5 py-5 flex flex-col gap-5"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* 顶栏：标题 + 物理读数 */}
      <div className="flex items-center justify-between gap-3">
        <SectionTitle>Customize</SectionTitle>
        <span
          className="text-xs font-mono tabular-nums"
          style={{ color: SUB }}
        >
          k={stiffness} · c={dampingCoef} · bounce={bounce.toFixed(2)}
        </span>
      </div>

      {/* 预设 chips */}
      <div className="flex flex-wrap gap-1.5">
        {SPRING_PRESETS.map((p) => {
          const active = activePreset?.key === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => pickPreset(p)}
              style={chipStyle(active)}
            >
              {p.label}
            </button>
          );
        })}
        {!activePreset && <span style={chipStyle(true)}>custom</span>}
      </div>

      {/* response & damping 滑杆 */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        <SpringSlider
          label="response"
          value={response}
          min={0.15}
          max={0.9}
          step={0.01}
          display={`${response.toFixed(2)}s`}
          onChange={setResponse}
        />
        <SpringSlider
          label="damping"
          value={damping}
          min={0.3}
          max={1.2}
          step={0.01}
          display={damping.toFixed(2)}
          onChange={setDamping}
        />
      </div>

      {/* drive section —— translate 只给开关（距离由舞台自适应），scale / rotate 保留数值 */}
      <div className="flex flex-col gap-2.5">
        <SectionTitle>Drive</SectionTitle>
        <ToggleRow
          label="translate"
          active={props.translate}
          hint="auto · 舞台宽度"
          onToggle={() => toggleProp("translate")}
        />
        {(["scale", "rotate"] as const).map((k) => {
          const range = PROP_RANGES[k];
          return (
            <PropRow
              key={k}
              label={k}
              active={props[k]}
              value={values[k]}
              min={range.min}
              max={range.max}
              step={range.step}
              display={formatPropValue(k, values[k])}
              onToggle={() => toggleProp(k)}
              onChange={(v) => setPropValue(k, v)}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ============ Reference Panel — 参数说明表 ============ */
type LegendRow = {
  name: string;
  type: string;
  value: string;
  desc: string;
  dim?: boolean;
};

const TABLE_COLS =
  "minmax(120px, auto) minmax(120px, auto) minmax(88px, auto) minmax(0, 1fr)";
const ROW_PAD = "14px 18px";
const DIVIDER = "1px solid rgba(0,0,0,0.06)";

function ReferencePanel() {
  /**
   * 静态参数说明表（类 API docs）。当前值不在这里显示——
   * 实时读数放在 Customize 顶栏（k / c / bounce）和下方代码面板里。
   */
  const rows: LegendRow[] = [
    {
      name: "response",
      type: "number · s",
      value: "0.50",
      desc: "弹簧的整体周期，越大越慢、振幅越大",
    },
    {
      name: "damping",
      type: "number · ratio",
      value: "0.80",
      desc: "阻尼比 ζ：=1 临界（无过冲），越小越弹",
    },
    {
      name: "bounce",
      type: "number · ratio",
      value: "0.20",
      desc: "iOS 17+ 写法的过冲量，等于 1 − damping",
    },
    {
      name: "stiffness (k)",
      type: "number · rad²/s²",
      value: "derived",
      desc: "恢复力 ω²·m，由 response 反推",
    },
    {
      name: "damping (c)",
      type: "number · kg/s",
      value: "derived",
      desc: "能量耗散 2·ζ·ω·m，由 response 与 damping 反推",
    },
    {
      name: "duration",
      type: "number · s",
      value: "derived",
      desc: "估算的整段动画时长，约等于收敛时间",
    },
    {
      name: "translate",
      type: "number · px",
      value: "auto",
      desc: "终点水平位移；启用时自动填满舞台宽度（.offset / translatedBy）",
    },
    {
      name: "scale",
      type: "number · ratio",
      value: "1.00",
      desc: "终点的缩放倍率，1.00 = 不缩放",
    },
    {
      name: "rotate",
      type: "number · °",
      value: "0",
      desc: "终点的旋转角度，正值顺时针",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="px-0.5">
        <SectionTitle>Reference</SectionTitle>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: TABLE_COLS,
            columnGap: 20,
            padding: "12px 18px",
            borderBottom: DIVIDER,
          }}
        >
          <HeaderCell>Property</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell>Default</HeaderCell>
          <HeaderCell>Description</HeaderCell>
        </div>

        {/* Body */}
        {rows.map((row, i) => (
          <div
            key={row.name}
            className="grid items-center"
            style={{
              gridTemplateColumns: TABLE_COLS,
              columnGap: 20,
              padding: ROW_PAD,
              borderTop: i === 0 ? undefined : DIVIDER,
            }}
          >
            <div>
              <Pill variant="prop" dim={row.dim}>
                {row.name}
              </Pill>
            </div>
            <span
              className="text-xs font-mono"
              style={{
                color: row.dim ? "rgba(0,0,0,0.32)" : SUB,
              }}
            >
              {row.type}
            </span>
            <div>
              <Pill variant="value" dim={row.dim}>
                {row.value}
              </Pill>
            </div>
            <span
              className="text-xs leading-[1.55]"
              style={{ color: row.dim ? "rgba(0,0,0,0.32)" : INK }}
            >
              {row.desc}
            </span>
          </div>
        ))}
      </div>

      <p
        className="text-xs leading-[1.6] m-0 px-0.5"
        style={{ color: SUB }}
      >
        三种等价写法（同一条弹簧）：
        <span style={{ color: INK }}> response + damping</span>（经典） ／
        <span style={{ color: INK }}> duration + bounce</span>（iOS 17+ 直观） ／
        <span style={{ color: INK }}> stiffness + damping coef</span>（直接物理参数，CASpringAnimation）。
      </p>
    </div>
  );
}

/* ---------------- 通用 16px 加粗小节标题 ---------------- */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4
      className="m-0 font-semibold"
      style={{
        color: INK,
        fontSize: 16,
        lineHeight: "24px",
        letterSpacing: 0.1,
      }}
    >
      {children}
    </h4>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs font-medium"
      style={{
        color: SUB,
        letterSpacing: 0.3,
      }}
    >
      {children}
    </span>
  );
}

function Pill({
  variant,
  dim,
  children,
}: {
  variant: "prop" | "value";
  dim?: boolean;
  children: React.ReactNode;
}) {
  // 参考图里 prop / default 两种 chip 外观一致 —— 同 bg 同字色。
  // 我们在 prop 上加 iOS 蓝字色区分「这是参数名」，value 保持中性深色。
  const bg = dim ? "#F5F6FA" : "#F3F4F9";
  const color = dim
    ? "rgba(0,0,0,0.38)"
    : variant === "prop"
      ? BLUE
      : "#111111";
  return (
    <span
      style={{
        display: "inline-block",
        background: bg,
        color,
        padding: "3px 9px",
        borderRadius: 6,
        fontSize: 12,
        lineHeight: "16px",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    borderRadius: 999,
    padding: "5px 14px",
    fontSize: 12,
    lineHeight: "16px",
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
    cursor: "pointer",
    transition: "all 120ms ease",
    userSelect: "none",
    background: active ? BLUE : "#FFFFFF",
    color: active ? "#FFFFFF" : "#111111",
    border: `1px solid ${active ? BLUE : "rgba(0,0,0,0.12)"}`,
  };
}

/* ---------------- 只有开关的属性行（translate 专用） ---------------- */
function ToggleRow({
  label,
  active,
  hint,
  onToggle,
}: {
  label: string;
  active: boolean;
  hint: string;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center"
        style={{
          ...chipStyle(active),
          width: 104,
          justifyContent: "center",
        }}
      >
        {label}
      </button>
      <span
        className="text-xs font-mono tabular-nums"
        style={{
          color: active ? SUB : "rgba(0,0,0,0.3)",
        }}
      >
        {hint}
      </span>
    </div>
  );
}

/* ---------------- 属性行：toggle + 当前值 + 滑杆 ---------------- */
function PropRow({
  label,
  active,
  value,
  min,
  max,
  step,
  display,
  onToggle,
  onChange,
}: {
  label: string;
  active: boolean;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onToggle: () => void;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center"
        style={{
          ...chipStyle(active),
          width: 104,
          justifyContent: "center",
        }}
      >
        {label}
      </button>
      <span
        className="text-xs font-mono tabular-nums shrink-0 text-right"
        style={{
          color: active ? INK : "rgba(0,0,0,0.3)",
          width: 56,
        }}
      >
        {display}
      </span>
      <ValueSlider
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={!active}
        onChange={onChange}
      />
    </div>
  );
}

/* ---------------- 主参数滑杆（response / damping） ---------------- */
function SpringSlider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="text-xs font-mono shrink-0"
        style={{ color: SUB, width: 64 }}
      >
        {label}
      </span>
      <ValueSlider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
      <span
        className="text-xs font-mono tabular-nums shrink-0 text-right"
        style={{ color: INK, width: 50 }}
      >
        {display}
      </span>
    </div>
  );
}

/* ---------------- 通用滑杆 ---------------- */
function ValueSlider({
  value,
  min,
  max,
  step,
  disabled = false,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackBg = disabled ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.08)";
  const fill = disabled ? "rgba(0,0,0,0.18)" : BLUE;
  const knobBorder = disabled ? "rgba(0,0,0,0.18)" : BLUE;
  return (
    <div className="relative flex-1" style={{ height: 22 }}>
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
        style={{ height: 4, borderRadius: 999, background: trackBg }}
      />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2"
        style={{
          height: 4,
          width: `${pct}%`,
          borderRadius: 999,
          background: fill,
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0"
        style={{
          height: 22,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `calc(${pct}% - 8px)`,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#FFFFFF",
          border: `2px solid ${knobBorder}`,
          boxShadow: disabled ? "none" : "0 2px 4px rgba(0,0,0,0.12)",
          opacity: disabled ? 0.6 : 1,
        }}
      />
    </div>
  );
}
