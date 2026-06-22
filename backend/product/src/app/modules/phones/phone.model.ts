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
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true},
    permissionId: {type: String, required: true},

    // 🎯 model ফিল্ডটিকে এখানে ইউনিক এবং প্রাইমারি ইনডেক্স হিসেবে সেট করা হলো
    model: {
      type: String,
      required: true,
      trim: true,
      unique: true, // ২টা প্রোডাক্টের মডেল কখনো এক হবে না
      index: true, // ডাটাবেজ সার্চ সুপার ফাস্ট করার জন্য ইনডেক্সিং
    },

    productCode: {type: String, default: "", unique: true},
    price: {type: Number, required: true, min: 0},
    discountPrice: {type: Number, min: 0},

    // সরাসরি availability ফিল্ড অপশন হিসেবে থাকছে
    availability: {
      type: String,
      enum: ["In Stock", "Coming Soon", "Pre Order", "Out of Stock"],
      default: "In Stock",
      index: true,
    },

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
    images: [{type: String, default: []}],
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
        delete ret.__v;
        return ret;
      },
    },
  },
);

PhoneSchema.index({categoryId: 1, price: 1, availability: 1});

export const Phone = mongoose.model<IPhone & mongoose.Document>("Phone", PhoneSchema);
