import {RootFooter} from "@/components/footer/RootFooter";
import Navbar from "@/components/soft/Navbar";

export default function layout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <>
      <Navbar></Navbar>
      {children}
      <RootFooter />
    </>
  );
}
