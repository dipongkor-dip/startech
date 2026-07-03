import z from "zod";
import {Availability, ProductStatus} from "./products.interface";

export const productValidationSchema = z.object({
  // permissionId: z.string().min(1, "Permission ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),

  productCode: z.string().min(1, "Product code is required"),
  availability: z.enum(Availability).default(Availability.InStock),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  discountPrice: z.number().min(0, "Discount price must be greater than or equal to 0"),
  productStatus: z.enum(ProductStatus).default(ProductStatus.INACTIVE),
  quantity: z.number().min(0, "Quantity must be greater than or equal to 0"),
});
