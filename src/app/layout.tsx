import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DeviceProvider } from "@/components/device-context";

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
    <html lang="zh-CN" className="h-full" suppressHydrationWarning>
      <body className="h-[100svh] overflow-hidden antialiased">
        <DeviceProvider>
          <TooltipProvider>
            <div className="flex h-[100svh] w-full">
              <AppSidebar />
              <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-[#f3f4f9] px-10 pb-8 pt-10">
                <div className="min-h-0 flex-1">{children}</div>
              </main>
            </div>
          </TooltipProvider>
        </DeviceProvider>
      </body>
    </html>
  );
}
