import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { ChatBubble } from "../chat/ChatBubble";
import { ChatInput } from "../chat/ChatInput";
import { IMessage } from "../../types/chat";
import { ShareScreenButton } from "../../components/ShareScreeenButton";
import { MicButton } from "../../components/MicButton";
import { CameraButton } from "../../components/CameraButton";

const ChatContent = () => {
  const { serverId } = useParams();
  const { chat } = useContext(ChatContext);

  // Заглушка для функции分享 экрана
  const handleShareScreen = () => {
    console.log("Share screen clicked");
  };

  return (
    <div className="flex h-full">
      {/* Sidebar с горизонтальными кнопками внизу */}
      <div className="w-64 bg-gray-700 text-white p-4 flex-shrink-0 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Sidebar</h2>
        {/* Пространство для будущего контента */}
        <div className="flex-1"></div>
        {/* Кнопки внизу горизонтально */}
        <div className="flex justify-between gap-2">
          <ShareScreenButton onClick={handleShareScreen} />
          <MicButton />
          <CameraButton />
        </div>
      </div>

      {/* Основной контент чата */}
      <div className="flex-1 bg-gray-800 text-white p-4 flex flex-col h-full">
        <h1 className="text-2xl font-semibold text-gray-300">
          Выбран сервер: {serverId}
        </h1>
        {chat.isChatOpen && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Контейнер для сообщений */}
            <div className="flex-1 border-l-2 overflow-y-auto p-4 space-y-4 rounded-lg shadow-lg bg-gray-900">
              {chat.messages.map((message: IMessage) => (
                <ChatBubble
                  key={message.timestamp + (message?.author || "anonymous")}
                  message={message}
                />
              ))}
            </div>

            {/* Фиксированная нижняя часть: только ввод */}
            <div className="mt-4">
              <div className="p-4 border-t bg-gray-800 rounded-b-lg">
                <ChatInput />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContent;