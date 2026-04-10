"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

const DEFAULT_ROUTINES = [
  { id: "mewing", label: "Mewing (tongue posture)", category: "Face", duration: "All day" },
  { id: "chew", label: "Mastic gum chewing (20 min)", category: "Face", duration: "20min" },
  { id: "skincare-am", label: "AM Skincare (Vit C → SPF)", category: "Skin", duration: "5min" },
  { id: "skincare-pm", label: "PM Skincare (Tret → Moisturizer)", category: "Skin", duration: "5min" },
  { id: "posture-check", label: "Posture check / wall stand", category: "Posture", duration: "10min" },
  { id: "chin-tuck", label: "Chin tucks (3×15)", category: "Posture", duration: "5min" },
  { id: "workout", label: "Resistance training", category: "Physique", duration: "60min" },
  { id: "protein", label: "Protein target (body weight ×2g)", category: "Physique", duration: "—" },
  { id: "sleep", label: "Sleep ≥7h (growth hormone)", category: "Recovery", duration: "7-9h" },
];

export function RoutineTracker() {
  const { userProfile } = useAppStore();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const relevantRoutines = userProfile?.insecurities?.length
    ? DEFAULT_ROUTINES.filter((r) => {
        const insecs = userProfile.insecurities ?? [];
        if (r.category === "Face" && insecs.some((i) => ["jawline", "mewing", "eye-area"].includes(i))) return true;
        if (r.category === "Skin" && insecs.some((i) => ["acne", "hyperpigmentation", "dark-circles", "skincare-routine"].includes(i))) return true;
        if (r.category === "Posture" && insecs.some((i) => ["forward-head", "shoulder-asymmetry", "anterior-pelvic"].includes(i))) return true;
        if (r.category === "Physique" && insecs.some((i) => ["body-fat", "muscle-mass", "shoulder-width"].includes(i))) return true;
        if (r.category === "Recovery") return true;
        return false;
      })
    : DEFAULT_ROUTINES;

  const pct = relevantRoutines.length > 0
    ? Math.round((completed.size / relevantRoutines.length) * 100)
    : 0;

  const categories = [...new Set(relevantRoutines.map((r) => r.category))];

  return (
    <div className="p-4">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[#a0a0a0] text-[10px] tracking-widest uppercase">Daily Adherence</span>
          <span className="text-[#00bfff] font-bold font-mono">{pct}%</span>
        </div>
        <div className="h-1 bg-[rgba(255,255,255,0.05)]">
          <div
            className="h-full bg-[#00bfff] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[9px] text-[#3a3a3a] mt-1">
          {completed.size} / {relevantRoutines.length} completed today
        </p>
      </div>

      {/* Routines by category */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-[9px] tracking-[2px] text-[#3a3a3a] uppercase mb-2">{cat}</p>
            <div className="space-y-1">
              {relevantRoutines
                .filter((r) => r.category === cat)
                .map((r) => (
                  <button
                    key={r.id}
                    onClick={() => toggleItem(r.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs border transition-all ${
                      completed.has(r.id)
                        ? "border-[rgba(0,255,0,0.2)] bg-[rgba(0,255,0,0.04)] text-[#a0a0a0]"
                        : "border-[rgba(255,255,255,0.04)] hover:border-[rgba(0,191,255,0.15)] text-[#c0c0c0]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 flex-shrink-0 border flex items-center justify-center text-[8px] ${
                        completed.has(r.id)
                          ? "border-[#00ff00] text-[#00ff00]"
                          : "border-[rgba(255,255,255,0.15)]"
                      }`}
                    >
                      {completed.has(r.id) ? "✓" : ""}
                    </span>
                    <span className={completed.has(r.id) ? "line-through opacity-50" : ""}>
                      {r.label}
                    </span>
                    <span className="ml-auto text-[9px] text-[#3a3a3a]">{r.duration}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
