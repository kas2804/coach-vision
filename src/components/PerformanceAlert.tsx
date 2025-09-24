// import React from 'react';
// import { AlertTriangle, X, UserX, Clock } from 'lucide-react';

// interface Alert {
//   id: string;
//   type: 'fatigue' | 'absence' | 'injury';
//   title: string;
//   description: string;
//   player?: string;
//   severity: 'high' | 'medium' | 'low';
// }

// interface PerformanceAlertProps {
//   alert: Alert;
//   onClose: () => void;
// }

// export const PerformanceAlert: React.FC<PerformanceAlertProps> = ({ alert, onClose }) => {
//   const getAlertIcon = () => {
//     switch (alert.type) {
//       case 'fatigue':
//         return <Clock className="w-6 h-6" />;
//       case 'absence':
//         return <UserX className="w-6 h-6" />;
//       case 'injury':
//         return <AlertTriangle className="w-6 h-6" />;
//       default:
//         return <AlertTriangle className="w-6 h-6" />;
//     }
//   };

//   const getSeverityColor = () => {
//     switch (alert.severity) {
//       case 'high':
//         return 'bg-brand-orange-dark text-brand-white';
//       case 'medium':
//         return 'bg-brand-orange text-brand-white';
//       case 'low':
//         return 'bg-brand-orange-light text-brand-white';
//       default:
//         return 'bg-brand-orange text-brand-white';
//     }
//   };

//   return (
//     <div className="fixed top-4 right-4 z-50 animate-slide-in">
//       <div className={`${getSeverityColor()} rounded-2xl p-4 shadow-2xl max-w-sm`}>
//         <div className="flex items-start justify-between mb-2">
//           <div className="flex items-center space-x-2">
//             {getAlertIcon()}
//             <span className="font-semibold">{alert.title}</span>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-brand-white/20 rounded-full transition-colors"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//         <p className="text-sm opacity-90 mb-2">{alert.description}</p>
//         {alert.player && (
//           <p className="text-sm font-medium">Player: {alert.player}</p>
//         )}
//       </div>
//     </div>
//   );
// };
import React, { useEffect } from "react";
import { AlertTriangle, X, UserX, Clock } from "lucide-react";

interface Alert {
  id: string;
  type: "fatigue" | "absence" | "injury";
  title: string;
  description: string;
  player?: string;
  severity: "high" | "medium" | "low";
}

interface PerformanceAlertProps {
  alert: Alert;
  onClose: () => void;
  /** optional auto-dismiss in ms (e.g., 7000) */
  autoCloseMs?: number;
  /** optional extra classes for the card */
  className?: string;
}

export const PerformanceAlert: React.FC<PerformanceAlertProps> = ({
  alert,
  onClose,
  autoCloseMs,
  className = "",
}) => {
  useEffect(() => {
    if (!autoCloseMs) return;
    const id = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(id);
  }, [autoCloseMs, onClose]);

  const icon =
    alert.type === "fatigue" ? (
      <Clock className="w-6 h-6" />
    ) : alert.type === "absence" ? (
      <UserX className="w-6 h-6" />
    ) : (
      <AlertTriangle className="w-6 h-6" />
    );

  const tone =
    alert.severity === "high"
      ? "bg-brand-orange-dark text-brand-white"
      : alert.severity === "medium"
      ? "bg-brand-orange text-brand-white"
      : "bg-brand-orange-light text-brand-white";

  return (
    // No 'fixed' here—parent decides placement
    <div
      role="alert"
      aria-live="assertive"
      className={`${tone} rounded-2xl p-4 shadow-2xl max-w-sm ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-semibold">{alert.title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-brand-white/20 rounded-full transition-colors"
          aria-label="Dismiss alert"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm opacity-90 mb-2">{alert.description}</p>
      {alert.player && (
        <p className="text-sm font-medium">Player: {alert.player}</p>
      )}
    </div>
  );
};
