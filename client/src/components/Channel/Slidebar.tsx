import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ws } from "../../ws";
import { RoomContext } from "../../context/RoomContext"; // Убедитесь, что путь правильный
import { UserContext } from "../../context/UserContext";

interface Server {
  id: string;
  name: string;
}

export const Sidebar = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const navigate = useNavigate();
  const { setRoomId } = useContext(RoomContext);
  const { userName, userId } = useContext(UserContext); // Получаем setRoomId из контекста

  const GetServers = () => {
    const userId = localStorage.getItem("userId");
    ws.emit("get-servers", userId);
    ws.on("server-list", (serverList: Server[]) => {
      setServers(serverList);
    });
    return () => {
      ws.off("server-list");
    };
  };

  useEffect(() => {
    GetServers();
  }, []);

  // Функция для обработки выбора сервера
  const handleServerClick = (serverId: string) => {
    setRoomId(serverId); // Устанавливаем roomId в контексте
    navigate(`/channels/${serverId}`); // Переходим на страницу сервера
    ws.emit("join-room", { roomId: serverId, peerId: userId, userName });
  };

  return (
    <div className="w-20 h-screen bg-gray-900 p-2 flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        {servers.length > 0 ? (
          servers.map((server) => (
            <div
              key={server.id}
              onClick={() => handleServerClick(server.id)} // Добавляем обработчик клика
              className="w-16 h-16 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-600 cursor-pointer"
            >
              {server.name[0]}
            </div>
          ))
        ) : (
          <p className="text-white text-center">Загрузка...</p>
        )}
      </div>

      {/* Кнопка создания сервера */}
      <div className="relative group">
        <button className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 active:scale-95">
          <Link to={"/channels/create"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        </button>
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Создать сервер
        </span>
      </div>
    </div>
  );
};

export default Sidebar;