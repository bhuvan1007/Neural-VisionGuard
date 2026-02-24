import React from 'react';
import { Activity, Flame, Car, Crosshair } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, gradientClass }) => (
    <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-4 lg:p-5 group hover:border-gray-700 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-black/40">
        <div className={`absolute -right-6 -top-6 w-24 h-24 ${gradientClass} opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity`}></div>
        <div className="flex items-center justify-between mb-2 lg:mb-3">
            <h3 className="text-[10px] lg:text-sm font-semibold text-gray-400 tracking-wide uppercase">{title}</h3>
            <div className={`p-1.5 lg:p-2.5 rounded-xl ${colorClass}`}>
                <Icon className="w-4 h-4 lg:w-5 h-5" />
            </div>
        </div>
        <div className="text-2xl lg:text-4xl font-black text-white tracking-tight">
            {value}
        </div>
    </div>
);

const StatCounters = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6 w-full">
            <StatCard
                title="Active Threats"
                value={stats.activeThreats}
                icon={Activity}
                colorClass="bg-rose-500/20 text-rose-500 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                gradientClass="bg-rose-500"
            />
            <StatCard
                title="Fires / Smoke"
                value={stats.fireDetected}
                icon={Flame}
                colorClass="bg-orange-500/20 text-orange-500 border border-orange-500/30"
                gradientClass="bg-orange-500"
            />
            <StatCard
                title="Accidents"
                value={stats.accidents}
                icon={Car}
                colorClass="bg-blue-500/20 text-blue-500 border border-blue-500/30"
                gradientClass="bg-blue-500"
            />
            <StatCard
                title="Weapons"
                value={stats.weapons}
                icon={Crosshair}
                colorClass="bg-red-600/20 text-red-500 border border-red-500/30"
                gradientClass="bg-red-600"
            />
        </div>
    );
};

export default StatCounters;
