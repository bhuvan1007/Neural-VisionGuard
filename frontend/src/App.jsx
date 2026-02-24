import React, { useState, useEffect, useRef } from 'react';
import VideoFeed from './components/VideoFeed';
import AlertLogs from './components/AlertLogs';
import StatCounters from './components/StatCounters';
import { ShieldAlert } from 'lucide-react';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [frameData, setFrameData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({
    activeThreats: 0,
    fireDetected: 0,
    accidents: 0,
    weapons: 0,
  });

  const ws = useRef(null);

  useEffect(() => {
    // Connect to FastAPI Backend WebSockets
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/stream';
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'frame_update') {
          // Update video frame
          setFrameData(data.image);

          // Process alerts if any exist in the payload
          if (data.alerts && data.alerts.length > 0) {
            setAlerts((prev) => {
              const newAlerts = [...data.alerts, ...prev].slice(0, 50); // Keep last 50
              return newAlerts;
            });

            // Update stats based on alert types
            setStats((prev) => {
              const newStats = { ...prev };
              data.alerts.forEach(alert => {
                newStats.activeThreats += 1;
                const lowerType = alert.type.toLowerCase();
                if (lowerType.includes('fire') || lowerType.includes('smoke')) newStats.fireDetected += 1;
                if (lowerType.includes('accident')) newStats.accidents += 1;
                if (lowerType.includes('weapon') || lowerType.includes('intrud')) newStats.weapons += 1;
              });
              return newStats;
            });
          }
        }
      } catch (err) {
        console.error("Error parsing WebSocket data:", err);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans selection:bg-rose-500/30">
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-3 lg:p-4 shrink-0 flex items-center justify-between shadow-md shadow-rose-900/5">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="p-1.5 lg:p-2 bg-rose-500/20 rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <ShieldAlert className="w-5 h-5 lg:w-6 lg:h-6 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent leading-tight">
              Neural VisionGuard
            </h1>
            <p className="text-[8px] lg:text-[10px] text-gray-400 font-bold tracking-[0.1em] lg:tracking-[0.2em] uppercase">Live Threat Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1 lg:py-1.5 border rounded-full ${isConnected ? 'bg-green-500/10 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${isConnected ? 'bg-green-500 animate-ping' : 'bg-red-500'}`}></div>
            <span className={`text-[10px] lg:text-xs font-semibold tracking-wide ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'ACTIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 content-start max-w-[1600px] mx-auto w-full">
        {/* Video Feed (Mobile: Top, Desktop: Top Right) */}
        <div className="order-1 lg:col-span-3 lg:col-start-2 lg:row-start-1 relative aspect-video bg-black rounded-2xl border border-gray-800 overflow-hidden shadow-2xl shadow-rose-900/10 flex flex-col justify-center">
          <VideoFeed frameData={frameData} isConnected={isConnected} />
        </div>

        {/* Stats Column (Mobile: Middle Grid, Desktop: Left Column span 2 rows) */}
        <div className="order-2 lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:row-span-2">
          <StatCounters stats={stats} />
        </div>

        {/* Logs Column (Mobile: Bottom, Desktop: Bottom Right) */}
        <div className="order-3 lg:col-span-3 lg:col-start-2 lg:row-start-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-4 lg:p-5 flex-1 min-h-[250px] lg:min-h-[300px]">
          <AlertLogs alerts={alerts} />
        </div>
      </main>
    </div>
  );
}

export default App;
