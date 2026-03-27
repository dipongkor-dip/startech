import type {Metadata} from "next";
import "./globals.css";
import {StoreProvider} from "@/providers/StoreProvider";
import {AuthProvider} from "@/providers/AuthProvider";
import {ThemeProviderWrapper} from "@/providers/ThemeProviderWrapper";
import {Inter} from "next/font/google";
import {cn} from "@/lib/utils";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/sonner";
import {SiteChrome} from "@/components/SiteChrome";

const inter = Inter({subsets: ["greek-ext"], variable: "--sans-serif"});

export const metadata: Metadata = {
  title: "Star Tech",
  description: "Star Tech - Electronics & Gadgets",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={cn("sans-serif", inter.variable)}>
      <body className="flex min-h-screen flex-col">
        <ThemeProviderWrapper>
          <StoreProvider>
            <AuthProvider>
              <TooltipProvider delay={0}>
                <SiteChrome>{children}</SiteChrome>
                <Toaster richColors position="top-center" />
              </TooltipProvider>
            </AuthProvider>
          </StoreProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
