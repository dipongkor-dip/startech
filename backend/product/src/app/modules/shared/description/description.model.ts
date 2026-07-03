import mongoose, {Schema, Model} from "mongoose";
import {IDescription, IDescriptionItem} from "./description.interface";

const DescriptionItemSchema = new Schema<IDescriptionItem>(
  {
    title: {type: String, required: true, trim: true},
    des: {type: String, required: true, trim: true},
  },
  {_id: false},
);

const ImageSchema = new Schema(
  {
    url: {type: String, required: true},
    publicId: {type: String, required: true},
  },
  {_id: false},
);

const DescriptionSchema = new Schema<IDescription>(
  {
    items: {
      type: [DescriptionItemSchema],
      required: true,
      default: [],
    },

    images: {type: [ImageSchema], default: []},
  },
  {versionKey: false, timestamps: true},
);

export const Description: Model<IDescription> = mongoose.model<IDescription>("Description", DescriptionSchema);
