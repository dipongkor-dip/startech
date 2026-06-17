import mongoose, {Schema} from "mongoose";
import {IPhone} from "./phone.interface";

// Sub-schemas for specification
const displaySpecSchema = new Schema(
  {
    size: {type: String, default: ""},
    type: {type: String, default: ""},
    resolution: {type: String, default: ""},
    refreshRate: {type: String, default: ""},
    brightness: {type: String, default: ""},
    protection: {type: String, default: ""},
    features: [{type: String}],
  },
  {_id: false},
);

const processorSpecSchema = new Schema(
  {
    chipset: {type: String, default: ""},
    cpuType: [{type: String}],
    gpu: {type: String, default: ""},
  },
  {_id: false},
);

const memorySpecSchema = new Schema(
  {
    ram: {type: String, default: ""},
    internalStorage: [{type: String}],
    cardSlot: {type: String, default: ""},
  },
  {_id: false},
);

const cameraSpecSchema = new Schema(
  {
    resolution: [{type: String}],
    features: [{type: String}],
    videoRecording: [{type: String}],
  },
  {_id: false},
);

const audioSpecSchema = new Schema(
  {
    speaker: {type: String, default: ""},
    audioFeatures: [{type: String}],
  },
  {_id: false},
);

const networkSpecSchema = new Schema(
  {
    sim: {type: String, default: ""},
    network: [{type: String}],
    wifi: [{type: String}],
    bluetooth: {type: String, default: ""},
  },
  {_id: false},
);

const specificationSchema = new Schema(
  {
    display: displaySpecSchema,
    processor: processorSpecSchema,
    memory: memorySpecSchema,
    rearCamera: cameraSpecSchema,
    fontCamera: cameraSpecSchema,
    audio: audioSpecSchema,
    networkConnectivity: networkSpecSchema,
    os: {type: String, default: ""},
    warranty: {type: String, default: ""},
  },
  {_id: false},
);

const PhoneSchema = new Schema(
  {
    brand: {type: String, required: true, trim: true},
    categoryId: {type: Schema.Types.ObjectId, ref: "Category", required: true, index: true},
    permissionId: {type: String, required: true},
    modelName: {type: String, required: true, trim: true, unique: true},
    productCode: {type: String, default: "", unique: true},
    price: {type: Number, required: true, min: 0},
    discountPrice: {type: Number, min: 0},
    status: {type: String, enum: ["In Stock", "Out of Stock", "Coming Soon"], default: "In Stock"},
    options: {
      type: [{ram: String, storage: String, color: String}],
      default: [],
    },
    display: {type: String, default: ""},
    processor: {type: String, default: ""},
    camera: {
      font: {type: String, default: ""},
      rear: {type: String, default: ""},
    },
    storage: {type: String, default: ""},
    features: [{type: String}],
    // images: [{url: {type: String, required: true}}],
    specification: specificationSchema,
    description: {
      type: [
        {
          items: [
            {
              title: {type: String, required: true},
              des: {type: String, required: true},
            },
          ],
          pic: {type: String, default: ""},
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        const {modelName, ...rest} = ret;
        return modelName !== undefined ? {...rest, model: modelName} : ret;
      },
    },
  },
);

export const Phone = mongoose.model<IPhone & mongoose.Document>("Phone", PhoneSchema);
