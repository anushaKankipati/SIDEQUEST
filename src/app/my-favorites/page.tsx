"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/utils/authOptions";
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
    return (
      <div className="container mb-6 my-12 mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center pt-10">
          No Favorites Found
        </h1>
      </div>
    );
  }

  const favoriteAds = await prisma.quest.findMany({
    where: { id: { in: user.favoriteIds } },
  });

  return <MyFavoritesPage initialFavorites={favoriteAds} userEmail={email} />;
}
