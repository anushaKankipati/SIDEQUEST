import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import prisma from "@/libs/prismadb"
import ProfileForm from "@/src/components/ProfileForm"
import ProfileDisplay from "@/src/components/ProfileDisplay"
import ProfilePage from "@/src/features/ProfilePage";

export default async function MyProfilePage() {
  return <ProfilePage />;
}

