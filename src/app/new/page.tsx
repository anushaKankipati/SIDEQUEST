'use client';
import UploadArea from "@/src/components/UploadArea";
import Uploader from "@/src/components/Uploader";
import { faImage, faLocationCrosshairs, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { useState } from "react";

export default function NewAdPage(){
    const[files, setFiles] = useState<UploadResponse[]>([]);
    return(
        <form className=" max-w-2xl mx-auto grid grid-cols-2 gap-12">
            <div className="grow pt-8">
               <UploadArea files={files} setFiles={setFiles}/>
                <div className="mt-8">
                    <label htmlFor="">Where is it located?</label>
                    <button className="w-full flex items-center gap-1 py-1 justify-center border border-gray-400 text-gray-600 rounded">
                        <FontAwesomeIcon icon={faLocationCrosshairs}/>
                        <span>Share Current location</span>
                    </button>
                    <div className="mt-2 bg-gray-100 p-4 min-h-12 rounded text-gray-400 text-center">
                        Google maps here
                    </div>
                </div>
            </div>

            <div className=" grow pt-2">
                <label htmlFor="titleIn">Title</label>
                <input id="titleIn" type="text" placeholder="Title" />

                <label htmlFor="priceIn">Price</label>
                <input id="priceIn" type="number" placeholder="Price" />

                <label htmlFor="categoryIn">Category</label>
                <select name="category" id="categoryIn" defaultValue="">
                    <option disabled value="">Select category</option>
                    <option value="Cars">Cars</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Properties">Properties</option>
                </select>

                <label htmlFor="descriptionIn">Description</label>
                <textarea name="" id="descriptionIn" placeholder="description"></textarea>

                <label htmlFor="contactIn">Contact Information</label>

                <textarea name="" id="contactIn" placeholder="mobile: 669-225-6980"></textarea>
                <button className="mt-2 bg-blue-600 text-white px-6 py-2 rounded">
                    Publish
                </button>
            </div>
        </form>
    )
}