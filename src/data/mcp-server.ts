import type { DocsSection } from "@/types/motion";

export const mcpServerSection: DocsSection = {
  type: "docs",
  title: "MCP Server",
  description:
    "配置 MCP client 后，Motion System MCP server 会由客户端自动拉起。接入后可直接查询动效分类、卡片和 SwiftUI / UIKit 代码。",
  sections: [
    {
      title: "Quick Start",
      paragraphs: [
        "先选择你的 MCP client，然后运行对应的初始化命令。配置写入后，重启客户端即可。正常使用时不需要手动执行 `npm run mcp`。",
      ],
      codeBlocks: [
        {
          title: "Cursor",
          language: "bash",
          code: "npx ios-motion-system@latest mcp init --client cursor",
        },
        {
          title: "Claude",
          language: "bash",
          code: "npx ios-motion-system@latest mcp init --client claude",
        },
        {
          title: "VS Code",
          language: "bash",
          code: "npx ios-motion-system@latest mcp init --client vscode",
        },
        {
          title: "Codex",
          language: "bash",
          code: "npx ios-motion-system@latest mcp init --client codex",
        },
      ],
    },
    {
      title: "Local Repository",
      paragraphs: [
        "如果你还没有把包发布到 npm，可以直接在仓库里运行本地版 init 命令。加上 `--local` 后，生成的配置会直接指向当前仓库里的 launcher 脚本。",
      ],
      codeBlocks: [
        {
          title: "本地仓库接入 Cursor",
          language: "bash",
          code: "node ./bin/ios-motion-system.cjs mcp init --client cursor --local",
        },
        {
          title: "本地仓库接入 Claude",
          language: "bash",
          code: "node ./bin/ios-motion-system.cjs mcp init --client claude --local",
        },
      ],
    },
    {
      title: "Manual Debug",
      paragraphs: [
        "`npm run mcp` 只用于手动调试或排查客户端连接问题，不是正常接入步骤。",
      ],
      codeBlocks: [
        {
          title: "手动启动服务",
          language: "bash",
          code: "npm run mcp",
        },
      ],
    },
    {
      title: "Manual Config",
      codeBlocks: [
        {
          title: ".cursor/mcp.json",
          language: "json",
          code: `{
  "mcpServers": {
    "ios-motion-system": {
      "command": "npx",
      "args": ["ios-motion-system@latest", "mcp"]
    }
  }
}`,
        },
        {
          title: ".mcp.json",
          language: "json",
          code: `{
  "mcpServers": {
    "ios-motion-system": {
      "command": "npx",
      "args": ["ios-motion-system@latest", "mcp"]
    }
  }
}`,
        },
        {
          title: ".vscode/mcp.json",
          language: "json",
          code: `{
  "servers": {
    "ios-motion-system": {
      "command": "npx",
      "args": ["ios-motion-system@latest", "mcp"]
    }
  }
}`,
        },
        {
          title: "~/.codex/config.toml",
          language: "toml",
          code: `[mcp_servers.ios-motion-system]
command = "npx"
args = ["ios-motion-system@latest", "mcp"]`,
        },
      ],
    },
    {
      title: "Tools",
      bullets: [
        "`list_categories`：返回分类与导航树",
        "`get_section`：返回单个章节内容",
        "`list_cards`：返回某个 cards 章节下的全部卡片",
        "`get_code`：返回最终 SwiftUI / UIKit 代码",
        "`search_motions`：按关键词搜索动效",
        "`recommend_motion`：按意图返回推荐候选",
        "所有 tools 都返回 `structuredContent`",
      ],
    },
    {
      title: "Common Usage",
      codeBlocks: [
        {
          title: "按分类获取卡片",
          language: "json",
          code: `{
  "tool": "list_cards",
  "arguments": {
    "slug": "spring-animations"
  }
}`,
        },
        {
          title: "直接获取代码",
          language: "json",
          code: `{
  "tool": "get_code",
  "arguments": {
    "previewId": "ios-carousel",
    "platform": "swift",
    "params": {
      "speedSec": "3.5"
    }
  }
}`,
        },
        {
          title: "按意图推荐",
          language: "json",
          code: `{
  "tool": "recommend_motion",
  "arguments": {
    "intent": "按钮按压反馈",
    "platform": "swift"
  }
}`,
        },
      ],
    },
    {
      title: "Response Examples",
      codeBlocks: [
        {
          title: "list_cards Response",
          language: "json",
          code: `{
  "slug": "spring-animations",
  "cards": [
    {
      "id": "ios-spring-playground",
      "previewId": "ios-spring-playground",
      "title": "Spring Playground",
      "tags": ["preset", "custom", "physics", "choreography"],
      "codePlatforms": ["swift", "uikit"]
    }
  ]
}`,
        },
        {
          title: "get_code Response",
          language: "json",
          code: `{
  "id": "ios-carousel",
  "previewId": "ios-carousel",
  "platform": "swift",
  "params": {
    "speedSec": "3.5"
  },
  "code": "struct PagerView: View { ... }"
}`,
        },
        {
          title: "recommend_motion Response",
          language: "json",
          code: `{
  "intent": "卡片展开",
  "count": 2,
  "recommendations": [
    {
      "id": "ios-spring-matched-geometry",
      "title": "Matched Geometry · 卡片折叠展开",
      "nextAction": {
        "tool": "get_code",
        "previewId": "ios-spring-matched-geometry",
        "suggestedPlatform": "swift"
      }
    }
  ]
}`,
        },
      ],
    },
    {
      title: "Dynamic Parameters",
      bullets: [
        "`ios-spring-playground`：支持 `response`、`damping`、`bounce`、`stiffness`、`dampingCoef`、`duration`、`swiftProps`、`uikitProps`",
        "`ios-carousel*`：支持 `speedSec`",
        "调用 `get_code` 时可以用 `params` 覆盖默认值",
      ],
    },
    {
      title: "Troubleshooting",
      bullets: [
        "服务启动失败：先在终端单独运行 `npm run mcp`",
        "拿不到代码：检查 `previewId` 是否真实存在",
        "动态参数没生效：确认 `params` 传的是字符串键值对",
        "安装依赖失败：优先检查本机代理环境变量",
      ],
    },
  ],
};
