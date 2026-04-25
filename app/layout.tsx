import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import TimezoneCookie from "@/components/TimezoneCookie";

export const metadata: Metadata = {
  title: "PrepWise",
  description:
    "AI-powered mock interview platform for software engineers to practice and improve their coding interview skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col pattern">
        <TimezoneCookie />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
