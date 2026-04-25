"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface Props {
  swiftHtml: string;
  uikitHtml: string;
  rawSwift: string;
  rawUikit: string;
}

export function CodeBlockClient({ swiftHtml, uikitHtml, rawSwift, rawUikit }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("swift");

  const handleCopy = useCallback(() => {
    const text = activeTab === "swift" ? rawSwift : rawUikit;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [activeTab, rawSwift, rawUikit]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between mb-1.5">
        <TabsList className="h-7">
          <TabsTrigger value="swift" className="text-xs font-mono px-2.5 h-5">SwiftUI</TabsTrigger>
          <TabsTrigger value="uikit" className="text-xs font-mono px-2.5 h-5">UIKit</TabsTrigger>
        </TabsList>
        <Button variant="ghost" size="sm" className="h-6 text-xs font-mono text-muted-foreground px-2" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <TabsContent value="swift" className="mt-0">
        <div
          className="rounded-lg border bg-muted/30 p-3 overflow-x-auto text-xs leading-relaxed max-h-[28rem] overflow-y-auto [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: swiftHtml }}
        />
      </TabsContent>
      <TabsContent value="uikit" className="mt-0">
        <div
          className="rounded-lg border bg-muted/30 p-3 overflow-x-auto text-xs leading-relaxed max-h-[28rem] overflow-y-auto [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: uikitHtml }}
        />
      </TabsContent>
    </Tabs>
  );
}
