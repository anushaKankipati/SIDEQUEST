import { NextRequest, NextResponse } from 'next/server';
import getCurrentUser from '@/src/app/actions/getCurrentUser';
import prisma from '@/libs/prismadb';
import { pusherServer } from '@/libs/pusher';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
): Promise<NextResponse> {
  try {
    // now await the params promise
    const { conversationId } = await params;

    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true },
    });
    if (!existingConversation) {
      return new NextResponse('Invalid Id', { status: 400 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: { hasSome: [currentUser.id] },
      },
    });

    existingConversation.users.forEach(user => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.error(error, 'ERROR_CONVERSATION_DELETE');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
