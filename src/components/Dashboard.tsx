import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './Header';
import { AthleteDashboard } from './AthleteDashboard';
import { TeamRosterPage } from './TeamRosterPage';
import { MainMatchCard } from './MainMatchCard';
import { TrainingIntensityCard } from './TrainingIntensityCard';
import { PlayerEngagementCard } from './PlayerEngagementCard';
import { TrainingDetailsCard } from './TrainingDetailsCard';
import { PlayerWellnessCard } from './PlayerWellnessCard';
import { PlayerProgressCard } from './PlayerProgressCard';
import { RecoveryCard } from './RecoveryCard';
import { AlertsCard } from './AlertsCard';
// import { UpdatesCard } from './UpdatesCard';
import { PerformanceAlert } from './PerformanceAlert';
import { LoginModal } from './LoginModal';
import { useCoachAlerts } from '../hooks/useCoachAlerts';

export const Dashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<'coach' | 'athlete' | 'admin' | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [showTeamRoster, setShowTeamRoster] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // NEW: live alerts for coaches
  const { alerts: liveAlerts } = useCoachAlerts(userRole === 'coach', 15000);

  // track alerts the user dismissed locally (so they don't reappear until a reload)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const alerts = useMemo(
    () => liveAlerts.filter(a => !dismissedIds.has(a.id)),
    [liveAlerts, dismissedIds]
  );
  const removeAlert = (alertId: string) =>
    setDismissedIds(prev => new Set(prev).add(alertId));

  // notifications drawer state (shows dismissed alerts history)
  const [showNotifications, setShowNotifications] = useState(false);

  // Keep a local history of dismissed alerts for viewing later in the bell panel
  const [dismissedHistory, setDismissedHistory] = useState<typeof liveAlerts>([]);
  useEffect(() => {
    // whenever dismissedIds changes, move matching live alerts into history (dedupe by id)
    const newlyDismissed = liveAlerts.filter(a => dismissedIds.has(a.id));
    if (newlyDismissed.length) {
      setDismissedHistory(prev => {
        const map = new Map(prev.map(a => [a.id, a]));
        newlyDismissed.forEach(a => map.set(a.id, a));
        return Array.from(map.values());
      });
    }
  }, [dismissedIds, liveAlerts]);

  const matchRef = useRef<HTMLDivElement | null>(null);

  const handleLogin = (role: 'coach' | 'athlete' | 'admin', playerName?: string) => {
    setUserRole(role);
    if (role === 'athlete' && playerName) {
      setCurrentPlayer(playerName);
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPlayer('');
    setShowTeamRoster(false);
    // clear dismissed on logout
    setDismissedIds(new Set());
  };

  const handleGoHome = () => {
    setUserRole(null);
    setCurrentPlayer('');
    setShowTeamRoster(false);
    setDismissedIds(new Set());
  };

  // Admin view (optional: you can add a custom admin dashboard here)
  if (userRole === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col items-center justify-center">
        <Header
          userRole={userRole}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onShowTeamRoster={() => setShowTeamRoster(true)}
          onGoHome={handleGoHome}
        />
        <div className="text-center mt-32">
          <h1 className="text-4xl font-bold mb-4">Admin Console</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">You are logged in as <span className="font-semibold">Admin</span>.</p>
          <a
            href="https://console.neon.tech/app/projects/fancy-frost-85573407"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-orange text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-brand-orange-dark transition-all shadow-lg"
          >
            Open Neon Database Console
          </a>
        </div>
      </div>
    );
  }

  // Athlete view
  if (userRole === 'athlete') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header
          userRole={userRole}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onShowTeamRoster={() => setShowTeamRoster(true)}
          onGoHome={handleGoHome}
        />
        <AthleteDashboard playerName={currentPlayer} />
      </div>
    );
  }

  // Coach roster page
  if (userRole === 'coach' && showTeamRoster) {
    return (
      <TeamRosterPage onBack={() => setShowTeamRoster(false)} onGoHome={handleGoHome} />
    );
  }

  // Logged-out landing
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header
          userRole={userRole}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onShowTeamRoster={() => setShowTeamRoster(true)}
          onGoHome={handleGoHome}
        />
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
          {/* Floating orbs */}
          <div className="absolute top-20 left-10 w-16 h-16 bg-brand-orange/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-40 right-20 w-12 h-12 bg-brand-orange-light/10 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-32 left-20 w-20 h-20 bg-brand-orange-dark/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <div className="absolute bottom-20 right-10 w-14 h-14 bg-brand-orange/10 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />

          <div className="text-center relative z-10 max-w-4xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold mb-4">
                <span className="stroke-text text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-orange-light to-brand-orange-dark">
                  Welcome to
                </span>
              </h1>
              <h2 className="text-7xl md:text-9xl font-black">
                <span className="stroke-text-large text-transparent bg-clip-text bg-gradient-to-r from-brand-orange-dark via-brand-orange to-brand-orange-light animate-pulse">
                  COACH VISION
                </span>
              </h2>
            </div>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 font-medium">
              <span className="typing-animation">Elevate your team's performance with data-driven insights</span>
            </p>

            <div className="space-y-6">
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-gradient-to-r from-brand-orange to-brand-orange-light text-brand-white px-12 py-4 rounded-2xl font-bold text-xl hover:from-brand-orange-dark hover:to-brand-orange transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-brand-orange/25"
              >
                Login to Get Started
              </button>
            </div>
          </div>
        </main>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  // Coach dashboard layout
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header
        userRole={userRole}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onShowTeamRoster={() => setShowTeamRoster(true)}
        onGoHome={handleGoHome}
        onToggleNotifications={() => setShowNotifications(s => !s)}
        notificationsCount={alerts.length}
        onSelectPlayer={(name) => {
          setUserRole('athlete');
          setCurrentPlayer(name);
        }}
        onSelectMatch={(_id) => {
          // We currently show only the next match in MainMatchCard; scroll to it
          if (matchRef.current) {
            matchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Row 1: Main + Sidebar */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8">
              <div ref={matchRef} className="h-full min-h-[320px]">
                <MainMatchCard />
              </div>
            </div>
            <div className="xl:col-span-4">
              <div className="h-full min-h-[320px]">
                <TrainingIntensityCard />
              </div>
            </div>
          </div>

          {/* Row 2: Four equal tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="h-full min-h-[220px]">
              <PlayerEngagementCard />
            </div>
            <div className="h-full min-h-[220px]">
              <TrainingDetailsCard />
            </div>
            <div className="h-full min-h-[220px]">
              <PlayerWellnessCard />
            </div>
            <div className="h-full min-h-[220px]">
              <RecoveryCard />
            </div>
          </div>

          {/* Row 3: Progress wide + Alerts side */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8">
              <div className="h-full min-h-[300px]">
                <PlayerProgressCard />
              </div>
            </div>
            <div className="xl:col-span-4">
              <div className="h-full min-h-[300px]">
                <AlertsCard />
              </div>
            </div>
          </div>

          {/* Optional extra column
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
             <div className="xl:col-span-4">
               <UpdatesCard />
             </div>
           </div> */}
        </div>
      </main>

      {/* Floating alerts stacked top-right */}
      {alerts.map((alert, index) => (
        <div
          key={alert.id}
          className="fixed right-4 z-50"
          style={{ top: `${4 + index * 120}px` }}
        >
          <PerformanceAlert
            alert={alert}
            onClose={() => removeAlert(alert.id)}
            // autoCloseMs={7000} // enable if you added optional auto-dismiss
          />
        </div>
      ))}

      {/* Notifications Drawer (right panel) */}
      {userRole === 'coach' && showNotifications && (
        <div className="fixed top-16 right-0 w-full sm:w-96 h-[calc(100%-4rem)] bg-brand-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="font-semibold text-brand-black dark:text-brand-white">Notifications</div>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Close
            </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-3">
            {alerts.length === 0 && dismissedHistory.length === 0 && (
              <div className="text-sm text-gray-500">No notifications yet.</div>
            )}

            {alerts.map(a => (
              <div key={`live-${a.id}`} className="p-3 rounded-xl bg-brand-orange/10">
                <div className="flex items-start justify-between">
                  <div className="text-sm font-medium text-brand-black dark:text-brand-white">{a.title}</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-orange text-white">Live</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{a.description}</div>
                <div className="mt-2 flex justify-end">
                  <button onClick={() => removeAlert(a.id)} className="text-xs text-brand-orange hover:underline">Dismiss</button>
                </div>
              </div>
            ))}

            {dismissedHistory.length > 0 && (
              <div className="pt-2">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Dismissed</div>
                <div className="space-y-2">
                  {dismissedHistory.map(a => (
                    <div key={`old-${a.id}`} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700">
                      <div className="text-sm font-medium text-brand-black dark:text-brand-white">{a.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{a.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
