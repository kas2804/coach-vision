// import React from 'react';
// import { Users, Target, Clock } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// const engagementData = [
//   { day: 'M', score: 45 },
//   { day: 'T', score: 52 },
//   { day: 'W', score: 48 },
//   { day: 'T', score: 58 },
//   { day: 'F', score: 53 },
// ];

// export const PlayerEngagementCard: React.FC = () => {
//   return (
//     <div className="bg-brand-white rounded-3xl p-6 shadow-lg">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-2">
//           <Users className="w-5 h-5 text-gray-600" />
//           <span className="font-semibold text-brand-black">Player Engagement</span>
//         </div>
//         <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-medium">
//           53%
//         </div>
//       </div>
      
//       <div className="mb-4">
//         <div className="text-2xl font-bold text-brand-black mb-1">53%</div>
//         <div className="text-sm text-gray-500">Current engagement level</div>
//       </div>
      
//       {/* Engagement Chart */}
//       <div className="h-24 mb-4">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={engagementData}>
//             <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
//             <YAxis hide />
//             <Line 
//               type="monotone" 
//               dataKey="score" 
//               stroke="#FF7900" 
//               strokeWidth={3}
//               dot={{ fill: '#FF7900', strokeWidth: 2, r: 4 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
      
//       {/* Bonus Activities */}
//       <div className="space-y-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Target className="w-4 h-4 text-brand-orange" />
//             <span className="text-sm text-gray-600">Shooting</span>
//           </div>
//           <span className="text-sm font-semibold text-brand-orange">+12</span>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Clock className="w-4 h-4 text-brand-orange-dark" />
//             <span className="text-sm text-gray-600">Court Time</span>
//           </div>
//           <span className="text-sm font-semibold text-brand-orange-dark">22 min</span>
//         </div>
//       </div>
//     </div>
//   );
// };
import React from "react";
import { Users, Target, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useCoachOverview } from "../hooks/useCoachOverview";

export const PlayerEngagementCard: React.FC = () => {
  const { data, loading, error } = useCoachOverview();

  // Fallbacks to keep UI stable while loading/if empty
  const latestEng =
    data?.engagementSeries?.[data.engagementSeries.length - 1]?.percent ?? 0;

  // Take the last 5 days from the 7-day series
  const series = data?.engagementSeries ?? [];
  const last5 = series.slice(-5);

  // Convert ISO date → single-letter weekday label (S M T W T F S)
  const dayLetter = (iso: string) => {
    const d = new Date(iso);
    return ["S", "M", "T", "W", "T", "F", "S"][d.getDay()];
  };

  const chartData =
    last5.length > 0
      ? last5.map((d) => ({ day: dayLetter(d.date), score: d.percent }))
      : [
          { day: "M", score: 0 },
          { day: "T", score: 0 },
          { day: "W", score: 0 },
          { day: "T", score: 0 },
          { day: "F", score: 0 },
        ];

  const shots = data?.shotsAttempted7d ?? 0;      // last 7d total shots (team)
  const courtMin = data?.courtTimeMin7d ?? 0;     // last 7d total minutes (team)

  return (
    <div className="bg-brand-white rounded-3xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-brand-black">Player Engagement</span>
        </div>
        <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-medium">
          {loading ? "…" : `${latestEng.toFixed(0)}%`}
        </div>
      </div>

      {/* Current engagement */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-brand-black mb-1">
          {loading ? "…" : `${latestEng.toFixed(0)}%`}
        </div>
        <div className="text-sm text-gray-500">
          {error ? "Couldn’t load engagement" : "Current engagement level"}
        </div>
      </div>

      {/* Mini line chart */}
      <div className="h-24 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis hide />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#FF7900"
              strokeWidth={3}
              dot={{ fill: "#FF7900", strokeWidth: 2, r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bonus activities (live) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-brand-orange" />
            <span className="text-sm text-gray-600">Shooting (last 7 days)</span>
          </div>
          <span className="text-sm font-semibold text-brand-orange">
            +{shots}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-brand-orange-dark" />
            <span className="text-sm text-gray-600">Court Time (last 7 days)</span>
          </div>
          <span className="text-sm font-semibold text-brand-orange-dark">
            {(courtMin / 60).toFixed(1)} hrs
          </span>
        </div>
      </div>
    </div>
  );
};
