"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { docsNavGroups, getDocsNavMeta } from "@/data/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const activeSlug = pathname === "/" ? "" : pathname.replace("/", "");

  return (
    <aside className="hidden h-[100svh] w-[304px] shrink-0 flex-col bg-[#f3f4f9] lg:flex">
      <div className="shrink-0 px-4 pt-10">
        <Link href="/" className="flex min-w-0 items-center gap-3 px-3">
          <Image
            src="/brand/logo-mark.png"
            alt="Motion System logo"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0"
          />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-medium leading-6 text-[rgba(0,0,0,0.88)]">
              Motion System
            </div>
            <div className="truncate text-[12px] leading-4 text-[rgba(0,0,0,0.45)]">
              iOS 交互动效规范
            </div>
          </div>
        </Link>
      </div>
      <div
        className="docs-sidebar-scrollbar mt-6 min-h-0 flex-1 overflow-y-auto px-4"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          scrollbarGutter: "stable",
          willChange: "scroll-position",
        }}
      >
        <nav className="space-y-12">
          {docsNavGroups.map((group) => (
            <section
              key={group.label}
              className="px-1"
            >
              <div className="px-3">
                <div className="text-[14px] font-medium leading-7 text-[rgba(0,0,0,0.88)]">
                  {group.label}
                </div>
              </div>
              <ul className="mt-2.5 space-y-0">
                {group.slugs.map((slug) => {
                  const isActive = activeSlug === slug;
                  const meta = getDocsNavMeta(slug);

                  return (
                    <li key={slug}>
                      <Link
                        href={`/${slug}`}
                        className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 transition-colors ${
                          isActive
                            ? "bg-[rgba(22,119,255,0.10)]"
                            : "hover:bg-[rgba(0,0,0,0.02)]"
                        }`}
                      >
                        <span
                          className={`text-[14px] leading-7 ${
                            isActive
                              ? "font-medium text-[#1677FF]"
                              : "font-normal text-[rgba(0,0,0,0.88)]"
                          }`}
                        >
                          {meta.primary}
                        </span>
                        {meta.secondary ? (
                          <span
                            className={`text-[14px] leading-7 ${
                              isActive
                                ? "text-[rgba(22,119,255,0.72)]"
                                : "text-[rgba(0,0,0,0.45)]"
                            }`}
                          >
                            {meta.secondary}
                          </span>
                        ) : null}
                        {meta.badge ? (
                          <span className="ml-auto text-[12px] leading-6 text-[#52C41A]">
                            {meta.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {/* 底部留白：让最末项与窗口底部之间多出 80px 间距 */}
          <div aria-hidden="true" style={{ height: 80 }} />
        </nav>
      </div>
    </aside>
  );
}
