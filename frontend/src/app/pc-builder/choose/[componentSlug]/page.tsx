"use server";

import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Suspense} from "react";
import {PcComponentChooseView} from "@/components/pc-builder/PcComponentChooseView";
import {getPcBuilderSlot} from "@/lib/pc-builder-data";
import {getMockProductsForPcComponent} from "@/lib/pc-builder-mock-products";

type Props = {params: Promise<{componentSlug: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {componentSlug} = await params;
  const slot = getPcBuilderSlot(componentSlug);
  if (!slot) return {title: "PC Builder | Star Tech"};
  return {
    title: `Choose ${slot.chooseTitle} | PC Builder | Star Tech`,
  };
}

export async function generateStaticParams() {
  return [
    {componentSlug: "cpu"},
    {componentSlug: "cpu-cooler"},
    {componentSlug: "motherboard"},
    {componentSlug: "ram"},
    {componentSlug: "storage"},
    {componentSlug: "graphics-card"},
    {componentSlug: "power-supply"},
    {componentSlug: "casing"},
    {componentSlug: "monitor"},
    {componentSlug: "casing-cooler"},
    {componentSlug: "keyboard"},
    {componentSlug: "mouse"},
    {componentSlug: "speaker"},
    {componentSlug: "headphone"},
    {componentSlug: "wifi-adapter"},
    {componentSlug: "antivirus"},
    {componentSlug: "ups"},
  ];
}

export default async function PcBuilderChoosePage({params}: Props) {
  const {componentSlug} = await params;
  const slot = getPcBuilderSlot(componentSlug);
  if (!slot) notFound();

  const products = getMockProductsForPcComponent(slot.slug);

  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-muted-foreground">Loading…</div>}>
      <PcComponentChooseView slot={slot} products={products} />
    </Suspense>
  );
}
