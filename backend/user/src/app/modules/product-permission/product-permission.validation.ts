import zod from "zod";

export const createPermissionSchema = zod.object({
  categoryId: zod.string("Invalid category ID format"),
  productManagerId: zod.string("Invalid product manager ID format"),
});

export type CreatePermissionDTO = zod.infer<typeof createPermissionSchema>;
