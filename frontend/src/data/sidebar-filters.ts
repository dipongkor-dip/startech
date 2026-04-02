export type SidebarFilterOption = {
  title: string;
  i: string[];
};

// {title: "Brand", i: ["Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Apple"]},

const DESKTOPS: SidebarFilterOption[] = [
  {title: "Processor", i: ["Intel", "AMD", "Apple"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB", "64 GB"]},
  {title: "SSD", i: ["256 GB", "512 GB", "1 TB", "2 TB"]},
  {title: "Graphics", i: ["Shared / Integrated", "Dedicated 4GB", "Dedicated 6GB", "Dedicated 8GB", "Dedicated 12GB", "Dedicated 16GB", "Dedicated 32GB"]},
];

const SPECIAL_PC: SidebarFilterOption[] = [
  {title: "Processor", i: ["Intel", "AMD"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB", "64 GB"]},
  {title: "SSD", i: ["256 GB", "512 GB", "1 TB", "2 TB"]},
  {title: "Graphics", i: ["Shared / Integrated", "Dedicated 4GB", "Dedicated 6GB", "Dedicated 8GB", "Dedicated 12GB", "Dedicated 16GB", "Dedicated 32GB"]},
];

const BRAND_PC: SidebarFilterOption[] = [
  {title: "Brand", i: ["Acer", "ASUS", "Dell", "HP", "Lenovo", "Gigabyte"]},
  {title: "Generation / Series", i: ["10th Gen", "11th Gen", "12th Gen", "13th Gen", "14th Gen"]},
  {title: "Processor", i: ["Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 7"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB", "64 GB"]},
  {title: "SSD", i: ["256 GB", "512 GB", "1 TB", "2 TB"]},
  {title: "HDD", i: ["1 TB", "2 TB"]},
  {title: "Graphics", i: ["Shared / Integrated", "Dedicated 4GB", "Dedicated 6GB", "Dedicated 8GB", "Dedicated 12GB", "Dedicated 16GB", "Dedicated 32GB"]},
];

const BRAND_PC_ITEM: SidebarFilterOption[] = [
  {title: "Generation / Series", i: ["10th Gen", "11th Gen", "12th Gen", "13th Gen", "14th Gen"]},
  {title: "Processor", i: ["Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 7"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB", "64 GB"]},
  {title: "SSD", i: ["256 GB", "512 GB", "1 TB", "2 TB"]},
  {title: "Graphics", i: ["Shared / Integrated", "Dedicated 4GB", "Dedicated 6GB", "Dedicated 8GB", "Dedicated 12GB", "Dedicated 16GB", "Dedicated 32GB"]},
];

const ALL_IN_ONE_PC: SidebarFilterOption[] = [
  {title: "Brand", i: ["AOC", "ASUS", "Dell", "HP", "Lenovo", "Teclast", "Smart"]},
  {title: "Generation / Series", i: ["Intel 10th Gen", "Intel 11th Gen", "Intel 12th Gen", "Intel 13th Gen", "Intel 14th Gen"]},
  {title: "Processor Type", i: ["Intel Celeron", "Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9"]},
  {title: "RAM", i: ["8GB", "16GB", "32 GB", "64GB"]},
  {title: "SSD", i: ["256GB", "512GB", "1TB", "2TB"]},
  {title: "Graphics", i: ["Shared / Integrated", "Dedicated 4GB", "Dedicated 6GB", "Dedicated 8GB", "Dedicated 12GB", "Dedicated 16GB", "Dedicated 32GB"]},
];

const AI_PC: SidebarFilterOption[] = [
  {title: "Processor", i: ["Intel", "Ryzen"]},
  {title: "Neural Core", i: ["16 core", "32 core"]},
  {title: "RAM", i: ["64GB", "128GB"]},
  {title: "SSD", i: ["1 TB", "2 TB"]},
  {title: "Graphics", i: ["Dedicated 16GB", "Dedicated 32GB"]},
];

const MAC_MINI: SidebarFilterOption[] = [
  {title: "Processor", i: ["M4 Chip", "M4 Pro Chip"]},
  {title: "RAM", i: ["16GB", "24GB"]},
  {title: "Storage", i: ["256GB", "512GB"]},
  {title: "GPU", i: ["10 Core", "16 Core"]},
];

const MAC_STUDIO: SidebarFilterOption[] = [
  {title: "Processor", i: ["M3 Ultra Chip", "M4 Max Chip"]},
  {title: "RAM", i: ["36GB", "96GB"]},
  {title: "Storage", i: ["512GB", "1TB"]},
  {title: "GPU", i: ["32 Core", "60 Core"]},
];

const LAPTOP: SidebarFilterOption[] = [
  {title: "Series", i: ["Consumer Laptops", "Business Laptop", "Gaming Laptop", "Premium Ultrabook Laptops"]},
  {title: "Brand", i: ["Apple", "Microsoft", "HP", "Dell", "Lenovo", "ASUS", "Acer", " MSI", "Gigabyte", "Walton", "Smart", "Chuwi", "Tecno"]},
  {title: "Processor Type", i: ["Intel", "AMD", "Apple", "Snapdragon"]},
  {title: "Processor Model", i: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9"]},
  {
    title: "Generation / Series",
    i: [
      "Intel 10th Gen",
      "Intel 11th Gen",
      "Intel 12th Gen",
      "Intel 13th Gen",
      "Intel 14th Gen",
      "AMD Ryzen 3",
      "Ryzen 3000 Series",
      "Ryzen 5000 Series",
      "Ryzen 7000 Series",
      "Ryzen 8000 Series",
      "Ryzen 9000 Series",
    ],
  },
  {title: "Display Type", i: ["LED", "OLED"]},
  {title: "RAM", i: ["8GB", "16GB", "32 GB", "64GB"]},
  {title: "RAM Type", i: ["DDR4", "DDR5"]},
  {title: "SSD", i: ["256GB", "512GB", "1TB", "2TB"]},
  {title: "HDD", i: ["1TB", "2TB"]},
  {title: "Graphics", i: ["Shared / Integrated", "Dedicated 4GB", "Dedicated 6GB", "Dedicated 8GB", "Dedicated 12GB", "Dedicated 16GB", "Dedicated 32GB"]},
  {title: "Operating System", i: ["Free Dox", "Windows", "macOS"]},
  {title: "Special Features", i: ["Blacklit Keyboard", "Finger Print", "Dual Display", "Type-C Port", "Touch Screen"]},
];

const LAPTOP_ITEM: SidebarFilterOption[] = [
  {title: "Processor Type", i: ["Intel", "AMD", "Apple", "Snapdragon"]},
  {title: "Processor Model", i: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9"]},
  {
    title: "Generation / Series",
    i: [
      "Intel 10th Gen",
      "Intel 11th Gen",
      "Intel 12th Gen",
      "Intel 13th Gen",
      "Intel 14th Gen",
      "AMD Ryzen 3",
      "Ryzen 3000 Series",
      "Ryzen 5000 Series",
      "Ryzen 7000 Series",
      "Ryzen 8000 Series",
      "Ryzen 9000 Series",
    ],
  },
  {
    title: "Display Size",
    i: ["13-Inch to 13.9-Inch", "14-Inch to 14.9-Inch", "15-Inch to 15.9-Inch", "16-Inch to 16.9-Inch"],
  },
  {title: "Display Type", i: ["LED", "OLED"]},
  {title: "RAM", i: ["8GB", "16GB", "32 GB", "64GB"]},
  {title: "RAM Type", i: ["DDR4", "DDR5"]},
  {title: "SSD", i: ["256GB", "512GB", "1TB", "2TB"]},
  {title: "HDD", i: ["1TB", "2TB"]},
  {title: "Graphics", i: ["Shared / Integrated", "Dedicated 4GB", "Dedicated 6GB", "Dedicated 8GB", "Dedicated 12GB", "Dedicated 16GB", "Dedicated 32GB"]},
  {title: "Operating System", i: ["Free Dox", "Windows", "macOS"]},
  {title: "Special Features", i: ["Blacklit Keyboard", "Finger Print", "Dual Display", "Type-C Port", "Touch Screen"]},
];

const CPU_FILTERS: SidebarFilterOption[] = [
  {title: "Brand", i: ["Intel", "AMD"]},
  {title: "Socket", i: ["Intel LGA2011", "Intel LGA2066", "Intel LGA1200", "Intel LGA1700", "Intel LGA1851", "AMD AM4", "AMD AM5"]},
  {title: "Number of Core", i: ["4", "6", "8", "12", "16", "24", "32"]},
  {title: "Number of Thread", i: ["8", "12", "16", "24", "32", "64"]},
  {title: "Clock Speed", i: ["Up to 2.4GHz", "2.5GHz to 3.4GHz", "3.5GHz to 3.90GHz", "4.0GHz to 5.0GHz", "Above 5.0GHz"]},
  {title: "Cache", i: ["2MB to 6MB", " 8MB to 12MB", "14MB to 30MB", "32MB & Above"]},
];

const AMD_CPU_FILTERS: SidebarFilterOption[] = [
  {title: "Socket", i: ["AM4", "AM5"]},
  {title: "Series", i: ["1000 Series", "2000 Series", "3000 Series", "4000 Series", "5000 Series", "6000 Series", "7000 Series", "8000 Series", "9000 Series"]},
  {title: "Type", i: ["Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9", "Threadripper"]},
  {title: "Number of Core", i: ["4", "6", "8", "12", "16", "24", "32"]},
  {title: "Number of Thread", i: ["8", "12", "16", "24", "32", "64"]},
  {title: "Clock Speed", i: ["Up to 2.4GHz", "2.5GHz to 3.4GHz", "3.5GHz to 3.90GHz", "4.0GHz to 5.0GHz", "Above 5.0GHz"]},
  {title: "Cache", i: ["2MB to 6MB", " 8MB to 12MB", "14MB to 30MB", "32MB & Above"]},
];

const INTEL_CPU_FILTERS: SidebarFilterOption[] = [
  {title: "Generation", i: ["10th Gen", "11th Gen", "12th Gen", "13th Gen", "14th Gen"]},
  {title: "Type", i: ["Core i3", "Core i5", "Core i7", "Core i9"]},
  {title: "Socket", i: ["Intel LGA2011", "Intel LGA2066", "Intel LGA1200", "Intel LGA1700", "Intel LGA1851"]},
  {title: "Number of Core", i: ["4", "6", "8", "12", "16", "24", "32"]},
  {title: "Number of Thread", i: ["8", "12", "16", "24", "32", "64"]},
  {title: "Clock Speed", i: ["Up to 2.4GHz", "2.5GHz to 3.4GHz", "3.5GHz to 3.90GHz", "4.0GHz to 5.0GHz", "Above 5.0GHz"]},
  {title: "Cache", i: ["2MB to 6MB", " 8MB to 12MB", "14MB to 30MB", "32MB & Above"]},
];

const STAR_PC_FILTERS: SidebarFilterOption[] = [...DESKTOPS];

const INTEL_PC_FILTERS: SidebarFilterOption[] = [
  {title: "Generation / Series", i: ["10th Gen", "11th Gen", "12th Gen", "13th Gen", "14th Gen"]},
  {title: "Processor", i: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB"]},
  {title: "SSD", i: ["256 GB", "512 GB", "1 TB", "2 TB"]},
  {title: "Graphics", i: ["Shared / Integrated", "Dedicated 4GB", "Dedicated 6GB", "Dedicated 8GB", "Dedicated 12GB", "Dedicated 16GB", "Dedicated 32GB"]},
];

// {title: "Graphics Card", i: ["Integrated Radeon", "AMD Radeon", "NVIDIA"]},
// {title: "Brand", i: ["Dell", "HP", "Lenovo", "ASUS", "Acer"]},
const RYZEN_PC_FILTERS: SidebarFilterOption[] = [
  {title: "Processor", i: ["Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB"]},
  {title: "SSD", i: ["256 GB", "512 GB", "1 TB", "2 TB"]},
  {title: "Graphics", i: ["Shared / Integrated", "Dedicated 4GB", "Dedicated 6GB", "Dedicated 8GB", "Dedicated 12GB", "Dedicated 16GB", "Dedicated 32GB"]},
];

const LAPTOP_FILTERS: SidebarFilterOption[] = [
  {title: "Processor", i: ["Intel", "AMD", "Apple"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB", "64 GB"]},
  {title: "Storage", i: ["256 GB", "512 GB", "1 TB"]},
  {title: "Graphics Card", i: ["NVIDIA", "AMD", "Integrated"]},
  {title: "Display Size", i: ['13"', '14"', '15.6"', '16"', '17.3"']},
  {title: "Brand", i: ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI"]},
];

const APPLE_MACBOOK: SidebarFilterOption[] = [
  {
    title: "Series",
    i: ["MacBook Air (2022)", "MacBook Air (2024)", "MacBook Air (2026)", "MacBook Pro (2024)", "MacBook Pro (2025)", "MacBook Pro (2026)", "MacBook Neo (2026)"],
  },
  {
    title: "Processor",
    i: ["M2 Chip", "M4 Chip", "M4 Pro Chip", "M4 Max Chip", "M5 Chip", "M5 Pro Chip", "M5 Max Chip"],
  },
  {
    title: "Display Size",
    i: ["13-Inch to 13.9-Inch", "14-Inch to 14.9-Inch", "15-Inch to 15.9-Inch", "16-Inch to 16.9-Inch"],
  },
  {title: "RAM", i: ["8 GB", "16 GB", "24 GB", "36 GB", "48 GB"]},
  {title: "Storage", i: ["256 GB", "512 GB", "1 TB", "2 TB"]},
];

const PHONE_FILTERS: SidebarFilterOption[] = [
  {title: "Brand", i: ["Apple", "Samsung", "Google", "Xiaomi", "OnePlus", "Vivo", "Oppo", "Realme"]},
  {title: "RAM", i: ["4 GB", "6 GB", "8 GB", "12 GB", "16 GB"]},
  {title: "Storage", i: ["64 GB", "128 GB", "256 GB", "512 GB"]},
  {title: "Display Size", i: ['6.0" to 6.4"', '6.5" to 6.9"', '7.0" and Above']},
];

const TABLET_FILTERS: SidebarFilterOption[] = [
  {title: "Brand", i: ["Apple", "Samsung", "Xiaomi", "Lenovo", "Huawei"]},
  {title: "RAM", i: ["4 GB", "6 GB", "8 GB", "12 GB"]},
  {title: "Storage", i: ["64 GB", "128 GB", "256 GB", "512 GB"]},
  {title: "Display Size", i: ['8"', '10"', '11"', '12.9"']},
];

const COMPONENT_FILTERS: SidebarFilterOption[] = [
  {title: "Chipset", i: ["NVIDIA GeForce", "AMD Radeon", "Intel Arc"]},
  {title: "Memory Type", i: ["GDDR5", "GDDR6", "GDDR6X", "GDDR7"]},
  {title: "Max Resolution", i: ["3840x2160", "5120x2880", "7680x4320"]},
];

const FILTERS_BY_PATH: Array<{matcher: (path: string) => boolean; filters: SidebarFilterOption[]}> = [
  {matcher: (path) => path.startsWith("/desktops"), filters: DESKTOPS},
  {matcher: (path) => path.startsWith("/special-pc") || path.startsWith("/gaming-pc"), filters: SPECIAL_PC},
  {matcher: (path) => path === "/star-pc", filters: STAR_PC_FILTERS},
  {matcher: (path) => path === "/intel-pc" || path.startsWith("/intel-gaming-pc"), filters: INTEL_PC_FILTERS},
  {matcher: (path) => path === "/ryzen-pc" || path.startsWith("/ryzen-gaming-pc"), filters: RYZEN_PC_FILTERS},
  {matcher: (path) => path === "/brand-pc", filters: BRAND_PC},
  {
    matcher: (path) =>
      path === "/asus-pc" ||
      path === "/acer-pc" ||
      path === "/acer-pc" ||
      path === "/dell-pc" ||
      path === "/hp-pc" ||
      path === "/lenovo-pc" ||
      path === "/gigabyte-pc" ||
      path === "/msi-pc" ||
      path === "/portable-mini-pc",
    filters: BRAND_PC_ITEM,
  },
  {
    matcher: (path) =>
      path === "/asus-all-in-one-pc" ||
      path === "/dHP-all-in-one-pc" ||
      path === "/dell-all-in-one-pc" ||
      path === "/hp-all-in-one-pc" ||
      path === "/lenovo-all-in-one-pc" ||
      path === "/teclast-all-in-one-pc" ||
      path === "/aoc-all-in-one-pc" ||
      path === "/asus-mini-pc" ||
      path === "/zotac-mini-pc",
    filters: BRAND_PC_ITEM,
  },
  {matcher: (path) => path === "/all-in-one-pc", filters: ALL_IN_ONE_PC},
  {matcher: (path) => path === "/ai-pc", filters: AI_PC},
  {matcher: (path) => path === "/apple-mac-mini", filters: MAC_MINI},
  {matcher: (path) => path === "/apple-imac", filters: [...MAC_MINI, {title: "Display", i: ["24 inch", "27 inch"]}]},
  {matcher: (path) => path === "/apple-mac-studio", filters: MAC_STUDIO},
  {matcher: (path) => path === "/laptops", filters: LAPTOP},
  {
    matcher: (path) =>
      path === "/lenovo-laptop" ||
      path === "/hp-laptop" ||
      path === "/msi-laptop" ||
      path === "/asus-laptop" ||
      path === "/gigabyte-laptop" ||
      path === "/acer-laptop" ||
      path === "/dell-laptop" ||
      path === "/smart-laptop" ||
      path === "/chuwi-laptop" ||
      path === "/microsoft-laptop" ||
      path === "/walton-laptop" ||
      path === "/msi-gaming-laptop" ||
      path === "/asus-gaming-laptop" ||
      path === "/lenovo-gaming-laptop" ||
      path === "/gigabyte-gaming-laptop",
    filters: [...LAPTOP_ITEM, {title: "Series", i: ["Consumer Laptops", "Business Laptop", "Gaming Laptop", "Premium Ultrabook Laptops"]}],
  },
  {
    matcher: (path) => path === "/msi-gaming-laptop" || path === "/asus-gaming-laptop" || path === "/lenovo-gaming-laptop" || path === "/gigabyte-gaming-laptop",
    filters: LAPTOP_ITEM,
  },
  {matcher: (path) => path === "/cpu", filters: CPU_FILTERS},
  {matcher: (path) => path === "/intel-cpu", filters: INTEL_CPU_FILTERS},
  {matcher: (path) => path === "/amd-cpu", filters: AMD_CPU_FILTERS},
  {matcher: (path) => path === "/apple-macbook", filters: APPLE_MACBOOK},
  {matcher: (path) => path.startsWith("/laptop"), filters: LAPTOP_FILTERS},
  {matcher: (path) => path.startsWith("/phones") || path.includes("mobile-phone") || path === "/iphone", filters: PHONE_FILTERS},
  {matcher: (path) => path.startsWith("/tablet"), filters: TABLET_FILTERS},
];

export function getFilterOptionsForPath(pathname: string): SidebarFilterOption[] {
  const normalized = pathname.trim().toLowerCase();
  const matched = FILTERS_BY_PATH.find(({matcher}) => matcher(normalized));
  return matched?.filters ?? [];
}
