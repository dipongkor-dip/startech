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
    label: 'Desktop',
    href: '/category/desktop',
    items: [
      { label: 'Desktop Offer', href: '/category/desktop/offers' },
      { label: 'Star PC', href: '/category/desktop/star-pc' },
      {
        label: 'Gaming PC',
        href: '/category/desktop/gaming',
        sub: [
          { label: 'Intel PC', href: '/category/desktop/gaming/intel' },
          { label: 'RYZEN PC', href: '/category/desktop/gaming/ryzen' },
        ],
      },
      { label: 'Brand PC', href: '/category/desktop/brand' },
      { label: 'All-in-One PC', href: '/category/desktop/aio' },
      { label: 'AI PC', href: '/category/desktop/ai' },
      { label: 'Portable Mini PC', href: '/category/desktop/mini' },
      { label: 'Apple Mac Mini', href: '/category/desktop/mac-mini' },
      { label: 'Apple iMac', href: '/category/desktop/imac' },
      { label: 'Apple Mac Studio', href: '/category/desktop/mac-studio' },
      { label: 'Apple Mac Pro', href: '/category/desktop/mac-pro' },
      { label: 'Show All Desktop', href: '/category/desktop' },
    ],
  },
  {
    label: 'Laptop',
    href: '/category/laptop',
    items: [
      { label: 'Laptop Offer', href: '/category/laptop/offers' },
      { label: 'Gaming Laptop', href: '/category/laptop/gaming' },
      { label: 'Ultrabook', href: '/category/laptop/ultrabook' },
      { label: 'Business Laptop', href: '/category/laptop/business' },
      { label: 'Apple MacBook', href: '/category/laptop/macbook' },
      { label: 'Show All Laptop', href: '/category/laptop' },
    ],
  },
  {
    label: 'Component',
    href: '/category/component',
    items: [
      { label: 'Processor', href: '/category/component/cpu' },
      { label: 'Graphics Card', href: '/category/component/gpu' },
      { label: 'Motherboard', href: '/category/component/motherboard' },
      { label: 'RAM', href: '/category/component/ram' },
      { label: 'Storage', href: '/category/component/storage' },
      { label: 'Power Supply', href: '/category/component/psu' },
      { label: 'Cooling', href: '/category/component/cooling' },
      { label: 'Show All Component', href: '/category/component' },
    ],
  },
  {
    label: 'Monitor',
    href: '/category/monitor',
    items: [
      { label: 'Gaming Monitor', href: '/category/monitor/gaming' },
      { label: 'Professional', href: '/category/monitor/pro' },
      { label: 'Ultrawide', href: '/category/monitor/ultrawide' },
      { label: '4K', href: '/category/monitor/4k' },
      { label: 'Show All Monitor', href: '/category/monitor' },
    ],
  },
  {
    label: 'Power',
    href: '/category/power',
    items: [
      { label: 'UPS', href: '/category/power/ups' },
      { label: 'Power Strip', href: '/category/power/strip' },
      { label: 'Adapter', href: '/category/power/adapter' },
      { label: 'Show All Power', href: '/category/power' },
    ],
  },
  {
    label: 'Phone',
    href: '/phones',
    items: [
      { label: 'Smartphone', href: '/phones' },
      { label: 'Feature Phone', href: '/phones/feature' },
      { label: 'Accessories', href: '/phones/accessories' },
      { label: 'Show All Phone', href: '/phones' },
    ],
  },
  {
    label: 'Tab',
    href: '/category/tablet',
    items: [
      { label: 'Android Tablet', href: '/category/tablet/android' },
      { label: 'iPad', href: '/category/tablet/ipad' },
      { label: 'Tablet Accessories', href: '/category/tablet/accessories' },
      { label: 'Show All Tab', href: '/category/tablet' },
    ],
  },
];
