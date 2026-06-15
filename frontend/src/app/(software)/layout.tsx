import Navbar from "@/components/Navbar";
import {RootFooter} from "@/components/footer/RootFooter";

export default function layout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <>
      <Navbar></Navbar>
      {children}
      <RootFooter />
    </>
  );
}
