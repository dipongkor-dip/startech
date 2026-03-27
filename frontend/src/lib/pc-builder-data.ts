import type {MockProduct} from "@/lib/category-listing";
import type {LucideIcon} from "lucide-react";
import {
  BatteryCharging,
  Box,
  CircuitBoard,
  Cpu,
  Fan,
  Gamepad2,
  HardDrive,
  Headphones,
  Keyboard,
  Monitor,
  Mouse,
  Plug,
  Shield,
  Speaker,
  Wifi,
} from "lucide-react";

export type PcBuilderSectionId = "core" | "peripherals";

export type PcBuilderSlot = {
  slug: string;
  label: string;
  /** Shown in breadcrumb / tab title, e.g. "Choose A CPU" */
  chooseTitle: string;
  required?: boolean;
  section: PcBuilderSectionId;
  icon: LucideIcon;
};

export const PC_BUILDER_CORE: PcBuilderSlot[] = [
  {slug: "cpu", label: "CPU", chooseTitle: "A CPU", required: true, section: "core", icon: Cpu},
  {slug: "cpu-cooler", label: "CPU Cooler", chooseTitle: "A CPU Cooler", section: "core", icon: Fan},
  {slug: "motherboard", label: "Motherboard", chooseTitle: "A Motherboard", required: true, section: "core", icon: CircuitBoard},
  {slug: "ram", label: "RAM", chooseTitle: "RAM", required: true, section: "core", icon: Box},
  {slug: "storage", label: "Storage", chooseTitle: "Storage", required: true, section: "core", icon: HardDrive},
  {slug: "graphics-card", label: "Graphics Card", chooseTitle: "A Graphics Card", section: "core", icon: Gamepad2},
  {slug: "power-supply", label: "Power Supply", chooseTitle: "A Power Supply", section: "core", icon: Plug},
  {slug: "casing", label: "Casing", chooseTitle: "A Case", section: "core", icon: Box},
];

export const PC_BUILDER_PERIPHERALS: PcBuilderSlot[] = [
  {slug: "monitor", label: "Monitor", chooseTitle: "A Monitor", section: "peripherals", icon: Monitor},
  {slug: "casing-cooler", label: "Casing Cooler", chooseTitle: "A Casing Cooler", section: "peripherals", icon: Fan},
  {slug: "keyboard", label: "Keyboard", chooseTitle: "A Keyboard", section: "peripherals", icon: Keyboard},
  {slug: "mouse", label: "Mouse", chooseTitle: "A Mouse", section: "peripherals", icon: Mouse},
  {slug: "speaker", label: "Speaker & Home Theater", chooseTitle: "Speakers", section: "peripherals", icon: Speaker},
  {slug: "headphone", label: "Headphone", chooseTitle: "Headphones", section: "peripherals", icon: Headphones},
  {slug: "wifi-adapter", label: "Wifi Adapter / LAN Card", chooseTitle: "A Network Adapter", section: "peripherals", icon: Wifi},
  {slug: "antivirus", label: "Anti Virus", chooseTitle: "Antivirus Software", section: "peripherals", icon: Shield},
  {slug: "ups", label: "UPS", chooseTitle: "A UPS", section: "peripherals", icon: BatteryCharging},
];

export const PC_BUILDER_SLOTS: PcBuilderSlot[] = [...PC_BUILDER_CORE, ...PC_BUILDER_PERIPHERALS];

/** Slots that support multiple products (extra rows via “+ Add another …”). */
export const PC_BUILDER_MULTI_LINE_SLOTS = new Set<string>(["ram", "storage"]);

export type PcSlotLine = {
  id: string;
  product: MockProduct | null;
};

export function isPcBuilderMultiLineSlot(slug: string): boolean {
  return PC_BUILDER_MULTI_LINE_SLOTS.has(slug);
}

export function createInitialLinesBySlot(): Record<string, PcSlotLine[]> {
  const m: Record<string, PcSlotLine[]> = {};
  for (const s of PC_BUILDER_SLOTS) {
    m[s.slug] = [{id: crypto.randomUUID(), product: null}];
  }
  return m;
}

export const PC_BUILDER_SECTION_LABEL: Record<PcBuilderSectionId, string> = {
  core: "Core Components",
  peripherals: "Peripherals & Others",
};

export function getPcBuilderSlot(slug: string): PcBuilderSlot | undefined {
  return PC_BUILDER_SLOTS.find((s) => s.slug === slug);
}

export type PcBuilderFilterGroup = {
  id: string;
  label: string;
  options: {id: string; label: string}[];
};

export function getFilterGroupsForSlot(slot: PcBuilderSlot): PcBuilderFilterGroup[] {
  switch (slot.slug) {
    case "cpu":
      return [
        {
          id: "socket",
          label: "Socket",
          options: [
            {id: "lga1700", label: "Intel LGA1700"},
            {id: "am4", label: "AMD AM4"},
            {id: "am5", label: "AMD AM5"},
            {id: "lga1200", label: "Intel LGA1200"},
          ],
        },
        {
          id: "cores",
          label: "Number of Core",
          options: [
            {id: "c2", label: "2"},
            {id: "c4", label: "4"},
            {id: "c6", label: "6"},
            {id: "c8", label: "8"},
            {id: "c12", label: "12"},
            {id: "c16", label: "16"},
          ],
        },
      ];
    case "motherboard":
      return [
        {
          id: "socket",
          label: "Socket",
          options: [
            {id: "lga1700", label: "Intel LGA1700"},
            {id: "am5", label: "AMD AM5"},
          ],
        },
        {
          id: "form",
          label: "Form Factor",
          options: [
            {id: "atx", label: "ATX"},
            {id: "matx", label: "Micro-ATX"},
            {id: "itx", label: "Mini-ITX"},
          ],
        },
      ];
    case "ram":
      return [
        {
          id: "type",
          label: "Memory Type",
          options: [
            {id: "ddr4", label: "DDR4"},
            {id: "ddr5", label: "DDR5"},
          ],
        },
        {
          id: "size",
          label: "Capacity",
          options: [
            {id: "8", label: "8 GB"},
            {id: "16", label: "16 GB"},
            {id: "32", label: "32 GB"},
          ],
        },
      ];
    case "storage":
      return [
        {
          id: "type",
          label: "Type",
          options: [
            {id: "nvme", label: "NVMe SSD"},
            {id: "sata", label: "SATA SSD"},
            {id: "hdd", label: "HDD"},
          ],
        },
        {
          id: "cap",
          label: "Capacity",
          options: [
            {id: "256", label: "256 GB"},
            {id: "512", label: "512 GB"},
            {id: "1t", label: "1 TB"},
            {id: "2t", label: "2 TB"},
          ],
        },
      ];
    case "graphics-card":
      return [
        {
          id: "chip",
          label: "Chipset",
          options: [
            {id: "nvidia", label: "NVIDIA"},
            {id: "amd", label: "AMD"},
            {id: "intel", label: "Intel ARC"},
          ],
        },
        {
          id: "vram",
          label: "VRAM",
          options: [
            {id: "4", label: "4 GB"},
            {id: "8", label: "8 GB"},
            {id: "12", label: "12 GB"},
            {id: "16", label: "16 GB"},
          ],
        },
      ];
    case "monitor":
      return [
        {
          id: "size",
          label: "Size",
          options: [
            {id: "24", label: '24"'},
            {id: "27", label: '27"'},
            {id: "32", label: '32"'},
          ],
        },
        {
          id: "panel",
          label: "Panel",
          options: [
            {id: "ips", label: "IPS"},
            {id: "va", label: "VA"},
            {id: "oled", label: "OLED"},
          ],
        },
      ];
    default:
      return [
        {
          id: "brand",
          label: "Brand",
          options: [
            {id: "asus", label: "ASUS"},
            {id: "msi", label: "MSI"},
            {id: "gigabyte", label: "Gigabyte"},
            {id: "corsair", label: "Corsair"},
          ],
        },
      ];
  }
}
