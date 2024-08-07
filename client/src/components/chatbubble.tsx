import React from "react";
import type { Message } from "@/types";

type ChatBubbleProps = {
  message: Message;
};

const ChatBubble = (props: ChatBubbleProps) => {
  const { message } = props;

  const TimeStamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex gap-2 border-blue-400 border-2 bg-gray-300 border-none w-3/4 max-w-fit pt-1 pb-2 pl-2 pr-2 rounded-bl-2xl rounded-tr-2xl rounded-br-2xl">
      <p className="pb-2 w-fit max-w-5/6">{message.message}</p>
      <p className="text-xs max-w-1/6 w-fit flex items-end">
        {TimeStamp(message.createdAt)}
      </p>
    </div>
  );
};

export { ChatBubble };
