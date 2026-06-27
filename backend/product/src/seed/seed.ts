import categoriesData from "./categoriesData.json";
import desktopData from "./desktopData.json";
import demoPhone from "./phone.json";
import monitors from "./monitor.json";
import appliances from "./appliances.json";
import appliances_ac from "./alppliances-ac.json";
import { category } from "../app/modules/shared/categories/categories.model";

export const seedCategories = async () => {
  try {
    await category.insertMany(categoriesData, { ordered: false });
    // await category.insertMany(desktopData, {ordered: false});
    // await category.insertMany(demoPhone, {ordered: false});
    // await category.insertMany(monitors, {ordered: false});
    // await category.insertMany(monitors, {ordered: false});
    // await category.insertMany(appliances, {ordered: false});
    // await category.insertMany(appliances_ac, {ordered: false});

    console.log("✅ Categories seeded successfully");
  } catch (error: any) {
    if (error.code === 11000) {
      console.error("❌ Duplicate category found:", error);
    } else {
      console.error("❌ Error seeding categories:", error);
    }
  }
};
