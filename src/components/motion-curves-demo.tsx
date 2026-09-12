"use client";

import { useEffect, useRef, useState } from "react";
import { motionCurveTokens, motionPrinciples, type MotionCurveToken } from "@/data/motion-tokens";

const timingTokens = motionCurveTokens.filter((token) => token.kind === "timing");
const springTokens = motionCurveTokens.filter((token) => token.kind === "spring");

const iosSpringPresets = [
  { id: "smooth", name: ".smooth", response: "0.50s", damping: "1.00", use: "稳定展开", note: "无过冲，丝滑停止。", swift: ".smooth" },
  { id: "snappy", name: ".snappy", response: "0.35s", damping: "0.86", use: "快速反馈", note: "响应很快，几乎没有过冲。", swift: ".snappy" },
  { id: "bouncy", name: ".bouncy", response: "0.50s", damping: "0.55", use: "成功与强调", note: "明显弹跳，适合轻量庆祝。", swift: ".bouncy" },
  { id: "interactive", name: ".interactiveSpring", response: "0.35s", damping: "0.86", use: "手势释放", note: "拖拽结束后的跟手回弹。", swift: ".interactiveSpring(response: 0.35, dampingFraction: 0.86)" },
  { id: "sheet", name: "Sheet Spring", response: "0.45s", damping: "0.90", use: "Sheet / 面板", note: "面板从底部出现时的稳定弹性。", swift: ".spring(response: 0.45, dampingFraction: 0.9)" },
] as const;

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[28px] border-2 border-white bg-gradient-to-b from-[#f7f8fa] to-white shadow-[0_30px_70px_rgba(13,42,83,.04)] ${className}`}>{children}</section>;
}

function KindSwitch({ activeKind, onChange }: { activeKind: "timing" | "spring"; onChange: (value: "timing" | "spring") => void }) {
  return <div role="tablist" aria-label="Curve kind" className="relative grid grid-cols-2 rounded-full bg-[#eef1f6] p-1"><span aria-hidden className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-[#2878f0] shadow-[0_4px_10px_rgba(40,120,240,.18)] transition-transform duration-200 ease-out ${activeKind === "spring" ? "translate-x-full" : "translate-x-0"}`} /><button type="button" role="tab" aria-selected={activeKind === "timing"} onClick={() => onChange("timing")} className={`relative z-10 rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${activeKind === "timing" ? "text-white" : "text-[#667085]"}`}>Timing · {timingTokens.length}</button><button type="button" role="tab" aria-selected={activeKind === "spring"} onClick={() => onChange("spring")} className={`relative z-10 rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${activeKind === "spring" ? "text-white" : "text-[#667085]"}`}>Spring · {springTokens.length}</button></div>;
}

function PlayButton({ label, ariaLabel, onClick }: { label: string; ariaLabel?: string; onClick: () => void }) {
  return <button type="button" aria-label={ariaLabel ?? label} title={ariaLabel ?? label} onClick={onClick} className="h-8 rounded-full bg-[#111827] px-3.5 text-[11px] font-semibold text-white transition-transform active:scale-95">{label}</button>;
}

function PreviewTrack({ token, large = false, showMeta = true }: { token: MotionCurveToken; large?: boolean; showMeta?: boolean }) {
  const [runId, setRunId] = useState(0);
  const [springProgress, setSpringProgress] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const isSpring = token.kind === "spring";

  function runSpring() {
    if (!token.spring) return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const target = progressRef.current < 0.5 ? 1 : 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { progressRef.current = target; setSpringProgress(target); return; }
    let progress = progressRef.current;
    let velocity = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min((now - last) / 1000, .032); last = now;
      const displacement = progress - target;
      const force = -token.spring!.stiffness * displacement - token.spring!.damping * velocity;
      velocity += force / token.spring!.mass * delta;
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
  useEffect(() => () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); }, [token.id]);

  const size = large ? "h-10 w-10" : "h-4 w-4";
  const inset = large ? 52 : 28;
  const progress = isSpring ? springProgress : runId % 2 === 1 ? 1 : 0;
  const springTravel = Math.max(trackWidth - (large ? 104 : 56), 0);
  const start = inset;
  const end = inset;
  const position = isSpring ? start + progress * springTravel : runId % 2 === 1 ? Math.max(trackWidth - end, start) : start;

  return <div className="min-w-0"><div className="flex min-w-0 items-center gap-4"><div ref={trackRef} className={`relative isolate h-8 min-w-0 flex-1 overflow-hidden rounded-full bg-[#e9edf5] ${large ? "h-8" : ""}`}><div className={`pointer-events-none absolute top-1/2 rounded-full ${size} ${isSpring ? "bg-[#111827] shadow-[0_12px_22px_rgba(17,24,39,.23)]" : "bg-[#2878f0] shadow-[0_10px_20px_rgba(40,120,240,.3)]"}`} style={{ left: position, transform: "translate(-50%, -50%)", ...(!isSpring ? { transition: `left ${token.durationMs}ms var(${token.cssVar})` } : {}) }} /></div><PlayButton label={isSpring ? "Run" : "Play"} ariaLabel={isSpring ? "Run spring preview" : "Play once"} onClick={() => isSpring ? runSpring() : setRunId((value) => value + 1)} /></div>{showMeta ? <div className="mt-3 min-w-0"><code className="block truncate font-mono text-[10px] text-[#8791a3]">{isSpring ? `stiff ${token.spring?.stiffness} · damp ${token.spring?.damping} · mass ${token.spring?.mass}` : token.cssVar}</code></div> : null}</div>;
}

function TokenRow({ token }: { token: MotionCurveToken }) {
  return <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 border-b border-[#edf0f4] px-5 py-4 last:border-0 sm:grid-cols-[150px_minmax(0,1fr)_80px] sm:items-center sm:gap-4"><div className="col-start-1 row-start-1 min-w-0 sm:col-auto sm:row-auto"><div className="truncate text-[13px] font-semibold text-[#111827]">{token.name.replace("Spring ", "")}</div><div className="mt-1 truncate font-mono text-[10px] text-[#98a2b3]">{token.cssVar}</div></div><div className="col-span-2 row-start-2 min-w-0 sm:col-auto sm:row-auto"><PreviewTrack token={token} showMeta={false} /></div><div className="col-start-2 row-start-1 whitespace-nowrap text-right sm:col-auto sm:row-auto"><div className="font-mono text-[11px] text-[#475467]">{token.durationMs}ms</div><div className="mt-1 text-[9px] uppercase tracking-[.1em] text-[#98a2b3]">duration</div></div></div>;
}

function Explorer({ activeKind, setActiveKind }: { activeKind: "timing" | "spring"; setActiveKind: (value: "timing" | "spring") => void }) {
  const tokens = activeKind === "timing" ? timingTokens : springTokens;
  return <Panel className="overflow-hidden"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e7ebf1] px-6 py-6 sm:px-7"><div><h2 className="text-[21px] font-semibold tracking-[-.04em] text-[#111827]">Curve explorer</h2><p className="mt-1 text-[11px] text-[#8791a3]">浏览每个 token 的实际手感与参数。</p></div><KindSwitch activeKind={activeKind} onChange={setActiveKind} /></div><div>{tokens.map((token) => <TokenRow key={token.id} token={token} />)}</div></Panel>;
}

function RulesCard() {
  return <Panel><div className="px-6 py-6 sm:px-7"><h2 className="text-[19px] font-semibold tracking-[-.04em] text-[#111827]">Motion rules</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{motionPrinciples.map((principle, index) => <div key={principle.title} className="border-t border-[#edf0f4] pt-3"><div className="flex items-center gap-2"><span className="font-mono text-[10px] text-[#98a2b3]">0{index + 1}</span><span className="text-[12px] font-semibold text-[#111827]">{principle.title}</span></div><p className="mt-2 text-[11px] leading-5 text-[#7a8495]">{principle.description}</p></div>)}</div></div></Panel>;
}

function BezierUsage() {
  return <Panel><div className="p-6 sm:p-7"><h2 className="text-[19px] font-semibold tracking-[-.04em] text-[#111827]">Bezier timing</h2><p className="mt-2 text-[12px] leading-5 text-[#667085]">CSS 时间函数只描述速度变化，不携带物理状态。把它用在明确、短促的状态切换上。</p><div className="mt-5 divide-y divide-[#e7ebf1] rounded-2xl border border-[#e7ebf1] bg-white">{[{ label: "Ease In", text: "加速离场：删除、收起、关闭。" }, { label: "Ease Out", text: "减速入场：浮层、菜单、内容出现。" }, { label: "Ease In Out", text: "对称过渡：透明度、颜色、轻微位移。" }, { label: "Linear", text: "匀速反馈：旋转、扫光、进度等待。" }].map((item) => <div key={item.label} className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-3"><span className="text-[12px] font-semibold text-[#111827]">{item.label}</span><span className="text-[11px] text-[#7a8495] sm:text-right">{item.text}</span></div>)}</div></div></Panel>;
}

function SpringSelection() {
  return <Panel><div className="p-6 sm:p-7"><h2 className="text-[19px] font-semibold tracking-[-.04em] text-[#111827]">Spring selection</h2><p className="mt-2 text-[12px] leading-5 text-[#667085]">用三个参数控制手感：response 决定速度，dampingFraction 决定过冲，mass 决定惯性。</p><div className="mt-5 grid gap-2 sm:grid-cols-3">{[{ label: "response", text: "整体节奏", value: "0.35–0.50s" }, { label: "dampingFraction", text: "回弹强度", value: "0.55–1.00" }, { label: "mass", text: "惯性", value: "1.00" }].map((item) => <div key={item.label} className="rounded-2xl bg-[#f5f7fa] px-3.5 py-3"><div className="font-mono text-[10px] text-[#667085]">{item.label}</div><div className="mt-1 text-[11px] text-[#7a8495]">{item.text}</div><div className="mt-2 font-mono text-[12px] font-semibold text-[#111827]">{item.value}</div></div>)}</div><code className="mt-4 block truncate rounded-xl bg-[#111827] px-3.5 py-3 font-mono text-[10px] text-[#eef2f8]">withAnimation(.spring(response: 0.45, dampingFraction: 0.9))</code></div></Panel>;
}

function IosSpringExamples() {
 return <Panel className="overflow-hidden"><div className="border-b border-[#e7ebf1] px-6 py-6 sm:px-7"><div className="mt-1 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-[19px] font-semibold tracking-[-.04em] text-[#111827]">常用 Spring 示例</h2><p className="mt-2 text-[12px] leading-5 text-[#667085]">下面的预览按 iOS 17 的 response / dampingFraction 语义换算为可运行的物理弹簧。</p></div><span className="rounded-lg bg-[#f3f5f8] px-2.5 py-2 text-[10px] text-[#667085]">点击 Run 单次播放</span></div></div><div className="grid gap-x-5 md:grid-cols-2 xl:grid-cols-5">{iosSpringPresets.map((preset) => { const base = springTokens.find((token) => token.id === preset.id) ?? springTokens[0]; const response = Number.parseFloat(preset.response); const dampingRatio = Number.parseFloat(preset.damping); const stiffness = Math.round((2 * Math.PI / response) ** 2); const damping = Math.round(2 * dampingRatio * Math.sqrt(stiffness)); const token: MotionCurveToken = { ...base, id: `ios-${preset.id}`, name: preset.name, durationMs: Math.round(response * 1000), use: preset.use, note: preset.note, spring: { stiffness, damping, mass: 1 } }; return <div key={preset.id} className="border-b border-[#edf0f4] px-6 py-5 last:border-0 sm:px-7 xl:border-b-0 xl:px-4"><div className="mb-3 flex items-start justify-between gap-2"><div className="min-w-0"><div className="truncate text-[14px] font-semibold text-[#111827]">{preset.name}</div><div className="mt-1 truncate text-[11px] text-[#98a2b3]">{preset.use}</div></div><span className="shrink-0 font-mono text-[10px] text-[#98a2b3]">{preset.response} / {preset.damping}</span></div><PreviewTrack token={token} /><code className="mt-3 block truncate rounded-lg bg-[#f5f7fa] px-2.5 py-2 font-mono text-[10px] text-[#667085]">withAnimation({preset.swift})</code></div>; })}</div></Panel>;
}

export function MotionCurvesDemo() {
  const [activeKind, setActiveKind] = useState<"timing" | "spring">("timing");
  return <div className="w-full pb-24"><header className="mb-8"><h1 className="text-[clamp(2.2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-.065em] text-[#111827]">A better sense of motion.</h1><p className="mt-3 max-w-[620px] text-[13px] leading-6 text-[#667085]">用一致的曲线和物理参数，让每个界面状态变化都更自然、更可控。</p></header><div className="mb-5"><RulesCard /></div><Explorer activeKind={activeKind} setActiveKind={setActiveKind} /><div className="mt-5"><BezierUsage /></div><div className="mt-5"><SpringSelection /></div><div className="mt-5"><IosSpringExamples /></div></div>;
}
