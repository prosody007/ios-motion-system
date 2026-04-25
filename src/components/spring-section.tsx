"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpringCanvas } from "@/components/spring-canvas";
import { BezierCanvas } from "@/components/bezier-canvas";
import type { SpringCurveSection } from "@/types/motion";
import { useCallback } from "react";

export function SpringCurveSectionView({ section }: { section: SpringCurveSection }) {
  const copyText = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-5">
          <h3 className="text-lg font-bold tracking-tight mb-2">
            Spring 曲线（iOS 动画核心）
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            iOS 的 spring 动画基于物理弹簧模型，核心参数：
            <strong className="text-foreground"> response</strong>（弹簧周期/速度）和
            <strong className="text-foreground"> dampingFraction</strong>
            （阻尼比：1.0=无过冲，越小弹跳越大）。iOS 17+ 新增{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-[#0051D5] text-xs">.smooth</code>、
            <code className="bg-muted px-1.5 py-0.5 rounded text-[#0051D5] text-xs">.snappy</code>、
            <code className="bg-muted px-1.5 py-0.5 rounded text-[#0051D5] text-xs">.bouncy</code>{" "}
            三个预设，覆盖 90% 场景。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {section.springs.map((s) => {
            const badgeVariant =
              s.badge.includes("推荐") || s.badge.includes("iOS")
                ? "bg-[#E5F1FF] text-[#0051D5] border-[#B3D7FF]"
                : "bg-amber-50 text-amber-600 border-amber-200";
            return (
              <Card
                key={s.name}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => copyText(s.swift)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{s.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${badgeVariant}`}
                    >
                      {s.badge}
                    </Badge>
                  </div>

                  <div
                    className="rounded-lg px-2 pt-2 pb-1.5"
                    style={{ background: "#F3F4F9" }}
                  >
                    <SpringCanvas response={s.response} damping={s.damping} />
                  </div>

                  <div className="flex gap-4 font-mono text-xs">
                    <span className="text-muted-foreground">
                      response{" "}
                      <span className="text-[#0051D5] font-semibold">{s.response}</span>
                    </span>
                    <span className="text-muted-foreground">
                      damping{" "}
                      <span className="text-[#0051D5] font-semibold">{s.damping}</span>
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>

                  <div className="font-mono text-xs leading-relaxed space-y-1 pt-1 border-t border-border/60">
                    <div className="flex">
                      <span className="text-muted-foreground/80 w-14 shrink-0">SwiftUI</span>
                      <span className="text-emerald-600 truncate">{s.swift}</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground/80 w-14 shrink-0">Legacy</span>
                      <span className="text-muted-foreground truncate">{s.swiftLegacy}</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground/80 w-14 shrink-0">UIKit</span>
                      <span className="text-muted-foreground truncate">{s.uikit}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 leading-relaxed">
        <strong className="text-amber-700">何时不用 Spring？</strong>{" "}
        无限循环动画（spinner → .linear）、简单淡入淡出（.easeInOut）、元素离场（.easeIn 加速消失）。大部分交互动画优先用 Spring。
      </div>

      <section>
        <div className="mb-5">
          <h3 className="text-lg font-bold tracking-tight mb-2">
            Timing Curve（传统贝塞尔，少数场景）
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            点击卡片复制 SwiftUI 写法。控制点定义了进入/离场的速度形态，建议仅在 spring 不适用时使用。
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {section.timingCurves.map((c) => (
            <Card
              key={c.name}
              className="cursor-pointer text-center transition-shadow hover:shadow-md"
              onClick={() => copyText(c.swift)}
            >
              <CardContent className="p-4 space-y-2">
                <div
                  className="rounded-lg flex items-center justify-center px-2 pt-2 pb-1.5"
                  style={{ background: "#F3F4F9" }}
                >
                  <BezierCanvas cp={c.cp} css={c.css} />
                </div>
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="font-mono text-xs text-muted-foreground break-all">{c.css}</div>
                <div className="text-xs text-muted-foreground/70">{c.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
