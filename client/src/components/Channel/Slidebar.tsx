import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ws } from "../../ws";

interface Server {
  id: string;
  name: string;
}

export const Sidebar = () => {
  const [servers, setServers] = useState<Server[]>([]); // Явно указываем тип массива

  const GetServers = ( ) =>{
    ws.emit("get-servers");

    ws.on("server-list", (serverList: Server[]) => {
      setServers(serverList);
    });

    return () => {
      ws.off("server-list");
    };
  }
  useEffect(() => {
    GetServers();
  }, []);
  return (
    <div className="w-20 h-screen bg-gray-900 p-2 flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        {servers.length > 0 ? (
          servers.map((server) => (
            <Link
              key={server.id}
              to={`/channels/${server.id}`}
              className="w-16 h-16 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-600"
            >
              {server.name[0]}
            </Link>
          ))
        ) : (
          <p className="text-white text-center">Загрузка...</p>
        )}
      </div>

      {/* Кнопка создания сервера */}
      <button className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-500"  >
        <Link to={'/channels/create'}>
        +
        </Link>
      </button>
    </div>
  );
};

export default Sidebar;