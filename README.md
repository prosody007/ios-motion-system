## iOS Motion System

iOS 交互动效参考库，提供可预览示例、参数说明与 SwiftUI / UIKit 实现代码。

## Web 本地预览

先启动开发服务器：

```bash
npm run dev
```

然后访问 [http://localhost:3000](http://localhost:3000)。

## MCP 本地运行

配置完成后，支持 MCP 的客户端会自动拉起服务。

发布到 npm 后，推荐直接运行：

```bash
npx ios-motion-system@latest mcp init --client cursor
```

或者：

```bash
npx ios-motion-system@latest mcp init --client claude
```

如果当前使用的是本地仓库，可以运行：

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

用于本地调试或排查连接问题：

```bash
npm run mcp
```

当前提供的 tools：

- `list_categories`
- `get_section`
- `list_cards`
- `get_code`
- `search_motions`
- `recommend_motion`

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

可以在 `get_code` 中通过 `params` 覆盖默认值。
