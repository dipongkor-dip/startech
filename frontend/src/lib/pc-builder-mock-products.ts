import type {MockProduct} from "@/lib/category-listing";

function expand(templates: Omit<MockProduct, "id">[], prefix: string): MockProduct[] {
  return templates.map((t, i) => ({
    ...t,
    id: `${prefix}-${i + 1}`,
  }));
}

const cpuTemplates: Omit<MockProduct, "id">[] = [
  {
    title: "AMD Ryzen 3 2200G Processor with Radeon Vega 8 Graphics",
    specs: ["Base Clock: 3.5 GHz", "Cores / Threads: 4 / 4", "Cache: 4 MB", "Socket: AM4"],
    price: 4400,
    originalPrice: 4900,
    discountLabel: "Save: 500৳",
    wattageMin: 8,
    wattageMax: 65,
  },
  {
    title: "Intel Core i5-12400 Alder Lake Processor",
    specs: ["Base Clock: 2.5 GHz", "Cores / Threads: 6 / 12", "Cache: 18 MB", "Socket: LGA1700"],
    price: 18500,
    wattageMin: 35,
    wattageMax: 117,
  },
  {
    title: "AMD Ryzen 5 7600 6-Core AM5 Desktop Processor",
    specs: ["Boost up to 5.1 GHz", "Cores / Threads: 6 / 12", "TDP: 65W", "Socket: AM5"],
    price: 22900,
    originalPrice: 24500,
    discountLabel: "Save: 1,600৳",
    wattageMin: 45,
    wattageMax: 88,
  },
  {
    title: "Intel Core i7-13700 16-Core LGA1700 Processor",
    specs: ["P-cores + E-cores: 8+8", "Cache: 30 MB", "TDP: 65W", "Socket: LGA1700"],
    price: 38900,
    wattageMin: 35,
    wattageMax: 219,
  },
];

export function getMockProductsForPcComponent(slug: string): MockProduct[] {
  if (slug === "cpu") {
    return expand(cpuTemplates, "cpu");
  }

  if (slug === "motherboard") {
    return expand(
      [
        {
          title: "ASUS PRIME B760M-A WiFi (Intel LGA1700) Micro-ATX",
          specs: ["Chipset: B760", "DDR5 support", "PCIe 4.0 M.2", "Wi‑Fi 6E"],
          price: 14200,
          wattageMin: 20,
          wattageMax: 45,
        },
        {
          title: "MSI PRO B650M-P WiFi (AM5) Micro-ATX Motherboard",
          specs: ["Chipset: B650", "DDR5", "PCIe 4.0", "2.5G LAN"],
          price: 15600,
          originalPrice: 16200,
          discountLabel: "Save: 600৳",
        },
        {
          title: "Gigabyte B550 AORUS Elite AX V2 (AM4) ATX",
          specs: ["Chipset: B550", "DDR4", "PCIe 4.0", "Wi‑Fi + BT"],
          price: 12800,
        },
      ],
      "mb",
    );
  }

  if (slug === "ram") {
    return expand(
      [
        {
          title: "Netac Basic 4GB DDR4 2666MHz Desktop RAM",
          specs: ["Capacity: 4 GB", "Speed: 2666 MT/s", "Voltage: 1.2V", "Form: UDIMM"],
          price: 2100,
          wattageMin: 2,
          wattageMax: 4,
        },
        {
          title: "Corsair Vengeance RGB 16GB (2×8GB) DDR4 3200MHz",
          specs: ["Kit: 16 GB", "Speed: 3200 MT/s", "Latency: CL16", "RGB"],
          price: 6200,
          wattageMin: 3,
          wattageMax: 6,
        },
        {
          title: "G.Skill Trident Z5 RGB 32GB (2×16GB) DDR5 6000",
          specs: ["Kit: 32 GB", "Speed: 6000 MT/s", "For AM5 / Intel 12th+", "RGB"],
          price: 14500,
          originalPrice: 15200,
          discountLabel: "Save: 700৳",
          wattageMin: 4,
          wattageMax: 8,
        },
      ],
      "ram",
    );
  }

  if (slug === "storage") {
    return expand(
      [
        {
          title: "Samsung 990 PRO 1TB PCIe 4.0 NVMe M.2 SSD",
          specs: ["Sequential read: up to 7450 MB/s", "PCIe 4.0 ×4", "M.2 2280", "NAND: V‑NAND"],
          price: 18500,
          originalPrice: 19200,
          discountLabel: "Save: 700৳",
          wattageMin: 2,
          wattageMax: 8,
        },
        {
          title: "WD Blue SN580 500GB NVMe SSD",
          specs: ["PCIe 4.0", "Read up to 4150 MB/s", "M.2 2280"],
          price: 5200,
          wattageMin: 1,
          wattageMax: 5,
        },
        {
          title: "Seagate Barracuda 2TB 7200 RPM HDD",
          specs: ["3.5\"", "SATA 6 Gb/s", "64 MB cache"],
          price: 6100,
          wattageMin: 4,
          wattageMax: 10,
        },
      ],
      "ssd",
    );
  }

  const label = slug.replace(/-/g, " ");
  return expand(
    [
      {
        title: `${label} — Entry model`,
        specs: ["Warranty: Official", "Ready for PC build", "Bangladesh stock"],
        price: 3200,
      },
      {
        title: `${label} — Mid range`,
        specs: ["Warranty: Official", "Popular choice", "Fast delivery"],
        price: 8900,
        originalPrice: 9500,
        discountLabel: "Save: 600৳",
      },
      {
        title: `${label} — Performance`,
        specs: ["Warranty: Official", "Premium tier", "For enthusiasts"],
        price: 16500,
      },
    ],
    slug,
  );
}
