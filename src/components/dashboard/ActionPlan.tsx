"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

interface Protocol {
  id: string;
  title: string;
  category: string;
  timeframe: string;
  steps: string[];
  tags: string[];
}

const PROTOCOLS: Protocol[] = [
  {
    id: "acne-stack",
    title: "Acne / Texture Protocol",
    category: "Skin",
    timeframe: "8-12 weeks",
    tags: ["acne", "skincare-routine"],
    steps: [
      "AM: Gentle cleanser → Niacinamide 10% → SPF50+",
      "PM: Oil cleanser → Salicylic acid 2% (4x/week) → Moisturizer",
      "3×/week PM: Tretinoin 0.025% (titrate up over 8 weeks)",
      "Diet: Eliminate dairy + high-GI foods for 4 weeks to identify correlation",
      "Do NOT layer actives: Niacinamide + Vitamin C = niacin flush risk",
    ],
  },
  {
    id: "hyperpig-stack",
    title: "Hyperpigmentation Protocol",
    category: "Skin",
    timeframe: "12-16 weeks",
    tags: ["hyperpigmentation"],
    steps: [
      "AM: Vitamin C (L-ascorbic acid 15-20%) → SPF50+ (NON-NEGOTIABLE)",
      "PM: Azelaic acid 15-20% OR Alpha arbutin 2%",
      "Weekly: AHA 10% glycolic acid exfoliation",
      "SPF is the protocol. Without it, every other step is placebo.",
      "Expected visible improvement: 10-12 weeks consistent use",
    ],
  },
  {
    id: "dark-circles",
    title: "Periorbital Dark Circles",
    category: "Skin",
    timeframe: "6-8 weeks",
    tags: ["dark-circles", "eye-area"],
    steps: [
      "Identify cause first: vascular (blue/purple) vs. pigment (brown) vs. structural (hollow)",
      "Vascular: Caffeine eye cream → improve sleep quality to 7-9h",
      "Pigment: Retinol + Vitamin C spot application (gentle)",
      "Structural: Facial fat loss will worsen — maintain healthy weight",
      "Cold compress AM reduces temporary vascular pooling",
    ],
  },
  {
    id: "mewing-protocol",
    title: "Facial Structure (Mewing)",
    category: "Face",
    timeframe: "12-24 months",
    tags: ["mewing", "jawline"],
    steps: [
      "Full tongue on palate — tip behind upper incisors, back third elevated",
      "Lips sealed, teeth lightly touching or 1-2mm apart",
      "Nasal breathing only — mouth tape during sleep if necessary",
      "Supplement: Mastic gum 30min/day for masseter hypertrophy",
      "Timeline: Soft tissue changes 3-6mo. Hard tissue (suture remodeling): years. Evidence is limited.",
    ],
  },
  {
    id: "forward-head",
    title: "Forward Head Posture Correction",
    category: "Posture",
    timeframe: "8-12 weeks",
    tags: ["forward-head", "shoulder-asymmetry"],
    steps: [
      "Chin tucks: 3 sets × 15 reps daily. Pull chin straight back, hold 5s",
      "Deep cervical flexor activation: lower jaw resistance exercises",
      "Stretch: Levator scapulae + upper traps 30s × 3 daily",
      "Strengthen: Rhomboids, lower traps — face pulls, band pull-aparts",
      "Screen position: eye level at top third of monitor",
    ],
  },
  {
    id: "body-fat",
    title: "Body Fat Reduction Protocol",
    category: "Physique",
    timeframe: "12-24 weeks",
    tags: ["body-fat", "muscle-mass"],
    steps: [
      "Caloric deficit: 300-500kcal/day below TDEE (1-1.5lb/week max)",
      "Protein: 2.0-2.4g/kg bodyweight to preserve lean mass",
      "Resistance training 3-5×/week during cut — muscle retention requires stimulus",
      "Cardio: LISS 150min/week OR HIIT 75min/week",
      "Track: Weekly average weight (not daily) to remove variance noise",
    ],
  },
  {
    id: "shoulder-width",
    title: "Shoulder Width Development",
    category: "Physique",
    timeframe: "16-24 weeks",
    tags: ["shoulder-width", "muscle-mass"],
    steps: [
      "Priority: Lateral deltoid head — lateral raises 4×15-20",
      "Overhead press (barbell or dumbbell) 3×5-8 heavy — foundational",
      "Rear delt: Face pulls 3×15-20 — critical for health + width illusion",
      "Frequency: 2×/week direct shoulder work minimum",
      "Clavicle length is genetic — maximize what's buildable",
    ],
  },
  {
    id: "hair-loss",
    title: "Hair Loss / Miniaturization",
    category: "Hair",
    timeframe: "6-12 months",
    tags: ["hair-loss"],
    steps: [
      "First: Dermatologist diagnosis — AGA vs. telogen effluvium vs. nutritional",
      "Androgenetic: Minoxidil 5% (topical) + Finasteride 1mg/day (if acceptable)",
      "Nutritional: Ferritin <50 = likely contributor. Iron supplementation.",
      "Dermarolling 0.5mm weekly + minoxidil = enhanced absorption",
      "Results timeline: 6-12 months minimum for visible regrowth",
    ],
  },
];

export function ActionPlan() {
  const { userProfile } = useAppStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  const relevantProtocols = userProfile?.insecurities?.length
    ? PROTOCOLS.filter((p) =>
        p.tags.some((tag) => userProfile.insecurities?.includes(tag))
      )
    : PROTOCOLS.slice(0, 4);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[9px] tracking-[3px] text-[#3a3a3a] uppercase">
            PERSONALIZED
          </p>
          <p className="text-sm font-bold text-white">Action Plan</p>
        </div>
        <span className="text-[10px] border border-[rgba(0,191,255,0.2)] text-[#00bfff] px-2 py-0.5">
          {relevantProtocols.length} protocols
        </span>
      </div>

      {relevantProtocols.length === 0 && (
        <p className="text-[#3a3a3a] text-xs text-center py-4">
          Complete onboarding to see your personalized protocols.
        </p>
      )}

      <div className="space-y-2">
        {relevantProtocols.map((p) => (
          <div
            key={p.id}
            className="border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,191,255,0.15)] transition-all"
          >
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
            >
              <span className="text-[#00bfff] text-[10px]">
                {expanded === p.id ? "▼" : "▶"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-bold truncate">{p.title}</p>
                <p className="text-[9px] text-[#3a3a3a]">
                  {p.category} · {p.timeframe}
                </p>
              </div>
            </button>

            {expanded === p.id && (
              <div className="px-3 pb-3 border-t border-[rgba(255,255,255,0.03)]">
                <div className="space-y-2 mt-2">
                  {p.steps.map((step, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span className="text-[#00bfff] font-mono text-[10px] flex-shrink-0 mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[#a0a0a0] leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
