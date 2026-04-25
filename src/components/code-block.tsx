import { codeToHtml } from "shiki";
import { CodeBlockClient } from "./code-block-client";

interface CodeBlockProps {
  codes: { swift: string; uikit: string };
}

export async function CodeBlock({ codes }: CodeBlockProps) {
  const [swiftHtml, uikitHtml] = await Promise.all([
    codeToHtml(codes.swift, {
      lang: "swift",
      theme: "github-light",
    }),
    codeToHtml(codes.uikit, {
      lang: "swift",
      theme: "github-light",
    }),
  ]);

  return <CodeBlockClient swiftHtml={swiftHtml} uikitHtml={uikitHtml} rawSwift={codes.swift} rawUikit={codes.uikit} />;
}
