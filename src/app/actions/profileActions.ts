"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import prisma from "@/libs/prismadb"

export async function createProfile(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return { error: "You must be logged in to create a profile." }
  }

  const data = Object.fromEntries(formData)
//   console.log("Received form data:", data)

  try {
    const skills = data.skills ? JSON.parse(data.skills as string) : []
    const newProfileData = {
      name: data.name as string,
      email: session.user.email,
      about: data.about as string,
      Certifications: data.certifications as string,
      skills: skills,
      profile_image: data.profile_image as string,
    }

    // console.log("Prepared profile data:", newProfileData)

    const newProfile = await prisma.user.upsert({
      where: { email: session.user.email },
      update: newProfileData,
      create: newProfileData,
    })

    // console.log("Profile created/updated:", newProfile)

    return { success: true, data: newProfile }
  } catch (error) {
    console.error("Failed to create/update profile:", error)
    return { error: "Failed to create/update profile." }
  }
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return { error: "You must be logged in to update your profile." }
  }

  const data = Object.fromEntries(formData)
//   console.log("Received form data:", data)

  try {
    const skills = data.skills ? JSON.parse(data.skills as string) : []
    const profileData = {
      name: data.name as string,
      about: data.about as string,
      Certifications: data.certifications as string,
      skills: skills,
      profile_image: data.profile_image as string,
    }

    // console.log("Prepared profile data:", profileData)

    const updatedProfile = await prisma.user.update({
      where: { email: session.user.email },
      data: profileData,
    })

    // console.log("Profile updated:", updatedProfile)

    return { success: true, data: updatedProfile }
  } catch (error) {
    console.error("Failed to update profile:", error)
    return { error: "Failed to update profile." }
  }
}

