import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
const port = 8080;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
    console.log("User connected");

    socket.on("register", async (data, callback) => {
    const { username, password,email } = data;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        return callback({ success: false, message: "Пользователь уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
        username,
        password: hashedPassword,
        email
        },
    });

    callback({ success: true, message: `Регистрация успешна!`+user.email });
    });
    socket.on("login", async (data, callback) => {
    const { username, password } = data;

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        return callback({ success: false, message: "Пользователь не найден" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return callback({ success: false, message: "Неверный пароль" });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
    });

    callback({ success: true, token });
    });

    socket.on("disconnect", () => {
    console.log("User disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
