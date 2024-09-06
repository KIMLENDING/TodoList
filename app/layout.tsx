import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClientProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TODO ",
  description: "TODO List",
  icons: {
    icon: '/icons/logo.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ConvexClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ConvexClerkProvider>

  );
}
