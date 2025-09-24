// import React from 'react';
// import { BarChart3, Calendar } from 'lucide-react';

// export const TrainingDetailsCard: React.FC = () => {
//   const weeklyTrainingData = [
//     { day: 'Mon', hours: 2 },
//     { day: 'Tue', hours: 3 },
//     { day: 'Wed', hours: 1 },
//     { day: 'Thu', hours: 2 },
//     { day: 'Fri', hours: 2 },
//     { day: 'Sat', hours: 0 },
//     { day: 'Sun', hours: 1 },
//   ];

//   return (
//     <div className="bg-brand-white rounded-3xl p-6 shadow-lg">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-2">
//           <Calendar className="w-5 h-5 text-gray-600" />
//           <span className="font-semibold text-brand-black">Training Details</span>
//         </div>
//         <span className="text-sm text-gray-500">Weekly</span>
//       </div>
      
//       <div className="mb-4">
//         <div className="text-2xl font-bold text-brand-black mb-1">10.5 h</div>
//         <div className="text-sm text-gray-500">Total training time</div>
//       </div>
      
//       {/* Habit Tracker Style Dot Visualization */}
//       <div className="mb-6">
//         <div className="text-sm text-gray-600 mb-3">Daily Training Hours</div>
//         <div className="space-y-3">
//           {weeklyTrainingData.map((item, index) => (
//             <div key={index} className="flex items-center justify-between">
//               <span className="text-sm font-medium text-brand-black w-12">{item.day}</span>
//               <div className="flex items-center space-x-1 flex-1 ml-4">
//                 {Array.from({ length: item.hours }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="w-3 h-3 bg-brand-orange rounded-full"
//                   />
//                 ))}
//                 {Array.from({ length: Math.max(0, 3 - item.hours) }).map((_, i) => (
//                   <div
//                     key={`empty-${i}`}
//                     className="w-3 h-3 border border-gray-300 rounded-full"
//                   />
//                 ))}
//               </div>
//               <span className="text-xs text-gray-500 w-8 text-right">{item.hours}h</span>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <div className="grid grid-cols-2 gap-4 text-center">
//         <div>
//           <div className="text-lg font-bold text-brand-black">85%</div>
//           <div className="text-xs text-gray-500">Completion Rate</div>
//         </div>
//         <div>
//           <div className="text-lg font-bold text-brand-black">12</div>
//           <div className="text-xs text-gray-500">Active Players</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// src/components/TrainingDetailsCard.tsx
import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { useCoachOverview } from '../hooks/useCoachOverview';

export const TrainingDetailsCard: React.FC = () => {
  const { data, loading, error } = useCoachOverview();

  const weekly = data?.weeklyTrainingTimeDots ?? []; // [{date:'YYYY-MM-DD', hours:number}]
  const totalHours = useMemo(
    () => Number((weekly.reduce((s, r) => s + (r.hours || 0), 0)).toFixed(1)),
    [weekly]
  );

  // Always render in Mon→Sun order (not by intensity or API order)
  const rows = useMemo(() => {
    const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

    if (!weekly.length) {
      return DAY_LABELS.map(label => ({ label, hours: 0, segments: 0 }));
    }

    // Build a map: Monday=0 ... Sunday=6 -> hours
    const dayHours: Record<number, number> = { 0:0,1:0,2:0,3:0,4:0,5:0,6:0 };
    weekly.forEach(r => {
      const d = new Date(`${r.date}T00:00:00`);
      // JS getDay(): Sun=0..Sat=6 -> shift so Mon=0..Sun=6
      const monIdx = (d.getDay() + 6) % 7;
      dayHours[monIdx] = r.hours ?? 0;
    });

    const maxH = Math.max(1, ...Object.values(dayHours));

    return DAY_LABELS.map((label, idx) => {
      const hours = dayHours[idx] ?? 0;
      const segments = Math.round((Math.max(0, hours) / maxH) * 5); // 0..5 dots, scaled
      return { label, hours, segments };
    });
  }, [weekly]);

  const completionRate = data?.completionRate ?? 0;
  const activePlayers  = data?.activePlayers ?? 0;

  return (
    <div className="bg-brand-white rounded-3xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-brand-black">Training Details</span>
        </div>
        <span className="text-sm text-gray-500">Weekly</span>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-brand-black mb-1">
          {loading ? '…' : `${totalHours} h`}
        </div>
        <div className="text-sm text-gray-500">Total training time</div>
      </div>

      {/* Habit Tracker Style Dot Visualization (scaled 0–5 per day) */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-3">Daily Training Intensity</div>
        <div className="space-y-3">
          {rows.map((row, idx) => (
            <div key={`${row.label}-${idx}`} className="flex items-center justify-between">
              <span className="text-sm font-medium text-brand-black w-12">{row.label}</span>
              <div className="flex items-center space-x-1 flex-1 ml-4">
                {Array.from({ length: row.segments }).map((_, i) => (
                  <div key={`f-${i}`} className="w-3 h-3 bg-brand-orange rounded-full" />
                ))}
                {Array.from({ length: Math.max(0, 5 - row.segments) }).map((_, i) => (
                  <div key={`e-${i}`} className="w-3 h-3 border border-gray-300 rounded-full" />
                ))}
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">
                {loading ? '…' : `${row.hours.toFixed(1)}h`}
              </span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-3 text-xs text-red-500">Couldn’t load training data.</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-brand-black">
            {loading ? '…' : `${Math.round(completionRate)}%`}
          </div>
          <div className="text-xs text-gray-500">Completion Rate</div>
        </div>
        <div>
          <div className="text-lg font-bold text-brand-black">
            {loading ? '…' : activePlayers}
          </div>
          <div className="text-xs text-gray-500">Active Players</div>
        </div>
      </div>
    </div>
  );
};
