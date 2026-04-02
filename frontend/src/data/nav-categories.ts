export type NavSubItem = {
  label: string;
  href: string;
};

export type NavMenuItem = {
  label: string;
  href: string;
  /** If set, hovering shows a flyout to the right */
  sub?: NavSubItem[];
};

export type NavCategory = {
  label: string;
  /** Optional default when clicking the top label */
  href?: string;
  items: NavMenuItem[];
};

/** E‑commerce category mega menu (structure mirrors common electronics storefronts) */
export const NAV_CATEGORIES: NavCategory[] = [
  {
    label: "Desktop",
    href: "/desktops",
    items: [
      {label: "Desktop Offer", href: "/special-pc"},
      {
        label: "Star PC",
        href: "/star-pc",
        sub: [
          {label: "Intel PC", href: "/intel-pc"},
          {label: "RYZEN PC", href: "/ryzen-pc"},
        ],
      },
      {
        label: "Gaming PC",
        href: "/gaming-pc",
        sub: [
          {label: "Intel PC", href: "/intel-gaming-pc"},
          {label: "RYZEN PC", href: "/ryzen-gaming-pc"},
        ],
      },
      {
        label: "Brand PC",
        href: "/brand-pc",
        sub: [
          {label: "Acer", href: "/acer-pc"},
          {label: "ASUS", href: "/asus-pc"},
          {label: "Dell", href: "/dell-pc"},
          {label: "HP", href: "/hp-pc"},
          {label: "Lenovo", href: "/lenovo-pc"},
          {label: "MSI", href: "/msi-pc"},
          {label: "Gigabyte", href: "/gigabyte-pc"},
        ],
      },
      {
        label: "All-in-One PC",
        href: "/all-in-one-pc",
        sub: [
          {label: "HP", href: "/hp-all-in-one-pc"},
          {label: "Dell", href: "/dell-all-in-one-pc"},
          {label: "ASUS", href: "/asus-all-in-one-pc"},
          {label: "Lenovo", href: "/lenovo-all-in-one-pc"},
          {label: "Teclast", href: "/teclast-all-in-one-pc"},
          {label: "AOC", href: "/aoc-all-in-one-pc"},
          {label: "dHP", href: "/dHP-all-in-one-pc"},
        ],
      },
      {
        label: "Portable Mini PC",
        href: "/portable-mini-pc",
        sub: [
          {label: "Asus", href: "/asus-mini-pc"},
          {label: "Zotac", href: "/zotac-mini-pc"},
        ],
      },
      {label: "AI PC", href: "/ai-pc"},
      {label: "Apple Mac Mini", href: "/apple-mac-mini"},
      {label: "Apple iMac", href: "/apple-imac"},
      {label: "Apple Mac Studio", href: "/apple-mac-studio"},
      {label: "Show All Desktop", href: "/desktops"},
    ],
  },
  {
    label: "Laptop",
    href: "/laptops",
    items: [
      {
        label: "All Laptop",
        href: "/laptops",
        sub: [
          {label: "Lenovo", href: "/lenovo-laptop"},
          {label: "HP", href: "/hp-laptop"},
          {label: "MSI", href: "/msi-laptop"},
          {label: "Tecno", href: "/asus-laptop"},
          {label: "MacBook", href: "/apple-macbook"},
          {label: "Gigabyte", href: "/gigabyte-laptop"},
          {label: "Acer", href: "/acer-laptop"},
          {label: "DELL", href: "/dell-laptop"},
          {label: "Smart", href: "/smart-laptop"},
          {label: "Chuwi", href: "/chuwi-laptop"},
          {label: "Microsoft", href: "/microsoft-laptop"},
          {label: "Walton", href: "/walton-laptop"},
        ],
      },
      {
        label: "Gaming Laptop",
        href: "/gaming-laptop",
        sub: [
          {label: "MSI", href: "/msi-gaming-laptop"},
          {label: "ASUS", href: "/asus-gaming-laptop"},
          {label: "Lenovo", href: "/lenovo-gaming-laptop"},
          {label: "Gigabyte", href: "/gigabyte-gaming-laptop"},
        ],
      },
      {
        label: "Premium Ultrabook",
        href: "/ultrabook",
        sub: [
          {label: "HP", href: "/gigabyte-ultrabook"},
          {label: "Acer", href: "/acer-ultrabook"},
          {label: "Lenovo", href: "/lenovo-ultrabook"},
          {label: "Dell", href: "/dell-ultrabook"},
          {label: "Microsoft", href: "/micorsoft-ultrabook"},
          {label: "Asus", href: "/asus-ultrabook"},
          {label: "MSI", href: "/msi-ultrabook"},
        ],
      },
      {
        label: " Laptop Accessories",
        href: "/laptop-accessories",
        sub: [
          {label: "Cooler", href: "/laptop-cooler"},
          {label: "Stand", href: "/laptop-stand"},
          {label: "Battery", href: "/laptop-battery"},
          {label: "Display", href: "/laptop-display"},
          {label: "keyboard", href: "/laptop-keyboard"},
        ],
      },
      {label: "Show All Laptop", href: "/laptops"},
    ],
  },
  {
    label: "Component",
    href: "/component",
    items: [
      {
        label: "Processor",
        href: "/cpu",
        sub: [
          {label: "Intel", href: "/intel-cpu"},
          {label: "AMD", href: "/amd-cpu"},
        ],
      },
      {label: "Graphics Card", href: "/gpu"},
      {label: "Motherboard", href: "/motherboard"},
      {label: "RAM", href: "/ram"},
      {label: "Storage", href: "/storage"},
      {label: "Power Supply", href: "/psu"},
      {label: "Cooling", href: "/cooling"},
      {label: "Show All Component", href: "/component"},
    ],
  },
  {
    label: "Monitor",
    href: "/monitor",
    items: [
      {label: "Gaming Monitor", href: "/gaming"},
      {label: "Professional", href: "/pro"},
      {label: "Ultrawide", href: "/ultrawide"},
      {label: "4K", href: "/4k"},
      {label: "Show All Monitor", href: "/monitor"},
    ],
  },
  {
    label: "Power",
    href: "/power",
    items: [
      {label: "UPS", href: "/ups"},
      {label: "Power Strip", href: "/strip"},
      {label: "Adapter", href: "/adapter"},
      {label: "Show All Power", href: "/power"},
    ],
  },
  {
    label: "Phone",
    href: "/phones",
    items: [
      {label: "iPhone", href: "/iphone"},
      {label: "Google", href: "/google-pixel-phone"},
      {label: "Samsung", href: "/samsung-mobile-phone"},
      {label: "Redmi", href: "/redmi-mobile-phone"},
      {label: "HONOR", href: "/honor-mobile-phone"},
      {label: "OnePlus", href: "/oneplus-mobile-phone"},
      {label: "OPPO", href: "/oppo-mobile-phone"},
      {label: "Vivo", href: "/vivo-mobile-phone"},
      {label: "Realme", href: "/realme-mobile-phone"},
      {label: "Infinix", href: "/infinix-mobile-phone"},
      {label: "TECNO", href: "/tecno-mobile-phone"},
      {label: "TCL", href: "/tcl-mobile-phone"},
      {label: "Nokia", href: "/nokia-mobile-phone"},
      {label: "ZTE", href: "/zte-mobile-phone"},
      {label: "Symphony", href: "/symphony-mobile-phone"},
      {label: "Walton", href: "/walton-mobile-phone"},
      {label: "XTRA", href: "/xtra-mobile-phone"},
      {label: "Helio", href: "/helio-mobile-phone"},
      {label: "Feature Phone", href: "/feature-phone"},
      {
        label: "Mobile Accessories",
        href: "/phones/accessories",
        sub: [
          {label: "Charger Adapter", href: "/mobile-phone-charger-adapter"},
          {label: "Type-C Cable", href: "/type-c-cable"},
          {label: "Micro USB Cable", href: "/micro-usb-cable"},
          {label: "Lightning Cable", href: "/lightning-cable"},
          {label: "Holder & Stand", href: "/mobile-phone-holder-stand"},
          {label: "Case & Cover", href: "/mobile-case-cover"},
          {label: "Mobile Phone Cooler", href: "/mobile-phone-cooler"},
        ],
      },
      {label: "Show All Phone", href: "/phones"},
    ],
  },
  {
    label: "Tab",
    href: "/tablet",
    items: [
      {label: "Android Tablet", href: "/android"},
      {label: "iPad", href: "/ipad"},
      {label: "Tablet Accessories", href: "/accessories"},
      {label: "Show All Tab", href: "/tablet"},
    ],
  },
];
