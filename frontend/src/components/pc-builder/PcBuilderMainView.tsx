"use client";

import * as React from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {toPng} from "html-to-image";
import {toast} from "sonner";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "@/components/ui/breadcrumb";
import {Button, buttonVariants} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {isPcBuilderMultiLineSlot, PC_BUILDER_SECTION_LABEL, PC_BUILDER_SLOTS, type PcBuilderSectionId} from "@/lib/pc-builder-data";
import {getLineWattage} from "@/lib/pc-builder-wattage";
import {savePrintPayload} from "@/lib/pc-builder-print";
import {usePcBuilder} from "@/components/pc-builder/PcBuilderContext";
import {Camera, HomeIcon, Package, Plus, Printer, RefreshCw, Save, ShoppingCart, X, Zap} from "lucide-react";

function formatBdt(n: number) {
  return `৳${n.toLocaleString("en-BD")}`;
}

export function PcBuilderMainView() {
  const router = useRouter();
  const {linesBySlot, clearLineProduct, addExtraLine} = usePcBuilder();
  const [hideUnconfigured, setHideUnconfigured] = React.useState(false);
  const [capturing, setCapturing] = React.useState(false);
  const captureRef = React.useRef<HTMLDivElement>(null);

  const slotsBySection = React.useMemo(() => {
    const map: Record<PcBuilderSectionId, typeof PC_BUILDER_SLOTS> = {core: [], peripherals: []};
    for (const s of PC_BUILDER_SLOTS) {
      map[s.section].push(s);
    }
    return map;
  }, []);

  const {itemCount, total, wattageMax} = React.useMemo(() => {
    let count = 0;
    let sum = 0;
    let wMax = 0;
    for (const slot of PC_BUILDER_SLOTS) {
      const lines = linesBySlot[slot.slug] ?? [];
      for (const line of lines) {
        if (!line.product) continue;
        count += 1;
        sum += line.product.price;
        const w = getLineWattage(slot.slug, line.product);
        wMax += w.max;
      }
    }
    return {itemCount: count, total: sum, wattageMax: wMax};
  }, [linesBySlot]);

  const slotHasSelection = (slug: string) => (linesBySlot[slug] ?? []).some((l) => l.product != null);

  const visibleSlots = (section: PcBuilderSectionId) => {
    const list = slotsBySection[section];
    if (!hideUnconfigured) return list;
    return list.filter((s) => slotHasSelection(s.slug));
  };

  const handleScreenshot = async () => {
    const el = captureRef.current;
    if (!el) {
      toast.error("Nothing to capture.");
      return;
    }
    setCapturing(true);
    try {
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const filename = `pc-builder-star-tech-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.png`;
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Screenshot saved — check your downloads folder.");
    } catch {
      toast.error("Could not create screenshot. Try again or use the browser’s screenshot tool.");
    } finally {
      setCapturing(false);
    }
  };

  const handlePrint = () => {
    savePrintPayload(linesBySlot);
    router.push("/pc-builder/print");
  };

  return (
    <div className="flex flex-1 flex-col bg-muted/30">
      <div className="border-b bg-background">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" className="inline-flex items-center gap-1" />}>
                  <HomeIcon className="size-4" />
                  <span className="sr-only">Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>PC Builder</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div ref={captureRef} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm" data-screenshot-root>
          <div className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Link href="/" className="text-xl font-bold tracking-tight text-chart-2">
              STAR TECH
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1 border-chart-1/40 hover:bg-chart-1/5">
                <ShoppingCart className="size-4 text-chart-1" />
                Add to Cart
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-1 border-chart-1/40 hover:bg-chart-1/5">
                <Save className="size-4 text-chart-1" />
                Save PC
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-1 border-chart-1/40 hover:bg-chart-1/5" onClick={() => handlePrint()}>
                <Printer className="size-4 text-chart-1" />
                Print
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 border-chart-1/40 hover:bg-chart-1/5"
                disabled={capturing}
                onClick={() => void handleScreenshot()}
              >
                <Camera className="size-4 text-chart-1" />
                {capturing ? "Saving…" : "Screenshot"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-b border-border px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
            <div className="flex-1 space-y-3">
              <h1 className="text-lg font-semibold text-chart-2 md:text-xl">PC Builder — Build Your Own Computer — Star Tech</h1>
              <div className="flex items-center gap-2">
                <Checkbox id="hide-unconfigured" checked={hideUnconfigured} onCheckedChange={(v) => setHideUnconfigured(v === true)} />
                <Label htmlFor="hide-unconfigured" className="cursor-pointer text-sm font-normal text-muted-foreground">
                  Hide Unconfigured Components
                </Label>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="rounded-md border border-dashed bg-muted/40 px-4 py-3 text-center sm:min-w-[140px] border-chart-1">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  Estimated Wattage
                  <Badge variant="secondary" className="text-[10px]">
                    BETA
                  </Badge>
                </div>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{itemCount === 0 ? 0 : wattageMax}W</p>
              </div>
              <div className="rounded-md bg-chart-2 px-5 py-3 text-center text-white sm:min-w-[160px]">
                <p className="text-2xl font-bold tabular-nums">{formatBdt(total)}</p>
                <p className="text-sm text-white/90">{itemCount} Items</p>
              </div>
            </div>
          </div>

          {(["core", "peripherals"] as const).map((section) => {
            const rows = visibleSlots(section);
            if (rows.length === 0) return null;
            return (
              <div key={section}>
                <div className="bg-zinc-700 px-4 py-2 text-sm font-semibold text-white sm:px-6">{PC_BUILDER_SECTION_LABEL[section]}</div>
                <ul className="divide-y divide-border">
                  {rows.flatMap((slot) => {
                    const Icon = slot.icon;
                    const lines = linesBySlot[slot.slug] ?? [];
                    const multi = isPcBuilderMultiLineSlot(slot.slug);
                    const anyPicked = lines.some((l) => l.product != null);

                    const lineItems = lines.map((line, lineIdx) => {
                      const picked = line.product;
                      const w = picked ? getLineWattage(slot.slug, picked) : null;

                      return (
                        <li key={`${slot.slug}-${line.id}`} className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-stretch sm:gap-4 sm:px-6">
                          <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                            {picked ? (
                              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/70 sm:size-20">
                                <Package className="size-9 text-muted-foreground/70 sm:size-10" aria-hidden />
                              </div>
                            ) : (
                              <div className="mt-0.5 flex size-16 shrink-0 items-center justify-center rounded-md border border-chart-1/50 text-chart-2 sm:size-14">
                                <Icon className="size-7 sm:size-6" aria-hidden />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                {multi && lineIdx > 0 ? (
                                  <span className="text-sm text-muted-foreground">Additional {slot.label}</span>
                                ) : (
                                  <>
                                    <span className="font-medium text-foreground">{slot.label}</span>
                                    {slot.required ? (
                                      <Badge variant="outline" className="border-muted-foreground/40 text-xs text-muted-foreground">
                                        Required
                                      </Badge>
                                    ) : null}
                                  </>
                                )}
                              </div>

                              {picked ? (
                                <div className="mt-2 space-y-1.5">
                                  <p className="font-heading text-sm font-semibold leading-snug text-foreground sm:text-base">{picked.title}</p>
                                  {w && (w.min > 0 || w.max > 0) ? (
                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Zap className="size-3.5 shrink-0" aria-hidden />
                                      <span>
                                        {w.min}W – {w.max}W
                                      </span>
                                    </p>
                                  ) : null}
                                </div>
                              ) : (
                                <div className="mt-3 space-y-2">
                                  <div className="h-2.5 max-w-md rounded bg-muted" />
                                  <div className="h-2.5 max-w-sm rounded bg-muted/80" />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center sm:pl-2">
                            {picked ? (
                              <>
                                <span className="text-base font-bold tabular-nums text-foreground sm:text-right">{formatBdt(picked.price)}</span>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="size-8 text-muted-foreground hover:text-destructive"
                                    aria-label="Remove"
                                    onClick={() => clearLineProduct(slot.slug, line.id)}
                                  >
                                    <X className="size-4" />
                                  </Button>
                                  <Link
                                    href={`/pc-builder/choose/${slot.slug}?line=${encodeURIComponent(line.id)}`}
                                    className={cn(buttonVariants({variant: "ghost", size: "icon-sm"}), "size-8 text-muted-foreground hover:text-chart-2")}
                                    aria-label="Change part"
                                  >
                                    <RefreshCw className="size-4" />
                                  </Link>
                                </div>
                              </>
                            ) : (
                              <Link
                                href={`/pc-builder/choose/${slot.slug}?line=${encodeURIComponent(line.id)}`}
                                className={cn(buttonVariants({variant: "outline", size: "default"}), "border-chart-2 rounded text-chart-2 hover:bg-chart-1/10 sm:w-28")}
                              >
                                Choose
                              </Link>
                            )}
                          </div>
                        </li>
                      );
                    });

                    const addAnother =
                      multi && anyPicked ? (
                        <li key={`${slot.slug}-add`} className="bg-muted/20 px-4 py-3 sm:px-6">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1 border-chart-1 text-chart-2 hover:bg-chart-1/10"
                            onClick={() => addExtraLine(slot.slug)}
                          >
                            <Plus className="size-4" />
                            Add Another {slot.label}
                          </Button>
                        </li>
                      ) : null;

                    return addAnother ? [...lineItems, addAnother] : lineItems;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
