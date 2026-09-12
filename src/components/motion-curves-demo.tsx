"use client";

import { useEffect, useRef, useState } from "react";
import { motionCurveTokens, motionPrinciples, type MotionCurveToken } from "@/data/motion-tokens";

const springTokens = motionCurveTokens.filter((token) => token.kind === "spring");
const timingSpringEquivalents: Record<string, { stiffness: number; damping: number; mass: number }> = {
  linear: { stiffness: 62, damping: 16, mass: 1 }, standard: { stiffness: 686, damping: 52, mass: 1 }, enter: { stiffness: 584, damping: 46, mass: 1 }, exit: { stiffness: 1215, damping: 67, mass: 1 }, "ease-in": { stiffness: 686, damping: 52, mass: 1 }, "ease-out": { stiffness: 584, damping: 46, mass: 1 }, "ease-in-out": { stiffness: 385, damping: 38, mass: 1 },
};
function springFor(token: MotionCurveToken) { return token.spring ?? timingSpringEquivalents[token.id] ?? { stiffness: 220, damping: 30, mass: 1 }; }

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[28px] border-2 border-white bg-gradient-to-b from-[#f7f8fa] to-white shadow-[0_30px_70px_rgba(13,42,83,.04)] ${className}`}>{children}</section>;
}

function KindSwitch({ activeKind, onChange }: { activeKind: "timing" | "spring"; onChange: (value: "timing" | "spring") => void }) {
  return <div role="tablist" aria-label="Curve kind" className="relative grid grid-cols-2 rounded-full bg-[#eef1f6] p-1"><span aria-hidden className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-[0_2px_8px_rgba(17,24,39,.12)] transition-transform duration-200 ease-out ${activeKind === "spring" ? "translate-x-full" : "translate-x-0"}`} /><button type="button" role="tab" aria-selected={activeKind === "timing"} onClick={() => onChange("timing")} className={`relative z-10 rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${activeKind === "timing" ? "text-[#111827]" : "text-[#667085]"}`}>Timing · {motionCurveTokens.length}</button><button type="button" role="tab" aria-selected={activeKind === "spring"} onClick={() => onChange("spring")} className={`relative z-10 rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${activeKind === "spring" ? "text-[#111827]" : "text-[#667085]"}`}>Spring · {motionCurveTokens.length}</button></div>;
}

function PlayButton({ label, ariaLabel, onClick }: { label: string; ariaLabel?: string; onClick: () => void }) {
  return <button type="button" aria-label={ariaLabel ?? label} title={ariaLabel ?? label} onClick={onClick} className="h-8 rounded-full bg-[#111827] px-3.5 text-[11px] font-semibold text-white transition-transform active:scale-95">{label}</button>;
}

function PreviewTrack({ token, mode, large = false, showMeta = true }: { token: MotionCurveToken; mode: "timing" | "spring"; large?: boolean; showMeta?: boolean }) {
  const [runId, setRunId] = useState(0);
  const [springProgress, setSpringProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const isSpring = mode === "spring";
  const spring = springFor(token);

  function runSpring() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const target = progressRef.current < 0.5 ? 1 : 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { progressRef.current = target; setSpringProgress(target); return; }
    let progress = progressRef.current;
    let velocity = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, .032); last = now;
      const displacement = progress - target;
      const force = -spring.stiffness * displacement - spring.damping * velocity;
      velocity += force / spring.mass * delta;
      progress += velocity * delta;
      progressRef.current = progress;
      setSpringProgress(progress);
      if (Math.abs(velocity) < .002 && Math.abs(progress - target) < .002) { progressRef.current = target; setSpringProgress(target); frameRef.current = null; return; }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    const update = () => setTrackWidth(node.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [large]);
  useEffect(() => () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); }, [token.id, mode]);

  const size = large ? "h-10 w-10" : "h-4 w-4";
  const inset = 16;
  const progress = isSpring ? springProgress : runId % 2 === 1 ? 1 : 0;
  const springTravel = Math.max(trackWidth - inset * 2, 0);
  const start = inset;
  const end = inset;
  const position = isSpring ? start + progress * springTravel : runId % 2 === 1 ? Math.max(trackWidth - end, start) : start;

  return <div className="min-w-0"><div className="flex min-w-0 items-center gap-4"><div ref={trackRef} className={`relative isolate h-8 min-w-0 flex-1 overflow-hidden rounded-full bg-[#e9edf5] ${large ? "h-8" : ""}`}><div className={`pointer-events-none absolute top-1/2 rounded-full ${size} bg-[#2878f0] shadow-[0_10px_20px_rgba(40,120,240,.3)]`} style={{ left: position, transform: "translate(-50%, -50%)", ...(!isSpring ? { transition: `left ${token.durationMs}ms var(${token.cssVar})` } : {}) }} /></div><PlayButton label="Run" ariaLabel="Run preview" onClick={() => isSpring ? runSpring() : setRunId((value) => value + 1)} /></div>{showMeta ? <div className="mt-3 min-w-0"><code className="block truncate font-mono text-[10px] text-[#8791a3]">{isSpring ? `spring(stiffness: ${spring.stiffness}, damping: ${spring.damping}, mass: ${spring.mass})` : token.easing}</code></div> : null}</div>;
}

function TokenRow({ token, mode }: { token: MotionCurveToken; mode: "timing" | "spring" }) {
  const spring = springFor(token);
  const code = mode === "spring" ? `withAnimation(.spring(stiffness: ${spring.stiffness}, damping: ${spring.damping}, mass: ${spring.mass}))` : `transition: transform ${token.durationMs}ms ${token.easing}`;
  return <div className="min-w-0 bg-white px-6 py-4 sm:px-7"><div className="min-w-0"><div className="truncate text-[13px] font-semibold text-[#111827]">{token.name.replace("Spring ", "")}</div><div className="mt-1 flex min-w-0 items-center gap-3"><code className="min-w-0 truncate select-all font-mono text-[10px] text-[#98a2b3]">{code}</code><span className="shrink-0 font-mono text-[10px] text-[#667085]"><span className="uppercase tracking-[.1em] text-[#98a2b3]">duration</span> {token.durationMs}ms</span></div></div><div className="mt-4 min-w-0"><PreviewTrack token={token} mode={mode} showMeta={false} /></div></div>;
}

function Explorer({ activeKind, setActiveKind }: { activeKind: "timing" | "spring"; setActiveKind: (value: "timing" | "spring") => void }) {
  const tokens = motionCurveTokens;
  return <Panel className="overflow-hidden"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e7ebf1] px-6 py-6 sm:px-7"><div><h2 className="text-[21px] font-semibold tracking-[-.04em] text-[#111827]">Curve explorer</h2><p className="mt-1 text-[11px] text-[#8791a3]">浏览每个 token 的实际手感与参数。</p></div><KindSwitch activeKind={activeKind} onChange={setActiveKind} /></div><div className="grid gap-px bg-[#edf0f4] md:grid-cols-2">{tokens.map((token) => <TokenRow key={token.id} token={token} mode={activeKind} />)}</div></Panel>;
}

function RulesCard() {
  return <Panel><div className="px-6 py-6 sm:px-7"><h2 className="text-[19px] font-semibold tracking-[-.04em] text-[#111827]">Motion rules</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{motionPrinciples.map((principle, index) => <div key={principle.title} className="border-t border-[#edf0f4] pt-3"><div className="flex items-center gap-2"><span className="font-mono text-[10px] text-[#98a2b3]">0{index + 1}</span><span className="text-[12px] font-semibold text-[#111827]">{principle.title}</span></div><p className="mt-2 text-[11px] leading-5 text-[#7a8495]">{principle.description}</p></div>)}</div></div></Panel>;
}

function BezierUsage() {
  return <Panel><div className="p-6 sm:p-7"><h2 className="text-[19px] font-semibold tracking-[-.04em] text-[#111827]">Bezier timing</h2><p className="mt-2 max-w-[760px] text-[12px] leading-5 text-[#667085]">CSS cubic-bezier 用四个控制点描述速度如何变化，不携带物理状态。它适合确定、短促、可预测的状态切换；选择曲线时要让运动方向和速度节奏保持一致。</p><div className="mt-5 grid gap-2 sm:grid-cols-3">{[{ label: "duration", text: "反馈节奏", value: "180–320ms" }, { label: "control points", text: "速度曲线", value: "cubic-bezier" }, { label: "direction", text: "运动方向", value: "enter / exit" }].map((item) => <div key={item.label} className="rounded-2xl bg-[#f5f7fa] px-3.5 py-3"><div className="font-mono text-[10px] text-[#667085]">{item.label}</div><div className="mt-1 text-[11px] text-[#7a8495]">{item.text}</div><div className="mt-2 font-mono text-[12px] font-semibold text-[#111827]">{item.value}</div></div>)}</div><div className="mt-5 divide-y divide-[#e7ebf1] rounded-2xl border border-[#e7ebf1] bg-white">{[{ label: "Ease In", text: "加速离场：删除、收起、关闭。" }, { label: "Ease Out", text: "减速入场：浮层、菜单、内容出现。" }, { label: "Ease In Out", text: "对称过渡：透明度、颜色、轻微位移。" }, { label: "Linear", text: "匀速反馈：旋转、扫光、进度等待。" }].map((item) => <div key={item.label} className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-3"><span className="text-[12px] font-semibold text-[#111827]">{item.label}</span><span className="text-[11px] text-[#7a8495] sm:text-right">{item.text}</span></div>)}</div></div></Panel>;
}

function SpringSelection() {
  return <Panel><div className="p-6 sm:p-7"><h2 className="text-[19px] font-semibold tracking-[-.04em] text-[#111827]">Spring parameters</h2><p className="mt-2 text-[12px] leading-5 text-[#667085]">用三个参数控制手感：response 决定节奏，dampingFraction 决定回弹，mass 决定惯性。</p><div className="mt-5 grid gap-2 sm:grid-cols-3">{[{ label: "response", text: "整体节奏", value: "0.35–0.50s" }, { label: "dampingFraction", text: "回弹强度", value: "0.55–1.00" }, { label: "mass", text: "惯性", value: "1.00" }].map((item) => <div key={item.label} className="rounded-2xl bg-[#f5f7fa] px-3.5 py-3"><div className="font-mono text-[10px] text-[#667085]">{item.label}</div><div className="mt-1 text-[11px] text-[#7a8495]">{item.text}</div><div className="mt-2 font-mono text-[12px] font-semibold text-[#111827]">{item.value}</div></div>)}</div><code className="mt-4 block truncate rounded-xl bg-[#111827] px-3.5 py-3 font-mono text-[10px] text-[#eef2f8]">withAnimation(.spring(response: 0.45, dampingFraction: 0.9))</code><div className="mt-5 divide-y divide-[#e7ebf1] rounded-2xl border border-[#e7ebf1] bg-white">{springTokens.map((token) => <div key={token.id} className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-3"><span className="text-[12px] font-semibold text-[#111827]">{token.name.replace("Spring ", "")}</span><span className="text-[11px] text-[#7a8495] sm:text-right">{token.use}</span></div>)}</div></div></Panel>;
}

export function MotionCurvesDemo() {
  const [activeKind, setActiveKind] = useState<"timing" | "spring">("timing");
  return <div className="w-full pb-24"><header className="mb-8"><h1 className="text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-.065em] text-[#111827]">A better sense of motion.</h1><p className="mt-3 max-w-[620px] text-[13px] leading-6 text-[#667085]">用一致的曲线和物理参数，让每个界面状态变化都更自然、更可控。</p></header><div className="mb-5"><RulesCard /></div><Explorer activeKind={activeKind} setActiveKind={setActiveKind} />{activeKind === "timing" ? <div className="mt-5"><BezierUsage /></div> : <div className="mt-5"><SpringSelection /></div>}</div>;
}
