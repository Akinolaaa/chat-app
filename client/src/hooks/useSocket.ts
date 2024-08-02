import io, { Socket } from "socket.io-client";
import { useEffect, useState } from "react";

// const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated"; // channel cos we are gonna be subscribing and publishing to it


const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:3001";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>();

  useEffect(() => {
    const socketIO = io(SOCKET_URL, {
      reconnection: true,
      upgrade: true,
      transports: ["websocket", "polling"],
    });

    setSocket(socketIO);

    return () => {
      socketIO.disconnect();
    };
  }, []);

  return socket;
}

export default useSocket