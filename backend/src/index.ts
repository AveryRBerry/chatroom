import { createServer } from 'node:http';
import { Server } from 'socket.io';
import express from 'express';
import cors from "cors"

const app = express();
app.use(cors())
app.use(express.json())
const server = createServer(app);
const io = new Server(server, { pingTimeout: 500, pingInterval: 1000 });

let connectedUserCount = 0;

app.post("/admin", (req, res) => {
    const msg = req.body
    console.log(msg)
    io.emit("message", msg)
    res.status(200).json({message: "successfully sent admin msg"})
});

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
        console.log(data)
        io.emit("message", data)
    })
});

server.listen(3001);
