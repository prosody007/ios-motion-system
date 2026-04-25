"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { cubicBezierX, cubicBezierY } from "@/lib/spring-math";

interface BezierCanvasProps {
  cp: [number, number, number, number];
  css?: string;
  className?: string;
}

const DURATION_MS = 1000;
const CANVAS_H = 90;
const TRACK_H = 18;
const GAP = 4;
const TOTAL_H = CANVAS_H + GAP + TRACK_H;

export function BezierCanvas({ cp, className }: BezierCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [key, setKey] = useState(0);

  const play = useCallback(() => {
    setKey((k) => k + 1);
    setPlaying(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 160, h = TOTAL_H;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    const pad = 14;
    const gw = w - pad * 2;
    const gh = CANVAS_H - pad * 2;
    const steps = 80;
    const trackTop = CANVAS_H + GAP;
    const trackW = gw;
    const cubeSize = 10;

    const drawFrame = (progress: number) => {
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, pad + gh);
      ctx.lineTo(pad + gw, pad + gh);
      ctx.stroke();

      ctx.strokeStyle = "rgba(0,122,255,0.1)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad + gw, pad + gh);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = "#007AFF";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = cubicBezierX(t, cp[0], cp[2]);
        const y = cubicBezierY(t, cp[1], cp[3]);
        i === 0 ? ctx.moveTo(pad + x * gw, pad + gh - y * gh) : ctx.lineTo(pad + x * gw, pad + gh - y * gh);
      }
      ctx.stroke();

      // Track
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.beginPath();
      ctx.roundRect(pad, trackTop, trackW, TRACK_H, TRACK_H / 2);
      ctx.fill();

      const x = cubicBezierX(progress, cp[0], cp[2]);
      const y = cubicBezierY(progress, cp[1], cp[3]);
      const ballPx = pad + x * gw;
      const ballPy = pad + gh - y * gh;
      const rawCubeX = pad + y * (trackW - cubeSize);
      const cubeX = Math.max(pad, Math.min(pad + trackW - cubeSize, rawCubeX));

      ctx.strokeStyle = "rgba(0,122,255,0.18)";
      ctx.setLineDash([1, 2]);
      ctx.beginPath();
      ctx.moveTo(cubeX + cubeSize / 2, ballPy);
      ctx.lineTo(cubeX + cubeSize / 2, trackTop);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(ballPx, ballPy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#007AFF";
      ctx.fill();

      ctx.fillStyle = "#007AFF";
      ctx.beginPath();
      ctx.roundRect(cubeX, trackTop + (TRACK_H - cubeSize) / 2, cubeSize, cubeSize, 2);
      ctx.fill();
    };

    drawFrame(playing ? 0 : 1);
    if (!playing) return;

    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / DURATION_MS, 1);
      drawFrame(progress);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPlaying(false);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cp, playing, key]);

  useEffect(() => {
    const timer = setTimeout(() => setPlaying(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onClick={play}
      style={{ display: "block", cursor: "pointer" }}
    />
  );
}
