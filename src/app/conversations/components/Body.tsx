"use client";

import useConversation from "@/src/hooks/useConversation";
import { FullMessageType } from "@/src/types";
import { init } from "next/dist/compiled/webpack/webpack";
import { useState, useRef, useEffect } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";

interface BodyProps {
  initialMessages: FullMessageType[] | undefined;
}

export default function Body({ initialMessages }: BodyProps) {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  return (
    <div className="mt-14 flex-1 overflow-y-auto">
      {messages?.map((message, i) => (
        <MessageBox
          isLast={i === messages?.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
}
