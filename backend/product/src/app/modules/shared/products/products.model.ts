import mongoose, {Schema} from "mongoose";
import {Availability, ProductModelName, ProductInt, ProductStatus} from "./products.interface";

const productSchema = new Schema(
  {
    categoryId: {type: Schema.Types.ObjectId, ref: "Category", required: true, index: true},
    permissionId: {type: String, required: true},

    specificationModel: {type: String, enum: Object.values(ProductModelName), required: true, index: true},
    productId: {type: Schema.Types.ObjectId, refPath: "specificationModel", required: true, index: true},

    descriptionId: {type: Schema.Types.ObjectId, ref: "Description", required: true},

    productCode: {type: String, required: true},
    brand: {type: String, required: true, trim: true},
    model: {type: String, index: true, required: true, trim: true, unique: true},
    productStatus: {type: String, enum: Object.values(ProductStatus), default: ProductStatus.INACTIVE, index: true},
    price: Number,
    discountPrice: {type: Number, min: 0},
    availability: {type: String, enum: Object.values(Availability), default: Availability.InStock, index: true},
    quantity: {type: Number, default: 0, min: 0},
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Product = mongoose.model<ProductInt & mongoose.Document>("Product", productSchema);
