import prisma from "@/libs/prismadb"; 
import getCurrentUser from "./getCurrentUser";
import { tree } from "next/dist/build/templates/app-page";

export default async function getConversations() {
  const currentUser = await getCurrentUser(); 

  if(!currentUser?.id) {
    return []; 
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc"
      }, 
      where: {
        userIds: {
          has: currentUser.id
        }
      }, 
      include: {
        users: true,
        messages: {
          include: {
            sender: true, 
            seen: true
          }
        }
      }
    }); 
    return conversations; 
  } catch(error: any) {
    return [];
  }

}