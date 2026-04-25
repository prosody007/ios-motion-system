import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { codeToHtml } from "shiki";
import type { TokenSection } from "@/types/motion";
import { TokenCodeBlock } from "./token-code-block";

export async function TokenSectionView({ section }: { section: TokenSection }) {
  const html = await codeToHtml(section.codeSnippet, {
    lang: "swift",
    theme: "github-light",
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs uppercase tracking-wider font-semibold">Token</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold">值</TableHead>
              <TableHead className="text-xs uppercase tracking-wider font-semibold">用途</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {section.tokens.map((token) => (
              <TableRow key={token.name}>
                <TableCell className="font-mono text-xs text-[#0051D5]">{token.name}</TableCell>
                <TableCell className="font-mono text-xs">
                  {token.value}
                  {token.bar > 0 && (
                    <span
                      className="inline-block h-1 rounded-full bg-[#007AFF] ml-2 align-middle"
                      style={{ width: token.bar }}
                    />
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{token.desc}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TokenCodeBlock html={html} raw={section.codeSnippet} />
    </div>
  );
}
