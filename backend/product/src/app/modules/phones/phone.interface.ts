import mongoose from "mongoose";
import {IQuery} from "../query/query.interface";
import {IReview} from "../reviews/review.interface";
import {IDescription} from "../description/description.interface";

export interface IQueries {
  queries: IQuery[];
  totalQueries: number;
}

export interface IReviews {
  reviews: IReview[];
  totalReviews: number;
  averageRating: number;
}

export interface IPhoneOption {
  ram?: string;
  storage?: string;
  color?: string;
}

export interface IPhone {
  _id: mongoose.Types.ObjectId;
  brand: string;
  model: string;
  productCode?: string;
  price: number;
  discountPrice?: number;
  status?: "In Stock" | "Out of Stock" | "Coming Soon";
  options?: IPhoneOption[];
  display: string;
  processor: string;
  camera: {
    font: string;
    rear: string;
  };
  storage: string;
  features: string[];
  images: {url: string}[];
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
  description?: IDescription;
  queries?: IQueries;
  reviews?: IReviews;
  createdAt?: Date;
  updatedAt?: Date;
}
