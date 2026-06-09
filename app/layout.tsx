import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";
import { CustomCursor } from "./components/CustomCursor";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "黄锡源 HXY / AIPM - AI 产品经理",
  description:
    "黄锡源 (HXY)，AI 产品经理。聚焦模型、Agent 与 Workflow 的产品化设计，把前沿能力转化为真实可用的产品体验。",
  openGraph: {
    title: "黄锡源 HXY / AIPM - AI 产品经理",
    description:
      "黄锡源 (HXY)，AI 产品经理。聚焦模型、Agent 与 Workflow 的产品化设计，把前沿能力转化为真实可用的产品体验。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-deepest text-text-primary font-body">
        <SmoothScroll />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
