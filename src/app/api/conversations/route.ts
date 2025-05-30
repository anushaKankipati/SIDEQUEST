import getCurrentUser from "../../actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";
import { pusherServer } from "@/libs/pusher";
import getConversations from "../../actions/getConversations";

export async function GET() {
  try {
    const currentUser = await getCurrentUser(); 
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversations = await getConversations();
    return NextResponse.json(conversations);

  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      newConversation.users.forEach(user => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConversation);
        }
      })
      return NextResponse.json(newConversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    // checking for existing single conversation
    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    // otherwise create a new one
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    // TODO: why map vs for each
    newConversation.users.map(user => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    })
    return NextResponse.json(newConversation);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
