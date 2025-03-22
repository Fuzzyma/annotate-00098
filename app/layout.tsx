import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ArtProvider } from "@/context/art-context";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Art Gallery",
  description: "Explore artwork from various artists",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ArtProvider>
            <div className="min-h-screen flex flex-col max-w-6xl mx-auto">
              <Navbar />
              <main className="flex-1 container mx-auto py-6 px-4">
                {children}
              </main>
              <footer className="border-t py-4">
                <div className="container mx-auto text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Art Gallery. All rights reserved.
                </div>
              </footer>
            </div>
            <Toaster />
          </ArtProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
