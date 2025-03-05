"use client"

import { useState, useEffect } from "react"
import UploadArea from "./UploadArea"
import type { UploadResponse } from "imagekit/dist/libs/interfaces"

interface SingleImageUploadProps {
  onUploadSuccess?: (file: UploadResponse | undefined) => void
  initialImage?: string
}

export default function SingleImageUpload({ onUploadSuccess, initialImage }: SingleImageUploadProps) {
  const [profilePic, setProfilePic] = useState<UploadResponse | null>(null)

  useEffect(() => {
    if (initialImage) {
      setProfilePic({ url: initialImage } as UploadResponse)
    }
  }, [initialImage])

  const handleSetFiles = (files: UploadResponse[] | ((prev: UploadResponse[]) => UploadResponse[])) => {
    if (Array.isArray(files)) {
      const newProfilePic = files.length > 0 ? files[0] : null
      setProfilePic(newProfilePic)
      if (onUploadSuccess) {
        onUploadSuccess(newProfilePic || undefined)
      }
    }
  }

  return <UploadArea files={profilePic ? [profilePic] : []} setFiles={handleSetFiles} />
}



