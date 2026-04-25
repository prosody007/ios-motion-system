"use client";

import type { ComponentType, ReactNode } from "react";
import { SpringPlaygroundProvider } from "./spring-playground/context";
import { SpringPlaygroundControls } from "./spring-playground/controls";

interface ControlsEntry {
  Provider: ComponentType<{ children: ReactNode }>;
  Controls: ComponentType;
}

const controlsMap: Record<string, ControlsEntry> = {
  "ios-spring-playground": {
    Provider: SpringPlaygroundProvider,
    Controls: SpringPlaygroundControls,
  },
};

export function getControlsEntry(id?: string): ControlsEntry | undefined {
  if (!id) return undefined;
  return controlsMap[id];
}
