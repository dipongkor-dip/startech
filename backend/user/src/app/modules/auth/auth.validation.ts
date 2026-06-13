import zod from "zod";

export const loginSchema = zod
  .object({
    email: zod.string().email("Invalid email format").optional(),
    phone: zod.string().min(10, "Phone number must be at least 10 digits long").optional(),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"],
  });

export const registerSchema = zod
  .object({
    name: zod.string().min(2, "Name must be at least 2 characters long").optional(),
    email: zod.string().email("Invalid email format").optional(),
    phone: zod.string().min(10, "Phone number must be at least 10 digits long").optional(),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"],
  });

export const sendOtpSchema = zod
  .object({
    email: zod.string().email("Invalid email format").optional(),
    phone: zod.string().min(10, "Phone number must be at least 10 digits long").optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"],
  });

export const verifyOtpSchema = zod
  .object({
    email: zod.string().email("Invalid email format").optional(),
    phone: zod.string().min(10, "Phone number must be at least 10 digits long").optional(),
    otp: zod.string().length(6, "OTP must be 6 digits long"),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"],
  });

export const changePasswordSchema = zod.object({
  currentPassword: zod.string().min(6, "Current password must be at least 6 characters long"),
  newPassword: zod.string().min(6, "New password must be at least 6 characters long"),
});

export const addEmployeeSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters long"),
  email: zod.string().email("Invalid email format"),
  phone: zod.string().min(10, "Phone number must be at least 10 digits long"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  role: zod.enum(["ADMIN", "SUPER_ADMIN", "CUSTOMER_SUPPORT_MANAGER", "DELIVERY_BOY", "PRODUCT_MANAGER"]),
});

export type loginDTO = zod.infer<typeof loginSchema>;
export type registerDTO = zod.infer<typeof registerSchema>;
export type sendOtpDTO = zod.infer<typeof sendOtpSchema>;
export type verifyOtpDTO = zod.infer<typeof verifyOtpSchema>;
export type changePasswordDTO = zod.infer<typeof changePasswordSchema>;
export type addEmployeeDTO = zod.infer<typeof addEmployeeSchema>;
