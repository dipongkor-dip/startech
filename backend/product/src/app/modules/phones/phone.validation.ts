import {z} from "zod";

export const phoneCreateSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  categoryId: z.string().min(1, "CategoryId is required"), // ObjectId string
  permissionId: z.string().min(1, "PermissionId is required"),
  model: z.string().min(1, "Model is required"),
  productCode: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().min(0).optional(),
  status: z.enum(["In Stock", "Out of Stock", "Coming Soon"]).default("In Stock"),

  options: z
    .array(
      z.object({
        ram: z.string().optional(),
        storage: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .optional(),

  display: z.string().optional(),
  processor: z.string().optional(),
  camera: z.object({
    font: z.string().optional(),
    rear: z.string().optional(),
  }),

  storage: z.string().optional(),
  features: z.array(z.string()).optional(),

  specification: z.object({
    display: z.object({
      size: z.string().optional(),
      type: z.string().optional(),
      resolution: z.string().optional(),
      refreshRate: z.string().optional(),
      brightness: z.string().optional(),
      protection: z.string().optional(),
      features: z.array(z.string()).optional(),
    }),
    processor: z.object({
      chipset: z.string().optional(),
      cpuType: z.array(z.string()).optional(),
      gpu: z.string().optional(),
    }),
    memory: z.object({
      ram: z.string().optional(),
      internalStorage: z.array(z.string()).optional(),
      cardSlot: z.string().optional(),
    }),
    rearCamera: z.object({
      resolution: z.array(z.string()).optional(),
      features: z.array(z.string()).optional(),
      videoRecording: z.array(z.string()).optional(),
    }),
    fontCamera: z.object({
      resolution: z.array(z.string()).optional(),
      features: z.array(z.string()).optional(),
      videoRecording: z.array(z.string()).optional(),
    }),
    audio: z.object({
      speaker: z.string().optional(),
      audioFeatures: z.array(z.string()).optional(),
    }),
    networkConnectivity: z.object({
      sim: z.string().optional(),
      network: z.array(z.string()).optional(),
      wifi: z.array(z.string()).optional(),
      bluetooth: z.string().optional(),
    }),
    os: z.string().optional(),
    warranty: z.string().optional(),
  }),

  description: z
    .array(
      z.object({
        items: z.array(
          z.object({
            title: z.string().min(1, "Title is required"),
            des: z.string().min(1, "Description is required"),
          }),
        ),
        pic: z.string().optional(),
      }),
    )
    .optional(),
});
