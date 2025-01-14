"use server";
import { getServerSession } from "next-auth";
import HomeAdsView from "../components/HomeAdsView";
import LandingView from "../components/LandingView";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomeView() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ? <HomeAdsView /> : <LandingView />;
}
