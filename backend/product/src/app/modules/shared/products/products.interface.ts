import {Types} from "mongoose";

export enum Availability {
  InStock = "In Stock",
  ComingSoon = "Coming Soon",
  PreOrder = "Pre Order",
  OutOfStock = "Out of Stock",
}

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETE = "DELETE",
}

export enum ProductModelName {
  Phone = "Phone",
  Laptop = "Laptop",
  CPU = "CPU",
  GPU = "GPU",
}

export interface ProductInt {
  categoryId: Types.ObjectId;
  permissionId: string;

  specificationModel: ProductModelName;
  productId: Types.ObjectId;

  descriptionId: Types.ObjectId;

  productCode: String;
  brand: string;
  model: string;
  price: number;
  discountPrice: number;
  availability: Availability;
  productStatus: ProductStatus;
  quantity: number;

  createdAt?: Date;
  updatedAt?: Date;
}
