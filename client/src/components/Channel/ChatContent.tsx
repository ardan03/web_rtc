import { useParams } from "react-router-dom";
import { Chat } from "../chat/Chat"; // Подключаем компонент Chat

const ChatContent = () => {
  const { serverId } = useParams(); // Достаем ID сервера из URL

  return (
    <div className="flex-1 bg-gray-800 text-white p-4">
      <h1 className="text-2xl">Выбран сервер: {serverId}</h1>
      <div className="border-l-2 pb-28">
                        <Chat />
                    </div> 
    </div>
  );
};

export default ChatContent;
