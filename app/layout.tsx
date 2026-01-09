import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Classification Curation",
  description: "Dell Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`flex gap-6 bg-gray-100 antialiased h-screen w-screen overflow-hidden p-4`}
      >
        {children}
      </body>
    </html>
  );
}
