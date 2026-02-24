import React from 'react';
import { Camera, RefreshCw, EyeOff } from 'lucide-react';

const VideoFeed = ({ frameData, isConnected }) => {
    if (!isConnected) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 absolute inset-0 text-gray-400">
                <EyeOff className="w-16 h-16 mb-4 text-gray-700" />
                <p className="text-lg font-medium text-gray-300">Connection to Camera Lost</p>
                <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                    Waiting for backend connection...
                </div>
            </div>
        );
    }

    if (!frameData) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 text-gray-400 absolute inset-0">
                <Camera className="w-16 h-16 mb-4 text-gray-600 animate-pulse" />
                <p className="text-lg font-medium text-gray-300">Awaiting Video Stream...</p>
                <div className="flex items-center gap-2 mt-4 text-sm text-rose-400 bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing YOLOv8 Inference
                </div>
            </div>
        );
    }

    return (
        <img
            src={frameData}
            alt="Live Security Feed"
            className="w-full h-full object-contain bg-black"
        />
    );
};

export default VideoFeed;
