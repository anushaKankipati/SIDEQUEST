import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Uploader from "./Uploader";
import { faImage, faPlus } from "@fortawesome/free-solid-svg-icons";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import {Dispatch, SetStateAction, useState } from "react";
import UploadThumbnail from "./UploadThumbnail";

type Props = {
    files: UploadResponse[];
    setFiles: Dispatch<SetStateAction<UploadResponse[]>>;
};

export default function UploadArea({files, setFiles}:Props) {
    const[isUploading, setIsUploading] = useState(false);
    return(
        <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-center text-xs text-gray-400 uppercase font-bold">Add relevant photos for the Quest:</h2>
        <div className="flex flex-col">
            <FontAwesomeIcon icon={faImage} className="h-24 text-gray-300"/>
            <label
                className={
                    'upload-btn mt-2 border px-4 py-2 rounded inline-flex gap-1 items-center justify-center '
                    + (
                    isUploading
                        ? 'text-gray-400 cursor-not-allowed'
                        : "border-theme-green text-theme-green cursor-pointer"
                    )
                }>
                <Uploader
                    onUploadStart={() => setIsUploading(true)}
                    onSuccess={file => {
                        setFiles(prev => [...prev, file]);
                        setIsUploading(false);
                    }}
                />
                {isUploading ? (
                    <span>Uploading...</span>
                ) : (
                    <>
                    <FontAwesomeIcon icon={faPlus}/>
                    <span>Add photos</span>
                    </>
                )}

            </label>
            <div className="flex gap-2 mt-2 flex-wrap">
                {files.map((file, index) => (
                    <div key={index} className="size-16 rounded overflow-hidden">
                        <UploadThumbnail file={file} />
                    </div>
                ))}
            </div>
        </div>
    </div>
    )
}