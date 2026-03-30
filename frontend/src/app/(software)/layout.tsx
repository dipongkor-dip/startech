import {StoreProvider} from "@/providers/StoreProvider";
import {AuthProvider} from "@/providers/AuthProvider";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster} from "@/components/ui/sonner";
import {SiteChrome} from "@/components/SiteChrome";

export default function SoftwareLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
  <StoreProvider>
    <AuthProvider>
      <TooltipProvider delay={0}>
        <SiteChrome>{children}</SiteChrome>
        <Toaster richColors position="top-center" />
      </TooltipProvider>
    </AuthProvider>
  </StoreProvider>
  );
}
