import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
