"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCardParams, substituteParams } from "@/components/card-context";

export function CodeToggle({ codes }: { codes: { swift: string; uikit: string } }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={open ? "secondary" : "outline"}
        size="sm"
        className="h-6 text-xs font-mono px-2.5 flex-shrink-0 inline-flex items-center gap-1.5"
        onClick={() => setOpen((o) => !o)}
      >
        <CodeIcon />
        {open ? "Hide" : "Code"}
      </Button>
      {open && (
        <div className="w-full mt-3 basis-full">
          <InlineCodeBlock codes={codes} />
        </div>
      )}
    </>
  );
}

function InlineCodeBlock({ codes }: { codes: { swift: string; uikit: string } }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("swift");
  const { params } = useCardParams();

  const swift = useMemo(() => substituteParams(codes.swift, params), [codes.swift, params]);
  const uikit = useMemo(() => substituteParams(codes.uikit, params), [codes.uikit, params]);

  const handleCopy = useCallback(() => {
    const text = activeTab === "swift" ? swift : uikit;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [activeTab, swift, uikit]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center mb-1.5">
        <TabsList className="h-7">
          <TabsTrigger value="swift" className="text-xs font-mono px-2.5 h-5">SwiftUI</TabsTrigger>
          <TabsTrigger value="uikit" className="text-xs font-mono px-2.5 h-5">UIKit</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="swift" className="mt-0">
        <CodeBlock code={swift} copied={copied} onCopy={handleCopy} />
      </TabsContent>
      <TabsContent value="uikit" className="mt-0">
        <CodeBlock code={uikit} copied={copied} onCopy={handleCopy} />
      </TabsContent>
    </Tabs>
  );
}

function CodeIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 1024 1024"
      fill="currentColor"
      aria-hidden
    >
      <path d="M621.568 208.299a38.101 38.101 0 0 0-73.941-18.518L386.773 833.28a38.101 38.101 0 0 0 73.899 18.475l160.853-643.456zM325.632 294.4a38.101 38.101 0 0 1 0 53.888L162.347 511.573 325.632 674.86a38.101 38.101 0 0 1-53.845 53.888L81.493 538.539a38.101 38.101 0 0 1 0-53.931L271.787 294.4a38.101 38.101 0 0 1 53.888 0z m372.736 0a38.101 38.101 0 0 0 0 53.888l163.285 163.285L698.368 674.86a38.101 38.101 0 0 0 53.888 53.888l190.25-190.208a38.101 38.101 0 0 0 0-53.931L752.257 294.4a38.101 38.101 0 0 0-53.888 0z" />
    </svg>
  );
}

function CodeBlock({
  code,
  copied,
  onCopy,
}: {
  code: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="relative">
      <pre className="rounded-lg border bg-muted/30 p-3 pr-16 overflow-x-auto text-xs leading-relaxed max-h-[28rem] overflow-y-auto whitespace-pre-wrap">
        {code}
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy code"}
        className="absolute top-3 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors"
        style={{
          right: 20,
          background: copied ? "#16a34a" : "#ffffff",
          color: copied ? "#ffffff" : "#000000",
          border: copied ? "1px solid #16a34a" : "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 16px 24px rgba(3,4,6,0.1)",
        }}
      >
        {copied ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="12" height="12" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}
