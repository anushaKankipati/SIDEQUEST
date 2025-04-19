import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPlus } from "@fortawesome/free-solid-svg-icons";
import { UploadResponse } from "imagekit/dist/libs/interfaces";
import { Dispatch, SetStateAction, useState } from "react";
import Uploader from "./Uploader";

type Props = {
  file: UploadResponse | undefined;
  setFile: Dispatch<SetStateAction<UploadResponse | undefined>>;
};

export default function SingleImageUpload({ file, setFile }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="bg-gray-100 p-6 rounded flex flex-col items-center gap-4">
      <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-white">
      {file?.url ? (
        <img
          src={file.url}
          alt="Uploaded"
          className="object-cover w-full h-full"
        />
      ) : (
        <FontAwesomeIcon icon={faImage} className="text-gray-300 text-4xl" />
      )}
      </div>

      <label
        className={
          'upload-btn border px-4 py-2 rounded text-sm font-medium inline-flex items-center gap-2 ' +
          (isUploading
            ? 'text-gray-400 cursor-not-allowed'
            : 'border-theme-green text-theme-green cursor-pointer')
        }
      >
        <Uploader
          accept=".png, .jpg, .jpeg, .gif, .bmp, .webp, .heic"
          onUploadStart={() => setIsUploading(true)}
          onSuccess={(file) => {
            setFile(file);
            setIsUploading(false);
          }}
        />
        {isUploading ? 'Uploading...' : (
          <>
            <FontAwesomeIcon icon={faPlus} />
            Upload Image
          </>
        )}
      </label>
    </div>
  );
}