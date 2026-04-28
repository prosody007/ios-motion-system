"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useCardParams } from "@/components/card-context";

export const BORDER_GLOW_PRESETS = {
  aurora: {
    label: "Aurora",
    colors: ["#22d3ee", "#a855f7", "#3b82f6", "#22d3ee"],
  },
  sunset: {
    label: "Sunset",
    colors: ["#fbbf24", "#fb923c", "#ef4444", "#ec4899", "#fbbf24"],
  },
  neon: {
    label: "Neon",
    colors: ["#22d3ee", "#ec4899", "#facc15", "#22d3ee"],
  },
  mono: {
    label: "Mono",
    colors: ["#0f172a", "#475569", "#cbd5e1", "#475569", "#0f172a"],
  },
} as const;

export type PresetKey = keyof typeof BORDER_GLOW_PRESETS;
export type PaletteKey = PresetKey | "custom";
export type SpinDirection = "normal" | "reverse";

const DEFAULT_CUSTOM_COLORS = [
  "#FF3D81",
  "#7B5BFF",
  "#22D3EE",
  "#FF3D81",
];

interface Ctx {
  duration: number;
  borderWidth: number;
  glowSize: number;
  glowOpacity: number;
  borderRadius: number;
  palette: PaletteKey;
  customColors: string[];
  /** 当前实际生效的色板 — 已合并 preset / custom */
  activeColors: string[];
  direction: SpinDirection;
  paused: boolean;
  setDuration: (n: number) => void;
  setBorderWidth: (n: number) => void;
  setGlowSize: (n: number) => void;
  setGlowOpacity: (n: number) => void;
  setBorderRadius: (n: number) => void;
  setPalette: (k: PaletteKey) => void;
  setCustomColor: (index: number, color: string) => void;
  setCustomColorCount: (n: number) => void;
  setDirection: (d: SpinDirection) => void;
  setPaused: (p: boolean) => void;
  reset: () => void;
}

const DEFAULTS = {
  duration: 4,
  borderWidth: 2,
  glowSize: 48,
  glowOpacity: 0.35,
  borderRadius: 20,
  palette: "aurora" as PaletteKey,
  direction: "normal" as SpinDirection,
  paused: false,
};

const C = createContext<Ctx | null>(null);

export function BorderGlowProvider({ children }: { children: ReactNode }) {
  const [duration, setDuration] = useState(DEFAULTS.duration);
  const [borderWidth, setBorderWidth] = useState(DEFAULTS.borderWidth);
  const [glowSize, setGlowSize] = useState(DEFAULTS.glowSize);
  const [glowOpacity, setGlowOpacity] = useState(DEFAULTS.glowOpacity);
  const [borderRadius, setBorderRadius] = useState(DEFAULTS.borderRadius);
  const [palette, setPalette] = useState<PaletteKey>(DEFAULTS.palette);
  const [customColors, setCustomColors] = useState<string[]>(
    DEFAULT_CUSTOM_COLORS,
  );
  const [direction, setDirection] = useState<SpinDirection>(DEFAULTS.direction);
  const [paused, setPaused] = useState(DEFAULTS.paused);

  const setCustomColor = useCallback((index: number, color: string) => {
    setCustomColors((prev) => {
      const next = [...prev];
      next[index] = color;
      return next;
    });
  }, []);

  const setCustomColorCount = useCallback((n: number) => {
    setCustomColors((prev) => {
      const target = Math.max(2, Math.min(8, Math.round(n)));
      if (prev.length === target) return prev;
      if (target > prev.length) {
        const filler = prev[prev.length - 1] ?? "#FFFFFF";
        return [...prev, ...Array(target - prev.length).fill(filler)];
      }
      return prev.slice(0, target);
    });
  }, []);

  const reset = useCallback(() => {
    setDuration(DEFAULTS.duration);
    setBorderWidth(DEFAULTS.borderWidth);
    setGlowSize(DEFAULTS.glowSize);
    setGlowOpacity(DEFAULTS.glowOpacity);
    setBorderRadius(DEFAULTS.borderRadius);
    setPalette(DEFAULTS.palette);
    setCustomColors(DEFAULT_CUSTOM_COLORS);
    setDirection(DEFAULTS.direction);
    setPaused(DEFAULTS.paused);
  }, []);

  const activeColors =
    palette === "custom"
      ? customColors
      : [...BORDER_GLOW_PRESETS[palette].colors];

  const { setParam } = useCardParams();
  useEffect(() => {
    setParam("duration", duration.toFixed(1));
    setParam("borderWidth", String(borderWidth));
    setParam("glowSize", String(glowSize));
    setParam("glowOpacity", glowOpacity.toFixed(2));
    setParam("borderRadius", String(borderRadius));
    setParam("colors", activeColors.join(", "));
    setParam("colorsArray", activeColors.map((c) => `"${c}"`).join(", "));
    setParam("direction", direction);
    setParam("paused", String(paused));
  }, [
    duration,
    borderWidth,
    glowSize,
    glowOpacity,
    borderRadius,
    activeColors,
    direction,
    paused,
    setParam,
  ]);

  const value: Ctx = {
    duration,
    borderWidth,
    glowSize,
    glowOpacity,
    borderRadius,
    palette,
    customColors,
    activeColors,
    direction,
    paused,
    setDuration,
    setBorderWidth,
    setGlowSize,
    setGlowOpacity,
    setBorderRadius,
    setPalette,
    setCustomColor,
    setCustomColorCount,
    setDirection,
    setPaused,
    reset,
  };

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useBorderGlow() {
  const v = useContext(C);
  if (!v) throw new Error("useBorderGlow must be used inside BorderGlowProvider");
  return v;
}
