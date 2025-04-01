import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { roomHandler } from "./room";
import path from "path";

const app = express();
app.use(cors());
const port = 8080;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Указываем uploads внутри dist
const uploadDir = path.join(__dirname, "uploads"); // dist/uploads
app.use("/uploads", express.static(uploadDir));
console.log("Serving uploads from:", uploadDir);

io.on("connection", (socket) => {
    console.log("a user connected");
    roomHandler(socket, uploadDir); // Передаем uploadDir
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});