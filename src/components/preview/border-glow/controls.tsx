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

const TABLE_COLS =
  "minmax(120px, auto) minmax(120px, auto) minmax(88px, auto) minmax(0, 1fr)";
const ROW_PAD = "14px 18px";
const DIVIDER = "1px solid rgba(0,0,0,0.06)";

export function BorderGlowControls() {
  return (
    <div className="flex flex-col gap-4">
      <CustomizePanel />
      <ReferencePanel />
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

function ReferencePanel() {
  const rows = [
    {
      name: "duration",
      type: "number · s",
      value: "4.0",
      desc: "一周完整旋转的时长，越大越慢",
    },
    {
      name: "borderWidth",
      type: "number · px",
      value: "2",
      desc: "锐利边框（彩环）的厚度",
    },
    {
      name: "glowSize",
      type: "number · px",
      value: "48",
      desc: "外晕的模糊半径，0 时完全无外晕",
    },
    {
      name: "glowOpacity",
      type: "number · 0–1",
      value: "0.35",
      desc: "外晕透明度",
    },
    {
      name: "borderRadius",
      type: "number · px",
      value: "20",
      desc: "卡片圆角；外环圆角 = 此值 + borderWidth",
    },
    {
      name: "palette",
      type: "enum",
      value: "aurora",
      desc: "色板：aurora / sunset / neon / mono / custom",
    },
    {
      name: "colors",
      type: "string[]",
      value: "—",
      desc: "选择 custom 时生效，2–8 个色标，建议首末同色形成闭环",
    },
    {
      name: "direction",
      type: "enum",
      value: "normal",
      desc: "旋转方向：normal 顺时针 · reverse 逆时针",
    },
    {
      name: "paused",
      type: "boolean",
      value: "false",
      desc: "暂停动画，默认 false（自动播放）",
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
              <Pill variant="prop">{row.name}</Pill>
            </div>
            <span
              className="text-xs font-mono"
              style={{ color: SUB }}
            >
              {row.type}
            </span>
            <div>
              <Pill variant="value">{row.value}</Pill>
            </div>
            <span
              className="text-xs leading-[1.55]"
              style={{ color: INK }}
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
        基于 CSS{" "}
        <code style={{ color: INK }}>@property</code> 注册一个{" "}
        <code style={{ color: INK }}>&lt;angle&gt;</code> 自定义属性，配合{" "}
        <code style={{ color: INK }}>conic-gradient(from var(--bg-angle), ...)</code>{" "}
        与{" "}
        <code style={{ color: INK }}>@keyframes</code>{" "}
        让浏览器原生插值角度，纯 CSS 即可旋转，无需 JS。
      </p>
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

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs font-medium"
      style={{ color: SUB, letterSpacing: 0.3 }}
    >
      {children}
    </span>
  );
}

function Pill({
  variant,
  children,
}: {
  variant: "prop" | "value";
  children: React.ReactNode;
}) {
  const color = variant === "prop" ? BLUE : "#111111";
  return (
    <span
      style={{
        display: "inline-block",
        background: "#F3F4F9",
        color,
        padding: "3px 9px",
        borderRadius: 6,
        fontSize: 12,
        lineHeight: "16px",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
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
