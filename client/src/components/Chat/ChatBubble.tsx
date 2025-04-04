import { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";
import { IMessage } from "../../types/chat";
import classNames from "classnames";
import { UserContext } from "../../context/UserContext";

export const ChatBubble: React.FC<{ message: IMessage }> = ({ message }) => {
    const { peers } = useContext(RoomContext);

    // Отладка
    console.log("Message:", message);
    console.log("Peers:", peers);
    const userName = message.userName;
    const userID = localStorage.getItem("userId");
    const isSelf = message.author === userID;
    const time = message.timestamp
    ? new Date(Number(message.timestamp)).toLocaleTimeString() // Преобразуем в число перед `Date`
    : "Время неизвестно";

    return (
        <div
            className={classNames("m-2 flex", {
                "pl-10 justify-end": isSelf,
                "pr-10 justify-start": !isSelf,
            })}
        >
            <div className="flex flex-col">
                <div
                    className={classNames("inline-block py-2 px-4 rounded", {
                        "bg-red-200": isSelf,
                        "bg-red-300": !isSelf,
                    })}
                >
                    {message.content || "Сообщение отсутствует"}
                    {message.fileUrl && (
                        <div className="mt-2">
                            <a
                                href={message.fileUrl}
                                download={
                                    message.content.startsWith("📁 Файл: ")
                                        ? message.content.split("📁 Файл: ")[1]
                                        : "file"
                                }
                                className="text-blue-500 underline hover:text-blue-700"
                            >
                                Скачать файл
                            </a>
                        </div>
                    )}
                    <div
                        className={classNames("text-xs opacity-50", {
                            "text-right": isSelf,
                            "text-left": !isSelf,
                        })}
                    >
                        {time}
                    </div>
                </div>
                <div
                    className={classNames("text-md", {
                        "text-right": isSelf,
                        "text-left": !isSelf,
                    })}
                >
                    {isSelf ? "You" : userName}
                </div>
            </div>
        </div>
    );
};