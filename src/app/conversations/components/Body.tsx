"use client";

import useConversation from "@/src/hooks/useConversation";
import { FullMessageType } from "@/src/types";
import { init } from "next/dist/compiled/webpack/webpack";
import { useState, useRef, useEffect } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";
import BackButton from "./BackButton";

interface BodyProps {
  initialMessages: FullMessageType[];
}

export default function Body({ initialMessages }: BodyProps) {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      // alert everyone we have seen this message
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, {id: message.id})) {
          return current; 
        }

        return [...current as FullMessageType[], message];
      });

      bottomRef?.current?.scrollIntoView();
    }; 

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current: any) => current.map((currentMessage: FullMessageType) => {
        if(currentMessage.id === newMessage.id) {
          return newMessage;
        }

        return currentMessage;
      }));
    };
    

    //bind client to channel and pass a function
    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    // must unsubscribe and unbind each time to prevent overflow
    return () => {
      pusherClient.unsubscribe(conversationId); 
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    }
  }, [conversationId]);

  return (
    <div className="mt-14 flex-1 overflow-y-auto relative">
      <BackButton/>
      <div className="lg:mt-0 mt-8">
        {messages?.map((message, i) => (
          <MessageBox
            isLast={i === messages?.length - 1}
            key={message.id}
            data={message}
          />
        ))}

      </div>
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
}
