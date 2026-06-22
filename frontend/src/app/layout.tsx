import type {Metadata} from "next";
import "./globals.css";
import {Inter} from "next/font/google";
import {Poppins} from "next/font/google";
import {ThemeProviderWrapper} from "@/providers/ThemeProviderWrapper";
import {StoreProvider} from "@/providers/StoreProvider";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/sonner";
import {AuthProvider} from "@/providers/AuthProvider";

const inter = Inter({subsets: ["latin"], variable: "--font-sans"});
const poppins = Poppins({subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-poppins"});

export const metadata: Metadata = {
  title: "Star Tech",
  description: "Star Tech - Electronics & Gadgets",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProviderWrapper>
          <StoreProvider>
            <AuthProvider>
              <TooltipProvider delay={0}>{children}</TooltipProvider>
              <Toaster richColors position="top-center" />
            </AuthProvider>
          </StoreProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
