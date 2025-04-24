"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/libs/prismadb";
import MyFavoritesPage from "@/src/components/MyFavoritesPage";

export default async function MyFavoritesPageWrapper() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return <h1>No Email Found</h1>;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { favoriteIds: true },
  });

  if (!user || user.favoriteIds.length === 0) {
    return <h1>No Favorites Found</h1>;
  }

  const favoriteAds = await prisma.quest.findMany({
    where: { id: { in: user.favoriteIds } },
  });

  return <MyFavoritesPage initialFavorites={favoriteAds} userEmail={email} />;
}