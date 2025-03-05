import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import prisma from "@/libs/prismadb"
import ProfileForm from "@/src/components/ProfileForm"

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return <div>Please sign in to edit your profile.</div>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  return (
    <div className="container mx-auto my-12">
      <h1 className="text-2xl font-bold mb-3 text-center pt-10">Edit Profile</h1>
      <ProfileForm user={user} />
    </div>
  )
}

