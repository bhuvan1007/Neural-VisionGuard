import React from 'react';
import { Camera, RefreshCw, EyeOff, Video } from 'lucide-react';

const VideoFeed = ({ frameData, isConnected, isCameraActive, onStartCamera }) => {
    if (!isConnected) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 absolute inset-0 text-gray-400 p-6 text-center">
                <EyeOff className="w-16 h-16 mb-4 text-gray-700" />
                <p className="text-lg font-medium text-gray-300">Connection to AI Core Lost</p>
                <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                    Waiting for backend connection...
                </div>
            </div>
        );
    }

    if (!isCameraActive) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 text-gray-400 absolute inset-0 p-6 text-center">
                <Video className="w-16 h-16 mb-4 text-gray-700" />
                <p className="text-lg font-medium text-gray-300 mb-6">Camera Access Required</p>
                <button
                    onClick={onStartCamera}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                    <Camera className="w-5 h-5" />
                    Grant Camera Access & Stream
                </button>
            </div>
        );
    }

    if (!frameData) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 text-gray-400 absolute inset-0 text-center">
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
            className="w-full h-full object-contain bg-black absolute inset-0"
        />
    );
};

export default VideoFeed;
