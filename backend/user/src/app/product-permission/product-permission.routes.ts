import {Router} from "express";
import {productPermissionController} from "./product-permission.controller";
import {createPermissionSchema} from "./product-permission.validation";
import {validateSchema} from "../middleware/validateSchema";
import {authentication} from "../middleware/authentication";
import {UserRole} from "@prisma/client";

const router = Router();

// protected routes
router.post("/create", authentication(UserRole.ADMIN), validateSchema(createPermissionSchema), productPermissionController.createPermission);

export const productPermissionRoutes = router;
