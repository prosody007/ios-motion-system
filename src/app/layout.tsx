import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Motion System — iOS 交互动效规范",
  description: "iOS 交互动效规范看板，包含 Spring 曲线、组件动效、手势、触觉反馈等完整代码参考。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="h-[100svh] overflow-hidden antialiased">
        <TooltipProvider>
          <SiteHeader />
          <div className="flex h-[calc(100svh-4rem)] w-full mt-16">
            <AppSidebar />
            <main className="flex min-w-0 flex-1 justify-center overflow-hidden">
              <div className="flex h-full w-full max-w-[1280px] min-h-0 flex-col px-10 pb-8 pt-10">
                <div className="min-h-0 flex-1">{children}</div>
                <SiteFooter />
              </div>
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
