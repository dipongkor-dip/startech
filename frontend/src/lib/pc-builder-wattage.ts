import type {MockProduct} from "@/lib/category-listing";

const DEFAULTS: Record<string, {min: number; max: number}> = {
  cpu: {min: 35, max: 125},
  "cpu-cooler": {min: 1, max: 15},
  motherboard: {min: 20, max: 45},
  ram: {min: 2, max: 6},
  storage: {min: 1, max: 10},
  "graphics-card": {min: 30, max: 320},
  "power-supply": {min: 0, max: 0},
  casing: {min: 5, max: 25},
  monitor: {min: 15, max: 65},
  "casing-cooler": {min: 2, max: 18},
  keyboard: {min: 0, max: 0},
  mouse: {min: 0, max: 0},
  speaker: {min: 5, max: 80},
  headphone: {min: 0, max: 0},
  "wifi-adapter": {min: 2, max: 8},
  antivirus: {min: 0, max: 0},
  ups: {min: 5, max: 40},
};

export function getLineWattage(slotSlug: string, product: MockProduct | null): {min: number; max: number} {
  if (!product) return {min: 0, max: 0};
  if (product.wattageMin != null && product.wattageMax != null) {
    return {min: product.wattageMin, max: product.wattageMax};
  }
  return DEFAULTS[slotSlug] ?? {min: 3, max: 15};
}
