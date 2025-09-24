// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, User, Home } from 'lucide-react';
// import { PlayerStatsModal } from './PlayerStatsModal';

// interface Player {
//   id: string;
//   number: number;
//   name: string;
//   position: string;
//   height: string;
//   initials: string;
// }

// const players: Player[] = [
//   { id: '1', number: 12, name: 'Alex Thompson', position: 'Point Guard', height: '6\'2"', initials: 'AT' },
//   { id: '2', number: 8, name: 'Brandon Miller', position: 'Shooting Guard', height: '6\'3"', initials: 'BM' },
//   { id: '3', number: 15, name: 'Carlos Rodriguez', position: 'Small Forward', height: '6\'7"', initials: 'CR' },
//   { id: '4', number: 22, name: 'David Chen', position: 'Power Forward', height: '6\'9"', initials: 'DC' },
//   { id: '5', number: 33, name: 'Ethan Williams', position: 'Center', height: '6\'11"', initials: 'EW' },
//   { id: '6', number: 7, name: 'Felix Garcia', position: 'Point Guard', height: '6\'1"', initials: 'FG' },
//   { id: '7', number: 19, name: 'Gabriel Santos', position: 'Shooting Guard', height: '6\'4"', initials: 'GS' },
//   { id: '8', number: 25, name: 'Hassan Ahmed', position: 'Small Forward', height: '6\'6"', initials: 'HA' },
//   { id: '9', number: 11, name: 'Isaac Johnson', position: 'Power Forward', height: '6\'8"', initials: 'IJ' },
//   { id: '10', number: 23, name: 'Marcus Johnson', position: 'Shooting Guard', height: '6\'4"', initials: 'MJ' },
//   { id: '11', number: 3, name: 'Jake Wilson', position: 'Point Guard', height: '6\'0"', initials: 'JW' },
//   { id: '12', number: 14, name: 'Kevin Brown', position: 'Center', height: '7\'0"', initials: 'KB' },
//   { id: '13', number: 9, name: 'Luis Martinez', position: 'Small Forward', height: '6\'5"', initials: 'LM' },
//   { id: '14', number: 21, name: 'Michael Davis', position: 'Power Forward', height: '6\'10"', initials: 'MD' },
//   { id: '15', number: 6, name: 'Nathan Lee', position: 'Shooting Guard', height: '6\'3"', initials: 'NL' },
//   { id: '16', number: 17, name: 'Oliver Smith', position: 'Point Guard', height: '6\'1"', initials: 'OS' },
//   { id: '17', number: 4, name: 'Patrick O\'Connor', position: 'Center', height: '6\'11"', initials: 'PO' },
//   { id: '18', number: 13, name: 'Ryan Taylor', position: 'Small Forward', height: '6\'6"', initials: 'RT' },
//   { id: '19', number: 20, name: 'Samuel Jackson', position: 'Power Forward', height: '6\'9"', initials: 'SJ' },
//   { id: '20', number: 5, name: 'Tyler Anderson', position: 'Shooting Guard', height: '6\'2"', initials: 'TA' }
// ].sort((a, b) => {
//   const lastNameA = a.name.split(' ')[1];
//   const lastNameB = b.name.split(' ')[1];
//   return lastNameA.localeCompare(lastNameB);
// });

// interface TeamRosterPageProps {
//   onBack: () => void;
//   onGoHome: () => void;
// }

// export const TeamRosterPage: React.FC<TeamRosterPageProps> = ({ onBack, onGoHome }) => {
//   const [animationStarted, setAnimationStarted] = useState(false);
//   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
//   const [showPlayerModal, setShowPlayerModal] = useState(false);

//   useEffect(() => {
//     // Start animation after component mounts
//     const timer = setTimeout(() => {
//       setAnimationStarted(true);
//     }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   const getPositionColor = (position: string) => {
//     switch (position) {
//       case 'Point Guard':
//         return 'bg-brand-orange text-brand-white';
//       case 'Shooting Guard':
//         return 'bg-brand-orange-light text-brand-white';
//       case 'Small Forward':
//         return 'bg-brand-orange-dark text-brand-white';
//       case 'Power Forward':
//         return 'bg-gray-600 text-brand-white';
//       case 'Center':
//         return 'bg-gray-500 text-brand-white';
//       default:
//         return 'bg-gray-400 text-brand-white';
//     }
//   };

//   const handlePlayerClick = (player: Player) => {
//     setSelectedPlayer(player);
//     setShowPlayerModal(true);
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
//         {/* Header */}
//         <div className="bg-brand-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between h-16">
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={onGoHome}
//                   className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-colors"
//                 >
//                   <Home className="w-5 h-5" />
//                   <span>Home</span>
//                 </button>
//                 <button
//                 onClick={onBack}
//                 className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//                 <span>Back to Dashboard</span>
//               </button>
//               </div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">
//                 Total Players: {players.length}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Split Text Animation */}
//         <div className="flex justify-center items-center py-16 bg-gradient-to-br from-brand-black via-gray-900 to-brand-black relative overflow-hidden">
//           {/* Background Basketball */}
//           <div className="absolute inset-0 opacity-5">
//             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
//               <div className="w-full h-full bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center">
//                 <div className="w-80 h-80 border-4 border-brand-white rounded-full flex items-center justify-center relative">
//                   <div className="w-2 h-40 bg-brand-white rounded-full"></div>
//                   <div className="w-40 h-2 bg-brand-white rounded-full absolute"></div>
//                   <div className="w-28 h-2 bg-brand-white rounded-full absolute transform rotate-45"></div>
//                   <div className="w-28 h-2 bg-brand-white rounded-full absolute transform -rotate-45"></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="split-text-container relative z-10 group cursor-default">
//             <div className={`text-part left ${animationStarted ? 'animate-slide-in-left' : ''}`}>
//               LAKERS
//             </div>
//             <div className={`text-part right ${animationStarted ? 'animate-slide-in-right' : ''}`}>
//               &nbsp;ROSTER
//             </div>
            
//             {/* Bouncing Basketball on Hover */}
//             <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center animate-bounce-basketball">
//                 <div className="w-8 h-8 border border-brand-white rounded-full flex items-center justify-center relative">
//                   <div className="w-px h-4 bg-brand-white rounded-full"></div>
//                   <div className="w-4 h-px bg-brand-white rounded-full absolute"></div>
//                   <div className="w-3 h-px bg-brand-white rounded-full absolute transform rotate-45"></div>
//                   <div className="w-3 h-px bg-brand-white rounded-full absolute transform -rotate-45"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Players Grid */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {players.map((player) => (
//               <div
//                 key={player.id}
//                 onClick={() => handlePlayerClick(player)}
//                 className="bg-brand-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border border-transparent hover:border-brand-orange/20"
//               >
//                 <div className="flex items-center space-x-4 mb-4">
//                   <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center">
//                     <User className="w-8 h-8 text-brand-white" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-3xl font-bold text-brand-orange">#{player.number}</div>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3">
//                   <div>
//                     <h3 className="text-lg font-bold text-brand-black dark:text-brand-white">
//                       {player.name}
//                     </h3>
//                   </div>
                  
//                   <div className="flex items-center justify-between">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(player.position)}`}>
//                       {player.position}
//                     </span>
//                   </div>
                  
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600 dark:text-gray-400">Height:</span>
//                     <span className="font-semibold text-brand-black dark:text-brand-white">{player.height}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Player Stats Modal */}
//       <PlayerStatsModal
//         isOpen={showPlayerModal}
//         onClose={() => setShowPlayerModal(false)}
//         player={selectedPlayer}
//       />
//     </>
//   );
// };

import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Home } from 'lucide-react';
import { PlayerStatsModal } from './PlayerStatsModal';

interface Player {
  id: number;               // DB SERIAL → number
  number: number;
  name: string;
  position: string;
  height: string;
  initials: string;
}

interface TeamRosterPageProps {
  onBack: () => void;
  onGoHome: () => void;
}

export const TeamRosterPage: React.FC<TeamRosterPageProps> = ({ onBack, onGoHome }) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  // NEW: players come from the API
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimationStarted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('/api/players') // Vite proxy sends this to Flask
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Player[]) => setPlayers(data))
      .catch(err => console.error('fetch /api/players failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Point Guard':
        return 'bg-brand-orange text-brand-white';
      case 'Shooting Guard':
        return 'bg-brand-orange-light text-brand-white';
      case 'Small Forward':
        return 'bg-brand-orange-dark text-brand-white';
      case 'Power Forward':
        return 'bg-gray-600 text-brand-white';
      case 'Center':
        return 'bg-gray-500 text-brand-white';
      default:
        return 'bg-gray-400 text-brand-white';
    }
  };

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowPlayerModal(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <div className="bg-brand-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onGoHome}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Dashboard</span>
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Players: {loading ? '...' : players.length}
              </div>
            </div>
          </div>
        </div>

        {/* Split Text Animation */}
        <div className="flex justify-center items-center py-16 bg-gradient-to-br from-brand-black via-gray-900 to-brand-black relative overflow-hidden">
          {/* Background Basketball */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
              <div className="w-full h-full bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center">
                <div className="w-80 h-80 border-4 border-brand-white rounded-full flex items-center justify-center relative">
                  <div className="w-2 h-40 bg-brand-white rounded-full"></div>
                  <div className="w-40 h-2 bg-brand-white rounded-full absolute"></div>
                  <div className="w-28 h-2 bg-brand-white rounded-full absolute transform rotate-45"></div>
                  <div className="w-28 h-2 bg-brand-white rounded-full absolute transform -rotate-45"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="split-text-container relative z-10 group cursor-default">
            <div className={`text-part left ${animationStarted ? 'animate-slide-in-left' : ''}`}>
              LAKERS
            </div>
            <div className={`text-part right ${animationStarted ? 'animate-slide-in-right' : ''}`}>
              &nbsp;ROSTER
            </div>

            {/* Bouncing Basketball on Hover */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center animate-bounce-basketball">
                <div className="w-8 h-8 border border-brand-white rounded-full flex items-center justify-center relative">
                  <div className="w-px h-4 bg-brand-white rounded-full"></div>
                  <div className="w-4 h-px bg-brand-white rounded-full absolute"></div>
                  <div className="w-3 h-px bg-brand-white rounded-full absolute transform rotate-45"></div>
                  <div className="w-3 h-px bg-brand-white rounded-full absolute transform -rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-gray-600 dark:text-gray-300">Loading players…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {players.map((player) => (
                <div
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  className="bg-brand-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border border-transparent hover:border-brand-orange/20"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-orange-dark rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-brand-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-brand-orange">#{player.number}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-brand-black dark:text-brand-white">
                        {player.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(player.position)}`}>
                        {player.position}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Height:</span>
                      <span className="font-semibold text-brand-black dark:text-brand-white">{player.height}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Player Stats Modal */}
      <PlayerStatsModal
        isOpen={showPlayerModal}
        onClose={() => setShowPlayerModal(false)}
        player={selectedPlayer}
      />
    </>
  );
};
