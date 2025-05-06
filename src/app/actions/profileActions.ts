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

  try {
    const skills = data.skills ? JSON.parse(data.skills as string) : []
    const socials = data.socials ? JSON.parse(data.socials as string) : []
    const certifications = data.certifications ? JSON.parse(data.certifications as string) : []
    
    const newProfileData = {
      name: data.name as string,
      email: session.user.email,
      about: data.about as string,
      skills: skills,
      socials: socials,
      image: data.image as string,
      certifications: {
        deleteMany: {},
        create: certifications.map((cert: any) => ({
          name: cert.name,
          documentUrl: cert.documentUrl || null,
          documentFile: cert.documentFile || null,
          issuedDate: new Date(cert.issuedDate),
          expiryDate: new Date(cert.expiryDate),
          issuer: cert.issuer
        }))
      }
    }

    const newProfile = await prisma.user.upsert({
      where: { email: session.user.email },
      update: newProfileData,
      create: newProfileData,
      include: {
        certifications: true
      }
    })

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

  try {
    const skills = data.skills ? JSON.parse(data.skills as string) : []
    const socials = data.socials ? JSON.parse(data.socials as string) : []
    const certifications = data.certifications ? JSON.parse(data.certifications as string) : []
    
    // First, get the current user to check existing certifications
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { certifications: true }
    })

    if (!currentUser) {
      return { error: "User not found." }
    }

    const profileData = {
      name: data.name as string,
      about: data.about as string,
      skills: skills,
      socials: socials,
      image: data.image as string,
      certifications: {
        // Delete all existing certifications
        deleteMany: {},
        // Create new certifications
        create: certifications.map((cert: any) => ({
          name: cert.name,
          documentUrl: cert.documentUrl || null,
          documentFile: cert.documentFile || null,
          issuedDate: new Date(cert.issuedDate),
          expiryDate: new Date(cert.expiryDate),
          issuer: cert.issuer
        }))
      }
    }

    const updatedProfile = await prisma.user.update({
      where: { email: session.user.email },
      data: profileData,
      include: {
        certifications: true
      }
    })

    return { success: true, data: updatedProfile }
  } catch (error) {
    console.error("Failed to update profile:", error)
    return { error: "Failed to update profile." }
  }
}

