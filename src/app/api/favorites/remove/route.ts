import prisma from "@/libs/prismadb"; // Adjust the path to your Prisma client

export async function DELETE(req: Request) {
  try {
    const { userEmail, adId } = await req.json();

    if (!userEmail || !adId) {
      return new Response(
        JSON.stringify({ message: "userEmail and adId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch the ad details before removing it
    const ad = await prisma.quest.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return new Response(
        JSON.stringify({ message: "Ad not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the user's favoriteIds
    const user = await prisma.user.update({
      where: { email: userEmail },
      data: {
        favoriteIds: {
          set: (await prisma.user.findUnique({ where: { email: userEmail } }))?.favoriteIds.filter((id) => id !== adId) || [], // Remove the adId
        },
      },
    });

    return new Response(
      JSON.stringify({ favoriteIds: user.favoriteIds, ad }), // Return updated favoriteIds and the removed ad object
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "Failed to remove favorite" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
