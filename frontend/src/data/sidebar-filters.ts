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

const STAR_PC_FILTERS: SidebarFilterOption[] = [{title: "Star PC Type", i: ["Intel PC", "RYZEN PC"]}, ...DESKTOP_FILTERS];

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

const FILTERS_BY_PATH: Array<{matcher: (path: string) => boolean; filters: SidebarFilterOption[]}> = [
  {matcher: (path) => path === "/star-pc", filters: STAR_PC_FILTERS},
  {matcher: (path) => path === "/cpu", filters: CPU_FILTERS},
  {matcher: (path) => path === "/intel-cpu", filters: INTEL_CPU_FILTERS},
  {matcher: (path) => path === "/amd-cpu", filters: AMD_CPU_FILTERS},
  {matcher: (path) => path === "/intel-pc", filters: INTEL_PC_FILTERS},
  {matcher: (path) => path === "/ryzen-pc", filters: RYZEN_PC_FILTERS},
  {matcher: (path) => path.startsWith("/desktop") || path.startsWith("/desktops"), filters: DESKTOP_FILTERS},
  {matcher: (path) => path.startsWith("/laptop"), filters: LAPTOP_FILTERS},
  {matcher: (path) => path.startsWith("/phones") || path.includes("mobile-phone") || path === "/iphone", filters: PHONE_FILTERS},
  {matcher: (path) => path.startsWith("/tablet"), filters: TABLET_FILTERS},
];

export function getFilterOptionsForPath(pathname: string): SidebarFilterOption[] {
  const normalized = pathname.trim().toLowerCase();
  const matched = FILTERS_BY_PATH.find(({matcher}) => matcher(normalized));
  return matched?.filters ?? [];
}
