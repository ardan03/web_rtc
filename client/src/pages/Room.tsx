import { useContext, useEffect, useState, useRef } from "react";
import { ShareScreenButton } from "../components/ShareScreeenButton";
import { ChatButton } from "../components/ChatButton";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import { RoomContext } from "../context/RoomContext";
import { Chat } from "../components/chat/Chat";
import { NameInput } from "../common/Name";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { MicButton } from "../components/MicButton";
import { CameraButton } from "../components/CameraButton";

interface RoomProps {
    roomId: string;
}

export const Room = ({ roomId }: RoomProps) => {
    const { stream, screenStream, peers, shareScreen, screenSharingId } = useContext(RoomContext);
    const { userId } = useContext(UserContext);
    const { toggleChat, chat } = useContext(ChatContext);

    const [chatWidth, setChatWidth] = useState(350);
    const minChatWidth = 250;
    const maxChatWidth = 600;
    const isResizing = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return;
            setChatWidth((prevWidth) => {
                const newWidth = prevWidth - e.movementX;
                return Math.max(minChatWidth, Math.min(newWidth, maxChatWidth));
            });
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        if (isResizing.current) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const handleMouseDown = () => {
        isResizing.current = true;
    };

    const screenSharingVideo = screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;
    const { [screenSharingId]: sharing, ...peersToShow } = peers;

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <div className="p-4 bg-gray-800 shadow-md flex justify-between items-center">
                <span className="text-lg font-semibold">Room ID: {roomId}</span>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Видео */}
                <div className={`flex flex-col flex-1 ${chat.isChatOpen ? "pr-4" : ""}`}>
                    {screenSharingVideo ? (
                        <div className="flex-1 flex justify-center items-center">
                            <VideoPlayer stream={screenSharingVideo} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4 p-4 overflow-auto">
                            {stream && (
                                <div>
                                    <VideoPlayer stream={stream} />
                                    <NameInput />
                                </div>
                            )}
                            {Object.values(peersToShow as PeerState)
                                .filter((peer) => !!peer.stream)
                                .map((peer) => (
                                    <div key={peer.peerId}>
                                        <VideoPlayer stream={peer.stream} />
                                        <div className="text-center mt-2">{peer.userName}</div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Чат */}
                {chat.isChatOpen && (
                    <div className="relative flex flex-col border-l bg-gray-800 shadow-md" style={{ width: `${chatWidth}px` }}>
                        <div
                            className="absolute -left-2 top-0 bottom-0 w-4 bg-gray-600 cursor-col-resize hover:bg-gray-500 active:bg-gray-400"
                            onMouseDown={handleMouseDown}
                        />
                        <Chat />
                    </div>
                )}
            </div>

            {/* Панель управления */}
            <div className="h-20 flex items-center justify-center space-x-6 bg-gray-800 shadow-lg border-t">
                <ShareScreenButton onClick={shareScreen} />
                <ChatButton onClick={toggleChat} />
                <MicButton />
                <CameraButton />
            </div>
        </div>
    );
};
