import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { ChatBubble } from "../chat/ChatBubble";
import { ChatInput } from "../chat/ChatInput";
import { IMessage } from "../../types/chat";

const ChatContent = () => {
  const { serverId } = useParams(); // Получаем ID сервера из URL
  const { chat } = useContext(ChatContext);

  return (
    <div className="flex-1 bg-gray-800 text-white p-4 flex flex-col h-full">
      <h1 className="text-2xl">Выбран сервер: {serverId}</h1>
      {chat.isChatOpen && (
        <div className="flex flex-col flex-1 border-l-2 overflow-hidden">
          {/* Контейнер для сообщений с прокруткой */}
          <div className="flex-1 overflow-y-auto p-2">
            {chat.messages.map((message: IMessage) => (
              <ChatBubble
                key={message.timestamp + (message?.author || "anonymous")}
                message={message}
              />
            ))}
          </div>
          {/* Фиксированное поле ввода */}
          <div className="p-2 border-t bg-gray-900">
            <ChatInput />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContent;