// import React from 'react';
// import { Activity, MapPin, Zap } from 'lucide-react';

// export const TrainingIntensityCard: React.FC = () => {
//   return (
//     <div className="bg-brand-white rounded-3xl p-6 shadow-lg h-80">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-bold text-brand-black">Training Intensity</h2>
//         <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-medium">
//           Active
//         </div>
//       </div>
      
//       {/* Main Stats */}
//       <div className="space-y-6">
//         <div>
//           <div className="flex items-center mb-2">
//             <Activity className="w-5 h-5 text-brand-orange mr-2" />
//             <span className="text-sm text-gray-600">Weekly Drill Time</span>
//           </div>
//           <div className="text-3xl font-bold text-brand-black">10.5 h</div>
//         </div>
        
//         <div>
//           <div className="flex items-center mb-2">
//             <MapPin className="w-5 h-5 text-brand-orange-dark mr-2" />
//             <span className="text-sm text-gray-600">Total Drill Distance</span>
//           </div>
//           <div className="text-3xl font-bold text-brand-black">5.3 km</div>
//         </div>
        
//         <div>
//           <div className="flex items-center mb-2">
//             <Zap className="w-5 h-5 text-brand-orange-light mr-2" />
//             <span className="text-sm text-gray-600">Sprint Bursts</span>
//           </div>
//           <div className="text-3xl font-bold text-brand-black">476 m</div>
//         </div>
//       </div>
      
//       {/* Progress Indicator */}
//       <div className="mt-6">
//         <div className="flex justify-between text-sm text-gray-600 mb-2">
//           <span>Weekly Goal</span>
//           <span>85%</span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div className="bg-brand-orange h-2 rounded-full" style={{ width: '85%' }}></div>
//         </div>
//       </div>
//     </div>
//   );
// };
// src/components/TrainingIntensityCard.tsx
import React, { useMemo } from 'react';
import { Activity, MapPin, Zap } from 'lucide-react';
import { useCoachOverview } from '../hooks/useCoachOverview';

export const TrainingIntensityCard: React.FC = () => {
  const { data, loading, error } = useCoachOverview();

  const weeklyHrs   = data?.weeklyDrillTimeHrs ?? 0;      // hours (number)
  const distanceM   = data?.totalDrillDistanceM ?? 0;     // meters (number)
  const bursts      = data?.sprintBursts ?? 0;            // count (number)
  const goalPct     = Math.max(0, Math.min(100, data?.completionRate ?? 0)); // 0–100

  const distanceLabel = useMemo(() => {
    // Show km when >= 1000m, otherwise meters
    return distanceM >= 1000 ? `${(distanceM / 1000).toFixed(1)} km`
                              : `${Math.round(distanceM)} m`;
  }, [distanceM]);

  return (
    <div className="bg-brand-white rounded-3xl p-6 shadow-lg h-80">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-brand-black">Training Intensity</h2>
        <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-medium">
          {weeklyHrs > 0 ? 'Active' : 'Idle'}
        </div>
      </div>

      {/* Main Stats */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-2">
            <Activity className="w-5 h-5 text-brand-orange mr-2" />
            <span className="text-sm text-gray-600">Weekly Drill Time</span>
          </div>
          <div className="text-3xl font-bold text-brand-black">
            {loading ? '…' : `${weeklyHrs.toFixed(1)} h`}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 text-brand-orange-dark mr-2" />
            <span className="text-sm text-gray-600">Total Drill Distance</span>
          </div>
          <div className="text-3xl font-bold text-brand-black">
            {loading ? '…' : distanceLabel}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <Zap className="w-5 h-5 text-brand-orange-light mr-2" />
            <span className="text-sm text-gray-600">Sprint Bursts</span>
          </div>
          <div className="text-3xl font-bold text-brand-black">
            {loading ? '…' : bursts}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Weekly Goal</span>
          <span>{loading ? '…' : `${Math.round(goalPct)}%`}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-brand-orange h-2 rounded-full transition-all duration-700"
            style={{ width: loading ? '0%' : `${goalPct}%` }}
          />
        </div>
        {error && (
          <div className="mt-2 text-xs text-red-500">
            Couldn’t load training intensity.
          </div>
        )}
      </div>
    </div>
  );
};
