import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/ui/Providers";

export const metadata: Metadata = {
  title: "maxOS — objectively better, open source.",
  description:
    "maxOS is an engineering solution to human aesthetics. Data-driven, evidence-based optimization. Not a course. Not a cult.",
  keywords: ["aesthetics", "looksmaxing", "self-improvement", "skincare", "fitness", "posture"],
  openGraph: {
    title: "maxOS",
    description: "objectively better, open source.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        <div className="scan-line" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
