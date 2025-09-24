// import React from 'react';
// import { Clock, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';

// export const MainMatchCard: React.FC = () => {
//   return (
//     <div className="relative bg-gradient-to-br from-brand-black via-gray-900 to-brand-black rounded-3xl p-8 overflow-hidden min-h-80">
//       {/* Background Basketball */}
//       <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
//         <div className="w-full h-full bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center transform translate-x-16 -translate-y-8">
//           <div className="w-48 h-48 border-2 border-brand-white rounded-full flex items-center justify-center relative">
//             <div className="w-1 h-24 bg-brand-white rounded-full"></div>
//             <div className="w-24 h-1 bg-brand-white rounded-full absolute"></div>
//             <div className="w-16 h-1 bg-brand-white rounded-full absolute transform rotate-45"></div>
//             <div className="w-16 h-1 bg-brand-white rounded-full absolute transform -rotate-45"></div>
//           </div>
//         </div>
//       </div>
      
//       {/* Content */}
//       <div className="relative z-10">
//         <div className="inline-flex items-center bg-brand-orange/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
//           <span className="text-brand-white text-sm font-medium">Next Match</span>
//         </div>
        
//         <h1 className="text-4xl lg:text-5xl font-bold text-brand-white leading-tight mb-8">
//           Lakers vs<br />
//           Raptors
//         </h1>
        
//         {/* Match Info */}
//         <div className="flex items-center text-brand-white/90 mb-6">
//           <Calendar className="w-5 h-5 mr-2" />
//           <span className="text-lg font-semibold">Saturday, 5:00 PM vs Raptors</span>
//         </div>
        
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
//           <div className="bg-brand-white/10 backdrop-blur-sm rounded-2xl p-4">
//             <div className="flex items-center mb-2">
//               <Clock className="w-5 h-5 text-brand-white/80 mr-2" />
//               <span className="text-brand-white/80 text-sm">Avg Performance</span>
//             </div>
//             <div className="text-xl sm:text-2xl font-bold text-brand-white">7.8 h</div>
//           </div>
          
//           <div className="bg-brand-white/10 backdrop-blur-sm rounded-2xl p-4">
//             <div className="flex items-center mb-2">
//               <AlertTriangle className="w-5 h-5 text-brand-orange-light mr-2" />
//               <span className="text-brand-white/80 text-sm">Injuries</span>
//             </div>
//             <div className="text-xl sm:text-2xl font-bold text-brand-orange-light">2</div>
//           </div>
          
//           <div className="bg-brand-white/10 backdrop-blur-sm rounded-2xl p-4">
//             <div className="flex items-center mb-2">
//               <TrendingUp className="w-5 h-5 text-brand-orange mr-2" />
//               <span className="text-brand-white/80 text-sm">Win Rate</span>
//             </div>
//             <div className="text-xl sm:text-2xl font-bold text-brand-orange">78%</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from "react";
import { Clock, AlertTriangle, Calendar, TrendingUp } from "lucide-react";
import { useCoachOverview } from "../hooks/useCoachOverview";

type Props = {
  teamName?: string; // default "Lakers"
};

export const MainMatchCard: React.FC<Props> = ({ teamName = "Lakers" }) => {
  const { data, loading, error } = useCoachOverview();

  // Safe getters
  const next = data?.nextMatch ?? null;
  const avgHrs =
    data && Number.isFinite(data.avgPerformanceHrs)
      ? `${data.avgPerformanceHrs.toFixed(1)} h`
      : "—";
  const injuries = data?.injuriesCount ?? 0;
  const winRate =
    data && Number.isFinite(data.winRate) ? `${Math.round(data.winRate)}%` : "—";

  function fmtDay(d?: string | null) {
    if (!d) return "—";
    // coach/overview returns YYYY-MM-DD (cast ::text), show “Sat, Sep 6”
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d; // fallback raw if parse fails
    return dt.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  const opponent = next?.opponent ?? "—";
  const isHome = next?.home_away === "Home";
  const vsMark = next ? (isHome ? "vs" : "vs") : "vs";
  const whenLine = next ? `${fmtDay(next.match_date)} ${vsMark} ${opponent}` : "No upcoming match";

  return (
    <div className="relative bg-gradient-to-br from-brand-black via-gray-900 to-brand-black rounded-3xl p-8 overflow-hidden min-h-80">
      {/* Background Basketball */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center transform translate-x-16 -translate-y-8">
          <div className="w-48 h-48 border-2 border-brand-white rounded-full flex items-center justify-center relative">
            <div className="w-1 h-24 bg-brand-white rounded-full" />
            <div className="w-24 h-1 bg-brand-white rounded-full absolute" />
            <div className="w-16 h-1 bg-brand-white rounded-full absolute rotate-45" />
            <div className="w-16 h-1 bg-brand-white rounded-full absolute -rotate-45" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="inline-flex items-center bg-brand-orange/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <span className="text-brand-white text-sm font-medium">
            {loading ? "Loading…" : "Next Match"}
          </span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold text-brand-white leading-tight mb-8">
          {teamName} {vsMark} <br />
          {opponent}
        </h1>

        {/* Match Info */}
        <div className="flex items-center text-brand-white/90 mb-6">
          <Calendar className="w-5 h-5 mr-2" />
          <span className="text-lg font-semibold">
            {error ? "—" : whenLine}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatBox
            icon={<Clock className="w-5 h-5 text-brand-white/80 mr-2" />}
            label="Avg Performance"
            value={avgHrs}
            valueClass="text-brand-white"
          />
          <StatBox
            icon={<AlertTriangle className="w-5 h-5 text-brand-orange-light mr-2" />}
            label="Injuries"
            value={String(injuries)}
            valueClass="text-brand-orange-light"
          />
          <StatBox
            icon={<TrendingUp className="w-5 h-5 text-brand-orange mr-2" />}
            label="Win Rate"
            value={winRate}
            valueClass="text-brand-orange"
          />
        </div>
      </div>
    </div>
  );
};

function StatBox({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-brand-white/10 backdrop-blur-sm rounded-2xl p-4">
      <div className="flex items-center mb-2">
        {icon}
        <span className="text-brand-white/80 text-sm">{label}</span>
      </div>
      <div className={`text-xl sm:text-2xl font-bold ${valueClass ?? "text-brand-white"}`}>
        {value}
      </div>
    </div>
  );
}
