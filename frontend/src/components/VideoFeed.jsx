import React from 'react';
import { Camera, RefreshCw, EyeOff, Video } from 'lucide-react';

const VideoFeed = ({ frameData, isConnected, isCameraActive, onStartCamera, videoRef }) => {
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

    return (
        <div className="w-full h-full relative bg-gray-950 rounded-2xl overflow-hidden">
            {/* 1. Underlying Local Video Stream (Fast, No Lag) */}
            <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`w-full h-full object-contain absolute inset-0 transition-opacity duration-300 ${frameData ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* 2. AI Annotated WebSockets Overlay (Slightly Delayed) */}
            {frameData && (
                <img
                    src={frameData}
                    alt="Live Security Feed"
                    className="w-full h-full object-contain absolute inset-0 z-10"
                />
            )}

            {/* Loading Indicator while waiting for first AI frame */}
            {!frameData && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 text-sm text-rose-400 bg-gray-900/80 backdrop-blur px-4 py-2 rounded-full border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Awaiting AI Inference
                </div>
            )}
        </div>
    );
};

export default VideoFeed;
