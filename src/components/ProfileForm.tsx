"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

import type { UploadResponse } from "imagekit/dist/libs/interfaces"
import type { User, Certification } from "@prisma/client"

import SubmitButton from "./SubmitButton"
import SkillTags from "./SkillTags"
import SocialLinks from "./SocialLinks"
import CertificationLinks from "./CertificationLinks"
import { createProfile, updateProfile } from "@/src/app/actions/profileActions"
import SingleImageUpload from "./SingleImageUpload"

interface ProfileFormProps {
  user: (User & {
    certifications: Certification[];
  }) | null
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [profilePic, setProfilePic] = useState<UploadResponse | undefined>(undefined)
  const [skills, setSkills] = useState<string[]>(user?.skills || [])
  const [socials, setSocials] = useState<string[]>(user?.socials || [])
  const [certifications, setCertifications] = useState<Certification[]>(user?.certifications || [])
  const [formData, setFormData] = useState({
    name: user?.name || "",
    about: user?.about || "",
    activeStatus: user?.activeStatus || "Inactive",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name as string,
        about: user.about || "",
        activeStatus: user.activeStatus ? "Active" : "Inactive",
      })
      setSkills(user.skills || [])
      setSocials(user.socials || [])
      setProfilePic(user.image ? ({ url: user.image } as UploadResponse) : undefined)
      setCertifications(user.certifications || [])
    }
  }, [user])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
  
    
    const hasInvalidDates = certifications.some(cert => {
      const issued = new Date(cert.issuedDate)
      const expiry = new Date(cert.expiryDate)
      return isNaN(issued.getTime()) || isNaN(expiry.getTime()) || issued >= expiry
    });
  
    if (hasInvalidDates) {
      return;
    }
    const hasInvalidSocialLinks = socials.some(link => {
      if (!link || typeof link !== "string") return true
      try {
        let validated = link
        if (!link.startsWith("http://") && !link.startsWith("https://")) {
          validated = `https://${link}`
        }
        new URL(validated)
        return false
      } catch {
        return true
      }
    })
  
    if (hasInvalidSocialLinks) {
      return
    }
  
    // Proceed with form submission...
    const submitData = new FormData()
    submitData.append("name", formData.name)
    submitData.append("about", formData.about)
  
    const certificationsToSubmit = certifications?.map(cert => ({
      name: cert.name,
      documentUrl: cert.documentUrl || null,
      documentFile: cert.documentFile || null,
      issuedDate: new Date(cert.issuedDate).toISOString(),
      expiryDate: new Date(cert.expiryDate).toISOString(),
      issuer: cert.issuer
    })) || [];
    submitData.append("certifications", JSON.stringify(certificationsToSubmit))
  
    submitData.append("skills", JSON.stringify(skills))
    submitData.append("activeStatus", String(formData.activeStatus))
  
    const processedSocials = socials.map(social => {
      if (!social.startsWith("http://") && !social.startsWith("https://")) {
        return `https://${social}`
      }
      return social
    })
    submitData.append("socials", JSON.stringify(processedSocials))
  
    submitData.append("image", profilePic?.url || "")
  
    try {
      const result = user ? await updateProfile(submitData) : await createProfile(submitData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Profile Successfully ${user ? "Updated" : "Created"}`)
        router.push("/my-profile")
        router.refresh()
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

  function handleCertificationChange(index: number, field: keyof Certification, value: any) {
    const newCertifications = [...certifications]
    newCertifications[index] = {
      ...newCertifications[index],
      [field]: value
    }
    setCertifications(newCertifications)
  }

  function addCertification() {
    setCertifications([...certifications, {
      id: "",
      name: '',
      documentUrl: '',
      documentFile: null,
      issuedDate: new Date(),
      expiryDate: new Date(),
      issuer: '',
      userId: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  }

  function removeCertification(index: number) {
    setCertifications(certifications.filter((_, i) => i !== index))
  }
  function handleToggleChange() {
    setFormData((prev) => ({
      ...prev,
      activeStatus: prev.activeStatus === "Active" ? "Inactive" : "Active",
    }))
  }
 

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-4 md:mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-12 flex-wrap">
      <div className="grow pt-2">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
          <textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Certifications</label>
          <CertificationLinks 
            certifications={certifications} 
            setCertifications={setCertifications}
            onCertificationChange={handleCertificationChange}
            onAddCertification={addCertification}
            onRemoveCertification={removeCertification}
          />
        </div>

        <div className="mb-4">
 <span className="block text-sm font-medium text-gray-700 mb-0">
   ACTIVE STATUS
 </span>
 <label htmlFor="activeStatus" className="relative inline-flex items-center cursor-pointer">
   <input
     type="checkbox"
     id="activeStatus"
     checked={formData.activeStatus === "Active"}
     onChange={handleToggleChange}
     className="sr-only"
   />
   <div
     className={`w-12 h-6 rounded-full transition ${
       formData.activeStatus === "Active" ? "bg-green-500" : "bg-gray-300"
     }`}
   ></div>
   <div
     className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
       formData.activeStatus === "Active" ? "transform translate-x-6" : ""
     }`}
   ></div>
 </label>
</div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Social Media Links</label>
          <SocialLinks links={socials} setLinks={setSocials} />
        </div>
      </div>

      <div className="grow lg:pt-2">
        <label htmlFor="dateCreated" className="block text-sm font-medium text-gray-700">
          Profile Image
        </label>
        <div className="mb-4">
          <SingleImageUpload file={profilePic} setFile={setProfilePic} />
        </div>

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
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">My SKILLS</label>
          <SkillTags tags={skills} setTags={setSkills} />
        </div>

        <SubmitButton>{user ? "Update Profile" : "Create Profile"}</SubmitButton>
      </div>
    </form>
  )
}
