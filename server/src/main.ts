import { randomUUID } from "node:crypto"

import dotenv from 'dotenv';
// import fastify from 'fastify';
// import fastifyCors from '@fastify/cors';
import {  Server as SocketServer } from 'socket.io';
import Redis from 'ioredis';
import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
// import closeWithGrace from 'close-with-grace';
dotenv.config();


const PORT = parseInt(process.env.PORT || "5000", 10);
const HOST = process.env.HOST || "0.0.0.0";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;

const CURRENT_COUNT_KEY =  "chat:connection-count"
const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated"; // channel cos we are gonna be subscribing and publishing to it
const NEW_MESSAGE_CHANNEL = "chat:new-message"
// const MESSAGES_KEY = "chat:messages" // messages are persisted here

if (!UPSTASH_REDIS_REST_URL) {
  console.error(`missing UPSTASH_REDIS_REST_URL`);
  process.exit(1);
}

  // const publisher = new Redis(UPSTASH_REDIS_REST_URL, {
  //   tls: {
    //     rejectUnauthorized: true // if you decided to encrypt your data
    //   }
  // });

  const publisher = new Redis(UPSTASH_REDIS_REST_URL);
  const subscriber = new Redis(UPSTASH_REDIS_REST_URL);

  let connectedClients = 0


async function buildServer() {
  const app = express();

  app.use(cors());

  app.use(express.json());

  const currentCount = await publisher.get(CURRENT_COUNT_KEY);
  if(currentCount) {
    await publisher.set(CURRENT_COUNT_KEY, 0)
  }


  app.get("/", (req: Request, res: Response) => {
    res.status(200).send({
        success: true,
        data: `Server Live${process.env.NODE_ENV === "production" ? "" : ` - ${process.env.NODE_ENV}`}`,
    });
  });

  app.get('/healthcheck', (req, res) => {
    res.json({
      status: "OK",
      port: PORT,
    })
  })

  return app;
}

async function main() {
  const app = await buildServer();

  const server = http.createServer(app);

  const io = new SocketServer(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", async(socket) => {
    const newCount = await publisher.incr(CURRENT_COUNT_KEY) // increment anytime a client connects
    connectedClients++

    await publisher.publish(CONNECTION_COUNT_UPDATED_CHANNEL, String(newCount))

    console.log('Client connecteddddd with socket id ', socket.id )

    socket.on(NEW_MESSAGE_CHANNEL, async({ message }) => {
      if(!message) {
        return
      }
      await publisher.publish(NEW_MESSAGE_CHANNEL, message.toString());
    })

    socket.on("disconnect", async() => {
      const newCount = await publisher.decr(CURRENT_COUNT_KEY) // decrement anytime a client disconnects
      connectedClients--

      await publisher.publish(CONNECTION_COUNT_UPDATED_CHANNEL, String(newCount))

      console.log("client disconnected with socket id ", socket.id)
    })
  })

  subscriber.subscribe(CONNECTION_COUNT_UPDATED_CHANNEL, (err, count) => {
    if (err) {
      console.error(`error subcribing to ${CONNECTION_COUNT_UPDATED_CHANNEL}`,  err);
      return
    }
    console.log(`${count} clients subscribed to ${CONNECTION_COUNT_UPDATED_CHANNEL} channel`)
  })

  subscriber.subscribe(NEW_MESSAGE_CHANNEL, (err, count) => {
    if (err) {
      console.error(`error subcribing to ${NEW_MESSAGE_CHANNEL}`,  err);
      return
    }
    console.log(`${count} clients subscribed to ${NEW_MESSAGE_CHANNEL} channel`)
  })

  // because you subscribed to the channels above. you can get messages from all those channels
  subscriber.on('message', (channel, payload) => {
    if(channel === CONNECTION_COUNT_UPDATED_CHANNEL) {
      io.emit(CONNECTION_COUNT_UPDATED_CHANNEL, { count: payload })
      return
    }
    if(channel === NEW_MESSAGE_CHANNEL) {
      io.emit(NEW_MESSAGE_CHANNEL, { message: payload, id: randomUUID(), createdAt: new Date().toISOString(), port: PORT })
      return
    }
  })

  try {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    // closeWithGrace({ delay: 2000 }, async() =>{ // Note- this didn't work and clients seem to disconnect on shutdown so redundant
    //   console.log("shutting down")
    // } )
  } catch (err) {
    console.error(err);
  }
}

main()