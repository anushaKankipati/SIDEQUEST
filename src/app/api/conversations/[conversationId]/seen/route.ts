import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/src/app/actions/getCurrentUser";
import prisma from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
): Promise<NextResponse> {
  try {
    // await the params promise to pull out conversationId
    const { conversationId } = await params;

    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: { include: { seen: true } },
        users: true,
      },
    });
    if (!conversation) {
      return new NextResponse("Invalid Id", { status: 400 });
    }

    const lastMessage =
      conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    const updatedMessage = await prisma.message.update({
      where: { id: lastMessage.id },
      include: { sender: true, seen: true },
      data: {
        seen: {
          connect: { id: currentUser.id },
        },
      },
    });

    // notify only this user’s channel
    await pusherServer.trigger(
      currentUser.email,
      "conversation:update",
      { id: conversationId, messages: [updatedMessage] }
    );

    // if they’d already seen it, just return the conversation
    if (lastMessage.seenIds.includes(currentUser.id)) {
      return NextResponse.json(conversation);
    }

    // otherwise broadcast the new seen-status
    await pusherServer.trigger(
      conversationId,
      "message:update",
      updatedMessage
    );

    return NextResponse.json(updatedMessage);
  } catch (err: any) {
    console.error(err, "ERROR_MESSAGES");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
