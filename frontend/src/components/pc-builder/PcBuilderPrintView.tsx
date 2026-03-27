"use client";

import * as React from "react";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {
  buildPrintTableRows,
  loadPrintPayload,
  sumPrintTotals,
  type PcPrintPayloadV1,
  type PcPrintTableRow,
} from "@/lib/pc-builder-print";
import type {PcSlotLine} from "@/lib/pc-builder-data";

function formatMoney(n: number | null, empty = "—"): string {
  if (n == null) return empty;
  return `${n.toLocaleString("en-BD")}৳`;
}

function rowsFromPayload(payload: PcPrintPayloadV1): PcPrintTableRow[] {
  return buildPrintTableRows(payload.linesBySlot as Record<string, PcSlotLine[]>);
}

export function PcBuilderPrintView() {
  const [rows, setRows] = React.useState<PcPrintTableRow[]>([]);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);
  const [pageUrl, setPageUrl] = React.useState("");
  const printedRef = React.useRef(false);

  React.useEffect(() => {
    const payload = loadPrintPayload();
    setPageUrl(typeof window !== "undefined" ? window.location.href : "");
    if (payload) {
      setSavedAt(payload.savedAt);
      setRows(rowsFromPayload(payload));
    }
  }, []);

  const {priceSum, regularSum} = React.useMemo(() => sumPrintTotals(rows), [rows]);

  React.useEffect(() => {
    if (rows.length === 0 || printedRef.current) return;
    printedRef.current = true;
    const t = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(t);
  }, [rows]);

  const formattedTime = savedAt
    ? new Date(savedAt).toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

  return (
    <div className="min-h-screen bg-white text-black print:min-h-0">
      <div className="mx-auto max-w-4xl px-6 py-4 print:max-w-none print:px-8 print:py-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="text-sm text-muted-foreground">Print preview opens automatically. Use your browser to save as PDF.</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
              Print again
            </Button>
            <Link href="/pc-builder" className={buttonVariants({size: "sm"})}>
              Back to PC Builder
            </Link>
          </div>
        </div>

        <header className="mb-6 border-b border-neutral-300 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs text-neutral-600 print:text-[10px]">{formattedTime}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-blue-600 print:text-xl">Star Tech</h1>
              <p className="mt-2 text-lg font-semibold text-red-600 print:text-base">Star Tech Ltd</p>
              <div className="mt-1 space-y-0.5 text-sm text-neutral-800 print:text-xs">
                <p>Tel: +880-9666-772334, +880-1755-662255</p>
                <p>Email: info@startech.com.bd</p>
                <p>Web: www.startech.com.bd</p>
              </div>
            </div>
            <div className="text-right text-sm text-neutral-600 print:text-xs">
              <p className="font-medium text-neutral-900">PC build quotation</p>
              <p className="mt-1">PC Builder</p>
            </div>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-neutral-400 text-sm print:text-xs">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border border-neutral-400 px-3 py-2 text-left font-semibold">Component</th>
                <th className="border border-neutral-400 px-3 py-2 text-left font-semibold">Product Name</th>
                <th className="border border-neutral-400 px-3 py-2 text-right font-semibold">Price</th>
                <th className="border border-neutral-400 px-3 py-2 text-right font-semibold">Regular Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="border border-neutral-400 px-3 py-8 text-center text-neutral-600">
                    No build data found. Go back to the PC Builder and click <strong>Print</strong> again.
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={`${row.component}-${i}`} className="align-top">
                    <td className="border border-neutral-400 px-3 py-2 font-medium">{row.component}</td>
                    <td className="border border-neutral-400 px-3 py-2">{row.productName || " "}</td>
                    <td className="border border-neutral-400 px-3 py-2 text-right tabular-nums">{formatMoney(row.price)}</td>
                    <td className="border border-neutral-400 px-3 py-2 text-right tabular-nums">
                      {row.price != null ? formatMoney(row.regularPrice ?? row.price) : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {rows.length > 0 ? (
              <tfoot>
                <tr className="bg-neutral-50 font-semibold">
                  <td colSpan={2} className="border border-neutral-400 px-3 py-2 text-right">
                    Total
                  </td>
                  <td className="border border-neutral-400 px-3 py-2 text-right tabular-nums">{formatMoney(priceSum, "0")}</td>
                  <td className="border border-neutral-400 px-3 py-2 text-right tabular-nums">{formatMoney(regularSum, "0")}</td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-300 pt-4 text-xs text-neutral-600 print:text-[10px]">
          <span className="break-all">{pageUrl || "—"}</span>
          <span>1 / 1</span>
        </footer>
      </div>
    </div>
  );
}
