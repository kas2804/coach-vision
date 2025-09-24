// import React from 'react';
// import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

// export const PlayerProgressCard: React.FC = () => {
//   return (
//     <div className="bg-brand-white rounded-3xl p-6 shadow-lg">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-2">
//           <TrendingUp className="w-5 h-5 text-gray-600" />
//           <span className="font-semibold text-brand-black">Player Development Highlights</span>
//         </div>
//         <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-medium">
//           Weekly
//         </div>
//       </div>
      
//       {/* Top Improved Player */}
//       <div className="mb-6">
//         <div className="flex items-center space-x-2 mb-2">
//           <Award className="w-5 h-5 text-brand-orange-light" />
//           <span className="text-sm text-gray-600">Top Improved Player</span>
//         </div>
//         <div className="text-xl font-bold text-brand-black">Marcus Johnson</div>
//         <div className="text-sm text-gray-500">Point Guard</div>
//       </div>
      
//       {/* Skill Improvements */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Target className="w-4 h-4 text-brand-orange" />
//             <span className="text-sm text-gray-600">Passing Accuracy</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="text-sm font-semibold text-brand-orange">+8%</span>
//             <div className="w-16 bg-gray-200 rounded-full h-2">
//               <div className="bg-brand-orange h-2 rounded-full" style={{ width: '80%' }}></div>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <BarChart3 className="w-4 h-4 text-brand-orange-dark" />
//             <span className="text-sm text-gray-600">Defensive Blocks</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="text-sm font-semibold text-brand-orange-dark">+5%</span>
//             <div className="w-16 bg-gray-200 rounded-full h-2">
//               <div className="bg-brand-orange-dark h-2 rounded-full" style={{ width: '65%' }}></div>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Target className="w-4 h-4 text-brand-orange-light" />
//             <span className="text-sm text-gray-600">Shooting Accuracy</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="text-sm font-semibold text-brand-orange-light">+12%</span>
//             <div className="w-16 bg-gray-200 rounded-full h-2">
//               <div className="bg-brand-orange-light h-2 rounded-full" style={{ width: '90%' }}></div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Overall Progress */}
//       <div className="mt-6 pt-4 border-t border-gray-100">
//         <div className="flex justify-between text-sm text-gray-600 mb-2">
//           <span>Overall Team Progress</span>
//           <span>+15%</span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-3">
//           <div className="bg-gradient-to-r from-brand-orange to-brand-orange-light h-3 rounded-full" style={{ width: '75%' }}></div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from "react";
import { TrendingUp, Target, Award, BarChart3 } from "lucide-react";
import { useCoachOverview } from "../hooks/useCoachOverview";

type Improvement = { title: string; deltaPct: number };

export const PlayerProgressCard: React.FC = () => {
  const { data, loading, error } = useCoachOverview();

  // 🔹 NEW: Top improved player from API (may be null)
  const tip = data?.topImprovedPlayer ?? null;

  // Safe fallbacks so the card never crashes
  const improvements: Improvement[] =
    data?.topImprovements && data.topImprovements.length > 0
      ? data.topImprovements
      : [
          { title: "Passing accuracy", deltaPct: 6 },
          { title: "Defensive blocks", deltaPct: 4 },
          { title: "Shooting accuracy", deltaPct: 3 },
        ];

  // Use completionRate (0–100) from your API as the overall team progress
  const overallProgress = Math.max(0, Math.min(100, data?.completionRate ?? 0));

  // Visual width for each mini-bar: base 50% + 5×delta (clamped to 100)
  //const barWidth = (delta: number) => `${Math.max(0, Math.min(100, 50 + delta * 5))}%`;

  // Pick an icon/tone per row by title keyword
  const rowIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("defens")) return <BarChart3 className="w-4 h-4 text-brand-orange-dark" />;
    if (t.includes("shoot")) return <Target className="w-4 h-4 text-brand-orange-light" />;
    return <Target className="w-4 h-4 text-brand-orange" />;
  };
  const rowToneClass = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("defens")) return "text-brand-orange-dark bg-gray-200";
    if (t.includes("shoot")) return "text-brand-orange-light bg-gray-200";
    return "text-brand-orange bg-gray-200";
  };
  const deltaTone = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("defens")) return "text-brand-orange-dark";
    if (t.includes("shoot")) return "text-brand-orange-light";
    return "text-brand-orange";
  };

  return (
    <div className="bg-brand-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-brand-black">Player Development Highlights</span>
        </div>
        <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-medium">
          Weekly
        </div>
      </div>

      {/* 🔹 Top Improvement (now live) */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Award className="w-5 h-5 text-brand-orange-light" />
          <span className="text-sm text-gray-600">Top Improvement</span>
        </div>

        {/* Title now prefers topImprovedPlayer from API */}
        <div className="text-xl font-bold text-brand-black">
          {loading ? "…" : tip ? `${tip.name} • ${tip.metric} +${tip.delta}` : (improvements[0]?.title ?? "—")}
        </div>

        {/* Subtitle explains the window when tip is present; otherwise fallback delta */}
        <div className="text-sm text-gray-500">
          {loading ? "" : tip ? `Last 7d vs prev 7d` : `+${improvements[0]?.deltaPct ?? 0}%`}
        </div>
      </div>

      {/* Skill Improvements (live/fallback) */}
      <div className="space-y-4">
        {improvements.slice(0, 3).map((imp: Improvement, idx: number) => (
          <div key={`${imp.title}-${idx}`} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {rowIcon(imp.title)}
              <span className="text-sm text-gray-600">{imp.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${deltaTone(imp.title)}`}>
                {loading ? "…" : `+${imp.deltaPct}%`}
              </span>
              
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress (live from completionRate) */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Team Progress</span>
          <span>{loading ? "…" : `+${overallProgress.toFixed(0)}%`}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-brand-orange to-brand-orange-light h-3 rounded-full"
            style={{ width: loading ? "0%" : `${overallProgress}%` }}
          />
        </div>
      </div>

      {error && <div className="mt-3 text-xs text-red-500">Couldn’t load improvements.</div>}
    </div>
  );
};
