import { createContext, useEffect, useReducer } from "react";
import { IMessage } from "../types/chat";
import { chatReducer, ChatState } from "../reducers/chatReducer";
import {
    addHistoryAction,
    addMessageAction,
    toggleChatAction,
} from "../reducers/chatActions";
import { ws } from "../ws";
interface ChatValue {
    chat: ChatState;
    sendMessage: (message: string, roomId: string, author: string) => void;
    sendFile: (file: File, roomId: string, author: string) => void;
    toggleChat: () => void;
}
export const ChatContext = createContext<ChatValue>({
    chat: {
        messages: [],
        isChatOpen: true,
    },
    sendMessage: (message: string, roomId: string, author: string) => {},
    sendFile: () => {},
    toggleChat: () => {},
});

export const ChatProvider: React.FC = ({ children }) => {
    const [chat, chatDispatch] = useReducer(chatReducer, {
        messages: [],
        isChatOpen: true,
    });

    const sendMessage = (message: string, roomId: string, author: string) => {
        if (!message.trim()) {
            console.log("no");
            return;
        }
        console.log("yes");
        const messageData: IMessage = {
            content: message,
            timestamp: new Date().getTime(),
            author,
        };
        chatDispatch(addMessageAction(messageData));
        ws.emit("send-message", roomId, messageData);
    };
    const sendFile = (file: File, roomId: string, author: string) => {
        const reader = new FileReader();
        reader.onload = () => {
            const fileData = {
                fileName: file.name,
                fileType: file.type,  // Включен тип файла, если он нужен на сервере
                fileBuffer: reader.result,  // `ArrayBuffer`
                author,
            };
            
            // Отправляем данные о файле через WebSocket
            ws.emit("send-file", roomId, fileData);
        };
    
        reader.onerror = (error) => {
            console.error("Ошибка при чтении файла:", error);
        };
    
        // Чтение файла как ArrayBuffer
        reader.readAsArrayBuffer(file);
    };

    const addMessage = (message: IMessage) => {
        chatDispatch(addMessageAction(message));
    };

    const addHistory = (messages: IMessage[]) => {
        chatDispatch(addHistoryAction(messages));
    };

    const toggleChat = () => {
        chatDispatch(toggleChatAction(!chat.isChatOpen));
    };
    useEffect(() => {
        ws.on("add-message", addMessage);
        ws.on("get-messages", addHistory);
        return () => {
            ws.off("add-message", addMessage);
            ws.off("get-messages", addHistory);
        };
    }, []);
    return (
        <ChatContext.Provider
            value={{
                chat,
                sendMessage,
                sendFile,
                toggleChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
