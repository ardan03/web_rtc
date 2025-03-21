import { Outlet } from "react-router-dom";
import Sidebar from "../components/Channel/Slidebar";

const Channel = () => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-800">
        <Outlet /> {/* Здесь будет либо `ChatContent`, либо страница создания сервера */}
      </div>
    </div>
  );
};

export default Channel;
