import {UserRole} from "@prisma/client";
import {prisma} from "../config/database.js";
import {env} from "../env/index.js";
import bcrypt from "bcryptjs";

const superUser = async () => {
  const hashedPassword = await bcrypt.hash(env.superAdmin.password, 12);

  const existingSuperAdmin = await prisma.user.findUnique({
    where: {email: env.superAdmin.email},
  });

  if (existingSuperAdmin) {
    console.log("Super admin already exists");
    return;
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: env.superAdmin.email,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        needPasswordReset: false,
        isValidated: true,
      },
    });

    await tx.superAdmin.create({
      data: {
        name: "Super Admin",
        userId: user.id,
      },
    });

    console.log("Super admin created successfully");
  });
};

export default superUser;
