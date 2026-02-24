import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

const AlertLogs = ({ alerts }) => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Live Hazard Logs
                </h2>
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Auto-refreshing</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {alerts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm py-10">
                        <div className="p-4 bg-gray-800/50 rounded-full mb-3">
                            <AlertTriangle className="w-6 h-6 text-gray-600" />
                        </div>
                        No recent hazards detected. System all clear.
                    </div>
                ) : (
                    alerts.map((alert, index) => (
                        <div key={index} className="bg-gray-800/80 border border-gray-700 p-3 rounded-xl flex items-start gap-4 hover:border-rose-500/50 transition-colors shadow-lg shadow-black/20">
                            <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${alert.severity === 'Critical' ? 'bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-orange-500/20 text-orange-500 border border-orange-500/30'}`}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-white tracking-wide text-sm">{alert.type.toUpperCase()}</span>
                                    <span className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed">{alert.description}</p>
                                <div className="mt-2 text-[10px] uppercase font-bold text-red-400 tracking-wider">
                                    » Alerted: {alert.authorityMapped}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertLogs;
