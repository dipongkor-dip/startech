import type {Metadata} from "next";
import {PcBuilderProvider} from "@/components/pc-builder/PcBuilderContext";

export const metadata: Metadata = {
  title: "PC Builder | Star Tech",
  description: "Build your own computer — pick components and see your build summary.",
};

export default function PcBuilderLayout({children}: {children: React.ReactNode}) {
  return <PcBuilderProvider>{children}</PcBuilderProvider>;
}
