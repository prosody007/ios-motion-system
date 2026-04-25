"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { springPosition } from "@/lib/spring-math";

interface SpringCanvasProps {
  response: number;
  damping: number;
  className?: string;
}

const DURATION_MS = 1000;
const CANVAS_H = 70;
const TRACK_H = 20;
const GAP = 4;
const TOTAL_H = CANVAS_H + GAP + TRACK_H;

export function SpringCanvas({ response, damping, className }: SpringCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [key, setKey] = useState(0);

  const settleTime = findSettleTime(damping, response);
  const totalT = settleTime * 1.05;

  const play = useCallback(() => {
    setKey((k) => k + 1);
    setPlaying(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 260;
    const h = TOTAL_H;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    const pad = 10;
    const gw = w - pad * 2;
    const gh = CANVAS_H - pad * 2;
    const steps = 100;
    const targetY = pad + gh * 0.28;
    const trackTop = CANVAS_H + GAP;
    const trackW = gw;
    const cubeSize = 12;
    const trackTravel = trackW - cubeSize;
    const overshootRoom = 0.78;
    const targetCubeX = pad + overshootRoom * trackTravel;

    const drawFrame = (progress: number) => {
      ctx.clearRect(0, 0, w, h);

      // Axes
      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, pad + gh);
      ctx.lineTo(pad + gw, pad + gh);
      ctx.stroke();

      // 1.0 target line
      ctx.strokeStyle = "rgba(0,122,255,0.12)";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(pad, targetY);
      ctx.lineTo(pad + gw, targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Curve
      ctx.strokeStyle = "#007AFF";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * totalT;
        const v = springPosition(t, damping, response);
        const px = pad + (i / steps) * gw;
        const py = pad + gh - v * (gh * 0.72);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Track bar
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.beginPath();
      ctx.roundRect(pad, trackTop, trackW, TRACK_H, TRACK_H / 2);
      ctx.fill();

      // Target marker on track (1.0 position)
      ctx.strokeStyle = "rgba(0,122,255,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(targetCubeX + cubeSize / 2, trackTop + 2);
      ctx.lineTo(targetCubeX + cubeSize / 2, trackTop + TRACK_H - 2);
      ctx.stroke();

      // Current value
      const ct = progress * totalT;
      const val = springPosition(ct, damping, response);

      // Ball on curve — follows the curve path
      const ballX = pad + progress * gw;
      const ballY = pad + gh - val * (gh * 0.72);

      // Cube on track — X driven by value, scaled so 1.0 sits at overshootRoom of track
      const rawCubeX = pad + val * overshootRoom * trackTravel;
      const cubeX = Math.max(pad, Math.min(pad + trackTravel, rawCubeX));

      // Vertical drop from ball down to cube
      ctx.strokeStyle = "rgba(0,122,255,0.18)";
      ctx.setLineDash([1, 2]);
      ctx.beginPath();
      ctx.moveTo(cubeX + cubeSize / 2, ballY);
      ctx.lineTo(cubeX + cubeSize / 2, trackTop);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#007AFF";
      ctx.fill();

      // Cube
      ctx.fillStyle = "#007AFF";
      ctx.beginPath();
      ctx.roundRect(cubeX, trackTop + (TRACK_H - cubeSize) / 2, cubeSize, cubeSize, 3);
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
  }, [response, damping, playing, totalT, key]);

  useEffect(() => {
    const timer = setTimeout(() => setPlaying(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onClick={play}
      style={{ width: "100%", height: TOTAL_H, display: "block", cursor: "pointer" }}
    />
  );
}

function findSettleTime(damping: number, response: number): number {
  const threshold = 0.003;
  for (let t = 2; t > 0.1; t -= 0.02) {
    if (Math.abs(springPosition(t, damping, response) - 1) > threshold) return t + 0.04;
  }
  return response * 2;
}
