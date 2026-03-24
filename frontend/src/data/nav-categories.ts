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
        label: "All-in-One PC",
        href: "/aio",
        sub: [
          {label: "HP", href: "/hp"},
          {label: "Dell", href: "/dell"},
          {label: "Lenovo", href: "/lenovo"},
          {label: "ASUS", href: "/asus"},
        ],
      },
      {label: "AI PC", href: "/ai"},
      {label: "Portable Mini PC", href: "/minipc", sub: [{label: "Asus", href: "/asus"}]},
      {label: "Apple Mac Mini", href: "/mac-mini"},
      {label: "Apple iMac", href: "/imac"},
      {label: "Apple Mac Studio", href: "/mac-studio"},
      {label: "Apple Mac Pro", href: "/mac-pro"},
      {label: "Show All Desktop", href: "/desktop"},
    ],
  },
  {
    label: "Laptop",
    href: "/laptop",
    items: [
      {label: "Laptop Offer", href: "/offers"},
      {label: "Gaming Laptop", href: "/gaming"},
      {label: "Ultrabook", href: "/ultrabook"},
      {label: "Business Laptop", href: "/business"},
      {label: "Apple MacBook", href: "/macbook"},
      {label: "Show All Laptop", href: "/laptop"},
    ],
  },
  {
    label: "Component",
    href: "/component",
    items: [
      {label: "Processor", href: "/cpu"},
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
