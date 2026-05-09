# Navigation

Push / Pop 导航转场。

## Push / Pop Transition

- Preview ID：`ios-nav-push`
- Tags：`0.35s` (duration) · `.default curve` (easing)

### AI Motion Spec

标准导航 Push / Pop：新页面从右进入，返回时向右退出。

#### Motion

| Key | Value |
|---|---|
| push | incoming view from right, current view shifts left/back |
| pop | reverse direction on back |

#### Constraints

| Key | Value |
|---|---|
| do_not_change | 不要做 crossfade 代替 push/pop spatial transition |

### Code

```tsx
// React — TODO: replace with the React implementation that mirrors the preview.
NavigationStack {
    List {
        NavigationLink("Detail", value: item)
    }
    .navigationDestination(for: Item.self) { item in
        DetailView(item: item)
    }
}

// 系统 Push 动画参数：
// duration: 0.35s
// curve: UIKit default (.curveEaseInOut 变体)
// 新页面从右侧 100% 宽度滑入
// 旧页面向左移动约 30% 宽度

// iOS 18+
.navigationTransition(.slide)
.navigationTransition(.zoom(sourceID: id, in: ns))
```

