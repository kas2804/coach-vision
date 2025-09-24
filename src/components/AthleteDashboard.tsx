import React, { useEffect, useState } from "react";
import { User, TrendingUp, Target, Award, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useAthleteOverview } from "../hooks/useAthleteOverview";
import {
  getPlayerFeedback,
  acknowledgeFeedback,
  initializeFeedback,
  FeedbackItem,
} from "../utils/feedbackStorage";

interface AthleteDashboardProps {
  playerName: string;
}

export const AthleteDashboard: React.FC<AthleteDashboardProps> = ({ playerName }) => {
  const { data, loading, error } = useAthleteOverview(playerName);

  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  // Load feedback for this player when dashboard mounts
  useEffect(() => {
    initializeFeedback();
    if (playerName) {
      const playerFeedback = getPlayerFeedback(playerName);
      setFeedback(playerFeedback);
    }
  }, [playerName]);

  const handleAcknowledge = (id: string) => {
    acknowledgeFeedback(id);
    if (playerName) {
      const updated = getPlayerFeedback(playerName);
      setFeedback(updated);
    }
  };

  if (!playerName) {
    return <div className="p-6">Please log in as an athlete.</div>;
  }
  if (loading) return <div className="p-6">Loading {playerName}…</div>;
  if (error || !data) return <div className="p-6">Couldn’t load data.</div>;

  const perfData = data.weeklyPerformance.length
    ? data.weeklyPerformance.map((d) => ({
        week: d.week,
        points: d.points,
        assists: d.assists,
        steals: d.steals,
      }))
    : [{ week: "No games", points: 0, assists: 0, steals: 0 }];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-black dark:text-brand-white mb-2">
            Welcome back, {playerName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Here's your performance overview</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Target className="w-5 h-5 text-brand-orange" />}
            label="Avg Points"
            value={data.summary.avgPoints.toFixed(1)}
            sub="+— from last month"
            tone="base"
          />
          <StatCard
            icon={<User className="w-5 h-5 text-brand-orange-light" />}
            label="Assists"
            value={data.summary.avgAssists.toFixed(1)}
            sub="+— from last month"
            tone="light"
          />
          <StatCard
            icon={<Award className="w-5 h-5 text-brand-orange-dark" />}
            label="FG%"
            value={`${data.summary.fgPct.toFixed(1)}%`}
            sub="+— from last month"
            tone="dark"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5 text-brand-orange" />}
            label="Games"
            value={String(data.summary.games)}
            sub="This season"
            tone="base"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile */}
          <div className="lg:col-span-4">
            <div className="bg-brand-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full mx-auto mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="w-24 h-24 bg-brand-white/20 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-brand-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-brand-black dark:text-brand-white mb-1">
                  {data.profile.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{data.profile.position}</p>
                <div className="bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full text-sm font-medium inline-block">
                  #{data.profile.number}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <InfoRow label="Height" value={data.profile.height ?? "—"} />
                <InfoRow label="Experience" value="—" />
              </div>
            </div>

            {/* Personal Bests */}
            <div className="bg-brand-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4">Personal Bests</h3>
              <div className="space-y-3">
                <BestRow label="Points in a game" value={String(data.personalBests.points)} tone="base" />
                <BestRow label="Assists in a game" value={String(data.personalBests.assists)} tone="light" />
                <BestRow label="3-Point %" value={`${data.personalBests.threePct.toFixed(1)}%`} tone="dark" />
              </div>
            </div>
          </div>

          {/* Performance & Skills */}
          <div className="lg:col-span-8 space-y-6">
            {/* Weekly Performance */}
            <div className="bg-brand-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">Weekly Performance</h3>
                <div className="flex space-x-2">
                  <LegendDot color="brand-orange" label="Points" />
                  <LegendDot color="brand-orange-light" label="Assists" />
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={perfData}>
                    <XAxis dataKey="week" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Line type="monotone" dataKey="points" stroke="#FF7900" strokeWidth={3} dot={{ fill: '#FF7900', r: 4 }} />
                    <Line type="monotone" dataKey="assists" stroke="#FFA500" strokeWidth={3} dot={{ fill: '#FFA500', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-brand-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4">Skills Assessment</h3>
              <div className="space-y-4">
                {data.skills.map((skill, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{skill.icon}</span>
                        <span className="font-medium text-brand-black dark:text-brand-white">{skill.skill}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <div className="text-brand-orange font-bold">{skill.current}%</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">You</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600 dark:text-gray-300 font-bold">{skill.teamAvg}%</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Team</div>
                        </div>
                      </div>
                    </div>
                    <BarRow label="You" value={skill.current} barClass="bg-brand-orange" />
                    <BarRow label="Avg" value={skill.teamAvg} barClass="bg-gray-400 dark:bg-gray-500" />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-brand-orange/10 rounded-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-orange mb-1">
                    {(
                      data.skills.reduce((sum, s) => sum + s.current, 0) /
                      Math.max(data.skills.length, 1)
                    ).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Overall Skills Average</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coach Feedback */}
          <div className="lg:col-span-12">
            <div className="bg-brand-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center space-x-2 mb-6">
                <MessageSquare className="w-5 h-5 text-brand-orange" />
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">Coach Feedback</h3>
              </div>

              {feedback.length === 0 ? (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  No feedback yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.map((fb) => (
                    <div
                      key={fb.id}
                      className={`p-4 rounded-2xl border ${
                        fb.acknowledged
                          ? "bg-gray-100 dark:bg-gray-700 border-gray-300"
                          : "bg-brand-orange/10 border-brand-orange"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-brand-black dark:text-brand-white">
                            {fb.feedback}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">From: {fb.coach}</p>
                        </div>
                        {!fb.acknowledged && (
                          <button
                            onClick={() => handleAcknowledge(fb.id)}
                            className="ml-4 px-3 py-1 bg-brand-orange text-white rounded-lg text-sm hover:bg-brand-orange-dark transition"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* helpers */
function StatCard({ icon, label, value, sub, tone }:{
  icon: React.ReactNode; label: string; value: string; sub: string; tone: "base" | "light" | "dark";
}) {
  const bg =
    tone === "light" ? "bg-brand-orange-light/10" :
    tone === "dark" ? "bg-brand-orange-dark/10" : "bg-brand-orange/10";
  const color =
    tone === "light" ? "text-brand-orange-light" :
    tone === "dark" ? "text-brand-orange-dark" : "text-brand-orange";
  return (
    <div className="bg-brand-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-2">
        <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center`}>
          <div className={color}>{icon}</div>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-brand-black dark:text-brand-white">{value}</div>
      <div className={`text-sm ${color}`}>{sub}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-semibold text-brand-black dark:text-brand-white">{value}</span>
    </div>
  );
}

function BestRow({ label, value, tone }: { label: string; value: string; tone: "base" | "light" | "dark" }) {
  const toneCls =
    tone === "light" ? "bg-brand-orange-light/10" :
    tone === "dark" ? "bg-brand-orange-dark/10" : "bg-brand-orange/10";
  const color =
    tone === "light" ? "text-brand-orange-light" :
    tone === "dark" ? "text-brand-orange-dark" : "text-brand-orange";
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl ${toneCls}`}>
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${color}`}>{label}</span>
      </div>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center space-x-1">
      <div className={`w-3 h-3 rounded-full ${color === "brand-orange" ? "bg-brand-orange" : "bg-brand-orange-light"}`} />
      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

function BarRow({ label, value, barClass }: { label: string; value: number; barClass: string }) {
  return (
    <div className="flex items-center space-x-2 mb-1">
      <span className="text-xs text-gray-600 dark:text-gray-400 w-8">{label}</span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div
          className={`${barClass} h-2 rounded-full`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
