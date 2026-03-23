import type {Metadata} from "next";
import "./globals.css";
import {StoreProvider} from "@/providers/StoreProvider";
import {AuthProvider} from "@/providers/AuthProvider";
import {ThemeProviderWrapper} from "@/providers/ThemeProviderWrapper";
import Navbar from "@/components/Navbar";
import {Inter} from "next/font/google";
import {cn} from "@/lib/utils";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({subsets: ["latin"], variable: "--font-sans"});

export const metadata: Metadata = {
  title: "Star Tech",
  description: "Star Tech - Electronics & Gadgets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="flex min-h-screen flex-col">
        <ThemeProviderWrapper>
          <StoreProvider>
            <AuthProvider>
              <TooltipProvider delay={0}>
                <Navbar />
                <main className="min-h-0 flex flex-1 flex-col">{children}</main>
                <Toaster richColors position="top-center" />
              </TooltipProvider>
            </AuthProvider>
          </StoreProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
