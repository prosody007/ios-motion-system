"use client";

import { useEffect, useState } from "react";
import type { DocsSection } from "@/types/motion";

function renderInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${part}-${index}`}
          className="rounded bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 font-mono text-[13px] text-[rgba(0,0,0,0.82)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(code).then(() => setCopied(true));
      }}
      aria-label={copied ? "Copied" : "Copy code"}
      title={copied ? "Copied" : "Copy code"}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(5,5,5,0.06)] bg-white text-[rgba(0,0,0,0.65)] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
    >
      {copied ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="12" height="12" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

export function DocsSectionView({ section }: { section: DocsSection }) {
  return (
    <div className="space-y-12">
      {section.sections.map((item) => (
        <section key={item.title} className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-[18px] font-semibold leading-7 text-[rgba(0,0,0,0.88)]">
              {item.title}
            </h2>
            {item.paragraphs?.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[14px] leading-7 text-[rgba(0,0,0,0.65)]"
              >
                {renderInlineCode(paragraph)}
              </p>
            ))}
          </div>

          {item.bullets?.length ? (
            <ul className="space-y-2 pl-5">
              {item.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="text-[14px] leading-7 text-[rgba(0,0,0,0.65)]"
                >
                  {renderInlineCode(bullet)}
                </li>
              ))}
            </ul>
          ) : null}

          {item.codeBlocks?.length ? (
            <div className="space-y-4">
              {item.codeBlocks.map((block) => (
                <div
                  key={`${item.title}-${block.title ?? block.language}`}
                  className="overflow-hidden rounded-xl border border-[rgba(5,5,5,0.06)] bg-[rgba(0,0,0,0.015)]"
                >
                  <div className="flex items-center justify-between border-b border-[rgba(5,5,5,0.06)] px-4 py-2.5">
                    <span className="text-[13px] font-medium text-[rgba(0,0,0,0.72)]">
                      {block.title ?? block.language}
                    </span>
                    <span className="text-[12px] uppercase tracking-[0.04em] text-[rgba(0,0,0,0.35)]">
                      {block.language}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute right-4 top-3 z-10">
                      <CopyCodeButton code={block.code} />
                    </div>
                    <pre className="overflow-x-auto px-4 py-4 pr-16 text-[13px] leading-6 text-[rgba(0,0,0,0.78)]">
                    <code>{block.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
