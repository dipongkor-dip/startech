import {CategoryInt} from "../app/modules/categories/categories.interface";
import {category} from "../app/modules/categories/categories.model";

const categoriesData: Partial<CategoryInt>[] = [
  {
    name: "Desktop",
    title: "Desktop PC Price in Bangladesh (BD)",
    description:
      "Desktop PC Price in Bangladesh starts from BDT 25,000 and depending on the configuration the price may go up to BDT 600,000 or more. At Star Tech you can get the latest configured custom Desktop PC, Gaming PC, Brand PC, All-in-One PC, Portable Mini PC etc. Browse below and order yours now!",
  },
  {
    name: "Laptop",
    title: "Laptop Price in Bangladesh (BD)",
    description:
      "Find the latest Laptop Price in Bangladesh from budget-friendly models to high-end gaming laptops. Prices start around BDT 30,000 and can exceed BDT 400,000 depending on brand and configuration.",
  },
  {
    name: "Component",
    title: "PC Component Price in Bangladesh (BD)",
    description: "Browse PC Components including processors, motherboards, RAM, graphics cards, SSDs, and more. Prices vary depending on brand and performance level.",
  },
  {
    name: "Monitor",
    title: "Monitor Price in Bangladesh (BD)",
    description: "Monitor prices in Bangladesh start from BDT 8,000 for basic models and can go up to BDT 200,000 for professional and gaming monitors.",
  },
  {
    name: "Power",
    title: "Power Supply Price in Bangladesh (BD)",
    description: "Get reliable Power Supplies, UPS, and stabilizers. Prices start from BDT 3,000 depending on wattage and brand.",
  },
  {
    name: "Phone",
    title: "Mobile Phone Price in Bangladesh (BD)",
    description: "Latest smartphones from popular brands available in Bangladesh. Prices range from BDT 10,000 to over BDT 200,000.",
  },
  {
    name: "Tablet",
    title: "Tablet Price in Bangladesh (BD)",
    description: "Affordable and premium tablets for study, work, and entertainment. Prices start around BDT 12,000.",
  },
  {
    name: "Office Equipment",
  },
  {
    name: "Camera",
    title: "Camera Price in Bangladesh (BD)",
    description: "DSLR, mirrorless, and action cameras with prices starting from BDT 20,000.",
  },
  {
    name: "Security",
    title: "Security Equipment Price in Bangladesh (BD)",
    description: "CCTV cameras, DVRs, and access control systems for home and office security.",
  },
  {
    name: "Networking",
    title: "Networking Equipment Price in Bangladesh (BD)",
    description: "Routers, switches, and networking accessories available for both home and enterprise use.",
  },
  {
    name: "Software",
    title: "Software Price in Bangladesh (BD)",
    description: "Licensed operating systems, office suites, and security software at affordable prices.",
  },
  {
    name: "Server & Storage",
  },
  {
    name: "Accessories",
    title: "Computer Accessories Price in Bangladesh (BD)",
    description: "Keyboards, mice, headphones, and other accessories available at all price ranges.",
  },
  {
    name: "Gadget",
    title: "Gadget Price in Bangladesh (BD)",
    description: "Smartwatches, fitness bands, and innovative gadgets for everyday use.",
  },
  {
    name: "Gaming",
    title: "Gaming Gear Price in Bangladesh (BD)",
    description: "Gaming consoles, controllers, and accessories for immersive gaming experiences.",
  },
  {
    name: "TV",
    title: "TV Price in Bangladesh (BD)",
    description: "Smart TVs and LED TVs from top brands starting around BDT 25,000.",
  },
  {
    name: "Appliance",
    title: "Home Appliance Price in Bangladesh (BD)",
    description: "Refrigerators, washing machines, air conditioners, and other appliances for home use.",
  },
];

const desktopData = [
  {
    name: "Desktop Offer",
    title: "Desktop Offer Price in Bangladesh (BD)",
    parentId: "6a2eb138360878ebecf6118f",
    description: "Latest desktop offers in Bangladesh including budget PCs, gaming rigs, and workstation deals. Prices vary depending on configuration and brand.",
  },
  {
    name: "Star PC",
    parentId: "6a2eb138360878ebecf6118f",
    title: "Star PC Price in Bangladesh (BD)",
    description: "Star PC custom builds available in Bangladesh with flexible configurations for office, gaming, and professional use.",
  },
  {
    name: "Gaming PC",
    parentId: "6a2eb138360878ebecf6118f",
    title: "Gaming PC Price in Bangladesh (BD)",
    description: "High-performance Gaming PCs with powerful graphics cards and processors. Prices start from mid-range builds to premium setups.",
  },
  {
    name: "Brand PC",
    parentId: "6a2eb138360878ebecf6118f",
    title: "Brand PC Price in Bangladesh (BD)",
    description: "Branded PCs from top manufacturers like HP, Dell, and Lenovo. Suitable for office and home use with warranty support.",
  },
  {
    name: "All-in-One PC",
    parentId: "6a2eb138360878ebecf6118f",
    title: "All-in-One PC Price in Bangladesh (BD)",
    description: "Compact All-in-One PCs combining monitor and CPU in one device. Ideal for space-saving setups.",
  },
  {
    name: "AI PC",
    parentId: "6a2eb138360878ebecf6118f",
    title: "AI PC Price in Bangladesh (BD)",
    description: "AI-powered PCs designed for machine learning, data science, and advanced computing workloads.",
  },
  {
    name: "Portable Mini PC",
    parentId: "6a2eb138360878ebecf6118f",
    title: "Portable Mini PC Price in Bangladesh (BD)",
    description: "Small form factor Mini PCs for portability and efficiency. Prices vary depending on performance and brand.",
  },
  {
    name: "Apple Mac Mini",
    parentId: "6a2eb138360878ebecf6118f",
    title: "Apple Mac Mini Price in Bangladesh (BD)",
    description: "Apple Mac Mini available with M-series processors. Compact yet powerful desktop solution for professionals.",
  },
  {
    name: "Apple iMac",
    parentId: "6a2eb138360878ebecf6118f",
    title: "Apple iMac Price in Bangladesh (BD)",
    description: "Apple iMac with Retina display and powerful hardware. Suitable for creative professionals and everyday use.",
  },
  {
    name: "Apple Mac Studio",
    parentId: "6a2eb138360878ebecf6118f",
    title: "Apple Mac Studio Price in Bangladesh (BD)",
    description: "Apple Mac Studio designed for high-end creative workflows with advanced performance and expandability.",
  },
  {
    name: "Apple Mac Pro",
    parentId: "6a2eb138360878ebecf6118f",
    title: "Apple Mac Pro Price in Bangladesh (BD)",
    description: "Apple Mac Pro workstation for professionals requiring extreme performance and modular expandability.",
  },
];

export const seedCategories = async () => {
  try {
    // await category.insertMany(categoriesData, { ordered: false });

    await category.insertMany(desktopData, {ordered: false});

    console.log("✅ Categories seeded successfully");
  } catch (error: any) {
    if (error.code === 11000) {
      console.error("❌ Duplicate category found:", error);
    } else {
      console.error("❌ Error seeding categories:", error);
    }
  }
};
