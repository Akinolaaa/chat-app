import React from "react";
import type { Message } from "@/types";

type ChatBubbleProps = {
  message: Message;
}

const ChatBubble = (props: ChatBubbleProps) => {
  const { message } = props;

  return (
    <div className="flex flex-col gap-1 relative border-blue-400 border-2 bg-gray-300 border-none min-w-fit py-2 px-4 rounded-bl-2xl rounded-tr-2xl rounded-br-2xl">
      <p className="pb-2">{ message.message }</p>
      <div className="absolute right-4 bottom-1 w-fit">
        <p className="text-xs">{ message.createdAt }</p>
      </div>
    </div>
  );
};

export { ChatBubble };
