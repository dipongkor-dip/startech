import type {MockProduct} from "@/lib/category-listing";
import {
  isPcBuilderMultiLineSlot,
  PC_BUILDER_SLOTS,
  type PcSlotLine,
} from "@/lib/pc-builder-data";

export const PC_BUILDER_PRINT_STORAGE_KEY = "startech-pc-builder-print-v1";

export type PcPrintPayloadV1 = {
  v: 1;
  savedAt: string;
  linesBySlot: Record<string, Array<{id: string; product: MockProduct | null}>>;
};

export type PcPrintTableRow = {
  component: string;
  productName: string;
  price: number | null;
  regularPrice: number | null;
};

export function buildPrintTableRows(linesBySlot: Record<string, PcSlotLine[]>): PcPrintTableRow[] {
  const rows: PcPrintTableRow[] = [];
  for (const slot of PC_BUILDER_SLOTS) {
    const lines = linesBySlot[slot.slug] ?? [];
    if (isPcBuilderMultiLineSlot(slot.slug)) {
      const iter = lines.length > 0 ? lines : [{id: "_", product: null}];
      for (const line of iter) {
        const p = line.product;
        rows.push({
          component: slot.label,
          productName: p?.title ?? "",
          price: p ? p.price : null,
          regularPrice: p ? (p.originalPrice ?? null) : null,
        });
      }
    } else {
      const p = lines[0]?.product ?? null;
      rows.push({
        component: slot.label,
        productName: p?.title ?? "",
        price: p ? p.price : null,
        regularPrice: p ? (p.originalPrice ?? null) : null,
      });
    }
  }
  return rows;
}

export function sumPrintTotals(rows: PcPrintTableRow[]) {
  let priceSum = 0;
  let regularSum = 0;
  for (const r of rows) {
    if (r.price != null) priceSum += r.price;
    if (r.price != null) {
      regularSum += r.regularPrice ?? r.price;
    }
  }
  return {priceSum, regularSum};
}

export function savePrintPayload(linesBySlot: Record<string, PcSlotLine[]>): void {
  if (typeof window === "undefined") return;
  const payload: PcPrintPayloadV1 = {
    v: 1,
    savedAt: new Date().toISOString(),
    linesBySlot: JSON.parse(JSON.stringify(linesBySlot)) as PcPrintPayloadV1["linesBySlot"],
  };
  try {
    sessionStorage.setItem(PC_BUILDER_PRINT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota or privacy mode */
  }
}

export function loadPrintPayload(): PcPrintPayloadV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PC_BUILDER_PRINT_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PcPrintPayloadV1;
    if (data?.v !== 1 || !data.linesBySlot) return null;
    return data;
  } catch {
    return null;
  }
}
