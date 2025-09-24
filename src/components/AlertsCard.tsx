// import React from 'react';
// import { AlertTriangle, UserX } from 'lucide-react';

// export const AlertsCard: React.FC = () => {
//   return (
//     <div className="bg-brand-white rounded-3xl p-6 shadow-lg">
//       <div className="flex items-center space-x-2 mb-4">
//         <AlertTriangle className="w-5 h-5 text-brand-orange-dark" />
//         <span className="font-semibold text-brand-black">Performance Alerts</span>
//       </div>
      
//       <div className="space-y-3">
//         <div className="flex items-center space-x-3 p-3 bg-brand-orange-dark/10 rounded-xl">
//           <div className="w-2 h-2 bg-brand-orange-dark rounded-full"></div>
//           <div className="flex-1">
//             <div className="text-sm font-medium text-brand-black">2 players under fatigue</div>
//             <div className="text-xs text-gray-500">Recommend rest day</div>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-3 p-3 bg-brand-orange/10 rounded-xl">
//           <UserX className="w-4 h-4 text-brand-orange" />
//           <div className="flex-1">
//             <div className="text-sm font-medium text-brand-black">1 player skipped session</div>
//             <div className="text-xs text-gray-500">Follow up required</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// src/components/AlertsCard.tsx
import React from "react";
import { AlertTriangle, UserX, Activity } from "lucide-react";
import { useCoachOverview } from "../hooks/useCoachOverview";

export const AlertsCard: React.FC = () => {
  // 1) HOOKS — always at the top and unconditional
  const { data, loading, error } = useCoachOverview();

  // 2) SAFE DERIVED VALUES (no hooks)
  const eng = data?.engagementSeries ?? [];
  const latestEng = eng.length ? eng[eng.length - 1].percent : 0;
  const injuriesCount = data?.injuriesCount ?? 0;
  const wellnessScore = data?.wellnessScore ?? 0;
  const avgPerformanceHrs = data?.avgPerformanceHrs ?? 0;

  // 3) EARLY RETURNS — fine now (no hooks below this point)
  if (loading) {
    return <div className="bg-brand-white rounded-3xl p-6 shadow-lg">Loading alerts…</div>;
  }
  if (error || !data) {
    return <div className="bg-brand-white rounded-3xl p-6 shadow-lg">Couldn’t load alerts.</div>;
  }

  // 4) BUILD ALERTS (plain JS, not a hook)
  const alerts: Array<{
    id: string;
    icon: React.ReactNode;
    title: string;
    detail: string;
    tone: "dark" | "mid" | "light";
  }> = [];

  if (injuriesCount > 0) {
    alerts.push({
      id: "injury",
      icon: <AlertTriangle className="w-5 h-5 text-brand-orange-dark" />,
      title: `${injuriesCount} player${injuriesCount > 1 ? "s" : ""} injured`,
      detail: "Adjust rotations; consider lighter loads.",
      tone: "dark",
    });
  }

  if (latestEng < 60) {
    alerts.push({
      id: "absence",
      icon: <UserX className="w-4 h-4 text-brand-orange" />,
      title: "Low attendance today",
      detail: `Engagement ${latestEng.toFixed(0)}% — follow up required`,
      tone: "mid",
    });
  }

  if (wellnessScore < 65 || avgPerformanceHrs < 0.5) {
    alerts.push({
      id: "fatigue",
      icon: <Activity className="w-4 h-4 text-brand-orange" />,
      title: "Fatigue risk",
      detail: `Wellness ${wellnessScore.toFixed(1)} / 100 • Avg load ${avgPerformanceHrs.toFixed(1)}h`,
      tone: "light",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "ok",
      icon: <AlertTriangle className="w-5 h-5 text-green-500" />,
      title: "All clear",
      detail: "No active alerts.",
      tone: "light",
    });
  }

  // 5) RENDER
  return (
    <div className="bg-brand-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-brand-orange-dark" />
        <span className="font-semibold text-brand-black">Performance Alerts</span>
      </div>

      <div className="space-y-3">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`flex items-center space-x-3 p-3 rounded-xl ${
              a.tone === "dark"
                ? "bg-brand-orange-dark/10"
                : a.tone === "mid"
                ? "bg-brand-orange/10"
                : "bg-brand-orange-light/10"
            }`}
          >
            <div>{a.icon}</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-brand-black">{a.title}</div>
              <div className="text-xs text-gray-500">{a.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
