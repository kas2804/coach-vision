// src/hooks/useCoachAlerts.ts
import { useEffect, useRef, useState } from "react";

export type CoachAlert = {
  id: string;
  type: "fatigue" | "absence" | "injury";
  title: string;
  description: string;
  player?: string;
  severity: "high" | "medium" | "low";
};

export function useCoachAlerts(enabled: boolean, pollMs = 15000) {
  const [alerts, setAlerts] = useState<CoachAlert[]>([]);
  const timerRef = useRef<number | null>(null);

  const fetchOnce = async () => {
    if (!enabled) return;
    try {
      const r = await fetch("/api/coach/alerts");
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      if (Array.isArray(j)) setAlerts(j);
    } catch (e) {
      // keep silent in UI; devs can open console
      // console.error("alerts fetch failed:", e);
    }
  };

  useEffect(() => {
    if (!enabled) {
      setAlerts([]);
      return;
    }
    fetchOnce();
    if (pollMs > 0) {
      timerRef.current = window.setInterval(fetchOnce, pollMs);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [enabled, pollMs]);

  return { alerts, refresh: fetchOnce };
}
