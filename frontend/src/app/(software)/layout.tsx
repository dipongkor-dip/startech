import { DemoSiteChrome } from "@/components/DemoChrome";
import {SiteChrome} from "@/components/SiteChrome";

export default function SoftwareLayout({children}: Readonly<{children: React.ReactNode}>) {
  // return <SiteChrome>{children}</SiteChrome>;
  return <DemoSiteChrome>{children}</DemoSiteChrome>;
}
