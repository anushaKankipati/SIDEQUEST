'use client';
import { useState } from "react"
import type { UploadResponse } from "imagekit/dist/libs/interfaces"

import SingleImageUpload from "@/src/components/SingleImageUpload"
import SubmitButton from "./SubmitButton"
import SkillTags from "./SkillTags"

export default function ProfileForm() {
  const [profilePic, setProfilePic] = useState<UploadResponse | undefined>(undefined)
  const [skills, setSkills] = useState<string[]>([])

  async function handleSubmit(formData: FormData) {
    // This is a placeholder for future backend integration
    console.log("Form submitted", Object.fromEntries(formData))
    console.log("Profile pic:", profilePic)
    console.log("Skills:", skills)
    // You can add client-side validation or state updates here
  }

  return (
    <form action={handleSubmit} className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-12 flex-wrap">
      <div className="grow pt-2">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
            Certifications
          </label>
          <textarea
            id="certifications"
            name="certifications"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
            defaultValue={new Date().toISOString().split("T")[0]}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <SkillTags tags={skills} setTags={setSkills} />
        </div>
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <SingleImageUpload />
        </div>
        <SubmitButton>Create Profile</SubmitButton>
      </div>
    </form>
  )
}
