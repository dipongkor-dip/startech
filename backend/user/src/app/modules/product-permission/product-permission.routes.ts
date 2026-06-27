import {Router} from "express";
import {productPermissionController} from "./product-permission.controller";
import {createPermissionSchema} from "./product-permission.validation";

import {UserRole} from "@prisma/client";
import {authentication} from "../../middleware/authentication";
import {validateSchema} from "../../middleware/validateSchema";

const router = Router();

// protected routes
router.post("/create", authentication(UserRole.ADMIN, UserRole.SUPER_ADMIN), validateSchema(createPermissionSchema), productPermissionController.createPermission);

export const productPermissionRoutes = router;
