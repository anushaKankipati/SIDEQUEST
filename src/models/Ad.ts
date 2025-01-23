import { UploadResponse } from "imagekit/dist/libs/interfaces";
import {Model, model, models, Schema} from "mongoose";

export type Ad = {
    _id: string;
    title: string;
    price: number;
    cityName?: string; 
    category: string;
    description: string;
    tags: string[];
    time_estimate: number;
    contact: string;
    files: UploadResponse[];
    isPayingByHour: boolean; 
    location: {
        lat: number;
        lng: number;
    },
    userEmail: string;
    createdAt: Date; 
    updatedAt: Date; 
}

const adSchema = new Schema<Ad>({
    title: String,
    price: Number,
    cityName: String,
    category: String,
    description: String,
    tags: [String],
    time_estimate: Number,
    contact: String,
    files: [Object],
    isPayingByHour: Boolean, 
    location: Object,
    userEmail: {type:String, required: true},
}, {
    timestamps: true,
});

adSchema.index({location:'2dsphere'});

export const AdModel = (models?.Ad as Model<Ad>) || model<Ad>('Ad', adSchema);