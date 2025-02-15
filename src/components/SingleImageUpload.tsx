import { useState } from "react";
import UploadArea from "./UploadArea";
import { UploadResponse } from "imagekit/dist/libs/interfaces";

export default function SingleImageUpload() {
    const [profilePic, setProfilePic] = useState<UploadResponse | null>(null);

    // This function is now updated to match the expected signature for `setFiles`
    const handleSetFiles = (files: UploadResponse[] | ((prev: UploadResponse[]) => UploadResponse[])) => {
        if (Array.isArray(files)) {
            // Only take the first file or set an empty array
            setProfilePic(files.length > 0 ? files[0] : null);
        }
    };

    return (
        <UploadArea
            files={profilePic ? [profilePic] : []} // Pass as an array, but only one file at most
            setFiles={handleSetFiles} // Now compatible with `Dispatch<SetStateAction<UploadResponse[]>>`
        />
    );
}

