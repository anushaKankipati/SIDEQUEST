import getConversationById from "./getConversationById"

export default async function getOtherConversationUsers(conversationId: string) {
  try {
    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      return null; 
    }
    return conversation.users;

  } catch (error: any) {
    return null; 
  }
}