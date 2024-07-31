import React from "react";

const ChatBubble = (props: any) => {
  const message = props.messages;

  return (
    <div className="border-blue-400 border-2 bg-gray-300 border-none max-w-fit py-2 px-4 rounded-bl-2xl rounded-tr-2xl rounded-br-2xl">
      <p>{message}</p>
    </div>
  );
};

export { ChatBubble };
