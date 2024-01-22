import { createServer } from 'node:http';
import { Server } from 'socket.io';
import express from 'express';
import cors from "cors"

const app = express();
app.use(cors())
const server = createServer(app);
const io = new Server(server, { pingTimeout: 500, pingInterval: 1000 });

let connectedUserCount = 0;

io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`);
    connectedUserCount++;
    io.emit("connectUserCount", { count: connectedUserCount })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        connectedUserCount--;
        console.log(connectedUserCount);
        io.emit("connectUserCount", { count: connectedUserCount })
    });

    socket.on("message", (data) => {
        io.emit("message", data)
    })
});

server.listen(3001);
