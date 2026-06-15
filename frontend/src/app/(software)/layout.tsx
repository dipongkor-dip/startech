import {DemoSiteChrome} from "@/components/DemoChrome";
import DemoNavbar from "@/components/DemoNavbar";
import {RootFooter} from "@/components/footer/RootFooter";
import {SiteChrome} from "@/components/SiteChrome";

export default function SoftwareLayout({children}: Readonly<{children: React.ReactNode}>) {
  // return <SiteChrome>{children}</SiteChrome>;
  return (
    <>
      <DemoNavbar></DemoNavbar>
      {children}
      <RootFooter />
    </>
  );
}
