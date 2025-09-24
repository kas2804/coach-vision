// src/hooks/useAthleteOverview.ts
import { useEffect, useState } from "react";

/* ---------- Types your component expects ---------- */
export type AthleteOverview = {
  profile: {
    id: number;
    number: number;
    name: string;
    position: string;
    height?: string | null;
  };
  summary: {
    avgPoints: number;
    avgAssists: number;
    fgPct: number;
    games: number;
  };
  weeklyPerformance: { week: string; points: number; assists: number; steals: number }[];
  monthlyStats: { month: string; points: number; assists: number }[];
  personalBests: { points: number; assists: number; threePct: number };
  skills: { skill: string; current: number; teamAvg: number; icon: string }[];
};

/* ---------- Backend shapes ---------- */
type Player = {
  id: number;
  number: number;
  name: string;
  position: string;
  height?: string | null;
};

type MatchRow = {
  id: number;
  match_date: string; // "Sat, 06 Sep 2025 00:00:00 GMT" or "2025-09-06"
  opponent: string;
  home_away: "Home" | "Away";
  competition: string | null;
  team_score?: number | null;
  opp_score?: number | null;
  result?: "W" | "L" | null;
};

type MatchStat = {
  match_id: number;
  player_id: number;
  number: number;
  name: string;
  minutes_played: number | null;
  fg_made: number | null;
  fg_attempted: number | null;
  three_made: number | null;
  three_attempted: number | null;
  ft_made: number | null;
  ft_attempted: number | null;
  rebounds_off: number | null;
  rebounds_def: number | null;
  assists: number | null;
  steals: number | null;
  blocks: number | null;
  turnovers: number | null;
  fouls: number | null;
  points: number | null;
  plus_minus: number | null;
};

/* ---------- Utils ---------- */
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const pct = (num: number, den: number) => (den > 0 ? (num / den) * 100 : 0);
const monthShort = (d: Date) =>
  d.toLocaleString(undefined, { month: "short" }); // Jan, Feb...

function normalizeDate(s: string): Date {
  // handle "Sat, 06 Sep 2025 00:00:00 GMT" or "2025-09-06"
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date(s.replace(/ GMT.*/i, "")) : d;
}

function safeN(x: number | null | undefined) {
  return typeof x === "number" ? x : 0;
}

/* ---------- HOOK ---------- */
export function useAthleteOverview(playerName: string) {
  const [data, setData] = useState<AthleteOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // 1) Find the player
        const playersRes = await fetch("/api/players");
        if (!playersRes.ok) throw new Error("players fetch failed");
        const players: Player[] = await playersRes.json();

        const player =
          players.find((p) => p.name === playerName) ||
          players.find((p) => p.name.toLowerCase().includes(playerName.toLowerCase()));
        if (!player) throw new Error("player not found");

        // 2) Read all matches
        const matchesRes = await fetch("/api/matches");
        if (!matchesRes.ok) throw new Error("matches fetch failed");
        const matches: MatchRow[] = await matchesRes.json();

        // 3) For each match, read stats and keep only this player's line
        const playerLines: Array<{ date: Date; stat: MatchStat }> = [];
        for (const m of matches) {
          const statsRes = await fetch(`/api/matches/${m.id}/stats`);
          if (!statsRes.ok) continue;
          const stats: MatchStat[] = await statsRes.json();
          const line = stats.find((s) => s.player_id === player.id);
          if (line) {
            const d = normalizeDate(m.match_date);
            playerLines.push({ date: d, stat: line });
          }
        }

        // sort by date ascending
        playerLines.sort((a, b) => a.date.getTime() - b.date.getTime());

        // 4) Aggregate summary + PBs
        const games = playerLines.length;
        const totals = playerLines.reduce(
          (acc, r) => {
            const s = r.stat;
            acc.points += safeN(s.points);
            acc.assists += safeN(s.assists);
            acc.steals += safeN(s.steals);
            acc.fg_made += safeN(s.fg_made);
            acc.fg_att += safeN(s.fg_attempted);
            acc.three_made += safeN(s.three_made);
            acc.three_att += safeN(s.three_attempted);
            acc.reb += safeN(s.rebounds_off) + safeN(s.rebounds_def);
            acc.min += safeN(s.minutes_played);
            return acc;
          },
          {
            points: 0,
            assists: 0,
            steals: 0,
            fg_made: 0,
            fg_att: 0,
            three_made: 0,
            three_att: 0,
            reb: 0,
            min: 0,
          }
        );

        const avgPoints = games ? totals.points / games : 0;
        const avgAssists = games ? totals.assists / games : 0;
        const fgPct = pct(totals.fg_made, totals.fg_att);
        const threePct = pct(totals.three_made, totals.three_att);

        // 5) Weekly performance (last up to 6 games -> W1..W6)
        const last6 = playerLines.slice(-6);
        const weeklyPerformance = last6.map((r, i) => ({
          week: `W${i + 1}`,
          points: safeN(r.stat.points),
          assists: safeN(r.stat.assists),
          steals: safeN(r.stat.steals),
        }));

        // 6) Monthly stats (sum per month)
        const monthMap = new Map<string, { points: number; assists: number }>();
        for (const r of playerLines) {
          const key = monthShort(r.date);
          const cur = monthMap.get(key) ?? { points: 0, assists: 0 };
          cur.points += safeN(r.stat.points);
          cur.assists += safeN(r.stat.assists);
          monthMap.set(key, cur);
        }
        const monthlyStats = Array.from(monthMap.entries()).map(([month, v]) => ({
          month,
          points: v.points,
          assists: v.assists,
        }));

        // 7) Calculate team averages from all player stats
        const allPlayerStats: MatchStat[] = [];
        for (const m of matches) {
          const statsRes = await fetch(`/api/matches/${m.id}/stats`);
          if (!statsRes.ok) continue;
          const stats: MatchStat[] = await statsRes.json();
          allPlayerStats.push(...stats);
        }

        // Calculate team averages
        const teamTotals = allPlayerStats.reduce(
          (acc, s) => {
            acc.points += safeN(s.points);
            acc.assists += safeN(s.assists);
            acc.steals += safeN(s.steals);
            acc.fg_made += safeN(s.fg_made);
            acc.fg_att += safeN(s.fg_attempted);
            acc.reb += safeN(s.rebounds_off) + safeN(s.rebounds_def);
            acc.min += safeN(s.minutes_played);
            acc.games += 1;
            return acc;
          },
          {
            points: 0,
            assists: 0,
            steals: 0,
            fg_made: 0,
            fg_att: 0,
            reb: 0,
            min: 0,
            games: 0,
          }
        );

        const teamGames = teamTotals.games || 1;
        const teamFgPct = pct(teamTotals.fg_made, teamTotals.fg_att);
        const teamApg = teamTotals.assists / teamGames;
        const teamSpg = teamTotals.steals / teamGames;
        const teamRpg = teamTotals.reb / teamGames;
        const teamMpg = teamTotals.min / teamGames;

        // 8) Skills calculation with dynamic team averages
        const pg = games || 1;
        const apg = totals.assists / pg;
        const spg = totals.steals / pg;
        const rpg = totals.reb / pg;
        const mpg = totals.min / pg;

        const skills: AthleteOverview["skills"] = [
          { 
            skill: "Shooting",   
            current: Math.round(clamp01(fgPct / 100) * 100), 
            teamAvg: Math.round(clamp01(teamFgPct / 100) * 100), 
            icon: "🎯" 
          },
          { 
            skill: "Passing",    
            current: Math.round(clamp01(apg / 10) * 100),   
            teamAvg: Math.round(clamp01(teamApg / 10) * 100), 
            icon: "🤝" 
          },
          { 
            skill: "Defense",    
            current: Math.round(clamp01(spg / 5) * 100),  
            teamAvg: Math.round(clamp01(teamSpg / 5) * 100), 
            icon: "🛡️" 
          },
          { 
            skill: "Endurance",  
            current: Math.round(clamp01(mpg / 40) * 100),   
            teamAvg: Math.round(clamp01(teamMpg / 40) * 100), 
            icon: "💪" 
          },
          { 
            skill: "Rebounding", 
            current: Math.round(clamp01(rpg / 12) * 100),   
            teamAvg: Math.round(clamp01(teamRpg / 12) * 100), 
            icon: "🏀" 
          },
        ];

        const payload: AthleteOverview = {
          profile: {
            id: player.id,
            number: player.number,
            name: player.name,
            position: player.position,
            height: player.height ?? null,
          },
          summary: {
            avgPoints,
            avgAssists,
            fgPct,
            games,
          },
          weeklyPerformance,
          monthlyStats,
          personalBests: {
            points: playerLines.reduce((m, r) => Math.max(m, safeN(r.stat.points)), 0),
            assists: playerLines.reduce((m, r) => Math.max(m, safeN(r.stat.assists)), 0),
            threePct,
          },
          skills,
        };

        if (!cancelled) setData(payload);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (playerName) load();
    else {
      setData(null);
      setLoading(false);
      setError(null);
    }
    return () => {
      cancelled = true;
    };
  }, [playerName]);

  return { data, loading, error };
}
