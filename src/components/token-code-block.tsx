"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TokenCodeBlock({ html, raw }: { html: string; raw: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(raw).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="relative rounded-xl border bg-muted/30 overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 h-7 text-xs font-mono text-muted-foreground z-10"
        onClick={handleCopy}
      >
        {copied ? "Copied!" : "Copy"}
      </Button>
      <div
        className="p-4 pr-20 overflow-x-auto text-xs leading-relaxed [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
