const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const redis = require('redis');
const cors = require("cors")

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        allowedHeaders: "*"
    }
});

let redisClient;
(async function (){
    redisClient = redis.createClient({
        password: 'n5gPpYfCJHONk7iR2ZMkH1O5394AIjcP',
        socket: {
            host: 'redis-14895.c309.us-east-2-1.ec2.cloud.redislabs.com',
            port: '14895'
        }
    });

    redisClient.on('error', (error) => {
        console.log(error)
    });

    redisClient.on('connect', () => {
        console.log("Client connected succesfully")
    });

    await redisClient.connect();
})();



// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on("joinRoom", async (room) => {
    socket.join(room);
    const messagesObject = await redisClient.get(room);
    console.log(messagesObject)
    socket.emit("previous_messages", JSON.parse(messagesObject))

    console.log(`User joined room: ${room}`);
  })

  socket.on('chat message', async (messageObject) => {
    // Broadcast the message to all sockets in the room
    // socket.emit("message", message)
    console.log(messageObject)
    let messagesObject = await redisClient.get(messageObject.room);
    if (messagesObject){
        messagesObject = JSON.parse(messagesObject);
        await redisClient.set(messageObject.room, JSON.stringify([...messagesObject, messageObject]))
    }
    else{
        await redisClient.set(messageObject.room, JSON.stringify([messageObject]))
    }
    socket.broadcast.to(messageObject.room).emit("message", messageObject)
  }); 

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(process.env.PORT || 6543, '0.0.0.0', () => {
  console.log('Server is listening');
});
