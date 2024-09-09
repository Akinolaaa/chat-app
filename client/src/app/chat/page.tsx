"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ChatBubble } from "@/components/chatbubble";
import type { Message } from "@/types";
import useSocket from "@/hooks/useSocket";
import { useUserContext } from "@/contexts/userContext";
import { useRouter } from "next/navigation";

const NEW_MESSAGE_CHANNEL = "chat:new-message";

export default function Home() {
  const socket = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useUserContext();
  const router = useRouter();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload: Message) => {
      setMessages((prevMessages) => [...prevMessages, payload]);
    };

    socket.on(NEW_MESSAGE_CHANNEL, handleNewMessage);

    return () => {
      socket.off(NEW_MESSAGE_CHANNEL, handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (!user.name) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    socket?.emit(NEW_MESSAGE_CHANNEL, {
      message: newMessage,
      userName: user.name,
      userId: user.id,
    });

    setNewMessage("");
  };

  return (
    <main className="relative flex flex-col w-full min-h-[50vw] max-h-screen max-w-3xl mx-auto">
      <h1 className="py-2">Talk to a Random Person Online</h1>
      <p>Welcome, {user.name}</p>
      <div className="flex flex-col chatHeight gap-2 overflow-y-scroll">
        {messages &&
          messages.map((message: Message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
        {/* Empty div to ensure scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="mt-4 mb-4 py-2 pb-2 absolute bottom-0 w-full"
      >
        <div className="flex gap-2 items-center w-full">
          <Textarea
            className="rounded-lg h-auto min-h-8"
            placeholder="Tell me what you're thinking of..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={255}
          />
          <Button className="h-full min-w-min">Send</Button>
        </div>
      </form>
    </main>
  );
}
