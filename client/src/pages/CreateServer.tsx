import { useState } from "react";
import { ws } from "../ws";

const CreateRoom = () => {
    const [roomName, setRoomName] = useState("");

    const handleCreateRoom = async () => {
        if (!roomName.trim()) {
            alert("Введите название комнаты");
            return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Ошибка: пользователь не найден");
            return;
        }

        const roomData = {
            name: roomName,
            ownerId: userId, // Исправлено название ключа
        };

        ws.emit("create-Server", roomData, (response: { error?: Error; result?: string }) => {
            if (response.error) {
                alert("Ошибка создания комнаты");
                console.error(response.error);
                return;
            }
            alert("Успешно! " + response.result);
            setRoomName(""); // Очистка поля после успешного создания
        });
    };

    return (
        <div className="flex-1 h-full flex flex-col items-center justify-center text-white bg-gray-800">
            <h1 className="text-2xl mb-4">Создать новую комнату</h1>
            <input
                type="text"
                placeholder="Название комнаты"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-80 p-2 rounded bg-gray-700 text-white focus:outline-none"
            />
            <button
                className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
                onClick={handleCreateRoom}
            >
                Создать
            </button>
        </div>
    );
};

export default CreateRoom;
