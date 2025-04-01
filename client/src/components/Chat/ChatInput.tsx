import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { RoomContext } from "../../context/RoomContext";
import { UserContext } from "../../context/UserContext";
import { Button } from "../common/Button";

export const ChatInput: React.FC = () => {
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { sendMessage, sendFile } = useContext(ChatContext);
    const { userId } = useContext(UserContext);
    const { roomId } = useContext(RoomContext);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (message.trim()) {
            sendMessage(message, roomId, userId);
            setMessage("");
        }

        if (selectedFile) {
            sendFile(selectedFile, roomId, userId);
            setSelectedFile(null);
            const fileInput = document.getElementById("file-input") as HTMLInputElement;
            if (fileInput) fileInput.value = "";
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4"> {/* Увеличил gap с 2 до 4 */}
                    {selectedFile && (
                        <div className="flex items-center gap-2">
                            <span className="text-base text-gray-500"> {/* Изменил text-sm на text-base */}
                                {selectedFile.name}
                            </span>
                        </div>
                    )}
                    <div className="flex items-end">
                        <textarea
                            className="border rounded w-full p-2 text-black bg-white"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            placeholder="Введите сообщение"
                        />
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="file-input"
                            className="cursor-pointer p-4 mx-2 text-gray-500 hover:text-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                />
                            </svg>
                        </label>
                        <Button
                            testId="send-msg-button"
                            type="submit"
                            className="bg-rose-400 p-4 rounded-lg text-xl hover:bg-rose-600 text-white"
                        >
                            <svg
                                style={{ transform: "rotate(90deg)" }}
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};