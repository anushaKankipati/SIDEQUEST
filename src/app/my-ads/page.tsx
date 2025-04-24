"use server";

import { useState, useEffect } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import MyAdsPageClient from "@/src/components/MyAdsPageClient";
import prisma from "@/libs/prismadb";

async function fetchUserPostedAds(userEmail: string) {
  // Fetch the user's posted ads
  const userAds = await prisma.quest.findMany({
    where: { user: { email: userEmail } },
  });

  // Fetch the user's favorite ad IDs
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { favoriteIds: true },
  });

  const favoriteIds = user?.favoriteIds || [];

  // Mark the user's posted ads as favorited if they are in the favoriteIds list
  const adsWithFavoriteStatus = userAds.map((ad) => ({
    ...ad,
    isFavorited: favoriteIds.includes(ad.id),
  }));

  return adsWithFavoriteStatus;
}

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return <h1>No Email Found</h1>;
  }

  // Fetch only the user's posted ads with their favorite status
  const ads = await fetchUserPostedAds(email);

  return (
    <MyAdsPageClient
      ads={ads}
      userEmail={email}
    />
  );
}
