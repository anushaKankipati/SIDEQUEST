"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons"

interface SocialLinksProps {
  links: string[]
  setLinks: (links: string[]) => void
}

export default function SocialLinks({ links, setLinks }: SocialLinksProps) {
  const [errors, setErrors] = useState<{ [key: number]: string }>({})

  function handleSocialChange(index: number, value: string) {
    const newLinks = [...links]
    newLinks[index] = value
    setLinks(newLinks)
  
    
  
    try {
      let urlToValidate = value
      if (!value.startsWith("http://") && !value.startsWith("https://")) {
        urlToValidate = `https://${value}`
      }
  
      new URL(urlToValidate) // Throws if invalid
  
      const newErrors = { ...errors }
      delete newErrors[index]
      setErrors(newErrors)
    } catch {
      setErrors(prev => ({ ...prev, [index]: "Please enter a valid URL" }))
    }
  }
  

  function addSocial() {
    setLinks([...links, ""])
  }

  function removeSocial(index: number) {
    setLinks(links.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div key={index} className="flex flex-col gap-1">
          <div className="flex gap-2">
            <input
              type="url"
              value={link}
              onChange={(e) => handleSocialChange(index, e.target.value)}
              placeholder="https://example.com/username"
              className={`flex-1 border rounded px-3 py-2 ${
                errors[index] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => removeSocial(index)}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              aria-label="Remove social link"
            >
              <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
            </button>
          </div>
          {errors[index] && (
            <p className="text-sm text-red-500">{errors[index]}</p>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addSocial}
        className="mt-2 px-4 py-2 bg-theme-green text-white rounded-md transition-colors flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
        Add Social Link
      </button>
    </div>
  )
} 