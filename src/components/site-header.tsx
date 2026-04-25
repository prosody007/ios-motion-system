import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-[rgba(5,5,5,0.06)] bg-white/92 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-full w-full items-center px-10">
        <div className="flex w-[304px] shrink-0 items-center">
          <Link href="/" className="flex min-w-0 items-center gap-3">
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

        <div className="flex min-w-0 flex-1 items-center justify-between pl-10">
          <div />
          <div className="hidden lg:block">
            <button
              type="button"
              className="inline-flex h-8 items-center gap-2 rounded-md border border-[rgba(5,5,5,0.06)] bg-white px-3 text-[12px] font-medium text-[rgba(0,0,0,0.65)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[rgba(0,0,0,0.015)]"
              aria-label="GitHub Star"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="text-[rgba(0,0,0,0.72)]"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.1c.58.1.79-.25.79-.56v-2.01c-3.2.7-3.88-1.35-3.88-1.35-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.97.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.27-5.23-5.68 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.93 10.93 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.68 5.39-5.24 5.67.41.36.78 1.08.78 2.18v3.23c0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              <span>GitHub</span>
              <span className="text-[rgba(0,0,0,0.35)]">Star</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
