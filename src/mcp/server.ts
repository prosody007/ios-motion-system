#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";
import {
  getCode,
  getNavigationTree,
  getSectionForMcp,
  listCards,
  listCategories,
  recommendMotion,
  searchMotions,
} from "@/mcp/catalog";

function asResult<T extends Record<string, unknown>>(data: T, text?: string) {
  return {
    content: [
      {
        type: "text" as const,
        text: text ?? JSON.stringify(data, null, 2),
      },
    ],
    structuredContent: data,
  };
}

const server = new McpServer({
  name: "ios-motion-system",
  version: "0.1.0",
});

server.registerTool(
  "list_categories",
  {
    description:
      "列出动效库的全部分类与导航分组，适合 agent 先浏览库结构，再决定查哪一章。",
    outputSchema: {
      navigation: z.array(
        z.object({
          label: z.string(),
          items: z.array(
            z.object({
              slug: z.string(),
              title: z.string(),
              description: z.string(),
              path: z.string(),
            }),
          ),
        }),
      ),
      categories: z.array(
        z.object({
          slug: z.string(),
          title: z.string(),
          description: z.string(),
          group: z.string().nullable(),
          path: z.string(),
        }),
      ),
    },
  },
  async () => {
    const data = {
      navigation: getNavigationTree(),
      categories: listCategories(),
    };
    return asResult(data, `Found ${data.categories.length} motion categories.`);
  },
);

server.registerTool(
  "get_section",
  {
    description:
      "按分类 slug 返回该章节的结构化内容。适合 agent 获取某一章的完整参考信息。",
    inputSchema: {
      slug: z.string().describe("分类 slug，例如 spring-animations / button / carousel"),
    },
  },
  async ({ slug }) => {
    const section = getSectionForMcp(slug);
    if (!section) {
      return asResult({ error: `Unknown section slug: ${slug}` }, `Unknown section slug: ${slug}`);
    }
    return asResult(section, `Loaded section: ${slug}`);
  },
);

server.registerTool(
  "list_cards",
  {
    description:
      "列出某个 cards 类型章节下的所有动效卡片。适合 agent 在章节内挑选具体 demo / 代码条目。",
    inputSchema: {
      slug: z.string().describe("分类 slug，例如 spring-animations / carousel / button"),
    },
  },
  async ({ slug }) => {
    const cards = listCards(slug);
    return asResult(
      {
        slug,
        cards,
      },
      `Found ${cards.length} cards in ${slug}.`,
    );
  },
);

server.registerTool(
  "get_code",
  {
    description:
      "按 previewId 返回最终可复制的 SwiftUI 或 UIKit 代码。支持传入参数覆盖默认模板值。",
    inputSchema: {
      previewId: z.string().describe("卡片的稳定 ID，一般等于 previewId，例如 ios-spring-playground"),
      platform: z.enum(["swift", "uikit"]).describe("目标平台代码"),
      params: z
        .record(z.string(), z.string())
        .optional()
        .describe(
          "可选：模板参数覆盖。例如 {\"speedSec\":\"3.5\"} 或 {\"response\":\"0.45\",\"damping\":\"0.82\"}",
        ),
    },
  },
  async ({ previewId, platform, params }) => {
    const result = getCode(previewId, platform, params ?? {});
    if (!result) {
      return asResult(
        { error: `Unknown previewId: ${previewId}` },
        `Unknown previewId: ${previewId}`,
      );
    }
    return asResult(result, `Resolved ${platform} code for ${previewId}.`);
  },
);

server.registerTool(
  "search_motions",
  {
    description:
      "按自然语言或关键词搜索动效内容。适合 agent 在不知道 slug / previewId 时先找最相关条目。",
    inputSchema: {
      query: z.string().describe("搜索意图，例如“按钮按压反馈”“下拉刷新”“spring 弹性动画”"),
      limit: z.number().int().min(1).max(20).optional().describe("返回数量，默认 8"),
    },
  },
  async ({ query, limit }) => {
    const results = searchMotions(query, limit ?? 8);
    return asResult(
      {
        query,
        count: results.length,
        results,
      },
      `Found ${results.length} motion matches for "${query}".`,
    );
  },
);

server.registerTool(
  "recommend_motion",
  {
    description:
      "按用户意图给出更适合直接实现的动效推荐。适合 agent 在明确业务场景时直接拿候选，再继续 get_code。",
    inputSchema: {
      intent: z.string().describe("用户意图，例如“按钮按压反馈”“卡片展开”“下拉刷新”"),
      platform: z
        .enum(["swift", "uikit"])
        .optional()
        .describe("可选：推荐时偏向哪个平台，主要影响 nextAction.suggestedPlatform"),
      category: z
        .string()
        .optional()
        .describe("可选：把推荐范围限制在某个分类 slug，例如 button / carousel"),
      limit: z.number().int().min(1).max(10).optional().describe("返回数量，默认 5"),
    },
  },
  async ({ intent, platform, category, limit }) => {
    const result = recommendMotion(intent, {
      platform,
      category,
      limit,
    });
    return asResult(
      result,
      `Recommended ${result.count} motions for "${intent}".`,
    );
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ios-motion-system MCP server running on stdio");
}

main().catch((error) => {
  console.error("ios-motion-system MCP server error:", error);
  process.exit(1);
});
