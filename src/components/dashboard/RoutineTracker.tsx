"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

const DEFAULT_ROUTINES = [
  { id: "mewing", label: "Mewing (full tongue posture, all day)", category: "Face", duration: "All day" },
  { id: "chew", label: "Mastic gum chewing", category: "Face", duration: "20–30 min" },
  { id: "skincare-am", label: "AM: Cleanser → Vitamin C → Niacinamide → SPF", category: "Skin", duration: "5 min" },
  { id: "skincare-pm", label: "PM: Double cleanse → Active → Moisturiser", category: "Skin", duration: "5 min" },
  { id: "chin-tuck", label: "Chin tucks (3×15, hold 5s)", category: "Posture", duration: "5 min" },
  { id: "wall-slide", label: "Wall slides (3×12)", category: "Posture", duration: "3 min" },
  { id: "hip-flexor-stretch", label: "Hip flexor stretch (60s each side)", category: "Posture", duration: "5 min" },
  { id: "foam-roll", label: "Thoracic foam rolling", category: "Posture", duration: "5 min" },
  { id: "workout", label: "Resistance training session", category: "Physique", duration: "60 min" },
  { id: "protein", label: "Hit protein target (body weight × 2.0g)", category: "Physique", duration: "—" },
  { id: "steps", label: "≥8,000 steps (NEAT)", category: "Physique", duration: "All day" },
  { id: "sleep", label: "7–9h sleep, 17–19°C, no screens −90 min", category: "Recovery", duration: "7–9 h" },
  { id: "hair-minox", label: "Minoxidil 5% (AM + PM application)", category: "Hair", duration: "3 min" },
  { id: "scalp-massage", label: "4 min scalp massage", category: "Hair", duration: "4 min" },
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

  const insecs = userProfile?.insecurities ?? [];
  const relevantRoutines = insecs.length
    ? DEFAULT_ROUTINES.filter((r) => {
        if (r.category === "Face" && insecs.some((i) => ["jawline", "mewing", "eye-area", "jaw-fat"].includes(i))) return true;
        if (r.category === "Skin" && insecs.some((i) => ["acne", "hyperpigmentation", "dark-circles", "skincare-routine"].includes(i))) return true;
        if (r.category === "Posture" && insecs.some((i) => ["forward-head", "shoulder-asymmetry", "anterior-pelvic"].includes(i))) return true;
        if (r.category === "Physique" && insecs.some((i) => ["body-fat", "muscle-mass", "shoulder-width"].includes(i))) return true;
        if (r.category === "Hair" && insecs.some((i) => ["hair-loss", "hair-texture"].includes(i))) return true;
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
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[#848484] text-[10px] tracking-widest uppercase">Daily Adherence</span>
          <span className="text-[#5ab3cc] font-bold font-mono">{pct}%</span>
        </div>
        <div className="h-0.5 bg-[rgba(255,255,255,0.04)]">
          <div className="h-full bg-[#5ab3cc] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[9px] text-[#2a2a2e] mt-1">
          {completed.size} / {relevantRoutines.length} completed today
        </p>
      </div>

      <div className="space-y-5">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-[9px] tracking-[2px] text-[#2a2a2e] uppercase mb-2 border-b border-[rgba(255,255,255,0.03)] pb-1">
              {cat}
            </p>
            <div className="space-y-1">
              {relevantRoutines
                .filter((r) => r.category === cat)
                .map((r) => (
                  <button
                    key={r.id}
                    onClick={() => toggleItem(r.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs border transition-all ${
                      completed.has(r.id)
                        ? "border-[rgba(82,183,136,0.15)] bg-[rgba(82,183,136,0.03)] text-[#848484]"
                        : "border-[rgba(255,255,255,0.04)] hover:border-[rgba(90,179,204,0.12)] text-[#c0c0c0]"
                    }`}
                  >
                    <span className={`w-4 h-4 flex-shrink-0 border flex items-center justify-center text-[8px] ${
                      completed.has(r.id)
                        ? "border-[#52b788] text-[#52b788]"
                        : "border-[rgba(255,255,255,0.12)]"
                    }`}>
                      {completed.has(r.id) ? "✓" : ""}
                    </span>
                    <span className={completed.has(r.id) ? "line-through opacity-40" : ""}>
                      {r.label}
                    </span>
                    <span className="ml-auto text-[9px] text-[#2a2a2e] flex-shrink-0">{r.duration}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
