"use client";

import { useEffect, useRef, useState } from "react";
import { motionCurveTokens, motionPrinciples, type MotionCurveToken } from "@/data/motion-tokens";

const springTokens = motionCurveTokens.filter((token) => token.kind === "spring");
const timingSpringEquivalents: Record<string, { stiffness: number; damping: number; mass: number }> = {
  linear: { stiffness: 62, damping: 16, mass: 1 }, standard: { stiffness: 686, damping: 52, mass: 1 }, enter: { stiffness: 584, damping: 46, mass: 1 }, exit: { stiffness: 1215, damping: 67, mass: 1 }, "ease-in": { stiffness: 686, damping: 52, mass: 1 }, "ease-out": { stiffness: 584, damping: 46, mass: 1 }, "ease-in-out": { stiffness: 385, damping: 38, mass: 1 }, ease: { stiffness: 520, damping: 40, mass: 1 },
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

type SimulatorMode = "bezier" | "spring";

type BezierValues = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  duration: number;
};

type SpringValues = {
  stiffness: number;
  damping: number;
  mass: number;
};

const defaultBezier: BezierValues = { x1: 0.42, y1: 0, x2: 1, y2: 1, duration: 320 };
const defaultSpring: SpringValues = { stiffness: 220, damping: 30, mass: 1 };

function formatNumber(value: number, digits = 2) {
  return value.toFixed(digits).replace(/\.?(0+)$/, "");
}

function ParameterControl({ label, value, min, max, step, suffix, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix?: string; onChange: (value: number) => void }) {
  const update = (next: number) => {
    if (!Number.isFinite(next)) return;
    onChange(Math.min(max, Math.max(min, next)));
  };
  return <label className="block"><span className="flex items-center justify-between gap-3 text-[11px] font-medium text-[#344054]"><span>{label}</span><span className="font-mono text-[10px] text-[#8791a3]">{formatNumber(value)}{suffix ?? ""}</span></span><div className="mt-2 flex items-center gap-3"><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => update(Number(event.target.value))} className="simulator-range min-w-0 flex-1" /><input aria-label={`${label} value`} type="number" min={min} max={max} step={step} value={value} onChange={(event) => update(Number(event.target.value))} className="h-8 w-[70px] rounded-lg border border-[#e1e6ee] bg-white px-2 text-right font-mono text-[10px] text-[#111827] outline-none transition-colors focus:border-[#98a2b3]" /></div></label>;
}

function CurveGraph({ values, onChange }: { values: BezierValues; onChange: (key: keyof BezierValues, value: number) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<"first" | "second" | null>(null);
  const y1 = 100 - values.y1 * 100;
  const y2 = 100 - values.y2 * 100;
  const updateFromPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1.5, Math.max(-0.5, 1 - (event.clientY - rect.top) / rect.height));
    onChange(dragging === "first" ? "x1" : "x2", Number(x.toFixed(2)));
    onChange(dragging === "first" ? "y1" : "y2", Number(y.toFixed(2)));
  };
  const startDrag = (point: "first" | "second", event: React.PointerEvent<SVGCircleElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(point);
  };
  const width = 240;
  return <div className="relative overflow-hidden rounded-2xl border border-[#e6eaf0] bg-[#f7f8fa] p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><div className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#98a2b3]">Curve shape</div><div className="mt-1 text-[10px] text-[#8791a3]">拖动两个手柄调整控制点</div></div><code className="font-mono text-[10px] text-[#667085]">cubic-bezier({formatNumber(values.x1)}, {formatNumber(values.y1)}, {formatNumber(values.x2)}, {formatNumber(values.y2)})</code></div><svg ref={svgRef} viewBox={`0 0 ${width} 100`} className={`block aspect-[2.4] h-auto w-full touch-none ${dragging ? "cursor-grabbing" : "cursor-default"}`} role="img" aria-label="Bézier curve preview" onPointerMove={updateFromPointer} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)}><defs><pattern id="sim-grid" width="20" height="10" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 10" fill="none" stroke="#e7ebf1" strokeWidth="0.7" /></pattern></defs><rect width={width} height="100" fill="url(#sim-grid)" rx="4" /><path d={`M 0 100 L ${values.x1 * width} ${y1} M ${width} 0 L ${values.x2 * width} ${y2}`} fill="none" stroke="#b8c3d4" strokeWidth="0.8" strokeDasharray="2 2" /><path d={`M 0 100 C ${values.x1 * width} ${y1}, ${values.x2 * width} ${y2}, ${width} 0`} fill="none" stroke="#2878f0" strokeWidth="2.5" strokeLinecap="round" /><circle cx={values.x1 * width} cy={y1} r="8" fill="transparent" onPointerDown={(event) => startDrag("first", event)} /><circle cx={values.x2 * width} cy={y2} r="8" fill="transparent" onPointerDown={(event) => startDrag("second", event)} /><circle cx={values.x1 * width} cy={y1} r="3.5" fill="#fff" stroke="#2878f0" strokeWidth="1.8" onPointerDown={(event) => startDrag("first", event)} /><circle cx={values.x2 * width} cy={y2} r="3.5" fill="#fff" stroke="#2878f0" strokeWidth="1.8" onPointerDown={(event) => startDrag("second", event)} /></svg><div className="mt-2 flex justify-between text-[10px] text-[#98a2b3]"><span>start</span><span>end</span></div></div>;
}

function SimulatorPreview({ mode, bezier, spring }: { mode: SimulatorMode; bezier: BezierValues; spring: SpringValues }) {
  const [timingRun, setTimingRun] = useState(false);
  const [springProgress, setSpringProgress] = useState(0);
  const progressRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); }, []);

  const runSpring = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const target = progressRef.current < 0.5 ? 1 : 0;
    let progress = progressRef.current;
    let velocity = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.032);
      last = now;
      const displacement = progress - target;
      const force = -spring.stiffness * displacement - spring.damping * velocity;
      velocity += (force / spring.mass) * delta;
      progress += velocity * delta;
      progressRef.current = progress;
      setSpringProgress(progress);
      if (Math.abs(velocity) < 0.002 && Math.abs(progress - target) < 0.002) {
        progressRef.current = target;
        setSpringProgress(target);
        frameRef.current = null;
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    progressRef.current = 0;
    setSpringProgress(0);
    setTimingRun(false);
  };

  const progress = mode === "spring" ? springProgress : timingRun ? 1 : 0;
  const code = mode === "spring" ? `withAnimation(.spring(stiffness: ${formatNumber(spring.stiffness)}, damping: ${formatNumber(spring.damping)}, mass: ${formatNumber(spring.mass)}))` : `transition: transform ${formatNumber(bezier.duration)}ms cubic-bezier(${formatNumber(bezier.x1)}, ${formatNumber(bezier.y1)}, ${formatNumber(bezier.x2)}, ${formatNumber(bezier.y2)})`;
  return <div className="rounded-2xl border border-[#e6eaf0] bg-white p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><div className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#98a2b3]">Live preview</div><div className="mt-1 text-[12px] text-[#667085]">点击 Run 播放一次，观察速度与回弹。</div></div><button type="button" onClick={reset} className="text-[11px] font-medium text-[#667085] underline decoration-[#d3d9e3] underline-offset-4 transition-colors hover:text-[#111827]">Reset</button></div><div className="mt-5 flex items-center gap-4"><div className="relative h-12 min-w-0 flex-1 overflow-hidden rounded-full bg-[#edf1f7]"><div className="absolute left-[8%] top-1/2 h-7 w-7 rounded-full bg-[#2878f0] shadow-[0_10px_24px_rgba(40,120,240,.28)]" style={{ left: `${8 + progress * 84}%`, transform: "translate(-50%, -50%)", transition: mode === "bezier" ? `left ${bezier.duration}ms cubic-bezier(${bezier.x1}, ${bezier.y1}, ${bezier.x2}, ${bezier.y2})` : undefined }} /></div><button type="button" onClick={() => mode === "spring" ? runSpring() : setTimingRun((value) => !value)} className="h-9 rounded-full bg-[#111827] px-4 text-[11px] font-semibold text-white transition-transform active:scale-95">Run</button></div><code className="mt-4 block overflow-x-auto whitespace-nowrap rounded-xl bg-[#111827] px-3.5 py-3 font-mono text-[10px] leading-5 text-[#eef2f8]">{code}</code></div>;
}

function CurveSimulator() {
  const [mode, setMode] = useState<SimulatorMode>("bezier");
  const [bezier, setBezier] = useState(defaultBezier);
  const [spring, setSpring] = useState(defaultSpring);
  const updateBezier = (key: keyof BezierValues, value: number) => setBezier((current) => ({ ...current, [key]: value }));
  const updateSpring = (key: keyof SpringValues, value: number) => setSpring((current) => ({ ...current, [key]: value }));
  const restoreDefaults = () => {
    setBezier(defaultBezier);
    setSpring(defaultSpring);
  };
  return <Panel className="overflow-hidden">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e7ebf1] px-6 py-6 sm:px-7">
      <div>
        <h2 className="text-[21px] font-semibold tracking-[-.04em] text-[#111827]">Curve simulator</h2>
        <p className="mt-1 text-[11px] text-[#8791a3]">拖动参数，实时调整曲线的节奏、惯性和回弹。</p>
      </div>
      <div role="tablist" aria-label="Simulator type" className="grid grid-cols-2 rounded-full bg-[#eef1f6] p-1">
        <button type="button" role="tab" aria-selected={mode === "bezier"} onClick={() => setMode("bezier")} className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${mode === "bezier" ? "bg-white text-[#111827] shadow-[0_2px_8px_rgba(17,24,39,.12)]" : "text-[#667085]"}`}>Bézier</button>
        <button type="button" role="tab" aria-selected={mode === "spring"} onClick={() => setMode("spring")} className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${mode === "spring" ? "bg-white text-[#111827] shadow-[0_2px_8px_rgba(17,24,39,.12)]" : "text-[#667085]"}`}>Spring</button>
      </div>
    </div>
    <div className="grid gap-5 p-6 sm:p-7 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
      <aside className="rounded-2xl border border-[#e6eaf0] bg-[#f7f8fa] p-4">
        <div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#98a2b3]">Parameters</span><button type="button" onClick={restoreDefaults} className="text-[10px] font-medium text-[#667085] underline decoration-[#d3d9e3] underline-offset-4 transition-colors hover:text-[#111827]">Restore</button></div>
        <div className="mt-5 space-y-5">
          {mode === "bezier" ? <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <ParameterControl label="X1" value={bezier.x1} min={0} max={1} step={0.01} onChange={(value) => updateBezier("x1", value)} />
              <ParameterControl label="Y1" value={bezier.y1} min={-0.5} max={1.5} step={0.01} onChange={(value) => updateBezier("y1", value)} />
              <ParameterControl label="X2" value={bezier.x2} min={0} max={1} step={0.01} onChange={(value) => updateBezier("x2", value)} />
              <ParameterControl label="Y2" value={bezier.y2} min={-0.5} max={1.5} step={0.01} onChange={(value) => updateBezier("y2", value)} />
            </div>
            <ParameterControl label="Duration" value={bezier.duration} min={80} max={1200} step={10} suffix="ms" onChange={(value) => updateBezier("duration", value)} />
          </> : <>
            <ParameterControl label="Stiffness" value={spring.stiffness} min={40} max={1200} step={1} onChange={(value) => updateSpring("stiffness", value)} />
            <ParameterControl label="Damping" value={spring.damping} min={1} max={160} step={1} onChange={(value) => updateSpring("damping", value)} />
            <ParameterControl label="Mass" value={spring.mass} min={0.1} max={5} step={0.1} onChange={(value) => updateSpring("mass", value)} />
          </>}
        </div>
      </aside>
      <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,.9fr)] 2xl:items-start">
        {mode === "bezier" ? <CurveGraph values={bezier} onChange={updateBezier} /> : <div className="flex min-h-[274px] flex-col justify-between rounded-2xl border border-[#e6eaf0] bg-[#f7f8fa] p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#98a2b3]">Spring response</span><span className="font-mono text-[10px] text-[#667085]">{formatNumber(spring.stiffness)} · {formatNumber(spring.damping)} · {formatNumber(spring.mass)}</span></div><div className="grid grid-cols-3 gap-3"><div className="rounded-xl bg-white p-3"><div className="font-mono text-[10px] text-[#98a2b3]">stiffness</div><div className="mt-1 text-[16px] font-semibold tracking-[-.04em] text-[#111827]">{formatNumber(spring.stiffness)}</div></div><div className="rounded-xl bg-white p-3"><div className="font-mono text-[10px] text-[#98a2b3]">damping</div><div className="mt-1 text-[16px] font-semibold tracking-[-.04em] text-[#111827]">{formatNumber(spring.damping)}</div></div><div className="rounded-xl bg-white p-3"><div className="font-mono text-[10px] text-[#98a2b3]">mass</div><div className="mt-1 text-[16px] font-semibold tracking-[-.04em] text-[#111827]">{formatNumber(spring.mass)}</div></div></div><div className="flex items-center gap-2 text-[11px] text-[#667085]"><span className="h-2 w-2 shrink-0 rounded-full bg-[#2878f0]" />阻尼越低，回弹越明显；质量越高，惯性感越强。</div></div>}
        <SimulatorPreview key={mode} mode={mode} bezier={bezier} spring={spring} />
      </div>
    </div>
  </Panel>;
}

function RulesCard() {
  return <Panel><div className="px-6 py-6 sm:px-7"><h2 className="text-[19px] font-semibold tracking-[-.04em] text-[#111827]">Motion rules</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{motionPrinciples.map((principle, index) => <div key={principle.title} className="border-t border-[#edf0f4] pt-3"><div className="flex items-center gap-2"><span className="font-mono text-[10px] text-[#98a2b3]">0{index + 1}</span><span className="text-[12px] font-semibold text-[#111827]">{principle.title}</span></div><p className="mt-2 text-[11px] leading-5 text-[#7a8495]">{principle.description}</p></div>)}</div></div></Panel>;
}

function BezierUsage() {
  return <Panel><div className="p-6 sm:p-7"><h2 className="text-[19px] font-semibold tracking-[-.04em] text-[#111827]">Bezier timing</h2><p className="mt-2 max-w-[760px] text-[12px] leading-5 text-[#667085]">CSS cubic-bezier 用四个控制点描述速度如何变化，不携带物理状态。它适合确定、短促、可预测的状态切换；选择曲线时要让运动方向和速度节奏保持一致。</p><div className="mt-5 grid gap-2 sm:grid-cols-3">{[{ label: "duration", text: "反馈节奏", value: "180–320ms" }, { label: "control points", text: "速度曲线", value: "cubic-bezier" }, { label: "direction", text: "运动方向", value: "enter / exit" }].map((item) => <div key={item.label} className="rounded-2xl bg-[#f5f7fa] px-3.5 py-3"><div className="font-mono text-[10px] text-[#667085]">{item.label}</div><div className="mt-1 text-[11px] text-[#7a8495]">{item.text}</div><div className="mt-2 font-mono text-[12px] font-semibold text-[#111827]">{item.value}</div></div>)}</div><div className="mt-5 divide-y divide-[#e7ebf1] rounded-2xl border border-[#e7ebf1] bg-white">{[{ label: "Ease In", text: "加速离场：删除、收起、关闭。" }, { label: "Ease Out", text: "减速入场：浮层、菜单、内容出现。" }, { label: "Ease In Out", text: "对称过渡：透明度、颜色、轻微位移。" }, { label: "Linear", text: "匀速反馈：旋转、扫光、进度等待。" }, { label: "Ease", text: "自然过渡：轻量、非关键的状态变化。" }].map((item) => <div key={item.label} className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-3"><span className="text-[12px] font-semibold text-[#111827]">{item.label}</span><span className="text-[11px] text-[#7a8495] sm:text-right">{item.text}</span></div>)}</div></div></Panel>;
}

function SpringSelection() {
  return <Panel><div className="p-6 sm:p-7"><h2 className="text-[19px] font-semibold tracking-[-.04em] text-[#111827]">Spring parameters</h2><p className="mt-2 text-[12px] leading-5 text-[#667085]">用三个参数控制手感：response 决定节奏，dampingFraction 决定回弹，mass 决定惯性。</p><div className="mt-5 grid gap-2 sm:grid-cols-3">{[{ label: "response", text: "整体节奏", value: "0.35–0.50s" }, { label: "dampingFraction", text: "回弹强度", value: "0.55–1.00" }, { label: "mass", text: "惯性", value: "1.00" }].map((item) => <div key={item.label} className="rounded-2xl bg-[#f5f7fa] px-3.5 py-3"><div className="font-mono text-[10px] text-[#667085]">{item.label}</div><div className="mt-1 text-[11px] text-[#7a8495]">{item.text}</div><div className="mt-2 font-mono text-[12px] font-semibold text-[#111827]">{item.value}</div></div>)}</div><code className="mt-4 block truncate rounded-xl bg-[#111827] px-3.5 py-3 font-mono text-[10px] text-[#eef2f8]">withAnimation(.spring(response: 0.45, dampingFraction: 0.9))</code><div className="mt-5 divide-y divide-[#e7ebf1] rounded-2xl border border-[#e7ebf1] bg-white">{springTokens.map((token) => <div key={token.id} className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-3"><span className="text-[12px] font-semibold text-[#111827]">{token.name.replace("Spring ", "")}</span><span className="text-[11px] text-[#7a8495] sm:text-right">{token.use}</span></div>)}</div></div></Panel>;
}

export function MotionCurvesDemo() {
  const [activeKind, setActiveKind] = useState<"timing" | "spring">("timing");
  return <div className="w-full pb-24"><header className="mb-8"><h1 className="text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-.065em] text-[#111827]">A better sense of motion.</h1><p className="mt-3 max-w-[620px] text-[13px] leading-6 text-[#667085]">用一致的曲线和物理参数，让每个界面状态变化都更自然、更可控。</p></header><div className="mb-5"><RulesCard /></div><Explorer activeKind={activeKind} setActiveKind={setActiveKind} /><div className="mt-5"><CurveSimulator /></div>{activeKind === "timing" ? <div className="mt-5"><BezierUsage /></div> : <div className="mt-5"><SpringSelection /></div>}</div>;
}
