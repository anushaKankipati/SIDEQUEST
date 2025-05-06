"use client"

import { useState } from "react"

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

    // Clear error when input is empty
    if (!value) {
      const newErrors = { ...errors }
      delete newErrors[index]
      setErrors(newErrors)
      return
    }

    // Validate URL
    try {
      // If URL doesn't start with http:// or https://, add https://
      let urlToValidate = value
      if (!value.startsWith("http://") && !value.startsWith("https://")) {
        urlToValidate = `https://${value}`
      }
      
      new URL(urlToValidate) // This will throw if the URL is invalid
      // Clear error if URL is valid
      const newErrors = { ...errors }
      delete newErrors[index]
      setErrors(newErrors)
    } catch (error) {
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Social Link
      </button>
    </div>
  )
} 