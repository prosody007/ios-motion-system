"use client";

import { Fragment, type ComponentType, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimationPreview } from "@/components/preview/animation-preview";
import { CodeToggle } from "@/components/code-toggle";
import { CardProvider } from "@/components/card-context";
import { getControlsEntry } from "@/components/preview/controls-registry";
import type { AnimationCard as AnimationCardType } from "@/types/motion";

const variantColors: Record<string, string> = {
  duration: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  easing: "bg-[#E5F1FF] text-[#0051D5] border-[#B3D7FF] hover:bg-[#E5F1FF]",
  spring: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
};

const FragmentProvider = ({ children }: { children: ReactNode }) => (
  <Fragment>{children}</Fragment>
);

export function AnimationCardView({ card }: { card: AnimationCardType }) {
  const controlsEntry = getControlsEntry(card.controlsId);
  const Provider: ComponentType<{ children: ReactNode }> =
    controlsEntry?.Provider ?? FragmentProvider;
  const Controls = controlsEntry?.Controls;
  const isTallPreview = card.previewId === "ios-card-flip";

  return (
    <CardProvider>
      <Provider>
        <div>
          <div
            className={
              isTallPreview
                ? "relative flex h-[369px] min-h-[200px] items-center justify-center overflow-hidden rounded-xl p-4"
                : "relative flex aspect-[16/10] min-h-[200px] items-center justify-center overflow-hidden rounded-xl p-6"
            }
            style={{ background: "#F3F4F9" }}
          >
            <AnimationPreview id={card.previewId} />
          </div>

          <div className="mt-3 flex items-center gap-2 flex-wrap px-1">
            <h3 className="font-semibold text-sm">{card.title}</h3>
            <div className="flex gap-1 flex-shrink-0">
              {card.tags.map((tag) => (
                <Badge
                  key={tag.text}
                  variant="outline"
                  className={`text-xs font-mono px-1.5 py-0 h-5 ${variantColors[tag.variant] ?? ""}`}
                >
                  {tag.text}
                </Badge>
              ))}
            </div>
            <div className="flex-1" />
            <CodeToggle codes={card.codes} />
          </div>

          {Controls && (
            <div className="mt-4">
              <Controls />
            </div>
          )}
        </div>
      </Provider>
    </CardProvider>
  );
}
