"use client";

import { useState, useRef, useCallback } from "react";

interface Item {
  id: number;
  label: string;
}

const ROW_H = 40;
const GAP = 4;
const STEP = ROW_H + GAP;
const SHIFT_TRANSITION = "transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)";
const RELEASE_TRANSITION = "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.3s ease";

export function ReorderPreview() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, label: "Favorites" },
    { id: 2, label: "Recents" },
    { id: 3, label: "Downloads" },
    { id: 4, label: "Shared" },
  ]);

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [dropIndex, setDropIndex] = useState(0);
  const [releasing, setReleasing] = useState(false);
  const [committing, setCommitting] = useState(false);
  const startY = useRef(0);

  const onDown = useCallback((e: React.PointerEvent, id: number) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) return;
    startY.current = e.clientY;
    setStartIndex(idx);
    setDropIndex(idx);
    setDraggingId(id);
    setDragY(0);
    setReleasing(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, [items]);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (draggingId === null || releasing) return;
    const dy = e.clientY - startY.current;
    setDragY(dy);
    const shift = Math.round(dy / STEP);
    const target = Math.max(0, Math.min(items.length - 1, startIndex + shift));
    if (target !== dropIndex) setDropIndex(target);
  }, [draggingId, items.length, startIndex, dropIndex, releasing]);

  const onUp = useCallback(() => {
    if (draggingId === null) return;
    const targetOffset = (dropIndex - startIndex) * STEP;
    setReleasing(true);
    setDragY(targetOffset);
    window.setTimeout(() => {
      // 提交阶段：数组 reorder（引起 DOM 布局瞬变）和 transform 清零必须在同一帧完成，
      // 且禁掉过渡，否则被挤压项会因为 layout 瞬移 + transform 过渡而出现"跳一下再回来"。
      setCommitting(true);
      if (startIndex !== dropIndex) {
        setItems((prev) => {
          const next = [...prev];
          const [moved] = next.splice(startIndex, 1);
          next.splice(dropIndex, 0, moved);
          return next;
        });
      }
      setDraggingId(null);
      setDragY(0);
      setReleasing(false);
      // 下一帧再把过渡打开（两层 rAF 确保浏览器已应用无过渡的新布局）
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setCommitting(false));
      });
    }, 300);
  }, [draggingId, dropIndex, startIndex]);

  return (
    <div className="w-full max-w-[220px] select-none">
      <div className="flex flex-col" style={{ gap: GAP }}>
        {items.map((item, i) => {
          const isDragging = draggingId === item.id;

          let offset = 0;
          if (!isDragging && draggingId !== null) {
            if (startIndex < dropIndex && i > startIndex && i <= dropIndex) {
              offset = -STEP;
            } else if (startIndex > dropIndex && i < startIndex && i >= dropIndex) {
              offset = STEP;
            }
          }

          const transform = isDragging
            ? `translateY(${dragY}px) scale(${releasing ? 1 : 1.03})`
            : `translateY(${offset}px)`;

          const transition = committing
            ? "none"
            : isDragging
              ? releasing
                ? RELEASE_TRANSITION
                : "none"
              : SHIFT_TRANSITION;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 px-3 touch-none"
              style={{
                height: ROW_H,
                background: isDragging ? "#ffffff" : "rgba(255,255,255,0.85)",
                transform,
                transition,
                zIndex: isDragging ? 10 : 1,
                position: "relative",
                boxShadow: isDragging && !releasing
                  ? "0 8px 24px rgba(0,0,0,0.18)"
                  : "0 1px 0 rgba(0,0,0,0.04)",
                borderRadius: 12,
                willChange: "transform",
              }}
              onPointerDown={(e) => onDown(e, item.id)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{ opacity: 0.45, flexShrink: 0, cursor: "grab" }}
              >
                <circle cx="4" cy="3" r="1" fill="#3c3c43" />
                <circle cx="8" cy="3" r="1" fill="#3c3c43" />
                <circle cx="4" cy="6" r="1" fill="#3c3c43" />
                <circle cx="8" cy="6" r="1" fill="#3c3c43" />
                <circle cx="4" cy="9" r="1" fill="#3c3c43" />
                <circle cx="8" cy="9" r="1" fill="#3c3c43" />
              </svg>
              <span className="text-sm text-neutral-800">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
