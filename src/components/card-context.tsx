"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { TemplateParams as Params } from "@/lib/template-params";
export { substituteParams } from "@/lib/template-params";

interface CardCtx {
  params: Params;
  setParam: (key: string, value: string) => void;
}

const Ctx = createContext<CardCtx | null>(null);

export function CardProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<Params>({});
  const setParam = useCallback((k: string, v: string) => {
    setParams((p) => (p[k] === v ? p : { ...p, [k]: v }));
  }, []);
  return (
    <Ctx.Provider value={{ params, setParam }}>{children}</Ctx.Provider>
  );
}

const EMPTY: CardCtx = { params: {}, setParam: () => {} };

export function useCardParams() {
  return useContext(Ctx) ?? EMPTY;
}
