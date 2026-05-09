"use client";

import {
  BORDER_GLOW_PRESETS,
  useBorderGlow,
  type PaletteKey,
  type PresetKey,
} from "./context";

const BLUE = "#007AFF";
const INK = "rgba(0,0,0,0.82)";
const SUB = "rgba(0,0,0,0.5)";

export function BorderGlowControls() {
  return (
    <div className="flex flex-col gap-4">
      <CustomizePanel />
    </div>
  );
}

function CustomizePanel() {
  const c = useBorderGlow();
  const presetKeys = Object.keys(BORDER_GLOW_PRESETS) as PresetKey[];

  return (
    <div
      className="rounded-xl px-5 py-5 flex flex-col gap-5"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <SectionTitle>Customize</SectionTitle>
        <button
          type="button"
          onClick={c.reset}
          className="text-xs"
          style={{
            color: SUB,
            background: "transparent",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 999,
            padding: "4px 12px",
            cursor: "pointer",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          }}
        >
          Reset
        </button>
      </div>

      {/* Palette chips */}
      <div className="flex flex-wrap gap-1.5">
        {presetKeys.map((k) => {
          const p = BORDER_GLOW_PRESETS[k];
          const active = c.palette === k;
          return (
            <PaletteChip
              key={k}
              active={active}
              colors={[...p.colors]}
              label={p.label}
              onClick={() => c.setPalette(k as PaletteKey)}
            />
          );
        })}
        <PaletteChip
          active={c.palette === "custom"}
          colors={c.customColors}
          label="Custom"
          onClick={() => c.setPalette("custom")}
        />
      </div>

      {/* Custom color editor */}
      {c.palette === "custom" && (
        <div
          className="rounded-lg flex flex-col gap-3"
          style={{
            background: "#F8F9FC",
            border: "1px solid rgba(0,0,0,0.05)",
            padding: "12px 14px",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-mono"
              style={{ color: SUB }}
            >
              colors[]
            </span>
            <div className="flex items-center gap-1">
              <StepperBtn
                disabled={c.customColors.length <= 2}
                onClick={() =>
                  c.setCustomColorCount(c.customColors.length - 1)
                }
              >
                −
              </StepperBtn>
              <span
                className="text-xs font-mono tabular-nums"
                style={{ color: INK, width: 18, textAlign: "center" }}
              >
                {c.customColors.length}
              </span>
              <StepperBtn
                disabled={c.customColors.length >= 8}
                onClick={() =>
                  c.setCustomColorCount(c.customColors.length + 1)
                }
              >
                +
              </StepperBtn>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {c.customColors.map((col, i) => (
              <ColorSwatch
                key={i}
                value={col}
                index={i}
                onChange={(v) => c.setCustomColor(i, v)}
              />
            ))}
          </div>
          <p
            className="text-xs leading-[1.55] m-0"
            style={{ color: SUB }}
          >
            首末同色可让色环平滑闭环。conic-gradient 会按等距分配色标。
          </p>
        </div>
      )}

      {/* Sliders */}
      <div className="flex flex-col gap-2.5">
        <SliderRow
          label="duration"
          value={c.duration}
          min={0.5}
          max={10}
          step={0.1}
          display={`${c.duration.toFixed(1)}s`}
          onChange={c.setDuration}
        />
        <SliderRow
          label="borderWidth"
          value={c.borderWidth}
          min={1}
          max={8}
          step={1}
          display={`${c.borderWidth}px`}
          onChange={c.setBorderWidth}
        />
        <SliderRow
          label="glowSize"
          value={c.glowSize}
          min={0}
          max={120}
          step={1}
          display={`${c.glowSize}px`}
          onChange={c.setGlowSize}
        />
        <SliderRow
          label="glowOpacity"
          value={c.glowOpacity}
          min={0}
          max={1}
          step={0.05}
          display={c.glowOpacity.toFixed(2)}
          onChange={c.setGlowOpacity}
        />
        <SliderRow
          label="borderRadius"
          value={c.borderRadius}
          min={0}
          max={48}
          step={1}
          display={`${c.borderRadius}px`}
          onChange={c.setBorderRadius}
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            c.setDirection(c.direction === "normal" ? "reverse" : "normal")
          }
          style={chipStyle(c.direction === "reverse")}
        >
          {c.direction === "normal" ? "Clockwise" : "Counter-clockwise"}
        </button>
        <button
          type="button"
          onClick={() => c.setPaused(!c.paused)}
          style={chipStyle(c.paused)}
        >
          {c.paused ? "Paused" : "Auto-play"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- shared atoms ---------------- */

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
      "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    cursor: "pointer",
    transition: "all 120ms ease",
    userSelect: "none",
    background: active ? BLUE : "#FFFFFF",
    color: active ? "#FFFFFF" : "#111111",
    border: `1px solid ${active ? BLUE : "rgba(0,0,0,0.12)"}`,
  };
}

function PaletteChip({
  active,
  colors,
  label,
  onClick,
}: {
  active: boolean;
  colors: string[];
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} style={chipStyle(active)}>
      <span className="inline-flex items-center gap-1.5">
        <span
          aria-hidden
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: `conic-gradient(from 0deg, ${colors.join(", ")})`,
            display: "inline-block",
            border: active
              ? "1px solid rgba(255,255,255,0.6)"
              : "1px solid rgba(0,0,0,0.08)",
          }}
        />
        {label}
      </span>
    </button>
  );
}

function ColorSwatch({
  value,
  index,
  onChange,
}: {
  value: string;
  index: number;
  onChange: (v: string) => void;
}) {
  return (
    <label
      className="relative inline-flex items-center gap-2 cursor-pointer"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 8,
        padding: "5px 10px 5px 6px",
      }}
      title={`color ${index + 1}`}
    >
      <span
        aria-hidden
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          background: value,
          border: "1px solid rgba(0,0,0,0.08)",
          display: "inline-block",
        }}
      />
      <span
        className="text-xs font-mono tabular-nums"
        style={{ color: INK }}
      >
        {value.toUpperCase()}
      </span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
        aria-label={`color ${index + 1}`}
      />
    </label>
  );
}

function StepperBtn({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#FFFFFF",
        color: disabled ? "rgba(0,0,0,0.3)" : INK,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 14,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function SliderRow({
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
        style={{ color: SUB, width: 96 }}
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
        style={{ color: INK, width: 56 }}
      >
        {display}
      </span>
    </div>
  );
}

function ValueSlider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative flex-1" style={{ height: 22 }}>
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
        style={{
          height: 4,
          borderRadius: 999,
          background: "rgba(0,0,0,0.08)",
        }}
      />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2"
        style={{
          height: 4,
          width: `${pct}%`,
          borderRadius: 999,
          background: BLUE,
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0"
        style={{ height: 22, cursor: "pointer" }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `calc(${pct}% - 8px)`,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#FFFFFF",
          border: `2px solid ${BLUE}`,
          boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
        }}
      />
    </div>
  );
}
