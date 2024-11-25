'use client';
import AdTextInputs from "@/src/components/AdTextInputs";
import UploadArea from "@/src/components/UploadArea";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
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
                <AdTextInputs />
                <button className="mt-2 bg-blue-600 text-white px-6 py-2 rounded">
                    Publish
                </button>
            </div>
        </form>
    )
}