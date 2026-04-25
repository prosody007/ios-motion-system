export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[rgba(5,5,5,0.06)] pt-8 text-sm text-[rgba(0,0,0,0.45)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p>Motion System ©2026 iOS 交互动效规范</p>
        <div className="flex items-center gap-4">
          <span>Next.js</span>
          <span>shadcn/ui</span>
          <span>v1.0</span>
        </div>
      </div>
    </footer>
  );
}
