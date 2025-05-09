import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/src/app/utils/authOptions"
import prisma from "@/libs/prismadb";
import { Prisma } from "@prisma/client";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const deletedUser = await prisma.user.delete({
      where: {
        email: session.user.email,
      }
    });
    return NextResponse.json(deletedUser);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

