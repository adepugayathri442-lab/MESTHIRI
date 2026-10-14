import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MESTHIRI | Flooring Craftsmen, Materials & Quotation Platform",
  description:
    "An architectural flooring services platform prototype connecting homeowners with skilled marble and tile craftsmen, material specifications, and conceptual floor previews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-sans bg-[#F6F2E9] text-[#172321] selection:bg-[#245B50] selection:text-[#F6F2E9]">
        {children}
      </body>
    </html>
  );
}
