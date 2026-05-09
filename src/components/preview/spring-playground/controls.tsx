"use client";

import {
  PROP_RANGES,
  SPRING_PRESETS,
  formatPropValue,
  useSpringPlayground,
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
    <div className="grid grid-cols-2 gap-3">
      <CustomizePanel
        response={response}
        damping={damping}
        stiffness={stiffness}
        dampingCoef={dampingCoef}
        bounce={bounce}
        activePreset={activePreset}
        setResponse={setResponse}
        setDamping={setDamping}
        pickPreset={pickPreset}
      />
      <DrivePanel
        props={props}
        values={values}
        setPropValue={setPropValue}
        toggleProp={toggleProp}
      />
    </div>
  );
}

/* ============ Customize Panel ============ */
type CustomizeProps = ReturnType<typeof useSpringPlayground>;

function CustomizePanel({
  response,
  damping,
  stiffness,
  dampingCoef,
  bounce,
  activePreset,
  setResponse,
  setDamping,
  pickPreset,
}: Pick<
  CustomizeProps,
  | "response"
  | "damping"
  | "stiffness"
  | "dampingCoef"
  | "bounce"
  | "activePreset"
  | "setResponse"
  | "setDamping"
  | "pickPreset"
>) {
  return (
    <div
      className="rounded-xl px-4 py-4 flex flex-col gap-3"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex flex-col gap-1">
        <SectionTitle>Customize</SectionTitle>
        <span
          className="text-xs font-mono tabular-nums"
          style={{ color: SUB }}
        >
          k={stiffness} · c={dampingCoef} · bounce={bounce.toFixed(2)}
        </span>
      </div>

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

      <div className="flex flex-col gap-2.5">
        <CompactSlider
          label="response"
          value={response}
          min={0.15}
          max={0.9}
          step={0.01}
          display={`${response.toFixed(2)}s`}
          onChange={setResponse}
        />
        <CompactSlider
          label="damping"
          value={damping}
          min={0.3}
          max={1.2}
          step={0.01}
          display={damping.toFixed(2)}
          onChange={setDamping}
        />
      </div>
    </div>
  );
}

function DrivePanel({
  props,
  values,
  setPropValue,
  toggleProp,
}: Pick<CustomizeProps, "props" | "values" | "setPropValue" | "toggleProp">) {
  return (
    <div
      className="rounded-xl px-4 py-4 flex flex-col gap-3"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
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
          <PlainPropSliderRow
            key={k}
            label={k}
            value={values[k]}
            min={range.min}
            max={range.max}
            step={range.step}
            display={formatPropValue(k, values[k])}
            onChange={(v) => setPropValue(k, v)}
          />
        );
      })}
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
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center"
        style={{
          ...chipStyle(active),
          width: 90,
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
function PlainPropSliderRow({
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
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-mono shrink-0"
          style={{
            color: SUB,
          }}
        >
          {label}
        </span>
        <span
          className="text-xs font-mono tabular-nums shrink-0 text-right"
          style={{
            color: INK,
            width: 56,
          }}
        >
          {display}
        </span>
      </div>
      <ValueSlider
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={false}
        onChange={onChange}
      />
    </div>
  );
}

function CompactSlider({
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
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
      <span
        className="text-xs font-mono shrink-0"
        style={{ color: SUB }}
      >
        {label}
      </span>
      <span
        className="text-xs font-mono tabular-nums shrink-0 text-right"
          style={{ color: INK, width: 56 }}
      >
        {display}
      </span>
      </div>
      <ValueSlider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
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
