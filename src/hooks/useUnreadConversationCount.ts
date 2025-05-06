import { useEffect, useState, useMemo } from "react";
import { pusherClient } from "@/libs/pusher";
import axios from "axios";
import { useSession } from "next-auth/react";
import useConversation from "./useConversation";

const useUnreadConversationCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const session = useSession();
  const pusherKey = useMemo(() => session.data?.user?.email, [session.data?.user?.email]);
  const { conversationId } = useConversation();

  const fetchConversations = async () => {
    const res = await axios.get("/api/conversations");
    const conversations = res.data;

    const unread = conversations
      .filter((conversation: any) => {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        if (!lastMessage) return false;

        return !lastMessage.seen.some((user: any) => user.email === pusherKey);
      });
    setUnreadCount(unread.length);
  };

  useEffect(() => {
    fetchConversations();
    const handler = () => fetchConversations();

    pusherClient.subscribe("conversations");
    pusherClient.bind("conversation:update", handler);
    pusherClient.bind("message:update", handler);

    return () => {
      pusherClient.unbind("conversation:update", handler);
      pusherClient.unbind("message:update", handler);
      pusherClient.unsubscribe("conversations");
    };
  }, [pusherKey, conversationId]);

  return unreadCount;
};

export default useUnreadConversationCount;