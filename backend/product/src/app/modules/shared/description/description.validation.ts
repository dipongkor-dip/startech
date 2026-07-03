import {z} from "zod";

export const descriptionValid = z.object({
  title: z.string().trim().min(1, "Title is required"),
  des: z.string().trim().min(1, "Description is required"), // 🎯 'description' থেকে পরিবর্তন করে 'des' করা হলো
});

export const descriptionValidationSchema = z.object({
  items: z.array(descriptionValid).min(1, "At least one description item is required"),
  images: z.array(z.object({url: z.string(), publicId: z.string()})).optional(),
});
