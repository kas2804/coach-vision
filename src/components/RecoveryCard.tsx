// import React from 'react';
// import { Moon, Battery } from 'lucide-react';

// export const RecoveryCard: React.FC = () => {
//   return (
//     <div className="bg-white rounded-3xl p-6 shadow-lg">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-2">
//           <Moon className="w-5 h-5 text-gray-600" />
//           <span className="font-semibold text-gray-900">Recovery</span>
//         </div>
//         <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
//           Good
//         </div>
//       </div>
      
//       <div className="mb-4">
//         <div className="text-2xl font-bold text-gray-900 mb-1">8.2 hrs</div>
//         <div className="text-sm text-gray-500">Avg team sleep</div>
//       </div>
      
//       {/* Sleep Quality Indicator */}
//       <div className="flex items-center space-x-2 mb-4">
//         <Battery className="w-4 h-4 text-green-600" />
//         <span className="text-sm text-green-600">Recovery Status: Optimal</span>
//       </div>
      
//       {/* Weekly Sleep Score */}
//       <div className="space-y-2">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Weekly Score</span>
//           <span className="font-semibold text-gray-900">87%</span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
//         </div>
//       </div>
//     </div>
//   );
// };
// src/components/RecoveryCard.tsx
import React, { useMemo } from 'react';
import { Moon, Battery } from 'lucide-react';
import { useCoachOverview } from '../hooks/useCoachOverview';

export const RecoveryCard: React.FC = () => {
  const { data, loading, error } = useCoachOverview();

  const score = typeof data?.wellnessScore === 'number' ? data!.wellnessScore : null; // 0–100
  const sleep = typeof data?.sleepAvg === 'number' ? data!.sleepAvg : null;           // hours

  const status = useMemo(() => {
    if (score === null) {
      return {
        label: '—',
        badge: 'bg-gray-100 text-gray-600',
        bar: 'bg-gray-400',
        text: 'text-gray-600',
      };
    }
    if (score >= 75) {
      return {
        label: 'Good',
        badge: 'bg-green-100 text-green-600',
        bar: 'bg-green-500',
        text: 'text-green-600',
      };
    }
    if (score >= 55) {
      return {
        label: 'Fair',
        badge: 'bg-yellow-100 text-yellow-700',
        bar: 'bg-yellow-500',
        text: 'text-yellow-700',
      };
    }
    return {
      label: 'Low',
      badge: 'bg-red-100 text-red-600',
      bar: 'bg-red-500',
      text: 'text-red-600',
    };
  }, [score]);

  const barWidth = `${Math.max(0, Math.min(100, score ?? 0))}%`;

  return (
    <div className="bg-brand-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Moon className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-brand-black">Recovery</span>
        </div>
        <div className={`${status.badge} px-3 py-1 rounded-full text-sm font-medium`}>
          {loading ? '…' : status.label}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-brand-black mb-1">
          {loading ? '…' : sleep !== null ? `${sleep.toFixed(1)} hrs` : '—'}
        </div>
        <div className="text-sm text-gray-500">Avg team sleep (7d)</div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Battery className={`w-4 h-4 ${status.text}`} />
        <span className={`text-sm ${status.text}`}>
          Recovery Status: {loading ? '…' : status.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Weekly Score</span>
          <span className="font-semibold text-brand-black">
            {loading ? '…' : score !== null ? `${score.toFixed(0)}%` : '—'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${status.bar} h-2 rounded-full transition-all duration-700`}
            style={{ width: loading || score === null ? '0%' : barWidth }}
          />
        </div>
      </div>

      {error && (
        <div className="mt-3 text-xs text-red-500">Couldn’t load recovery.</div>
      )}
    </div>
  );
};
