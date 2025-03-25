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
    ws.emit("get-servers");

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
      <button className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-500">
        <Link to={"/channels/create"}>+</Link>
      </button>
    </div>
  );
};

export default Sidebar;