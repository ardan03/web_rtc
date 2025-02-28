import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from './common/Button';
import { RoomContext } from '../context/RoomContext';

export const MicButton = () => {
    const { toggleMicrophone, isMicrophoneOn, stream } = useContext(RoomContext);
    const [audioLevel, setAudioLevel] = useState<number>(0);
    const animationFrameId = useRef<number>();

    useEffect(() => {
        if (!stream || !isMicrophoneOn) {
            setAudioLevel(0);
            return;
        }

        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.4;
        audioSource.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateAudioLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
            setAudioLevel(Math.min(100, (average / 128) * 100));
            
            animationFrameId.current = requestAnimationFrame(updateAudioLevel);
        };

        updateAudioLevel();

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            audioContext.close();
        };
    }, [stream, isMicrophoneOn]);

    return (
        <div className="relative mx-1">
            <Button
                onClick={toggleMicrophone}
                type="button"
                className={`flex items-center justify-center w-14 h-14 rounded-full ${
                    isMicrophoneOn 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                }`}
            >
                {isMicrophoneOn ? (
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-6 h-6"
                    >
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                ) : (
                    <svg 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
                    </svg>
                )}
            </Button>
            {isMicrophoneOn && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-green-500 transition-all duration-100"
                            style={{ width: `${audioLevel}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};