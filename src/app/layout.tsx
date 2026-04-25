import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <TooltipProvider>
          <SiteHeader />
          <div className="flex w-full pt-16">
            <AppSidebar />
            <main className="flex min-w-0 flex-1 justify-center">
              <div className="flex min-h-[calc(100svh-4rem)] w-full max-w-[1280px] flex-col px-10 pb-20 pt-10">
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
