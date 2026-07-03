import mongoose from "mongoose";

export interface IPhoneOption {
  ram?: string;
  storage?: string;
  color?: string;
}

export interface IPhone {
  _id: mongoose.Types.ObjectId;
  images: {url: string; publicId: string}[];

  options?: IPhoneOption[];
  display: string;
  processor: string;
  camera: {
    font: string;
    rear: string;
  };
  storage: string;
  features: string[];
  specification?: {
    display?: {
      size?: string;
      type?: string;
      resolution?: string;
      refreshRate?: string;
      brightness?: string;
      protection?: string;
      features?: string[];
    };
    processor?: {
      chipset?: string;
      cpuType?: string[];
      gpu?: string;
    };
    memory?: {
      ram?: string;
      internalStorage?: string[];
      cardSlot?: string;
    };
    rearCamera?: {
      resolution?: string[];
      features?: string[];
      videoRecording?: string[];
    };
    fontCamera?: {
      resolution?: string[];
      features?: string[];
      videoRecording?: string[];
    };
    audio?: {
      speaker?: string;
      audioFeatures?: string[];
    };
    networkConnectivity?: {
      sim?: string;
      network?: string[];
      wifi?: string[];
      bluetooth?: string;
    };
    os?: string;
    warranty?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
