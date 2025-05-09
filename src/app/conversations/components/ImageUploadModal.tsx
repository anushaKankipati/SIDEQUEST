"use client";

import { UploadResponse } from "imagekit-javascript/dist/src/interfaces";
import { useState } from "react";
import Uploader from "@/src/components/Uploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import useConversation from "@/src/hooks/useConversation";
import Image from "next/image";

interface ImageUploadModalProps {
  onClose: () => void;
}

export default function ImageUploadModal({ onClose }: ImageUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadResponse | null>(null);
  const { conversationId } = useConversation();

  const handleUploadSuccess = (file: UploadResponse) => {
    setUploadedImage(file);
    setIsUploading(false);
  };

  const handleSendImage = async () => {
    if (!uploadedImage) return;
    
    try {
      await axios.post("/api/messages", {
        image: uploadedImage.url,
        conversationId,
      });
      onClose();
    } catch (error) {
      console.error("Error sending image message:", error);
    }
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
  };

  return (
    <>
      <div
        onClick={onClose}
        className="bg-black/50 fixed inset-0 z-40"
      ></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Upload Image</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
          </div>
          <div className="bg-gray-100 p-3 sm:p-6 rounded flex flex-col items-center gap-3 sm:gap-4">
            {!uploadedImage ? (
              <label
                className={
                  'upload-btn border px-3 sm:px-4 py-2 rounded text-sm font-medium inline-flex items-center gap-2 ' +
                  (isUploading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'border-theme-green text-theme-green cursor-pointer')
                }
              >
                <Uploader
                  accept=".png, .jpg, .jpeg, .gif, .bmp, .webp, .heic"
                  onUploadStart={() => setIsUploading(true)}
                  onSuccess={handleUploadSuccess}
                />
                {isUploading ? 'Uploading...' : (
                  <>
                    <FontAwesomeIcon icon={faPlus} />
                    Upload Image
                  </>
                )}
              </label>
            ) : (
              <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
                <div className="relative w-full aspect-square max-h-[250px] sm:max-h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={uploadedImage.url}
                    alt="Uploaded preview"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleDeleteImage}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </button>
                  <button
                    onClick={handleSendImage}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded text-sm font-medium text-white bg-theme-green hover:bg-green-800"
                  >
                    Send Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 