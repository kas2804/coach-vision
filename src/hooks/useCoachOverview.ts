// src/hooks/useCoachOverview.ts
import { useEffect, useState } from "react";

export type CoachOverview = {
  nextMatch: null | {
    id: number;
    match_date: string;
    opponent: string;
    home_away: "Home" | "Away";
    competition: string | null;
  };
  avgPerformanceHrs: number;
  injuriesCount: number;
  winRate: number;
  weeklyDrillTimeHrs: number;
  totalDrillDistanceM: number;
  sprintBursts: number;
  engagementSeries: { date: string; percent: number }[];
  weeklyTrainingTimeDots: { date: string; hours: number }[];
  completionRate: number;
  activePlayers: number;
  wellnessScore: number;
  sleepAvg: number | null;
  fgPct7d: number;
  rebounds7d: number;
  assists7d: number;
  shotsAttempted7d: number;
  courtTimeMin7d: number;
  topImprovements: { title: string; deltaPct: number }[];
  topImprovedPlayer?: {
    player_id: number;
    name: string;
    position: string | null;
    number: number | null;
    metric: string;   // "PPG"
    delta: number;    // e.g., +4.2
    ppg_last: number;
    ppg_prev: number;
  } | null;
};

export function useCoachOverview() {
  const [data, setData] = useState<CoachOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/coach/overview")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
