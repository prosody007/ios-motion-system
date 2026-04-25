"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNavGroups, getDocsNavMeta } from "@/data/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const activeSlug = pathname === "/" ? "" : pathname.replace("/", "");

  return (
    <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] w-[304px] shrink-0 border-r border-[rgba(5,5,5,0.06)] bg-white lg:block">
      <div className="docs-sidebar-scrollbar h-full overflow-y-auto px-4 py-4">
        <nav className="space-y-6">
          <div className="space-y-0.5 px-1">
            <Link
              href="/"
              className={`block rounded-md px-3 py-1.5 text-[14px] font-medium leading-7 transition-colors ${
                pathname === "/"
                  ? "bg-[rgba(22,119,255,0.08)] text-[#1677FF]"
                  : "text-[rgba(0,0,0,0.88)] hover:bg-[rgba(0,0,0,0.02)]"
              }`}
            >
              组件总览
            </Link>
            <div className="flex items-center justify-between px-3 py-1.5">
              <span className="text-[14px] font-medium leading-7 text-[rgba(0,0,0,0.88)]">
                更新日志
              </span>
              <span className="rounded-md bg-[rgba(82,196,26,0.10)] px-2 py-[1px] text-[12px] font-medium leading-5 text-[#52C41A]">
                v1.0
              </span>
            </div>
          </div>

          {docsNavGroups.map((group, index) => (
            <section
              key={group.label}
              className={`px-1 ${
                index === 0
                  ? ""
                  : "border-t border-[rgba(5,5,5,0.06)] pt-5"
              }`}
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
        </nav>
      </div>
    </aside>
  );
}
