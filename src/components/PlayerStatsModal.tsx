// import React, { useState } from 'react';
// import { X, User, Target, Award, TrendingUp, MessageSquare, Send, Calendar } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// interface Player {
//   id: number;
//   number: number;
//   name: string;
//   position: string;
//   height: string;
//   initials: string;
// }

// interface PlayerStatsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   player: Player | null;
// }

// const generatePlayerData = (playerId: string) => {
//   // Generate unique data based on player ID
//   const basePoints = 15 + (parseInt(playerId) * 2);
//   const baseAssists = 4 + parseInt(playerId);
//   const baseFG = 55 + (parseInt(playerId) * 1.5);
//   
//   return {
//     performanceData: [
//       { week: 'W1', points: basePoints + 3, assists: baseAssists + 2, steals: 2 },
//       { week: 'W2', points: basePoints + 7, assists: baseAssists + 4, steals: 3 },
//       { week: 'W3', points: basePoints + 10, assists: baseAssists + 3, steals: 4 },
//       { week: 'W4', points: basePoints + 13, assists: baseAssists + 5, steals: 5 },
//       { week: 'W5', points: basePoints + 9, assists: baseAssists + 4, steals: 3 },
//       { week: 'W6', points: basePoints + 15, assists: baseAssists + 6, steals: 6 },
//     ],
//     skillsData: [
//       { skill: 'Shooting', current: Math.min(95, baseFG + 15), teamAvg: 75, icon: '🎯' },
//       { skill: 'Dribbling', current: Math.min(95, baseFG + 8), teamAvg: 70, icon: '⚡' },
//       { skill: 'Defense', current: Math.min(95, baseFG + 12), teamAvg: 80, icon: '🛡️' },
//       { skill: 'Endurance', current: Math.min(95, baseFG + 20), teamAvg: 85, icon: '💪' },
//       { skill: 'Passing', current: Math.min(95, baseFG + 18), teamAvg: 78, icon: '🎯' },
//       { skill: 'Rebounding', current: Math.min(95, baseFG + 5), teamAvg: 82, icon: '🏀' },
//     ],
//     stats: {
//       avgPoints: basePoints + 10,
//       assists: baseAssists + 4,
//       fieldGoalPercentage: baseFG + 10,
//       games: 24,
//       personalBests: {
//         points: basePoints + 25,
//         assists: baseAssists + 8,
//         threePointPercentage: Math.min(95, baseFG + 20)
//       }
//     }
//   };
// };

// const getExistingFeedback = (playerId: string) => [
//   {
//     id: `${playerId}-1`,
//     date: '2024-01-15',
//     skill: 'Shooting',
//     feedback: 'Great improvement in 3-point accuracy. Keep working on follow-through consistency.',
//     coach: 'Coach Johnson',
//     acknowledged: false
//   },
//   {
//     id: `${playerId}-2`,
//     date: '2024-01-12',
//     skill: 'Defense',
//     feedback: 'Excellent defensive positioning in last game. Work on lateral movement speed.',
//     coach: 'Coach Johnson',
//     acknowledged: true
//   }
// ];

// export const PlayerStatsModal: React.FC<PlayerStatsModalProps> = ({ isOpen, onClose, player }) => {
//   const [newComment, setNewComment] = useState('');
//   const [selectedSkill, setSelectedSkill] = useState('General');
//   const [feedback, setFeedback] = useState(player ? getExistingFeedback(player.id.toString()) : []);

//   if (!isOpen || !player) return null;

//   const playerData = generatePlayerData(player.id.toString());
//   const skillsAverage = Math.round(playerData.skillsData.reduce((sum, skill) => sum + skill.current, 0) / playerData.skillsData.length);

//   const handleAddComment = () => {
//     if (newComment.trim()) {
//       const newFeedback = {
//         id: `${player.id}-${Date.now()}`,
//         date: new Date().toISOString().split('T')[0],
//         skill: selectedSkill,
//         feedback: newComment.trim(),
//         coach: 'Coach Johnson',
//         acknowledged: false
//       };
//       setFeedback(prev => [newFeedback, ...prev]);
//       setNewComment('');
//       setSelectedSkill('General');
//     }
//   };

//   const skills = ['General', 'Shooting', 'Dribbling', 'Defense', 'Endurance', 'Passing', 'Rebounding'];

//   return (
//     <div className="fixed inset-0 bg-brand-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-brand-white dark:bg-gray-800 rounded-3xl p-8 max-w-6xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-hidden">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center">
//               <User className="w-8 h-8 text-brand-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white">
//                 #{player.number} {player.name}
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400">{player.position} • {player.height}</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//           </button>
//         </div>

//         <div className="overflow-y-auto max-h-[75vh]">
//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center">
//                   <Target className="w-5 h-5 text-brand-orange" />
//                 </div>
//                 <span className="text-sm text-gray-600 dark:text-gray-400">Avg Points</span>
//               </div>
//               <div className="text-2xl font-bold text-brand-black dark:text-brand-white">{playerData.stats.avgPoints}</div>
//               <div className="text-sm text-brand-orange">+12% from last month</div>
//             </div>

//             <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="w-10 h-10 bg-brand-orange-light/10 rounded-full flex items-center justify-center">
//                   <User className="w-5 h-5 text-brand-orange-light" />
//                 </div>
//                 <span className="text-sm text-gray-600 dark:text-gray-400">Assists</span>
//               </div>
//               <div className="text-2xl font-bold text-brand-black dark:text-brand-white">{playerData.stats.assists}</div>
//               <div className="text-sm text-brand-orange-light">+8% from last month</div>
//             </div>

//             <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="w-10 h-10 bg-brand-orange-dark/10 rounded-full flex items-center justify-center">
//                   <Award className="w-5 h-5 text-brand-orange-dark" />
//                 </div>
//                 <span className="text-sm text-gray-600 dark:text-gray-400">FG%</span>
//               </div>
//               <div className="text-2xl font-bold text-brand-black dark:text-brand-white">{playerData.stats.fieldGoalPercentage}%</div>
//               <div className="text-sm text-brand-orange-dark">+5% from last month</div>
//             </div>

//             <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
//               <div className="flex items-center space-x-3 mb-2">
//                 <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center">
//                   <TrendingUp className="w-5 h-5 text-brand-orange" />
//                 </div>
//                 <span className="text-sm text-gray-600 dark:text-gray-400">Games</span>
//               </div>
//               <div className="text-2xl font-bold text-brand-black dark:text-brand-white">{playerData.stats.games}</div>
//               <div className="text-sm text-gray-600 dark:text-gray-400">This season</div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Performance Chart */}
//             <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
//               <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4">Weekly Performance</h3>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={playerData.performanceData}>
//                     <XAxis dataKey="week" axisLine={false} tickLine={false} />
//                     <YAxis axisLine={false} tickLine={false} />
//                     <Line type="monotone" dataKey="points" stroke="#FF7900" strokeWidth={3} dot={{ fill: '#FF7900', r: 4 }} />
//                     <Line type="monotone" dataKey="assists" stroke="#FFA500" strokeWidth={3} dot={{ fill: '#FFA500', r: 4 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Skills Assessment */}
//             <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
//               <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4">Skills Assessment</h3>
//               
//               <div className="space-y-4 mb-6">
//                 {playerData.skillsData.map((skill, index) => (
//                   <div key={index} className="bg-brand-white dark:bg-gray-600 rounded-2xl p-4">
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center space-x-3">
//                         <span className="text-2xl">{skill.icon}</span>
//                         <span className="font-medium text-brand-black dark:text-brand-white">{skill.skill}</span>
//                       </div>
//                       <div className="flex items-center space-x-4 text-sm">
//                         <div className="text-center">
//                           <div className="text-brand-orange font-bold">{skill.current}%</div>
//                           <div className="text-gray-500 dark:text-gray-400 text-xs">Player</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-gray-600 dark:text-gray-300 font-bold">{skill.teamAvg}%</div>
//                           <div className="text-gray-500 dark:text-gray-400 text-xs">Team</div>
//                         </div>
//                       </div>
//                     </div>
//                     
//                     <div className="space-y-2">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-xs text-gray-600 dark:text-gray-400 w-12">Player</span>
//                         <div className="flex-1 bg-gray-200 dark:bg-gray-500 rounded-full h-2">
//                           <div 
//                             className="bg-brand-orange h-2 rounded-full transition-all duration-1000" 
//                             style={{ width: `${skill.current}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <span className="text-xs text-gray-600 dark:text-gray-400 w-12">Team</span>
//                         <div className="flex-1 bg-gray-200 dark:bg-gray-500 rounded-full h-2">
//                           <div 
//                             className="bg-gray-400 dark:bg-gray-400 h-2 rounded-full transition-all duration-1000" 
//                             style={{ width: `${skill.teamAvg}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               
//               <div className="p-4 bg-brand-orange/10 rounded-2xl">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-brand-orange mb-1">{skillsAverage}%</div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400">Overall Skills Average</div>
//                 </div>
//               </div>
//             </div>

//             {/* Add Comment Section */}
//             <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
//               <div className="flex items-center space-x-2 mb-4">
//                 <MessageSquare className="w-5 h-5 text-brand-orange" />
//                 <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">Add Feedback</h3>
//               </div>
//               
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Skill Category
//                   </label>
//                   <select
//                     value={selectedSkill}
//                     onChange={(e) => setSelectedSkill(e.target.value)}
//                     className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-brand-white dark:bg-gray-600 text-brand-black dark:text-brand-white"
//                   >
//                     {skills.map(skill => (
//                       <option key={skill} value={skill}>{skill}</option>
//                     ))}
//                   </select>
//                 </div>
//                 
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Feedback
//                   </label>
//                   <textarea
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                     placeholder="Enter your feedback for the player..."
//                     rows={4}
//                     className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none bg-brand-white dark:bg-gray-600 text-brand-black dark:text-brand-white placeholder-gray-500 dark:placeholder-gray-400"
//                   />
//                 </div>
//                 
//                 <button
//                   onClick={handleAddComment}
//                   disabled={!newComment.trim()}
//                   className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all ${
//                     newComment.trim()
//                       ? 'bg-brand-orange text-brand-white hover:bg-brand-orange-dark'
//                       : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   <Send className="w-4 h-4" />
//                   <span>Send Feedback</span>
//                 </button>
//               </div>
//             </div>

//             {/* Feedback History */}
//             <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
//               <div className="flex items-center space-x-2 mb-6">
//                 <Calendar className="w-5 h-5 text-brand-orange" />
//                 <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">Feedback History</h3>
//               </div>
//               
//               <div className="space-y-4 max-h-80 overflow-y-auto">
//                 {feedback.map((item) => (
//                   <div key={item.id} className={`p-4 rounded-xl border-l-4 ${
//                     item.acknowledged 
//                       ? 'bg-brand-white dark:bg-gray-600 border-gray-300 dark:border-gray-500' 
//                       : 'bg-brand-orange/10 border-brand-orange'
//                   }`}>
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-sm font-medium text-brand-orange">{item.skill}</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
//                         <span className="text-xs text-gray-500 dark:text-gray-400">{item.date}</span>
//                       </div>
//                       {!item.acknowledged && (
//                         <span className="text-xs bg-brand-orange text-brand-white px-2 py-1 rounded-full">
//                           Pending
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-sm text-brand-black dark:text-brand-white mb-2">{item.feedback}</p>
//                     <p className="text-xs text-gray-600 dark:text-gray-400">- {item.coach}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// src/components/PlayerStatsModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { addFeedback, getPlayerFeedback, FeedbackItem } from '../utils/feedbackStorage';
import {
  X, User, Target, Award, TrendingUp,
  MessageSquare, Send, Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useAthleteOverview } from "../hooks/useAthleteOverview";

interface Player {
  id: number;
  number: number;
  name: string;
  position: string;
  height: string;
  initials: string;
}

interface PlayerStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
}

const getExistingFeedback = (playerId: string) => [
  {
    id: `${playerId}-1`,
    date: "2025-09-05",
    skill: "Shooting",
    feedback:
      "Great improvement in 3-point accuracy. Keep working on follow-through consistency.",
    coach: "Coach Wilson",
    acknowledged: false,
  },
  {
    id: `${playerId}-2`,
    date: "2025-09-02",
    skill: "Defense",
    feedback:
      "Excellent defensive positioning in last game. Work on lateral movement speed.",
    coach: "Coach Wilson",
    acknowledged: true,
  },
];

export const PlayerStatsModal: React.FC<PlayerStatsModalProps> = ({
  isOpen,
  onClose,
  player,
}) => {
  // --- ALWAYS call hooks in the same order ---
  // Pass empty string when no player; your hook should no-op if name === "".
  const playerName = player?.name || "";
  const { data, loading, error } = useAthleteOverview(playerName);

  const [newComment, setNewComment] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('General');
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  // Load feedback from shared storage when player changes
  React.useEffect(() => {
    if (player) {
      const playerFeedback = getPlayerFeedback(player.name);
      setFeedback(playerFeedback);
    }
  }, [player]);

  // Derived data (memoized but ALWAYS called)
  const perfData = useMemo(() => {
    const rows =
      data?.weeklyPerformance?.map((d: any) => ({
        week: d.week,
        points: d.points,
        assists: d.assists,
      })) ?? [];
    return rows.length ? rows : [{ week: "No games", points: 0, assists: 0 }];
  }, [data?.weeklyPerformance]);

  const skills = data?.skills ?? [];
  const skillsAverage = useMemo(() => {
    if (!skills.length) return 0;
    const sum = skills.reduce(
      (acc: number, s: any) => acc + (Number(s.current) || 0),
      0
    );
    return Math.round(sum / skills.length);
  }, [skills]);

  const stats = data?.summary ?? {
    avgPoints: 0,
    avgAssists: 0,
    fgPct: 0,
    games: 0,
  };

  const personal = data?.personalBests ?? {
    points: 0,
    assists: 0,
    threePct: 0,
  };

  const skillsList =
    ["General"].concat(skills.map((s: any) => String(s.skill))) || ["General"];

  const handleAddComment = () => {
    if (newComment.trim() && player) {
      // Add feedback to shared storage
      addFeedback({
        playerId: player.id.toString(),
        playerName: player.name,
        skill: selectedSkill,
        feedback: newComment.trim(),
        coach: 'Coach Wilson',
        acknowledged: false
      });
      // Refresh feedback list
      const updatedFeedback = getPlayerFeedback(player.name);
      setFeedback(updatedFeedback);
      // Reset form
      setNewComment('');
      setSelectedSkill('General');
    }
  };

  // --- Only now is it safe to conditionally return (after ALL hooks) ---
  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 bg-brand-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-brand-white dark:bg-gray-800 rounded-3xl p-8 max-w-6xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-brand-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white">
                #{player.number} {player.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {player.position} • {player.height}
              </p>
              {error && (
                <div className="text-xs text-red-500 mt-1">
                  Couldn’t load live stats. Showing placeholders.
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[75vh]">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatBox
              tone="base"
              icon={<Target className="w-5 h-5 text-brand-orange" />}
              label="Avg Points"
              value={loading ? "…" : Number(stats.avgPoints || 0).toFixed(1)}
              sub="+— from last month"
            />
            <StatBox
              tone="light"
              icon={<User className="w-5 h-5 text-brand-orange-light" />}
              label="Assists"
              value={loading ? "…" : Number(stats.avgAssists || 0).toFixed(1)}
              sub="+— from last month"
            />
            <StatBox
              tone="dark"
              icon={<Award className="w-5 h-5 text-brand-orange-dark" />}
              label="FG%"
              value={loading ? "…" : `${Number(stats.fgPct || 0).toFixed(1)}%`}
              sub="+— from last month"
            />
            <StatBox
              tone="base"
              icon={<TrendingUp className="w-5 h-5 text-brand-orange" />}
              label="Games"
              value={loading ? "…" : String(stats.games || 0)}
              sub="This season"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Performance */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4">
                Weekly Performance
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={perfData}>
                    <XAxis dataKey="week" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Line
                      type="monotone"
                      dataKey="points"
                      stroke="#FF7900"
                      strokeWidth={3}
                      dot={{ fill: "#FF7900", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="assists"
                      stroke="#FFA500"
                      strokeWidth={3}
                      dot={{ fill: "#FFA500", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skills Assessment */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-4">
                Skills Assessment
              </h3>

              <div className="space-y-4 mb-6">
                {(skills.length ? skills : []).map((skill: any, i: number) => (
                  <div
                    key={`${String(skill.skill)}-${i}`}
                    className="bg-brand-white dark:bg-gray-600 rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{skill.icon || "🎯"}</span>
                        <span className="font-medium text-brand-black dark:text-brand-white">
                          {String(skill.skill)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <div className="text-brand-orange font-bold">
                            {Number(skill.current || 0)}%
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            Player
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600 dark:text-gray-300 font-bold">
                            {Number(skill.teamAvg ?? 0)}%
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">
                            Team
                          </div>
                        </div>
                      </div>
                    </div>

                    <BarRow label="Player" value={Number(skill.current || 0)} barClass="bg-brand-orange" />
                    <BarRow label="Team" value={Number(skill.teamAvg ?? 0)} barClass="bg-gray-400 dark:bg-gray-400" />
                  </div>
                ))}
              </div>

              <div className="p-4 bg-brand-orange/10 rounded-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-orange mb-1">
                    {loading ? "…" : `${skillsAverage}%`}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Overall Skills Average
                  </div>
                </div>
              </div>
            </div>

            {/* Add Feedback */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-brand-orange" />
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                  Add Feedback
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skill Category
                  </label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-brand-white dark:bg-gray-600 text-brand-black dark:text-brand-white"
                  >
                    {skillsList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feedback
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your feedback for the player..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none bg-brand-white dark:bg-gray-600 text-brand-black dark:text-brand-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all ${
                    newComment.trim()
                      ? "bg-brand-orange text-brand-white hover:bg-brand-orange-dark"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Send Feedback</span>
                </button>
              </div>
            </div>

            {/* Feedback History */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="w-5 h-5 text-brand-orange" />
                <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white">
                  Feedback History
                </h3>
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {feedback.map((item) => (
                  <div key={item.id} className={`p-4 rounded-xl border-l-4 ${
                    item.acknowledged 
                      ? 'bg-brand-white dark:bg-gray-600 border-gray-300 dark:border-gray-500' 
                      : 'bg-brand-orange/10 border-brand-orange'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-brand-orange">{item.skill}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      {!item.acknowledged && (
                        <span className="text-xs bg-brand-orange text-brand-white px-2 py-1 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-brand-black dark:text-brand-white mb-2">{item.feedback}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">- {item.coach}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personal bests (compact footer) */}
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            Personal bests — Points: <b>{personal.points}</b> • Assists:{" "}
            <b>{personal.assists}</b> • 3PT%: <b>{personal.threePct}%</b>
          </div>
        </div>
      </div>
    </div>
  );
};

/* helpers */
function StatBox({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "base" | "light" | "dark";
}) {
  const bg =
    tone === "light"
      ? "bg-brand-orange-light/10"
      : tone === "dark"
      ? "bg-brand-orange-dark/10"
      : "bg-brand-orange/10";
  const color =
    tone === "light"
      ? "text-brand-orange-light"
      : tone === "dark"
      ? "text-brand-orange-dark"
      : "text-brand-orange";
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center`}>
          <div className={color}>{icon}</div>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-brand-black dark:text-brand-white">
        {value}
      </div>
      <div className={`text-sm ${color}`}>{sub}</div>
    </div>
  );
}

function BarRow({
  label,
  value,
  barClass,
}: {
  label: string;
  value: number;
  barClass: string;
}) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center space-x-2 mb-1">
      <span className="text-xs text-gray-600 dark:text-gray-400 w-12">{label}</span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-500 rounded-full h-2">
        <div className={`${barClass} h-2 rounded-full`} style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}
