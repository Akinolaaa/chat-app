# A Chat Application

Instantly send messages to connected clients and give feedback.

## Getting Started

### Running the Application in Dev Mode

Step 1: Clone the repo

Step 2: Install dependecies. In the root directory of the project run the flowing commands.

```bash
npm run install-server
```

```bash
npm run install-client
```

Step 3: Go in to the client folder and create a file called `.env`.

Step 4: Copy the following into the file

```txt
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Step 5: Go in to the server folder and create a file called `.env`.

Step 6: Copy the following into the file

```txt
UPSTASH_REDIS_REST_URL=**redis url**
PORT=5000
```

Note: provide your own redis url or reach our to repo owner

Step 7: Run the development server

```bash
npm run dev-server
```

Step 8: Run the client server

```bash
npm run client-server
```

Step 9: Open the client url in your browser `http://localhost:3000`
