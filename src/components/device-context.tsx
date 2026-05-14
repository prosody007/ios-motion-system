"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DeviceKind = "phone" | "ipad";

type DeviceContextValue = {
  device: DeviceKind;
  setDevice: (next: DeviceKind) => void;
  toggleDevice: () => void;
};

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function DeviceProvider({
  children,
  initial = "phone",
}: {
  children: ReactNode;
  initial?: DeviceKind;
}) {
  const [device, setDevice] = useState<DeviceKind>(initial);

  const toggleDevice = useCallback(() => {
    setDevice((prev) => (prev === "phone" ? "ipad" : "phone"));
  }, []);

  const value = useMemo(
    () => ({ device, setDevice, toggleDevice }),
    [device, toggleDevice],
  );

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
}

export function useDevice(): DeviceContextValue {
  const ctx = useContext(DeviceContext);
  if (!ctx) {
    // 提供安全 fallback 而不是 throw，避免在未包 Provider 的边缘场景下渲染崩溃
    return {
      device: "phone",
      setDevice: () => {},
      toggleDevice: () => {},
    };
  }
  return ctx;
}
