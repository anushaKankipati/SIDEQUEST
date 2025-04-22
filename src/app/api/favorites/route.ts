import prisma from "@/libs/prismadb"; // Assuming this path is correct
//import { getServerSession } from "next-auth/next"
//import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("userEmail"); //userId
  //console.log("Received userEmail in API:", userEmail);
  if (!userEmail) {
    return new Response(JSON.stringify({ message: "Missing userEmail" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail }, //id: userId
      select: { favoriteIds: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ favoriteIds: user.favoriteIds }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}