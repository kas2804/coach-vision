// import React, { useState, useEffect } from 'react';
// import { User, Moon, Target, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

// interface Player {
//   id: string;
//   name: string;
//   position: string;
//   wellnessScore: number;
//   sleep: number;
//   fieldGoalPercentage: number;
//   rebounds: number;
//   assists: number;
//   initials: string;
// }

// const players: Player[] = [
//   {
//     id: '1',
//     name: 'Prady Lianmel',
//     position: 'Point Guard',
//     wellnessScore: 64.0,
//     sleep: 7.5,
//     fieldGoalPercentage: 64.0,
//     rebounds: 7.1,
//     assists: 3.8,
//     initials: 'PL'
//   },
//   {
//     id: '2',
//     name: 'Marcus Johnson',
//     position: 'Shooting Guard',
//     wellnessScore: 78.5,
//     sleep: 8.2,
//     fieldGoalPercentage: 72.3,
//     rebounds: 5.4,
//     assists: 4.2,
//     initials: 'MJ'
//   },
//   {
//     id: '3',
//     name: 'David Thompson',
//     position: 'Small Forward',
//     wellnessScore: 71.2,
//     sleep: 7.8,
//     fieldGoalPercentage: 68.7,
//     rebounds: 6.9,
//     assists: 2.1,
//     initials: 'DT'
//   },
//   {
//     id: '4',
//     name: 'Kevin Williams',
//     position: 'Power Forward',
//     wellnessScore: 82.1,
//     sleep: 8.5,
//     fieldGoalPercentage: 59.4,
//     rebounds: 9.2,
//     assists: 1.8,
//     initials: 'KW'
//   },
//   {
//     id: '5',
//     name: 'James Rodriguez',
//     position: 'Center',
//     wellnessScore: 69.8,
//     sleep: 7.2,
//     fieldGoalPercentage: 61.5,
//     rebounds: 11.3,
//     assists: 1.2,
//     initials: 'JR'
//   }
// ];

// export const PlayerWellnessSlider: React.FC = () => {
//   const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   useEffect(() => {
//     if (!isAutoPlaying) return;

//     const interval = setInterval(() => {
//       setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
//     }, 10000); // Change every 10 seconds

//     return () => clearInterval(interval);
//   }, [isAutoPlaying]);

//   const currentPlayer = players[currentPlayerIndex];

//   const nextPlayer = () => {
//     setIsAutoPlaying(false);
//     setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
//   };

//   const prevPlayer = () => {
//     setIsAutoPlaying(false);
//     setCurrentPlayerIndex((prev) => (prev - 1 + players.length) % players.length);
//   };

//   return (
//     <div className="bg-brand-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
//       {/* Auto-play indicator */}
//       <div className="absolute top-2 right-2">
//         <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-brand-orange animate-pulse' : 'bg-gray-300'}`}></div>
//       </div>

//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center space-x-2">
//           <User className="w-5 h-5 text-gray-600" />
//           <span className="font-semibold text-brand-black">Player Wellness</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={prevPlayer}
//             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <ChevronLeft className="w-4 h-4 text-gray-600" />
//           </button>
//           <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center">
//             <span className="text-brand-orange text-xs font-semibold">{currentPlayer.initials}</span>
//           </div>
//           <button
//             onClick={nextPlayer}
//             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <ChevronRight className="w-4 h-4 text-gray-600" />
//           </button>
//         </div>
//       </div>
      
//       <div className="mb-4 transition-all duration-500">
//         <div className="text-lg font-bold text-brand-black mb-1">{currentPlayer.name}</div>
//         <div className="text-sm text-gray-500">{currentPlayer.position}</div>
//       </div>
      
//       {/* Wellness Score */}
//       <div className="mb-4">
//         <div className="text-2xl font-bold text-brand-black mb-1">{currentPlayer.wellnessScore}</div>
//         <div className="text-sm text-gray-500">Wellness Score</div>
//         <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//           <div 
//             className="bg-brand-orange h-2 rounded-full transition-all duration-1000" 
//             style={{ width: `${currentPlayer.wellnessScore}%` }}
//           ></div>
//         </div>
//       </div>
      
//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div className="text-center">
//           <div className="flex items-center justify-center mb-1">
//             <Moon className="w-4 h-4 text-brand-orange mr-1" />
//             <span className="text-sm text-gray-600">Sleep</span>
//           </div>
//           <div className="text-lg font-bold text-brand-black">{currentPlayer.sleep} hrs</div>
//         </div>
        
//         <div className="text-center">
//           <div className="flex items-center justify-center mb-1">
//             <Target className="w-4 h-4 text-brand-orange-dark mr-1" />
//             <span className="text-sm text-gray-600">FG%</span>
//           </div>
//           <div className="text-lg font-bold text-brand-black">{currentPlayer.fieldGoalPercentage}%</div>
//         </div>
//       </div>
      
//       {/* Performance Stats */}
//       <div className="grid grid-cols-2 gap-4 text-center">
//         <div>
//           <div className="text-lg font-bold text-brand-black">{currentPlayer.rebounds}</div>
//           <div className="text-xs text-gray-500">Rebounds</div>
//         </div>
//         <div>
//           <div className="text-lg font-bold text-brand-black">{currentPlayer.assists}</div>
//           <div className="text-xs text-gray-500">Assists</div>
//         </div>
//       </div>

//       {/* Player indicators */}
//       <div className="flex justify-center space-x-2 mt-4">
//         {players.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => {
//               setIsAutoPlaying(false);
//               setCurrentPlayerIndex(index);
//             }}
//             className={`w-2 h-2 rounded-full transition-all ${
//               index === currentPlayerIndex ? 'bg-brand-orange' : 'bg-gray-300'
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };
// src/components/PlayerWellnessSlider.tsx
import React, { useEffect, useMemo, useState } from "react";
import { User, Moon, Target, ChevronLeft, ChevronRight } from "lucide-react";

type APIPlayer = {
  id: number;
  name: string;
  position: string;
  number: number;
  height: string;   // from height_text (renamed in backend service)
  initials: string; // provided by /api/players
};

type Skill = { skill: string; current: number; teamAvg: number; icon: string };
type AthleteOverview = {
  summary: { avgPoints: number; avgAssists: number; fgPct: number; games: number; [k: string]: any };
  skills: Skill[];
  [k: string]: any;
};

type SliderItem = {
  id: string;
  name: string;
  position: string;
  initials: string;
  wellnessScore: number | null;      // computed from skills avg (0–100) or null
  sleep: number | null;              // expects .sleepAvg if your backend provides it
  fieldGoalPercentage: number | null;
  rebounds: number | null;           // expects summary.avgRebounds / reboundsPg if provided
  assists: number | null;            // from summary.avgAssists
};

export const PlayerWellnessSlider: React.FC = () => {
  const [items, setItems] = useState<SliderItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Load players, then fetch per-player overview
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const pr = await fetch("/api/players");
        if (!pr.ok) throw new Error(`players: ${pr.status}`);
        const players: APIPlayer[] = await pr.json();

        // Choose first 5 (or all if you want)
        const chosen = players.slice(0, 5);

        const results = await Promise.allSettled(
          chosen.map(async (p) => {
            const r = await fetch(`/api/athletes/${encodeURIComponent(p.name)}/overview`);
            if (!r.ok) throw new Error(`athlete: ${r.status}`);
            const data: AthleteOverview = await r.json();

            const skills = Array.isArray(data?.skills) ? data.skills : [];
            const skillsAvg =
              skills.length > 0
                ? Math.round(
                    skills.reduce((s, k) => s + (Number(k.current) || 0), 0) / skills.length
                  )
                : null;

            const fg = typeof data?.summary?.fgPct === "number" ? data.summary.fgPct : null;
            const assists =
              typeof data?.summary?.avgAssists === "number" ? data.summary.avgAssists : null;
            // Optional fields if you later add them to athlete_overview:
            const sleepAvg =
              typeof (data as any)?.sleepAvg === "number" ? (data as any).sleepAvg : null;
            const reboundsPg =
              typeof (data as any)?.summary?.avgRebounds === "number"
                ? (data as any).summary.avgRebounds
                : typeof (data as any)?.summary?.reboundsPg === "number"
                ? (data as any).summary.reboundsPg
                : null;

            const score = skillsAvg ?? (fg !== null ? Math.max(0, Math.min(100, fg)) : null);

            const item: SliderItem = {
              id: String(p.id),
              name: p.name,
              position: p.position,
              initials: p.initials || p.name.split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase(),
              wellnessScore: score,
              sleep: sleepAvg, // will be null until you add it per-player in backend
              fieldGoalPercentage: fg,
              rebounds: reboundsPg, // will be null unless added in backend
              assists: assists,
            };
            return item;
          })
        );

        if (!alive) return;

        const okItems = results
          .filter((res): res is PromiseFulfilledResult<SliderItem> => res.status === "fulfilled")
          .map((res) => res.value);

        // Fallback: if none loaded, keep empty list but stop autoplay
        setItems(okItems);
        setCurrentIndex(0);
        setIsAutoPlaying(okItems.length > 1);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Failed to load player wellness");
        setItems([]);
        setIsAutoPlaying(false);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 10000);
    return () => clearInterval(id);
  }, [isAutoPlaying, items.length]);

  const current = items[currentIndex] || null;

  const scorePct = useMemo(() => {
    const v = current?.wellnessScore ?? 0;
    return Math.max(0, Math.min(100, Number(v)));
  }, [current?.wellnessScore]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((i) => (i + 1) % Math.max(items.length || 1, 1));
  };
  const prev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((i) => (i - 1 + Math.max(items.length || 1, 1)) % Math.max(items.length || 1, 1));
  };

  return (
    <div className="bg-brand-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
      {/* Auto-play & loading indicator */}
      <div className="absolute top-2 right-2 flex items-center space-x-2">
        {loading && <span className="text-xs text-gray-400">loading…</span>}
        <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-brand-orange animate-pulse" : "bg-gray-300"}`} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-brand-black">Player Wellness</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={prev} className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="Previous">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center">
            <span className="text-brand-orange text-xs font-semibold">
              {current?.initials ?? "—"}
            </span>
          </div>
          <button onClick={next} className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="Next">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Body */}
      {err ? (
        <div className="text-sm text-red-500">{err}</div>
      ) : !current ? (
        <div className="text-sm text-gray-500">{loading ? "Loading…" : "No players"}</div>
      ) : (
        <>
          <div className="mb-4 transition-all duration-500">
            <div className="text-lg font-bold text-brand-black mb-1">{current.name}</div>
            <div className="text-sm text-gray-500">{current.position}</div>
          </div>

          {/* Wellness Score */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-brand-black mb-1">
              {current.wellnessScore !== null ? current.wellnessScore.toFixed(1) : "—"}
            </div>
            <div className="text-sm text-gray-500">
              Wellness Score {current.wellnessScore === null ? "(skills avg fallback when available)" : ""}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-brand-orange h-2 rounded-full transition-all duration-1000"
                style={{ width: `${scorePct}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Moon className="w-4 h-4 text-brand-orange mr-1" />
                <span className="text-sm text-gray-600">Sleep</span>
              </div>
              <div className="text-lg font-bold text-brand-black">
                {current.sleep !== null ? `${current.sleep.toFixed(2)} hrs` : "—"}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="w-4 h-4 text-brand-orange-dark mr-1" />
                <span className="text-sm text-gray-600">FG%</span>
              </div>
              <div className="text-lg font-bold text-brand-black">
                {current.fieldGoalPercentage !== null ? `${current.fieldGoalPercentage.toFixed(1)}%` : "—"}
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-brand-black">
                {current.rebounds !== null ? current.rebounds.toFixed(1) : "—"}
              </div>
              <div className="text-xs text-gray-500">Rebounds</div>
            </div>
            <div>
              <div className="text-lg font-bold text-brand-black">
                {current.assists !== null ? current.assists.toFixed(1) : "—"}
              </div>
              <div className="text-xs text-gray-500">Assists</div>
            </div>
          </div>

          {/* Player indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(i);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? "bg-brand-orange" : "bg-gray-300"
                }`}
                aria-label={`Go to player ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
