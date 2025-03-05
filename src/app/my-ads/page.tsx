"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdItem from "@/src/components/AdItem";
import prisma from "@/libs/prismadb";

async function getQuestsByUserEmail(email: string): Promise<any[]> {
  const quests = await prisma.quest.findMany({
    include: {
      user: { select: { email: true } },
    },
    where: {
      user: {
        email: email,
      },
    },
  });
  return quests;
}

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return <h1>No Email Found</h1>;
  }
  const adDocs = await getQuestsByUserEmail(email);
  if (adDocs.length === 0) {
    return <h1>No Ads Found</h1>;
  }
  return (
    <div className="container mb-6 my-12 mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center pt-10 ">Quests You've Posted</h1>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
        {adDocs.map((ad) => (
          <AdItem key={ad.id} ad={JSON.parse(JSON.stringify(ad))} />
        ))}
      </div>
    </div>
  );
}
