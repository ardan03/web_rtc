
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useReducer } from "react";
import { ChatContext } from "../../context/ChatContext";
import { ChatBubble } from "../chat/ChatBubble";
import { ChatInput } from "../chat/ChatInput";
import { ws } from "../../ws";
import { Room } from "../../pages/Room";
import { RoomContext } from "../../context/RoomContext";
import { IMessage } from "../../types/chat";
import { chatReducer } from "../../reducers/chatReducer";
import { addHistoryAction, addMessageAction } from "../../reducers/chatActions";


interface Room {
  id: string;
  name: string;
  type: "TEXT" | "VOICE";
}

const ChatContent = () => {
  const { serverId, roomId } = useParams(); // Получаем serverId и roomId из URL
  const navigate = useNavigate(); // Для изменения URL
  const { chat } = useContext(ChatContext);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { setRoomId } = useContext(RoomContext);
  const [chat1, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: true,
  });

  useEffect(() => {
    if (serverId) {
      ws.emit("get-rooms", serverId, (response: { rooms: Room[] }) => {
        setRooms(response.rooms);
        // Если roomId есть в URL, выбираем его, иначе первую комнату
        if (response.rooms.length > 0) {
          const initialRoomId = roomId || response.rooms[0].id;
          setSelectedRoomId(initialRoomId);
          if (!roomId) {
            navigate(`/channels/${serverId}/${initialRoomId}`);
          }
        }
      });
    }
  }, [serverId, roomId, navigate]);

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    setRoomId(roomId);
    ws.emit("join-room", { roomId, peerId: "some-peer-id", userName: "some-user" });
    ws.emit("get-messages", { roomId }, (messages: IMessage[]) => {
      chatDispatch(addHistoryAction(messages));
    });

    // Обновляем URL при выборе комнаты
    navigate(`/channels/${serverId}/${roomId}`);
  };

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

  return (
    <div className="flex h-full">
      <div className="w-64 bg-gray-700 text-white p-4 flex-shrink-0 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Комнаты</h2>
        <div className="flex-1 overflow-y-auto">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomSelect(room.id)}
              className={`w-full text-left p-2 mb-2 rounded-lg ${selectedRoomId === room.id ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-600"
                }`}
            >
              {room.name} ({room.type})
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-800 text-white p-4 flex flex-col h-full">
        <h1 className="text-2xl font-semibold text-gray-300">
          Выбран сервер: {serverId} | Комната: {selectedRoom?.name || "Не выбрана"}
        </h1>

        {selectedRoom?.type === "VOICE" ? (
          <Room roomId={selectedRoomId || ""} />
        ) : (
          chat.isChatOpen && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 border-l-2 overflow-y-auto p-4 space-y-4 rounded-lg shadow-lg bg-gray-900">
                {chat.messages.map((message: IMessage) => (
                  <ChatBubble
                    key={message.timestamp + (message?.author || "anonymous")}
                    message={message}
                  />
                ))}
              </div>
              <div className="mt-4">
                <div className="p-4 border-t bg-gray-800 rounded-b-lg">
                  <ChatInput />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChatContent;

