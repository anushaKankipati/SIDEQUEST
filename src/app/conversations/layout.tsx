import Sidebar from "@/src/components/sidebar/Sidebar";
import getConversations from "../actions/getConversations";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  return (
    <Sidebar>
      <div className="h-screen">
        <ConversationList initialItems={conversations}/>
        {children}
      </div>
    </Sidebar>
  );
}
