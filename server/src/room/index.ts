import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const rooms: Record<string, Record<string, IUser>> = {};
const chats: Record<string, IMessage[]> = {};
const prisma = new PrismaClient();

interface IUser {
    peerId: string;
    userName: string;
}
interface IRoomParams {
    roomId: string;
    peerId: string;
}
interface IJoinRoomParams extends IRoomParams {
    userName: string;
}
interface IMessage {
    content: string;
    author?: string;
    timestamp: number;
    fileUrl?: string | null;
}
interface Iserver{
    name: string;
    ownerId: string;
}
interface IFileData {
    fileName: string;
    fileType: string;
    fileBuffer: ArrayBuffer;
    author: string;

}



export const roomHandler = (socket: Socket, uploadDir: string) => {
    console.log("Регистрируем обработчики для сокета:", socket.id);
    const createRoom = () => {
        console.log("ddd");
        const roomId = uuidV4();
        rooms[roomId] = {};
        socket.emit("room-created", { roomId });
        console.log("user created the room");
    };
    const joinRoom = ({ roomId, peerId, userName }: IJoinRoomParams) => {
        if (!rooms[roomId]) rooms[roomId] = {};
        if (!chats[roomId]) chats[roomId] = [];
        socket.emit("get-messages", chats[roomId]);
        console.log("user joined the room", roomId, peerId, userName);
        rooms[roomId][peerId] = { peerId, userName }
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", { peerId, userName });
        socket.emit("get-users", {
            roomId,
            participants: rooms[roomId],
        });

        socket.on("disconnect", () => {
            console.log("user left the room", peerId);
            leaveRoom({ roomId, peerId });
        });
    };

    const leaveRoom = ({ peerId, roomId }: IRoomParams) => {
        // rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);
        socket.to(roomId).emit("user-disconnected", peerId);
    };

    const startSharing = ({ peerId, roomId }: IRoomParams) => {
        console.log({ roomId, peerId });
        socket.to(roomId).emit("user-started-sharing", peerId);
    };

    const stopSharing = (roomId: string) => {
        socket.to(roomId).emit("user-stopped-sharing");
    };
    const addMessage = (roomId: string, message: IMessage) => {
        console.log({ message });
        if (chats[roomId]) {
            chats[roomId].push(message);
        } else {
            chats[roomId] = [message];
        }
        console.log(roomId);
        socket.to(roomId).emit("add-message", message)
    };
    const changeName = ({ peerId, userName, roomId }: { peerId: string, userName: string, roomId: string }) => {
        if (rooms[roomId] && rooms[roomId][peerId]) {
            rooms[roomId][peerId].userName = userName;
            socket.to(roomId).emit("name-changed", { peerId, userName });
        }
    };
    const createServer = async (
        ServerInfo: Iserver,
        callback: (error: Error | null, result: string) => void
    ) => {
        console.log(ServerInfo.name);
        console.log(ServerInfo.ownerId);
        try {
            const server = await prisma.server.create({
                data: {
                    name: ServerInfo.name,
                    ownerId: ServerInfo.ownerId,
                    rooms: {
                        create: [
                            { name: "Общий чат", type: "TEXT" },
                            { name: "Голосовая комната", type: "VOICE" }
                        ]
                    }
                },
                include: {
                    rooms: true // Чтобы вернуть созданные комнаты
                }
            });

            callback(null, `Сервер "${server.name}" создан с 2 комнатами`);
        } catch (error) {
            callback(error as Error, "null");
        }
    };

    const getServer = async ()=>{
        const Server = await prisma.server.findMany();
        socket.emit("server-list", Server);

    }
    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("start-sharing", startSharing);
    socket.on("stop-sharing", stopSharing);
    socket.on("send-message", addMessage);
    socket.on("change-name", changeName);
    socket.on("create-Server", createServer);
    socket.on("get-servers", getServer);
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

        callback({ success: true, message: `Регистрация успешна!`+user.email});
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
        console.log(user.id);
        callback({ success: true, token, userId: user.id });

        });
        socket.on("send-file", (roomId: string, fileData: IFileData) => {
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

            const filePath = path.join(uploadDir, `${uuidV4()}${path.extname(fileData.fileName)}`);
            fs.writeFileSync(filePath, Buffer.from(fileData.fileBuffer));
            console.log("File saved at:", filePath);

            const fileUrl = `http://localhost:8080/uploads/${path.basename(filePath)}`; // Абсолютный URL
            const message: IMessage = {
                content: `📁 Файл: ${fileData.fileName}`,
                author: fileData.author,
                timestamp: Date.now(),
                fileUrl,
            };

            if (!chats[roomId]) chats[roomId] = [];
            chats[roomId].push(message);

            socket.to(roomId).emit("add-message", message);
            socket.emit("add-message", message);
        });
};


