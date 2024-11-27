import { UploadResponse } from "imagekit/dist/libs/interfaces";
import {Model, model, models, Schema} from "mongoose";

type Ad = {
    title: string;
    price: number;
    category: string;
    description: string;
    time_estimate: number;
    contact: string;
    files: UploadResponse[];
    location: {
        lat: number;
        lng: number;
    },
    userEmail: string;
}

const  adSchema = new Schema<Ad>({
    title: String,
    price: Number,
    category: String,
    description: String,
    time_estimate: Number,
    contact: String,
    files: [Object],
    location: Object,
    userEmail: {type:String, required: true},
}, {
    timestamps: true,
});

export const AdModel = (models?.Ad as Model<Ad>) || model<Ad>('Ad', adSchema);