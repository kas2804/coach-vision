// import React, { useState } from 'react';
// import { User, X, LogIn } from 'lucide-react';

// interface LoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onLogin: (role: 'coach' | 'athlete', playerName?: string) => void;
// }

// export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
//   const [selectedRole, setSelectedRole] = useState<'coach' | 'athlete' | null>(null);
//   const [showAthleteLogin, setShowAthleteLogin] = useState(false);
//   const [showCoachLogin, setShowCoachLogin] = useState(false);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loginError, setLoginError] = useState('');

//   const playerNames = [
//     'Alex Thompson', 'Brandon Miller', 'Carlos Rodriguez', 'David Chen', 'Ethan Williams',
//     'Felix Garcia', 'Gabriel Santos', 'Hassan Ahmed', 'Isaac Johnson', 'Marcus Johnson',
//     'Jake Wilson', 'Kevin Brown', 'Luis Martinez', 'Michael Davis', 'Nathan Lee',
//     'Oliver Smith', 'Patrick O\'Connor', 'Ryan Taylor', 'Samuel Jackson', 'Tyler Anderson'
//   ];

//   if (!isOpen) return null;

//   const handleRoleSelect = (role: 'coach' | 'athlete') => {
//     setSelectedRole(role);
//     if (role === 'athlete') {
//       setShowAthleteLogin(true);
//     } else if (role === 'coach') {
//       setShowCoachLogin(true);
//     }
//   };

//   const handleLogin = () => {
//     if (selectedRole === 'coach') {
//       // Validate coach login
//       if (!username || !password) {
//         setLoginError('Please enter both username and password');
//         return;
//       }
      
//       if (username !== 'Coach Wilson') {
//         setLoginError('Invalid username');
//         return;
//       }
      
//       if (password !== 'coach') {
//         setLoginError('Incorrect password');
//         return;
//       }
      
//       onLogin('coach');
//       onClose();
//       // Reset form
//       setUsername('');
//       setPassword('');
//       setLoginError('');
//       setShowCoachLogin(false);
//       setSelectedRole(null);
//     } else if (selectedRole === 'athlete') {
//       // Validate athlete login
//       if (!username || !password) {
//         setLoginError('Please enter both username and password');
//         return;
//       }
      
//       if (!playerNames.includes(username)) {
//         setLoginError('Player name not found');
//         return;
//       }
      
//       if (password !== 'Lakers') {
//         setLoginError('Incorrect password');
//         return;
//       }
      
//       onLogin('athlete', username);
//       onClose();
//       // Reset form
//       setUsername('');
//       setPassword('');
//       setLoginError('');
//       setShowAthleteLogin(false);
//       setSelectedRole(null);
//     }
//   };

//   const handleBack = () => {
//     if (showAthleteLogin) {
//       setShowAthleteLogin(false);
//     } else if (showCoachLogin) {
//       setShowCoachLogin(false);
//     }
//     setSelectedRole(null);
//     setUsername('');
//     setPassword('');
//     setLoginError('');
//   };

//   const handleClose = () => {
//     onClose();
//     setShowAthleteLogin(false);
//     setShowCoachLogin(false);
//     setSelectedRole(null);
//     setUsername('');
//     setPassword('');
//     setLoginError('');
//   };

//   return (
//     <div className="fixed inset-0 bg-brand-black/50 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-brand-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-brand-black">
//             {showAthleteLogin ? 'Athlete Login' : showCoachLogin ? 'Coach Login' : 'Login to Coach Vision'}
//           </h2>
//           <button
//             onClick={handleClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>
        
//         {showCoachLogin ? (
//           <div className="space-y-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Coach Wilson"
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
//               />
//             </div>
            
//             {loginError && (
//               <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
//                 {loginError}
//               </div>
//             )}
            
//             <div className="flex space-x-3">
//               <button
//                 onClick={handleBack}
//                 className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={handleLogin}
//                 className="flex-1 bg-brand-orange text-brand-white py-3 rounded-xl font-semibold hover:bg-brand-orange-dark transition-all"
//               >
//                 Login
//               </button>
//             </div>
//           </div>
//         ) : showAthleteLogin ? (
//           <div className="space-y-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Player Name
//               </label>
//               <select
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
//               >
//                 <option value="">Select your name</option>
//                 {playerNames.map(name => (
//                   <option key={name} value={name}>{name}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
//               />
//             </div>
            
//             {loginError && (
//               <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
//                 {loginError}
//               </div>
//             )}
            
//             <div className="flex space-x-3">
//               <button
//                 onClick={handleBack}
//                 className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={handleLogin}
//                 className="flex-1 bg-brand-orange text-brand-white py-3 rounded-xl font-semibold hover:bg-brand-orange-dark transition-all"
//               >
//                 Login
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="space-y-4 mb-6">
//           <div
//               onClick={() => handleRoleSelect('coach')}
//             className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
//               selectedRole === 'coach'
//                 ? 'border-brand-orange bg-brand-orange/10'
//                 : 'border-gray-200 hover:border-brand-orange/50'
//             }`}
//           >
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center">
//                 <User className="w-6 h-6 text-brand-white" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-brand-black">Coach</h3>
//                 <p className="text-sm text-gray-600">Access team management dashboard</p>
//               </div>
//             </div>
//           </div>
          
//           <div
//               onClick={() => handleRoleSelect('athlete')}
//             className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
//               selectedRole === 'athlete'
//                 ? 'border-brand-orange bg-brand-orange/10'
//                 : 'border-gray-200 hover:border-brand-orange/50'
//             }`}
//           >
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-brand-orange-light rounded-full flex items-center justify-center">
//                 <User className="w-6 h-6 text-brand-white" />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-brand-black">Athlete</h3>
//                 <p className="text-sm text-gray-600">View personal performance metrics</p>
//               </div>
//             </div>
//           </div>
//         </div>
            
//         <button
//           onClick={handleLogin}
//               disabled={!selectedRole}
//           className={`w-full py-3 rounded-2xl font-semibold transition-all ${
//               selectedRole
//               ? 'bg-brand-orange text-brand-white hover:bg-brand-orange-dark'
//               : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//           }`}
//         >
//               {selectedRole ? `Continue as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}` : 'Select Role'}
//         </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };
import React, { useEffect, useState } from 'react';
import { User, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: 'coach' | 'athlete'| 'admin', playerName?: string) => void;
}

type PlayerRow = {
  id: number;
  number: number;
  name: string;
  position: string;
  height: string;
  initials: string;
};

const FALLBACK_PLAYERS = [
  'Alex Thompson','Brandon Miller','Carlos Rodriguez','David Chen','Ethan Williams',
  'Felix Garcia','Gabriel Santos','Hassan Ahmed','Isaac Johnson','Marcus Johnson',
  'Jake Wilson','Kevin Brown','Luis Martinez','Michael Davis','Nathan Lee',
  "Patrick O'Connor",'Oliver Smith','Ryan Taylor','Samuel Jackson','Tyler Anderson',
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'coach' | 'athlete' | 'admin' | null>(null);
  const [showAthleteLogin, setShowAthleteLogin] = useState(false);
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Live players from API
  const [players, setPlayers] = useState<string[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [playersError, setPlayersError] = useState<string | null>(null);

  // fetch players ONCE when modal mounts (safe hooks order)
  useEffect(() => {
    if (!isOpen) return;
    setLoadingPlayers(true);
    setPlayersError(null);

    fetch('/api/players')
      .then(r => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((rows: PlayerRow[]) => {
        const names = rows.map(r => r.name).filter(Boolean);
        setPlayers(names.length ? names : FALLBACK_PLAYERS);
      })
      .catch(() => {
        setPlayers(FALLBACK_PLAYERS);
        setPlayersError('Could not load players; using fallback list.');
      })
      .finally(() => setLoadingPlayers(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRoleSelect = (role: 'coach' | 'athlete' | 'admin') => {
    setSelectedRole(role);
    if (role === 'athlete') {
      setShowAthleteLogin(true);
    } else if (role === 'coach') {
      setShowCoachLogin(true);
    } else if (role === 'admin') {
      setShowAdminLogin(true);
    }
    setLoginError('');
  };

  const handleLogin = () => {
    if (selectedRole === 'coach') {
      if (!username || !password) return setLoginError('Please enter both username and password');
      if (username !== 'Coach Wilson') return setLoginError('Invalid username');
      if (password !== 'coach') return setLoginError('Incorrect password');

      onLogin('coach');
      resetAndClose();
      return;
    }

    if (selectedRole === 'athlete') {
      if (!username || !password) return setLoginError('Please enter both username and password');
      if (!players.includes(username)) return setLoginError('Player name not found');
      if (password !== 'Lakers') return setLoginError('Incorrect password');

      onLogin('athlete', username);
      resetAndClose();
      return;
    }

    if (selectedRole === 'admin') {
      // Validate admin login
      if (!username || !password) {
        setLoginError('Please enter both username and password');
        return;
      }
      if (username !== 'Admin') {
        setLoginError('Invalid username');
        return;
      }
      if (password !== 'Neon') {
        setLoginError('Incorrect password');
        return;
      }
      // Redirect to Neon database console
      window.open('https://console.neon.tech/app/projects/fancy-frost-85573407', '_blank');
      onClose();
      // Reset form
      setUsername('');
      setPassword('');
      setLoginError('');
      setShowAdminLogin(false);
      setSelectedRole(null);
      return;
    }
  };

  const resetAndClose = () => {
    onClose();
    setShowAthleteLogin(false);
    setShowCoachLogin(false);
    setShowAdminLogin(false);
    setSelectedRole(null);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const handleBack = () => {
    setShowAthleteLogin(false);
    setShowCoachLogin(false);
    setShowAdminLogin(false);
    setSelectedRole(null);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  return (
    <div className="fixed inset-0 bg-brand-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-brand-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-brand-black">
            {showAthleteLogin ? 'Athlete Login' : showCoachLogin ? 'Coach Login' : 'Login to Coach Vision'}
          </h2>
          <button onClick={resetAndClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {showAdminLogin ? (
          <div className="space-y-4 mb-6">
            <Field label="Username">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </Field>
            {loginError && <ErrorMsg>{loginError}</ErrorMsg>}
            <div className="flex space-x-3">
              <Btn variant="secondary" onClick={handleBack}>Back</Btn>
              <Btn variant="primary" onClick={handleLogin}>Access Database</Btn>
            </div>
          </div>
        ) : showCoachLogin ? (
          <div className="space-y-4 mb-6">
            <Field label="Username">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Coach Wilson"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </Field>

            {loginError && <ErrorMsg>{loginError}</ErrorMsg>}

            <div className="flex space-x-3">
              <Btn variant="secondary" onClick={handleBack}>Back</Btn>
              <Btn variant="primary" onClick={handleLogin}>Login</Btn>
            </div>
          </div>
        ) : showAthleteLogin ? (
          <div className="space-y-4 mb-6">
            <Field label="Player Name">
              <select
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                disabled={loadingPlayers}
              >
                <option value="">{loadingPlayers ? 'Loading players…' : 'Select your name'}</option>
                {players.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              {playersError && <div className="mt-1 text-xs text-gray-500">{playersError}</div>}
            </Field>

            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              />
            </Field>

            {loginError && <ErrorMsg>{loginError}</ErrorMsg>}

            <div className="flex space-x-3">
              <Btn variant="secondary" onClick={handleBack}>Back</Btn>
              <Btn variant="primary" onClick={handleLogin} disabled={loadingPlayers || !players.length}>
                Login
              </Btn>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <RoleCard
                active={selectedRole === 'coach'}
                onClick={() => handleRoleSelect('coach')}
                title="Coach"
                subtitle="Access team management dashboard"
                tone="brand"
              />
              <RoleCard
                active={selectedRole === 'athlete'}
                onClick={() => handleRoleSelect('athlete')}
                title="Athlete"
                subtitle="View personal performance metrics"
                tone="light"
              />
              <div
                onClick={() => handleRoleSelect('admin')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedRole === 'admin'
                    ? 'border-brand-orange bg-brand-orange/10'
                    : 'border-gray-200 hover:border-brand-orange/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-orange-dark rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-brand-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black">Admin</h3>
                    <p className="text-sm text-gray-600">Access database console</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={!selectedRole}
              className={`w-full py-3 rounded-2xl font-semibold transition-all ${
                selectedRole
                  ? 'bg-brand-orange text-brand-white hover:bg-brand-orange-dark'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedRole ? `Continue as ${selectedRole[0].toUpperCase() + selectedRole.slice(1)}` : 'Select Role'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* Small presentational helpers */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
function ErrorMsg({ children }: { children: React.ReactNode }) {
  return <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{children}</div>;
}
function Btn({ variant, onClick, disabled, children }:{
  variant: 'primary' | 'secondary'; onClick?: () => void; disabled?: boolean; children: React.ReactNode;
}) {
  const cls =
    variant === 'primary'
      ? 'flex-1 bg-brand-orange text-brand-white py-3 rounded-xl font-semibold hover:bg-brand-orange-dark transition-all disabled:opacity-50'
      : 'flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all';
  return (
    <button onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
function RoleCard({ active, onClick, title, subtitle, tone }:{
  active: boolean; onClick: () => void; title: string; subtitle: string; tone: 'brand'|'light';
}) {
  const ring = active ? 'border-brand-orange bg-brand-orange/10' : 'border-gray-200 hover:border-brand-orange/50';
  const bubble =
    tone === 'brand'
      ? 'w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center'
      : 'w-12 h-12 bg-brand-orange-light rounded-full flex items-center justify-center';
  return (
    <div onClick={onClick} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${ring}`}>
      <div className="flex items-center space-x-3">
        <div className={bubble}>
          <User className="w-6 h-6 text-brand-white" />
        </div>
        <div>
          <h3 className="font-semibold text-brand-black">{title}</h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
