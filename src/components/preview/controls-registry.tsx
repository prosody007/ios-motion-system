"use client";

import type { ComponentType, ReactNode } from "react";
import { SpringPlaygroundProvider } from "./spring-playground/context";
import { SpringPlaygroundControls } from "./spring-playground/controls";
import { BorderGlowProvider } from "./border-glow/context";
import { BorderGlowControls } from "./border-glow/controls";

interface ControlsEntry {
  Provider: ComponentType<{ children: ReactNode }>;
  Controls: ComponentType;
}

const controlsMap: Record<string, ControlsEntry> = {
  "ios-spring-playground": {
    Provider: SpringPlaygroundProvider,
    Controls: SpringPlaygroundControls,
  },
  "ios-border-glow": {
    Provider: BorderGlowProvider,
    Controls: BorderGlowControls,
  },
};

export function getControlsEntry(id?: string): ControlsEntry | undefined {
  if (!id) return undefined;
  return controlsMap[id];
}
