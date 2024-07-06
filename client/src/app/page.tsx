"use client"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001'
const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated"; // channel cos we are gonna be subscribing and publishing to it
const NEW_MESSAGE_CHANNEL = "chat:new-message"

type Message = {
  message: string;
  id: string;
  port: number;
  createdAt: string;
}


function useSocket() {
  const [socket, setSocket ] = useState<Socket | null>()

  useEffect(() => {
    const socketIO = io(SOCKET_URL, {
      reconnection: true,
      upgrade: true,
      transports: ['websocket', 'polling']
    })

    setSocket(socketIO)

    return () => { socketIO.disconnect() }
  }, [])

  return socket
}
export default function Home() {
  const socket = useSocket()
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    socket?.on('connect', () => {
      console.log('Connected to Socket...')
    })

    // listen for new messages
    socket?.on(NEW_MESSAGE_CHANNEL, (payload: Message)=> {
      setMessages(() => [payload.message, ...messages])
    })
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    socket?.emit(NEW_MESSAGE_CHANNEL, { message: newMessage })
  }
  return (
    <main className="flex flex-col p-4 w-full max-w-3xl mx-auto ">
      {
      messages && messages.map((msg, i) => <p key={i}>{msg}</p>)
      }
      <form onSubmit={handleSubmit} className="flex items-center">
        <Textarea
          className="rounded-lg mr-4"
          placeholder="Tell me what you're thinking of..."
          value={newMessage}
          onChange={(e) =>setNewMessage(e.target.value)}
          maxLength={255}
        />
        <Button className="h-full"> Send Message </Button>
      </form>
    </main>
  );
}
