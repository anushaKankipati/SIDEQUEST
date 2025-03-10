import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import prisma from "@/libs/prismadb"
import ProfileForm from "@/src/components/ProfileForm"
import ProfileDisplay from "@/src/components/ProfileDisplay"

export default async function MyProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return <div>Please sign in to view your profile.</div>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  return (
    <div className="container mx-auto my-6 overflow-y-auto">
      {/* <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1> */}
      {user && user.name ? <ProfileDisplay user={user} /> : <ProfileForm user={user} />}
    </div>
  )
}

