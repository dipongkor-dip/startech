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

export const seedCategories = async () => {
  try {
    await category.insertMany(categoriesData, { ordered: false });

    console.log("✅ Categories seeded successfully");
  } catch (error: any) {
    if (error.code === 11000) {
      console.error("❌ Duplicate category found:", error);
    } else {
      console.error("❌ Error seeding categories:", error);
    }
  }
};

