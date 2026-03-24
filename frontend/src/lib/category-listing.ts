import {NAV_CATEGORIES, type NavCategory, type NavMenuItem, type NavSubItem} from "@/data/nav-categories";

export type CategoryBreadcrumb = {label: string; href: string};

export type CategoryListingResolved = {
  path: string;
  breadcrumbs: CategoryBreadcrumb[];
  title: string;
  description: string;
  pills: {label: string; href: string}[];
  sectionLabel: string;
};

type ChainNode = NavCategory | NavMenuItem | NavSubItem;

const DEFAULT_DESCRIPTION =
  "Browse the latest models with official warranty, competitive pricing, and fast delivery across Bangladesh. Filter by price, availability, and specifications to find the right product.";

function pathFromSlug(slug: string[]): string {
  return `/${slug.join("/")}`;
}

function buildPills(chain: ChainNode[]) {
  const cat = chain[0] as NavCategory;
  const focusedItem = chain[1] as NavMenuItem | undefined;

  if (chain.length === 1) {
    return cat.items.filter((i) => !i.label.toLowerCase().startsWith("show all")).map((i) => ({label: i.label, href: i.href}));
  }

  if (chain.length === 2 && focusedItem?.sub?.length) {
    return focusedItem.sub.map((sub) => ({label: sub.label, href: sub.href}));
  }

  return [];
}

function buildTitle(chain: ChainNode[]): string {
  const suffix = " Price in Bangladesh (BD)";
  const cat = chain[0] as NavCategory;
  const last = chain[chain.length - 1];

  if (chain.length === 1) {
    if (cat.label === "Desktop") return `Desktop PC${suffix}`;
    return `${cat.label}${suffix}`;
  }

  return `${last.label}${suffix}`;
}

function buildBreadcrumbs(chain: ChainNode[]): CategoryBreadcrumb[] {
  const crumbs: CategoryBreadcrumb[] = [{label: "Home", href: "/"}];
  const cat = chain[0] as NavCategory;
  crumbs.push({label: cat.label, href: cat.href ?? "#"});
  for (let i = 1; i < chain.length; i++) {
    const n = chain[i] as NavMenuItem | NavSubItem;
    crumbs.push({label: n.label, href: n.href});
  }
  return crumbs;
}

function tryMatchItem(cat: NavCategory, item: NavMenuItem, path: string): ChainNode[] | null {
  if (item.href === path) return [cat, item];
  if (item.sub) {
    for (const s of item.sub) {
      if (s.href === path) return [cat, item, s];
    }
  }
  return null;
}

function findChain(path: string): ChainNode[] | null {
  for (const cat of NAV_CATEGORIES) {
    if (cat.href === path) return [cat];
    for (const item of cat.items) {
      const matched = tryMatchItem(cat, item, path);
      if (matched) return matched;
    }
  }
  return null;
}

export function resolveCategoryListing(slug: string[] | undefined): CategoryListingResolved | null {
  if (!slug?.length) return null;
  const path = pathFromSlug(slug);
  const chain = findChain(path);
  if (!chain) return null;

  const cat = chain[0] as NavCategory;
  const sectionLabel = (chain[chain.length - 1] as NavMenuItem | NavSubItem).label;

  return {
    path,
    breadcrumbs: buildBreadcrumbs(chain),
    title: buildTitle(chain),
    description: DEFAULT_DESCRIPTION,
    pills: buildPills(chain),
    sectionLabel,
  };
}

export type MockProduct = {
  id: string;
  title: string;
  specs: string[];
  price: number;
  originalPrice?: number;
  discountLabel?: string;
};

export function getMockProducts(): MockProduct[] {
  return [
    {
      id: "1",
      title: "Asus NUC 14 Essential Intel N97 Portable Mini PC",
      specs: ["Processor: Intel N97", "RAM: 8 GB DDR5", "Storage: 256 GB SSD", "WLAN: Wi‑Fi 6"],
      price: 42900,
      originalPrice: 45900,
      discountLabel: "Save: 3,000",
    },
    {
      id: "2",
      title: "HP ProDesk 400 G9 Intel Core i5 Business Desktop",
      specs: ["Processor: Intel Core i5-13500", "RAM: 16 GB DDR4", "Storage: 512 GB NVMe SSD", "OS: Windows 11 Pro"],
      price: 78900,
    },
    {
      id: "3",
      title: "Lenovo ThinkCentre M70q Gen 4 AMD Ryzen 5",
      specs: ["Processor: AMD Ryzen 5 7530U", "RAM: 16 GB", "Storage: 1 TB SSD", "Graphics: AMD Radeon"],
      price: 92500,
      originalPrice: 98900,
      discountLabel: "Save: 6,400",
    },
    {
      id: "4",
      title: "Dell OptiPlex Micro Plus Intel Core i7",
      specs: ["Processor: Intel Core i7-13700T", "RAM: 32 GB DDR5", "Storage: 512 GB SSD", "Form factor: Ultra compact"],
      price: 112000,
    },
    {
      id: "5",
      title: "Gaming Tower RTX 4060 Intel Core i5",
      specs: ["Processor: Intel Core i5-14400F", "RAM: 16 GB DDR5", "Graphics: NVIDIA RTX 4060 8 GB", "Storage: 1 TB NVMe"],
      price: 145900,
      originalPrice: 152500,
      discountLabel: "Save: 6,600",
    },
    {
      id: "6",
      title: "AMD Ryzen 7 Office PC with Wi‑Fi",
      specs: ["Processor: AMD Ryzen 7 5700G", "RAM: 16 GB", "Storage: 512 GB SSD", "WLAN: Wi‑Fi 5"],
      price: 67800,
    },
    {
      id: "7",
      title: 'All-in-One 24" FHD Intel Core i3',
      specs: ['Display: 23.8" FHD IPS', "Processor: Intel Core i3-1215U", "RAM: 8 GB", "Storage: 256 GB SSD"],
      price: 54900,
    },
    {
      id: "8",
      title: "Apple Mac mini M2 8-Core / 8 GB",
      specs: ["Chip: Apple M2", "RAM: 8 GB unified", "Storage: 256 GB SSD", "Ports: HDMI, Thunderbolt 4"],
      price: 69900,
    },
  ];
}

export type PhoneLike = {
  _id: string;
  brand: string;
  model: string;
  price: number;
  discountPrice?: number;
  processor?: string;
  display?: string;
  storage?: string;
  status?: string;
  options?: Array<{
    ram?: string;
    storage?: string;
    color?: string;
  }>;
};

function formatSaveLabel(discountDiff: number) {
  // Matches the style of existing mock labels: `Save: 3,000`
  return `Save: ${discountDiff.toLocaleString("en-BD")}`;
}

export function mapPhonesToMockProducts(phones: PhoneLike[]): MockProduct[] {
  return phones.map((p) => {
    const discountPrice = typeof p.discountPrice === "number" && p.discountPrice > 0 ? p.discountPrice : undefined;

    const hasDiscount = discountPrice !== undefined && discountPrice < p.price;
    const finalPrice = hasDiscount ? discountPrice! : p.price;
    const originalPrice = hasDiscount ? p.price : undefined;

    const discountDiff = hasDiscount ? p.price - discountPrice! : 0;
    const discountLabel = hasDiscount ? formatSaveLabel(Math.max(0, Math.round(discountDiff))) : undefined;

    const ram = p.options?.[0]?.ram;
    const optionStorage = p.options?.[0]?.storage;

    const specs: string[] = [];
    if (p.processor) specs.push(`Processor: ${p.processor}`);
    if (p.display) specs.push(`Display: ${p.display}`);
    if (ram) specs.push(`RAM: ${ram}`);
    if (p.storage) specs.push(`Storage: ${p.storage}`);
    else if (optionStorage) specs.push(`Storage: ${optionStorage}`);
    if (p.status) specs.push(`Status: ${p.status}`);

    // Ensure the card always has something to render.
    if (specs.length === 0) specs.push("Specifications unavailable");

    return {
      id: String(p._id),
      title: `${p.brand} ${p.model}`.trim(),
      specs,
      price: finalPrice,
      originalPrice,
      discountLabel,
    };
  });
}
