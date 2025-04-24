import prisma from "@/libs/prismadb"; // Adjust the path to your Prisma client

export async function POST(request: Request) {
  try {
    const { userEmail, adId } = await request.json();

    if (!userEmail || !adId) {
      return new Response(
        JSON.stringify({ message: "userEmail and adId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the user's favoriteIds
    const user = await prisma.user.update({
      where: { email: userEmail },
      data: {
        favoriteIds: {
          push: adId,
        },
      },
    });

    // Fetch the full ad details
    const ad = await prisma.quest.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return new Response(
        JSON.stringify({ message: "Ad not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ favoriteIds: user.favoriteIds, ad }), // Return both favoriteIds and the full ad object
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to add favorite" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}