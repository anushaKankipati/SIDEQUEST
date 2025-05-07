"use client"

import { useState, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPlus, faFile } from "@fortawesome/free-solid-svg-icons"
import type { UploadResponse } from "imagekit/dist/libs/interfaces"
import type { Certification } from "@prisma/client"
import Uploader from "./Uploader"

interface CertificationLinksProps {
  certifications: Certification[]
  setCertifications: (certifications: Certification[]) => void
  onCertificationChange: (index: number, field: keyof Certification, value: any) => void
  onAddCertification: () => void
  onRemoveCertification: (index: number) => void
}

export default function CertificationLinks({ 
  certifications, 
  setCertifications,
  onCertificationChange,
  onAddCertification,
  onRemoveCertification
}: CertificationLinksProps) {
  const [errors, setErrors] = useState<{ [key: number]: { [key: string]: string } }>({})
  const [isUploading, setIsUploading] = useState<number | null>(null)
  const uploaderRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  function validateDates(issuedDate?: Date, expiryDate?: Date): boolean {
    if (!(issuedDate instanceof Date) || isNaN(issuedDate.getTime())) return false
    if (!(expiryDate instanceof Date) || isNaN(expiryDate.getTime())) return false
    return issuedDate < expiryDate
  }
  

  function handleCertificationChange(index: number, field: keyof Certification, value: any) {
    onCertificationChange(index, field, value)

    // Clear error when input is empty
    if (!value) {
      const newErrors = { ...errors }
      if (newErrors[index]) {
        delete newErrors[index][field]
        if (Object.keys(newErrors[index]).length === 0) {
          delete newErrors[index]
        }
      }
      setErrors(newErrors)
      return
    }

    // Validate URL for documentUrl field
    if (field === 'documentUrl') {
      try {
        // If URL doesn't start with http:// or https://, add https://
        let urlToValidate = value
        if (!value.startsWith("http://") && !value.startsWith("https://")) {
          urlToValidate = `https://${value}`
        }
        
        new URL(urlToValidate) // This will throw if the URL is invalid
        // Clear error if URL is valid
        const newErrors = { ...errors }
        if (newErrors[index]) {
          delete newErrors[index][field]
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index]
          }
        }
        setErrors(newErrors)
      } catch{
        setErrors(prev => ({
          ...prev,
          [index]: { ...prev[index], [field]: "Please enter a valid URL" }
        }))
      }
    }

    // Validate dates
    // Validate dates
if (field === 'issuedDate' || field === 'expiryDate') {
  const cert = certifications[index]
  const updatedCert = {
    ...cert,
    [field]: value,
  }

  if (!validateDates(updatedCert.issuedDate, updatedCert.expiryDate)) {
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        expiryDate: "Issue date must be before expiry date"
      }
    }))
  } else {
    const newErrors = { ...errors }
    if (newErrors[index]) {
      delete newErrors[index]['issuedDate']
      delete newErrors[index]['expiryDate']
      if (Object.keys(newErrors[index]).length === 0) {
        delete newErrors[index]
      }
    }
    setErrors(newErrors)
  }
}

  }

  function handleDocumentUpload(index: number, file?: UploadResponse) {
    const newCertifications = [...certifications]
    newCertifications[index] = {
      ...newCertifications[index],
      documentFile: file as any,
      documentUrl: file?.url || ''
    }
    setCertifications(newCertifications)
    setIsUploading(null)
  }

  function handleUploadStart(index: number) {
    setIsUploading(index)
  }

  function handleUploadClick(index: number) {
    uploaderRefs.current[index]?.click()
  }

  return (
    <div className="space-y-4">
      {certifications.map((cert, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Certification Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                required
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors[index]?.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              {errors[index]?.name && (
                <p className="text-sm text-red-500 mt-1">{errors[index].name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Certification Document <span className="text-red-500">*</span>
              </label>
              {cert.documentFile ? (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faFile} className="text-gray-400 text-2xl" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{(cert.documentFile as any).name}</p>
                      <p className="text-xs text-gray-500">{((cert.documentFile as any).size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      onClick={() => handleDocumentUpload(index)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      aria-label="Remove document"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => handleUploadClick(index)}
                    disabled={isUploading === index}
                    className={`px-4 py-2 border rounded-md transition-colors flex items-center gap-2 ${
                      isUploading === index
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'border-theme-green text-theme-green hover:bg-green-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                    {isUploading === index ? 'Uploading...' : 'Upload Document'}
                  </button>
                  <Uploader
                    ref={(el: HTMLInputElement | null) => uploaderRefs.current[index] = el}
                    accept=".pdf,.doc,.docx"
                    onUploadStart={() => handleUploadStart(index)}
                    onSuccess={(file) => handleDocumentUpload(index, file)}
                    className="hidden"
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Upload PDF or Word document (max 5MB)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Document URL (if hosted externally) <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={cert.documentUrl || ''}
                onChange={(e) => handleCertificationChange(index, 'documentUrl', e.target.value)}
                placeholder="https://example.com/certificate"
                required={!cert.documentFile}
                className={`w-full border rounded px-3 py-2 mt-1 ${
                  errors[index]?.documentUrl ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              {errors[index]?.documentUrl && (
                <p className="text-sm text-red-500 mt-1">{errors[index].documentUrl}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Issuer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Issued Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={new Date(cert.issuedDate).toISOString().split('T')[0]}
                  onChange={(e) => handleCertificationChange(index, 'issuedDate', new Date(e.target.value))}
                  required
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors[index]?.issuedDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[index]?.issuedDate && (
                  <p className="text-sm text-red-500 mt-1">{errors[index].issuedDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={new Date(cert.expiryDate).toISOString().split('T')[0]}
                  onChange={(e) => handleCertificationChange(index, 'expiryDate', new Date(e.target.value))}
                  required
                  className={`w-full border rounded px-3 py-2 mt-1 ${
                    errors[index]?.expiryDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors[index]?.expiryDate && (
                  <p className="text-sm text-red-500 mt-1">{errors[index].expiryDate}</p>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemoveCertification(index)}
            className="mt-2 p-2 text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Remove certification"
          >
            <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAddCertification}
        className="mt-2 px-4 py-2 bg-theme-green text-white rounded-md transition-colors flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
        Add Certification
      </button>
    </div>
  )
} 