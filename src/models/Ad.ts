import { FormattedAutocompleteLocation } from "@/libs/types";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

export type Ad = {
    id: string;
    title: string;
    price: number;
    category: string;
    description: string;
    tags: string[];
    time_estimate: number;
    contact: string;
    userId: string;
    files: UploadResponse[];
    location: {
        lat: number;
        lng: number;
    },
    formattedLocation?: FormattedAutocompleteLocation;
    createdAt: Date; 
    updatedAt: Date; 
}