export type SidebarFilterOption = {
  title: string;
  i: string[];
};

const DESKTOP_FILTERS: SidebarFilterOption[] = [
  {title: "Processor", i: ["Intel", "AMD", "Apple"]},
  {title: "SSD", i: ["256 GB", "512 GB", "1 TB", "2 TB"]},
  {title: "Graphics Card", i: ["NVIDIA", "AMD", "Integrated"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB", "64 GB"]},
  {title: "Brand", i: ["Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Apple"]},
];

const STAR_PC_FILTERS: SidebarFilterOption[] = [
  {title: "Star PC Type", i: ["Intel PC", "RYZEN PC"]},
  ...DESKTOP_FILTERS,
];

const INTEL_PC_FILTERS: SidebarFilterOption[] = [
  {title: "Processor", i: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9"]},
  {title: "SSD", i: ["256 GB", "512 GB", "1 TB", "2 TB"]},
  {title: "Graphics Card", i: ["Integrated", "NVIDIA"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB"]},
  {title: "Brand", i: ["Dell", "HP", "Lenovo", "ASUS", "Acer"]},
];

const RYZEN_PC_FILTERS: SidebarFilterOption[] = [
  {title: "Processor", i: ["Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9"]},
  {title: "SSD", i: ["256 GB", "512 GB", "1 TB", "2 TB"]},
  {title: "Graphics Card", i: ["Integrated Radeon", "AMD Radeon", "NVIDIA"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB"]},
  {title: "Brand", i: ["Dell", "HP", "Lenovo", "ASUS", "Acer"]},
];

const LAPTOP_FILTERS: SidebarFilterOption[] = [
  {title: "Processor", i: ["Intel", "AMD", "Apple"]},
  {title: "RAM", i: ["8 GB", "16 GB", "32 GB", "64 GB"]},
  {title: "Storage", i: ["256 GB", "512 GB", "1 TB"]},
  {title: "Graphics Card", i: ["NVIDIA", "AMD", "Integrated"]},
  {title: "Display Size", i: ['13"', '14"', '15.6"', '16"', '17.3"']},
  {title: "Brand", i: ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI"]},
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
  {title: "Chipset", i: ["NVIDIA GeForce", "AMD Radeon", "Intel Iris Xe"]},
  {title: "Memory Type", i: ["GDDR5", "GDDR6", "GDDR6X", "GDDR7"]},
  {title: "Max Resolution", i: ["3840x2160", "5120x2880", "7680x4320"]},
];

const DEFAULT_FILTERS: SidebarFilterOption[] = [{title: "Brand", i: ["Generic"]}];

const FILTERS_BY_PATH: Array<{matcher: (path: string) => boolean; filters: SidebarFilterOption[]}> = [
  {matcher: (path) => path === "/star-pc", filters: STAR_PC_FILTERS},
  {matcher: (path) => path === "/intel-pc", filters: INTEL_PC_FILTERS},
  {matcher: (path) => path === "/ryzen-pc", filters: RYZEN_PC_FILTERS},
  {matcher: (path) => path.startsWith("/desktop") || path.startsWith("/desktops"), filters: DESKTOP_FILTERS},
  {matcher: (path) => path.startsWith("/laptop"), filters: LAPTOP_FILTERS},
  {matcher: (path) => path.startsWith("/phones") || path.includes("mobile-phone") || path === "/iphone", filters: PHONE_FILTERS},
  {matcher: (path) => path.startsWith("/tablet"), filters: TABLET_FILTERS},
  {matcher: (path) => path.startsWith("/component") || path === "/gpu", filters: COMPONENT_FILTERS},
];

export function getFilterOptionsForPath(pathname: string): SidebarFilterOption[] {
  const normalized = pathname.trim().toLowerCase();
  const matched = FILTERS_BY_PATH.find(({matcher}) => matcher(normalized));
  return matched?.filters ?? DEFAULT_FILTERS;
}
