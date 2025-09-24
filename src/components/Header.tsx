import React, { useState } from 'react';
import { Search, Bell, Grid3X3, User, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { LoginModal } from './LoginModal';
import { useCoachOverview } from '../hooks/useCoachOverview';

interface HeaderProps {
  userRole: 'coach' | 'athlete' |'admin' | null;
  onLogin: (role: 'coach' | 'athlete'| 'admin') => void;
  onLogout: () => void;
  onShowTeamRoster?: () => void;
  onGoHome?: () => void;
  onToggleNotifications?: () => void;
  notificationsCount?: number;
  onSelectPlayer?: (name: string) => void;
  onSelectMatch?: (matchId: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  onLogin,
  onLogout,
  onShowTeamRoster,
  onGoHome,
  onToggleNotifications,
  notificationsCount = 0,
  onSelectPlayer,
  onSelectMatch,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Live coach overview (safe: header renders fine even if null)
  const { data, loading, error } = useCoachOverview();

  const next = data?.nextMatch ?? null;
  const winRate = data?.winRate ?? null;
  // keep injuries if you still want a separate badge elsewhere; not used for bell now
  // const injuries = data?.injuriesCount ?? 0;

  // ---- Engagement today (SAFE) ----
  const engSeries = data?.engagementSeries ?? [];
  const lastEng = engSeries.length ? engSeries[engSeries.length - 1] : null;
  const engagementLabel = loading
    ? 'Engagement …'
    : lastEng
    ? `Engagement ${lastEng.percent.toFixed(0)}%`
    : error
    ? 'Engagement —'
    : 'Engagement —';

  // local search state
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  // caches
  type PlayerRow = { id: number; name: string; position?: string | null; number?: number | null };
  type MatchRow = { id: number; match_date: string; opponent: string; home_away: 'Home'|'Away'; competition: string | null };

  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  // lazy load data once
  async function maybeLoadData() {
    if (loaded) return;
    try {
      const [pr, mr] = await Promise.all([fetch('/api/players'), fetch('/api/matches')]);
      if (pr.ok) setPlayers(await pr.json());
      if (mr.ok) setMatches(await mr.json());
    } catch {}
    setLoaded(true);
  }

  // simple contains helper
  const q = query.trim().toLowerCase();

  const playerResults = q
    ? players.filter(p =>
        (p.name?.toLowerCase().includes(q)) ||
        (p.position?.toLowerCase().includes(q)) ||
        (String(p.number ?? '').includes(q))
      )
    : [];

  const matchResults = q
    ? matches.filter(m =>
        m.opponent?.toLowerCase().includes(q) ||
        m.home_away?.toLowerCase().includes(q) ||
        m.match_date?.toLowerCase().includes(q)
      )
    : [];

  // date formatter
  function fmtDate(s: string) {
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <>
      <header className="bg-brand-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onGoHome}
                className="w-8 h-8 bg-gradient-to-br from-brand-orange via-brand-orange-light to-brand-orange-dark rounded-full flex items-center justify-center relative overflow-hidden hover:scale-110 transition-transform"
                aria-label="Home"
              >
                {/* Basketball lines */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-1/2 w-px h-full bg-brand-white transform -translate-x-1/2" />
                  <div className="absolute top-1/2 left-0 w-full h-px bg-brand-white transform -translate-y-1/2" />
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-px bg-brand-white transform rotate-45 origin-center" />
                  <div className="absolute top-3/4 left-1/4 w-1/2 h-px bg-brand-white transform -rotate-45 origin-center" />
                </div>
              </button>
              <button
                onClick={onGoHome}
                className="text-xl font-bold text-brand-black dark:text-brand-white hover:text-brand-orange transition-colors"
              >
                Coach Vision
              </button>
            </div>

            {/* Search + live chips (coach only) */}
            {userRole === 'coach' && (
              <div className="flex-1 mx-4 md:mx-8 flex items-center space-x-3">
                <div className="relative flex-1 max-w-lg">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search players or matches..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-200 bg-brand-white dark:bg-gray-700 text-brand-black dark:text-brand-white"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                      setOpen(true);
                      maybeLoadData();
                    }}
                    onBlur={() => setTimeout(() => setOpen(false), 150)}
                  />

                  {open && (playerResults.length || matchResults.length) > 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                      {!!playerResults.length && (
                        <div className="py-2">
                          <div className="px-3 py-1 text-xs uppercase tracking-wide text-gray-500">Players</div>
                          {playerResults.slice(0, 6).map(p => (
                            <button
                              key={p.id}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => onSelectPlayer?.(p.name)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hoverbg-gray-700"
                            >
                              <div className="text-sm text-brand-black dark:text-brand-white">{p.name}</div>
                              <div className="text-xs text-gray-500">{p.position ?? '—'} {p.number != null ? `• #${p.number}` : ''}</div>
                            </button>
                          ))}
                        </div>
                      )}

                      {!!matchResults.length && (
                        <div className="py-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="px-3 py-1 text-xs uppercase tracking-wide text-gray-500">Matches</div>
                          {matchResults.slice(0, 6).map(m => (
                            <button
                              key={m.id}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => onSelectMatch?.(m.id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <div className="text-sm text-brand-black dark:text-brand-white">
                                {fmtDate(m.match_date)} vs {m.opponent} ({m.home_away})
                              </div>
                              <div className="text-xs text-gray-500">{m.competition ?? '—'}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Live chips */}
                {/*
                <div className="hidden md:flex items-center space-x-2">
                  <Chip
                    label={
                      next
                        ? `Next: ${next.match_date} vs ${next.opponent} (${next.home_away})`
                        : loading
                        ? 'Next: …'
                        : 'No upcoming match'
                    }
                  />
                  <Chip
                    label={
                      winRate !== null
                        ? `Win ${winRate.toFixed(0)}%`
                        : error
                        ? 'Win —'
                        : 'Win …'
                    }
                  />
                  <Chip label={engagementLabel} />
                </div>
                */}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {userRole === 'coach' && (
                <button
                  onClick={onToggleNotifications}
                  className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-orange text-white text-[10px] leading-[18px] text-center">
                      {notificationsCount}
                    </span>
                  )}
                </button>
              )}

              {userRole === 'coach' && (
                <button
                  onClick={onShowTeamRoster}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Team roster"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
              )}

              {userRole ? (
                <div className="flex items-center space-x-2">
                  <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-medium">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Logout"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Login"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={onLogin}
      />
    </>
  );
};

/* tiny chip component */
function Chip({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 whitespace-nowrap">
      {label}
    </span>
  );
}



// export const Header: React.FC<HeaderProps> = ({ userRole, onLogin, onLogout, onShowTeamRoster, onGoHome }) => {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <>
//       <header className="bg-brand-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-3">
//             <button 
//               onClick={onGoHome}
//               className="w-8 h-8 bg-gradient-to-br from-brand-orange via-brand-orange-light to-brand-orange-dark rounded-full flex items-center justify-center relative overflow-hidden hover:scale-110 transition-transform"
//             >
//               {/* Basketball pattern lines */}
//               <div className="absolute inset-0">
//                 <div className="absolute top-0 left-1/2 w-px h-full bg-brand-white transform -translate-x-1/2"></div>
//                 <div className="absolute top-1/2 left-0 w-full h-px bg-brand-white transform -translate-y-1/2"></div>
//                 <div className="absolute top-1/4 left-1/4 w-1/2 h-px bg-brand-white transform rotate-45 origin-center"></div>
//                 <div className="absolute top-3/4 left-1/4 w-1/2 h-px bg-brand-white transform -rotate-45 origin-center"></div>
//               </div>
//             </button>
//             <button 
//               onClick={onGoHome}
//               className="text-xl font-bold text-brand-black dark:text-brand-white hover:text-brand-orange transition-colors"
//             >
//               Coach Vision
//             </button>
//           </div>

//           {/* Search */}
//           <div className="flex-1 max-w-lg mx-8">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search players, stats, matches..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent transition-all duration-200 bg-brand-white dark:bg-gray-700 text-brand-black dark:text-brand-white"
//               />
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={toggleTheme}
//               className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//             >
//               {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
//             </button>
//             {userRole === 'coach' && (
//               <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
//                 <Bell className="w-5 h-5" />
//               </button>
//             )}
//             {userRole === 'coach' && (
//               <button 
//                 onClick={onShowTeamRoster}
//                 className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//               >
//                 <Grid3X3 className="w-5 h-5" />
//               </button>
//             )}
//             {userRole ? (
//               <div className="flex items-center space-x-2">
//                 <div className="bg-brand-orange/10 text-brand-orange px-3 py-1 rounded-full text-sm font-medium">
//                   {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
//                 </div>
//                 <button 
//                   onClick={onLogout}
//                   className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <User className="w-5 h-5" />
//                 </button>
//               </div>
//             ) : (
//               <button 
//                 onClick={() => setShowLoginModal(true)}
//                 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <User className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
      
//       <LoginModal
//         isOpen={showLoginModal}
//         onClose={() => setShowLoginModal(false)}
//         onLogin={onLogin}
//       />
//     </>
//   );
// };

