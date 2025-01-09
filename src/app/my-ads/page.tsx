"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { connect } from "@/libs/helpers";
import { AdModel } from "@/src/models/Ad";
import AdItem from "@/src/components/AdItem";
import { stringify } from "querystring";

export default async function MyAdsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return <h1>No Email Found</h1>;
  }
  await connect();
  const adDocs = await AdModel.find({ userEmail: email });
  return (
    <div className="container my-8 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Ads</h1>
      <div className="grid grid-cols-4 gap-x-2 gap-y-4">
        {adDocs.map((ad) => (
          <AdItem key={ad._id} ad={JSON.parse(JSON.stringify(ad))} />
        ))}
      </div>
    </div>
  );
}
