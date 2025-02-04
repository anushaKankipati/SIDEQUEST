"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { connect } from "@/libs/helpers";
import { AdModel } from "@/src/models/Ad";
import AdItem from "@/src/components/AdItem";

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return <h1>No Email Found</h1>;
  }
  await connect();
  const adDocs = await AdModel.find({ userEmail: email });
  return (
    <div className="container my-3 mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Ads</h1>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
        {adDocs.map((ad) => (
          <AdItem key={ad._id} ad={JSON.parse(JSON.stringify(ad))} />
        ))}
      </div>
    </div>
  );
}
