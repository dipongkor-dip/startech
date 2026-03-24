import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Print PC build | Star Tech",
  description: "Printable quotation for your PC Builder configuration.",
};

export default function PcBuilderPrintLayout({children}: {children: React.ReactNode}) {
  return children;
}
