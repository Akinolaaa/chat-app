"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useEffect, useState } from "react";
import { ChatBubble } from "@/components/chatbubble";
import type { Message } from "@/types";
import useSocket from "@/hooks/useSocket";

// const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated"; // channel cos we are gonna be subscribing and publishing to it
const NEW_MESSAGE_CHANNEL = "chat:new-message";

export default function Home() {
  const socket = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("Connected to Socket...");
    });

    // listen for new messages
    socket?.on(NEW_MESSAGE_CHANNEL, (payload: Message) => {
      setMessages(() => [...messages, payload]);
    });
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    socket?.emit(NEW_MESSAGE_CHANNEL, { message: newMessage });

    setNewMessage("");
  };

  return (
    <main className="relative flex flex-col w-full min-h-[50vw] max-h-screen max-w-3xl mx-auto">
      <h1 className="py-2"> Talk to a Random Person Online</h1>
      <div className="flex flex-col h-full gap-2 overflow-y-scroll">
        {messages &&
          messages.map((message: Message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-4 py-2 pb-2 absolute bottom-0 w-full"
      >
        <div className="flex gap-2 items-center w-full">
          <Textarea
            className="rounded-lg h-auto min-h-8"
            placeholder="Tell me what you're thinking of..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={255}
          />
          <Button className="h-full min-w-min"> Send </Button>
        </div>
      </form>
    </main>
  );
}
