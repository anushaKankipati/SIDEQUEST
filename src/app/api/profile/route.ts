import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/src/app/utils/authOptions"
import prisma from "@/libs/prismadb";
import getCurrentUser from "../../actions/getCurrentUser";

export async function DELETE() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const deletedUser = await prisma.user.delete({
      where: {
        id: currentUser.id
      }
    }); 
    if (!deletedUser) {
      return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
    return NextResponse.json({body: "No Content"}, {status: 204});
  } catch(error) {
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  try {
    const user = await prisma.user.create({
      data: {
        ...data,
        email: session.user.email,
        image: data.image || "/images/defaultavatar.jpg"
      },
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error creating profile:", error)
    return NextResponse.json({ error: "Failed to create profile", details: error }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await req.json()
  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data,
    })
    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile", details: error }, { status: 500 })
  }
}

