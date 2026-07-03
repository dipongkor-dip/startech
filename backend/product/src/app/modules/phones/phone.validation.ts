import {z} from "zod";
import {descriptionValidationSchema} from "../shared/description/description.validation";
import {productValidationSchema} from "../shared/products/products.validation";

export const phoneValidation = z.object({
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
});

export const phoneValidationSchema = z.object({
  product: productValidationSchema,
  phone: phoneValidation,
  description: descriptionValidationSchema,
});
