"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

import type { UploadResponse } from "imagekit/dist/libs/interfaces"
import type { User } from "@prisma/client"

import SingleImageUpload from "@/src/components/SingleImageUpload"
import SubmitButton from "./SubmitButton"
import SkillTags from "./SkillTags"
import { createProfile, updateProfile } from "@/src/app/actions/profileActions"

interface ProfileFormProps {
  user: User | null
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [profilePic, setProfilePic] = useState<UploadResponse | undefined>(undefined)
  const [skills, setSkills] = useState<string[]>(user?.skills || [])
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    about: user?.about || "",
    certifications: user?.Certifications || "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        about: user.about || "",
        certifications: user.Certifications || "",
      })
      setSkills(user.skills)
      setProfilePic(user.profile_image ? ({ url: user.profile_image } as UploadResponse) : undefined)
    }
  }, [user])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const submitData = new FormData()
    submitData.append("name", formData.name)
    submitData.append("email", formData.email)
    submitData.append("about", formData.about)
    submitData.append("certifications", formData.certifications)
    submitData.append("skills", JSON.stringify(skills))
    submitData.append("profile_image", profilePic?.url || "")

    try {
      const result = user ? await updateProfile(submitData) : await createProfile(submitData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Profile Successfully ${user ? "Updated" : "Created"}`)
        router.push("/my-profile")
        router.refresh() // This is important to trigger a re-render of the page
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("An error occurred while saving the profile")
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadSuccess = (file: UploadResponse | undefined) => {
    setProfilePic(file)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-12 flex-wrap">
      <div className="grow pt-2">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="about" className="block text-sm font-medium text-gray-700">
            About
          </label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            rows={5}
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
            Certifications
          </label>
          <textarea
            id="certifications"
            name="certifications"
            value={formData.certifications}
            onChange={handleInputChange}
            rows={4}
          ></textarea>
        </div>
      </div>
      <div className="grow lg:pt-2">
        <div className="mb-4">
          <label htmlFor="dateCreated" className="block text-sm font-medium text-gray-700">
            Date Created
          </label>
          <input
            type="text"
            id="dateCreated"
            name="dateCreated"
            defaultValue={
              user ? new Date(user.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
            }
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">My SKILLS</label>
          <SkillTags tags={skills} setTags={setSkills} />
        </div>
        {/* <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <SingleImageUpload onUploadSuccess={handleUploadSuccess} initialImage={user?.profile_image || undefined} />
        </div> */}
        <SubmitButton>{user ? "Update Profile" : "Create Profile"}</SubmitButton>
      </div>
    </form>
  )
}

