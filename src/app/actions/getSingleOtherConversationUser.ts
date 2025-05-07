import getOtherConversationUsers from "./getOtherConversationUsers";

export default async function getSingleOtherConversationUser(conversationId: string) {
  try {
    const users = await getOtherConversationUsers(conversationId);
    if (!users || users?.length == 0) {
      return null; 
    }
    return users[0];

  } catch {
    return null; 
  }
}