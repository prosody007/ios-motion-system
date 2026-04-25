## iOS Motion System

一个面向 iOS 交互动效的参考库：

- 给人看：Web 文档站，直接预览动画、调参数、复制 SwiftUI / UIKit 代码
- 给工具看：内置 MCP server，供 agent / IDE 按章节、卡片、平台和意图查询动效代码

## Web 本地预览

先启动开发服务器：

```bash
npm run dev
```

然后访问 [http://localhost:3000](http://localhost:3000)。

## MCP 本地运行

正常接入时，MCP client 会自动拉起服务。

发布到 npm 后，推荐直接运行：

```bash
npx ios-motion-system@latest mcp init --client cursor
```

或者：

```bash
npx ios-motion-system@latest mcp init --client claude
```

如果你还在本地仓库里调试，可以运行：

```bash
node ./bin/ios-motion-system.cjs mcp init --client cursor --local
```

手动配置时，可使用：

```json
{
  "mcpServers": {
    "ios-motion-system": {
      "command": "npx",
      "args": ["ios-motion-system@latest", "mcp"]
    }
  }
}
```

如果需要手动调试或排查客户端连接问题，再执行：

```bash
npm run mcp
```

当前提供的核心 tools：

- `list_categories`
- `get_section`
- `list_cards`
- `get_code`
- `search_motions`
- `recommend_motion`

站内文档页面：

- `/mcp-server`：MCP 协议、架构、tool 契约、请求/响应样例

### `get_code` 示例

```json
{
  "previewId": "ios-spring-playground",
  "platform": "swift",
  "params": {
    "response": "0.45",
    "damping": "0.82"
  }
}
```

### 动态模板参数

MCP 会自动给部分动态代码片段注入默认参数：

- `ios-spring-playground`
  - `response`
  - `damping`
  - `bounce`
  - `stiffness`
  - `dampingCoef`
  - `duration`
  - `swiftProps`
  - `uikitProps`
- `ios-carousel*`
  - `speedSec`

你也可以在 `get_code` 里传 `params` 覆盖这些默认值。

## 数据结构

现有内容主要来自：

- `src/data/*.ts`：各章节数据
- `src/data/index.ts`：`slug -> section`
- `src/types/motion.ts`：类型定义
- `src/mcp/catalog.ts`：MCP 查询与代码适配层
- `src/mcp/server.ts`：MCP server 入口

## 后续可扩展方向

- 给卡片补 `keywords` / `scenarios`
- 增加 `recommend_motion` 之类的意图推荐 tool
- 给 MCP 增加资源型输出，例如章节摘要、参数参考表
