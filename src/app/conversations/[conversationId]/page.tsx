"use server";

import EmptyState from "@/src/components/EmptyState";
import getConversationById from "../../actions/getConversationById";
import getMessages from "../../actions/getMessages";
import Body from "../components/Body";
import Form from "../components/Form";
import getOtherConversationUsers from "../../actions/getOtherConversationUsers";

// no more IParams interface – inline is fine
export default async function ConversationId(
  { params }: { params: Promise<{ conversationId: string }> }
) {
  // now await the promise to get your param
  const { conversationId } = await params;

  const conversation = await getConversationById(conversationId);
  const messages = (await getMessages(conversationId)) || [];
  const otherUsers = (await getOtherConversationUsers(conversationId)) || [];

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        {/* add avatar and name above */}
        <Body initialMessages={messages} />
        <Form otherUsers={otherUsers} />
      </div>
    </div>
  );
}
