"use client";

import * as React from "react";
import type {MockProduct} from "@/lib/category-listing";
import {
  createInitialLinesBySlot,
  isPcBuilderMultiLineSlot,
  PC_BUILDER_SLOTS,
  type PcSlotLine,
} from "@/lib/pc-builder-data";

type PcBuilderState = {
  linesBySlot: Record<string, PcSlotLine[]>;
  setLineProduct: (slotSlug: string, lineId: string, product: MockProduct) => void;
  clearLineProduct: (slotSlug: string, lineId: string) => void;
  addExtraLine: (slotSlug: string) => void;
};

const PcBuilderContext = React.createContext<PcBuilderState | null>(null);

export function PcBuilderProvider({children}: {children: React.ReactNode}) {
  const [linesBySlot, setLinesBySlot] = React.useState<Record<string, PcSlotLine[]>>(() => createInitialLinesBySlot());

  React.useEffect(() => {
    setLinesBySlot((prev) => {
      let changed = false;
      const next = {...prev};
      for (const s of PC_BUILDER_SLOTS) {
        if (!next[s.slug]?.length) {
          next[s.slug] = [{id: crypto.randomUUID(), product: null}];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, []);

  const setLineProduct = React.useCallback((slotSlug: string, lineId: string, product: MockProduct) => {
    setLinesBySlot((prev) => {
      const lines = prev[slotSlug];
      if (!lines) return prev;
      return {
        ...prev,
        [slotSlug]: lines.map((line) => (line.id === lineId ? {...line, product} : line)),
      };
    });
  }, []);

  const clearLineProduct = React.useCallback((slotSlug: string, lineId: string) => {
    setLinesBySlot((prev) => {
      const lines = prev[slotSlug];
      if (!lines) return prev;
      const idx = lines.findIndex((l) => l.id === lineId);
      if (idx < 0) return prev;

      if (isPcBuilderMultiLineSlot(slotSlug) && idx > 0) {
        const next = lines.filter((l) => l.id !== lineId);
        return {
          ...prev,
          [slotSlug]: next.length > 0 ? next : [{id: crypto.randomUUID(), product: null}],
        };
      }

      return {
        ...prev,
        [slotSlug]: lines.map((line) => (line.id === lineId ? {...line, product: null} : line)),
      };
    });
  }, []);

  const addExtraLine = React.useCallback((slotSlug: string) => {
    if (!isPcBuilderMultiLineSlot(slotSlug)) return;
    setLinesBySlot((prev) => {
      const lines = prev[slotSlug] ?? [];
      return {
        ...prev,
        [slotSlug]: [...lines, {id: crypto.randomUUID(), product: null}],
      };
    });
  }, []);

  const value = React.useMemo(
    () => ({
      linesBySlot,
      setLineProduct,
      clearLineProduct,
      addExtraLine,
    }),
    [linesBySlot, setLineProduct, clearLineProduct, addExtraLine],
  );

  return <PcBuilderContext.Provider value={value}>{children}</PcBuilderContext.Provider>;
}

export function usePcBuilder() {
  const ctx = React.useContext(PcBuilderContext);
  if (!ctx) {
    throw new Error("usePcBuilder must be used within PcBuilderProvider");
  }
  return ctx;
}
