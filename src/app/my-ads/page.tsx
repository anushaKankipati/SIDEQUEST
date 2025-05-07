"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/utils/authOptions";
import MyAdsPageClient from "@/src/components/MyAdsPageClient";
import prisma from "@/libs/prismadb";

async function fetchUserPostedAds(userEmail: string) {
  const userAds = await prisma.quest.findMany({
    where: { user: { email: userEmail } },
  });

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { favoriteIds: true },
  });

  const favoriteIds = user?.favoriteIds || [];

  return userAds.map((ad) => ({
    ...ad,
    isFavorited: favoriteIds.includes(ad.id),
  }));
}

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return (
      <div className="container mb-6 my-12 mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center pt-10">
          No Email Found
        </h1>
      </div>
    );
  }

  const ads = await fetchUserPostedAds(email);

  if (ads.length === 0) {
    return (
      <div className="container mb-6 my-12 mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center pt-10">
          No Quests Found
        </h1>
      </div>
    );
  }

  return (
    <MyAdsPageClient
      ads={ads}
      userEmail={email}
    />
  );
}
