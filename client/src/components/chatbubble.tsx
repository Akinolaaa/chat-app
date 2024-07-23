const ChatBubble = (props) => {
  const messages = props.messages;

  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-2">
      {messages &&
        messages.map((msg, i) => (
          <div
            key={i}
            className=" flex gap-3 border-blue-400 border-2 bg-gray-300 border-none max-w-fit py-2 px-4 rounded-bl-2xl rounded-tr-2xl rounded-br-2xl"
          >
            <p>{msg}</p>
            <span className="text-xs mt-3  text-gray-600">{time}</span>
          </div>
        ))}
    </div>
  );
};

export { ChatBubble };
