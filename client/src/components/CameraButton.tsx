import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import { Button } from "./common/Button";

export const CameraButton = () => {
    const { toggleCamera, isCameraOn } = useContext(RoomContext);

    return (
        <div className="relative mx-1">
            <Button
                onClick={toggleCamera}
                type="button"
                className={`flex items-center justify-center w-14 h-14 rounded-full ${
                    isCameraOn 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                }`}
            >
                {isCameraOn ? (
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-6 h-6"
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M23 7l-7 5 7 5V7z"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                    </svg>
                ) : (
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        className="w-6 h-6"
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 .666L23 7v10"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                )}
            </Button>
        </div>
    );
}; 