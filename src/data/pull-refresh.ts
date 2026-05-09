import type { CardsSection } from "@/types/motion";

export const pullRefreshSection: CardsSection = {
  type: "cards",
  title: "Pull to Refresh",
  description: "下拉刷新与回弹过程。",
  cards: [
    {
      title: "Pull to Refresh",
      tags: [
        { text: "0.32s", variant: "duration" },
        { text: ".spring", variant: "spring" },
      ],
      previewId: "ios-pull-refresh",
      code: `// React — TODO: replace with the React implementation that mirrors the preview.
import SwiftUI

// ===== 方案 A：系统原生 .refreshable（推荐）=====
// 阻尼、spinner、归位全由系统接管，行为统一

struct RefreshableDemo: View {
    @State private var items = ["Today", "Yesterday", "Last Week", "Older"]

    var body: some View {
        List(items, id: \\.self) { Text($0) }
            .refreshable { await loadData() }
    }

    private func loadData() async {
        try? await Task.sleep(for: .seconds(2.25))
    }
}

// ===== 方案 B：自定义 spinner（与本 demo 参数一致）=====
// • 72% 圆弧（恒定缺口，旋转肉眼可见）
// • 下拉阶段：opacity + scale 随进度
// • 刷新：0.75s × 3 圈 = 2.25s 线性旋转
// • 归位：spring(duration: 0.32, bounce: 0.15)

struct PullSpinner: View {
    let progress: Double       // 下拉进度 0...1
    let isRefreshing: Bool
    @State private var rotation: Double = 0

    var body: some View {
        ZStack {
            Circle()
                .stroke(.black.opacity(0.15), lineWidth: 2.2)
            Circle()
                .trim(from: 0, to: 0.72)
                .stroke(
                    .black.opacity(0.75),
                    style: .init(lineWidth: 2.2, lineCap: .round)
                )
                .rotationEffect(.degrees(-90 + rotation))
        }
        .frame(width: 22, height: 22)
        .scaleEffect(0.7 + progress * 0.3)
        .opacity(isRefreshing ? 1 : progress)
        .onChange(of: isRefreshing) { _, spinning in
            if spinning {
                rotation = 0
                withAnimation(.linear(duration: 0.75 * 3)) {
                    rotation = 360 * 3
                }
            } else {
                rotation = 0
            }
        }
    }
}

struct CustomPullToRefresh<Content: View>: View {
    @ViewBuilder var content: () -> Content
    var onRefresh: () async -> Void

    @State private var pullY: CGFloat = 0
    @State private var isRefreshing = false

    private let trigger: CGFloat = 55
    private let maxPull: CGFloat = 140
    private let rubberK: CGFloat = 70   // 橡皮筋收敛系数

    var body: some View {
        ZStack(alignment: .top) {
            PullSpinner(
                progress: min(1, pullY / trigger),
                isRefreshing: isRefreshing
            )
            .padding(.top, 10)

            content()
                .offset(y: pullY)
        }
        .gesture(
            DragGesture()
                .onChanged { v in
                    guard !isRefreshing else { return }
                    pullY = dampen(v.translation.height)
                }
                .onEnded { _ in
                    guard !isRefreshing else { return }
                    if pullY >= trigger {
                        Task { await startRefresh() }
                    } else {
                        withAnimation(.spring(duration: 0.32, bounce: 0.15)) {
                            pullY = 0
                        }
                    }
                }
        )
    }

    private func dampen(_ raw: CGFloat) -> CGFloat {
        guard raw > 0 else { return 0 }
        // 临界前：线性 0.55 阻尼；临界后：指数橡皮筋逼近 maxPull
        if raw * 0.55 <= trigger {
            return raw * 0.55
        }
        let past = raw - trigger / 0.55
        let span = maxPull - trigger
        let y = trigger + span * (1 - exp(-past / rubberK))
        return min(y, maxPull)
    }

    private func startRefresh() async {
        withAnimation(.spring(duration: 0.32, bounce: 0.15)) {
            pullY = trigger
            isRefreshing = true
        }
        await onRefresh()
        try? await Task.sleep(for: .seconds(2.25))
        withAnimation(.spring(duration: 0.32, bounce: 0.15)) {
            pullY = 0
            isRefreshing = false
        }
    }
}`,
    },
  ],
};
