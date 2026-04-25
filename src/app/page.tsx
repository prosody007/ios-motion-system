import Link from "next/link";
import { categories } from "@/data/categories";
import { docsNavGroups } from "@/data/navigation";

export default function Home() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-[38px] font-semibold leading-[1.2] tracking-[-0.02em] text-[rgba(0,0,0,0.88)]">
          组件总览
        </h1>
        <p className="mt-4 max-w-[880px] text-[14px] leading-7 text-[rgba(0,0,0,0.65)]">
          面向 iOS 商业应用的交互动效参考库，覆盖按钮、表单、列表、弹层、手势、转场与高级动效。
          每个分类都附带可直接复制的 SwiftUI / UIKit 示例代码，帮助开发统一实现时长、曲线与反馈表现。
        </p>
      </div>

      <div className="space-y-14">
        {docsNavGroups.map((group) => {
          const groupItems = group.slugs
            .map((slug) => categories.find((item) => item.slug === slug))
            .filter((item): item is (typeof categories)[number] => Boolean(item));

          return (
            <section key={group.label}>
              <div className="mb-6 flex items-baseline gap-1.5">
                <h2 className="text-[28px] font-semibold leading-9 text-[rgba(0,0,0,0.88)]">
                  {group.label}
                </h2>
                <span className="text-[20px] leading-8 text-[rgba(0,0,0,0.25)]">
                  {groupItems.length}
                </span>
              </div>

              <div className="grid gap-x-12 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
                {groupItems.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${item.slug}`}
                    className="group block py-0.5 transition-colors"
                  >
                    <div className="text-[16px] font-medium leading-7 text-[rgba(0,0,0,0.88)] transition-colors group-hover:text-[#1677FF]">
                      {item.title}
                    </div>
                    <p className="mt-0.5 text-[14px] leading-6 text-[rgba(0,0,0,0.45)]">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
