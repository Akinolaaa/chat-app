import React from "react";
import type { Message } from "@/types";
import { useUserContext } from "@/contexts/userContext";

type ChatBubbleProps = {
  message: Message;
};

const ChatBubble = (props: ChatBubbleProps) => {
  const { message } = props;
  const { user } = useUserContext();
  const isCurrentUser = message.userId === user.id;

  const TimeStamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      {isCurrentUser && (
        <div className="flex flex-col items-end mb-1">
          <p className="text-xs">{message.userName}</p>
          <div className="relative bg-gray-200 text-gray-800 px-4 pb-4 pt-1 rounded-bl-2xl rounded-tl-2xl rounded-br-2xl max-w-xs shadow-md">
            <p className="mb-2 break-all">{message.message}</p>
            <span className="text-xs text-gray-500 absolute bottom-1 right-2">
              {TimeStamp(message.createdAt)}
            </span>
          </div>
        </div>
      )}

      {!isCurrentUser && (
        <div className="flex flex-col items-start mb-1">
          <p className="text-xs">{message.userName}</p>
          <div className="relative bg-gray-200 text-gray-800 pl-2 pr-4 pb-4 pt-1 rounded-bl-2xl rounded-tr-2xl rounded-br-2xl max-w-xs shadow-md">
            <p className="mb-2 break-all">{message.message}</p>
            <span className="text-xs text-gray-500 absolute bottom-1 right-2">
              {TimeStamp(message.createdAt)}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export { ChatBubble };
