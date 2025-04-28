"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import prisma from "@/libs/prismadb";
import toast from "react-hot-toast";

export async function createAd(formData: FormData) {
  const { files, location, tags, formattedLocation, ...data } =
    Object.fromEntries(formData);

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    toast.error("You must be logged in to create a quest.");
    throw new Error("User is not authenticated.");
  }

  const newAdData: any = {
    ...data,
    files: JSON.parse(files as string),
    location: JSON.parse(location as string),
    tags: JSON.parse(tags as string),
    formattedLocation: formattedLocation
      ? JSON.parse(formattedLocation as string)
      : null, // Because formattedLocation is optional
    price: parseFloat(data.price as string) || 0, // Prisma expects Float type
    time_estimate: parseFloat(data.time_estimate as string) || 0, // Prisma expects Float type

    user: {
      connectOrCreate: {
        where: { email: session?.user?.email },
        create: {
          email: session?.user?.email as string,
          name: session?.user?.name || null,
          image: session?.user?.image || null,
        },
      },
    },
  };

  // Ensure all required fields are provided
  const newAdDoc = await prisma.quest.create({
    data: newAdData,
  });

  return JSON.parse(JSON.stringify(newAdDoc));
}

export async function updateAd(formData: FormData) {
  const { _id, files, tags, location, formattedLocation, ...data } =
    Object.fromEntries(formData);

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    toast.error("You must be logged in to create a quest.");
    throw new Error("User is not authenticated.");
  }

  // Fetch existing ad to check ownership
  const existingAd = await prisma.quest.findUnique({
    where: { id: _id as string },
    include: {
      user: { select: { email: true } },
    },
  });

  if (!existingAd || existingAd.user.email !== session.user.email) {
    throw new Error("Ad not found or unauthorized");
  }

  const adData = {
    ...data,
    price: parseFloat(data.price as string), // Assuming price is a number
    time_estimate: parseFloat(data.time_estimate as string), // Assuming time_estimate is a number
    files: JSON.parse(files as string),
    location: JSON.parse(location as string),
    tags: JSON.parse(tags as string) as string[],
    formattedLocation: formattedLocation
      ? JSON.parse(formattedLocation as string)
      : null, // Handle optional null/undefined
  };

  const updatedAd = await prisma.quest.update({
    where: { id: _id as string },
    data: adData,
  });

  revalidatePath(`/ad/${_id}`);
  return JSON.parse(JSON.stringify(updatedAd));
}
