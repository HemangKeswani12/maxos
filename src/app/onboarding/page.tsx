"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MaxOSLogo } from "@/components/ui/MaxOSLogo";
import { useAppStore } from "@/store/useAppStore";
import { upsertUserProfile } from "@/lib/supabase";
import { ConcernVisual } from "@/components/onboarding/ConcernVisual";

const CATEGORIES: {
  id: string;
  label: string;
  icon: string;
  concerns: { id: string; label: string; visualTag?: string }[];
}[] = [
  {
    id: "skin-face",
    label: "Skin — Face",
    icon: "◈",
    concerns: [
      { id: "acne", label: "Acne / Breakouts", visualTag: "acne" },
      { id: "hyperpigmentation", label: "Hyperpigmentation / Dark Spots", visualTag: "hyperpigmentation" },
      { id: "dark-circles", label: "Dark Circles", visualTag: "dark-circles" },
      { id: "eye-bags", label: "Eye Bags / Puffiness", visualTag: "eye-bags" },
      { id: "redness", label: "Redness / Rosacea", visualTag: "redness" },
      { id: "large-pores", label: "Large / Visible Pores", visualTag: "large-pores" },
      { id: "oily-skin", label: "Oily / Congested Skin" },
      { id: "dry-skin", label: "Dry / Flaky Skin" },
      { id: "fine-lines", label: "Fine Lines / Premature Aging" },
      { id: "uneven-skin-tone", label: "Uneven Skin Tone / Dullness" },
      { id: "body-acne", label: "Body / Back / Chest Acne", visualTag: "body-acne" },
      { id: "keratosis-pilaris", label: "Keratosis Pilaris (Arm Bumps)", visualTag: "keratosis-pilaris" },
      { id: "stretch-marks", label: "Stretch Marks", visualTag: "stretch-marks" },
    ],
  },
  {
    id: "face-structure",
    label: "Face Structure",
    icon: "◉",
    concerns: [
      { id: "jawline", label: "Soft / Undefined Jawline", visualTag: "jawline" },
      { id: "mewing", label: "Facial Structure (Mewing / Tongue Posture)", visualTag: "mewing" },
      { id: "jaw-fat", label: "Double Chin / Submental Fat", visualTag: "jaw-fat" },
      { id: "weak-chin", label: "Recessed / Weak Chin", visualTag: "weak-chin" },
      { id: "cheekbones", label: "Flat Cheeks / Lack of Prominence" },
      { id: "eye-area", label: "Eye Shape / Canthal Tilt" },
      { id: "brows", label: "Sparse / Uneven Eyebrows", visualTag: "brows" },
      { id: "nose-appearance", label: "Nose Appearance" },
      { id: "lips", label: "Thin / Undefined Lips" },
      { id: "face-symmetry", label: "Facial Asymmetry" },
    ],
  },
  {
    id: "posture",
    label: "Posture & Alignment",
    icon: "◎",
    concerns: [
      { id: "forward-head", label: "Forward Head Posture", visualTag: "forward-head" },
      { id: "rounded-shoulders", label: "Rounded / Rolled Shoulders", visualTag: "rounded-shoulders" },
      { id: "kyphosis", label: "Kyphosis (Upper Back Rounding)", visualTag: "kyphosis" },
      { id: "anterior-pelvic", label: "Anterior Pelvic Tilt (Duck Butt)", visualTag: "anterior-pelvic" },
      { id: "posterior-pelvic", label: "Posterior Pelvic Tilt (Flat Butt)", visualTag: "posterior-pelvic" },
      { id: "shoulder-asymmetry", label: "Shoulder Asymmetry", visualTag: "shoulder-asymmetry" },
      { id: "scoliosis", label: "Scoliosis / Lateral Spinal Curve", visualTag: "scoliosis" },
      { id: "knee-valgus", label: "Knock Knees (Knee Valgus)", visualTag: "knee-valgus" },
      { id: "flat-feet", label: "Flat Feet / Overpronation", visualTag: "flat-feet" },
    ],
  },
  {
    id: "physique",
    label: "Body Composition & Physique",
    icon: "⬡",
    concerns: [
      { id: "body-fat", label: "High Body Fat / Overweight", visualTag: "body-fat" },
      { id: "muscle-mass", label: "Low Muscle Mass / Underdeveloped", visualTag: "muscle-mass" },
      { id: "shoulder-width", label: "Narrow Shoulders / No V-Taper", visualTag: "shoulder-width" },
      { id: "visceral-fat", label: "Visceral Fat / Beer Belly", visualTag: "visceral-fat" },
      { id: "love-handles", label: "Love Handles / Flank Fat" },
      { id: "underdeveloped-chest", label: "Underdeveloped Chest / Flat Chest" },
      { id: "gynecomastia", label: "Gynecomastia (Male Chest Fat)" },
      { id: "spindly-arms", label: "Thin / Underdeveloped Arms" },
      { id: "small-calves", label: "Underdeveloped Calves" },
      { id: "thin-neck", label: "Thin Neck" },
      { id: "poor-waist", label: "Wide Waist / No Definition" },
      { id: "glute-development", label: "Poor Glute Development" },
    ],
  },
  {
    id: "hair",
    label: "Hair & Facial Hair",
    icon: "◆",
    concerns: [
      { id: "hair-loss", label: "Hair Loss / Thinning Crown", visualTag: "hair-loss" },
      { id: "receding-hairline", label: "Receding Hairline" },
      { id: "hair-texture", label: "Frizzy / Brittle / Damaged Hair", visualTag: "hair-texture" },
      { id: "dandruff", label: "Dandruff / Scalp Flaking", visualTag: "dandruff" },
      { id: "hair-style", label: "Hairstyle Not Flattering for Face Shape", visualTag: "hair-style" },
      { id: "beard", label: "Patchy / Sparse Beard", visualTag: "beard" },
      { id: "brow-sparse", label: "Sparse Eyebrows", visualTag: "brows" },
    ],
  },
  {
    id: "grooming-oral",
    label: "Grooming & Oral",
    icon: "◇",
    concerns: [
      { id: "skincare-routine", label: "No Skincare Routine / Basic Hygiene Stack" },
      { id: "yellow-teeth", label: "Yellow / Stained Teeth", visualTag: "yellow-teeth" },
      { id: "crooked-teeth", label: "Crooked / Misaligned Teeth" },
      { id: "gum-health", label: "Poor Gum Health / Receding Gums" },
      { id: "nail-health", label: "Brittle / Damaged Nails", visualTag: "nail-health" },
      { id: "fragrance", label: "No Fragrance / Scent Strategy" },
      { id: "clothing-fit", label: "Clothing Doesn't Fit / Wrong Proportions" },
    ],
  },
  {
    id: "sleep-health",
    label: "Sleep & Recovery",
    icon: "◈",
    concerns: [
      { id: "sleep-quality", label: "Poor Sleep Quality / Under 7h", visualTag: "sleep-quality" },
      { id: "low-energy", label: "Chronic Low Energy / Fatigue" },
      { id: "poor-recovery", label: "Poor Workout Recovery" },
      { id: "stress", label: "Chronic Stress / Elevated Cortisol" },
    ],
  },
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const setUserProfile = useAppStore((s) => s.setUserProfile);

  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [age, setAge] = useState(22);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [insecurities, setInsecurities] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [hoveredConcern, setHoveredConcern] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string>("skin-face");

  const toggleInsecurity = (id: string) => {
    setInsecurities((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    if (!session?.user) return;
    setSaving(true);
    const userId = (session.user as { id?: string }).id ?? session.user.email ?? "";
    const profile = {
      id: userId,
      email: session.user.email ?? "",
      name: session.user.name ?? null,
      image: session.user.image ?? null,
      gender,
      age,
      height_cm: height,
      weight_kg: weight,
      insecurities,
      onboarding_complete: true,
    };
    try {
      await upsertUserProfile(profile);
    } catch {
      // continue even if Supabase not configured
    }
    setUserProfile(profile);
    router.push("/dashboard");
  };

  const bmi = weight / ((height / 100) ** 2);

  const steps = [
    { label: "BIOLOGICAL DATA", icon: "◈" },
    { label: "CONCERN MAPPING", icon: "◉" },
    { label: "SYSTEM INIT", icon: "◎" },
  ];

  const allConcerns = CATEGORIES.flatMap((c) => c.concerns);
  const selectedConcern = hoveredConcern
    ? allConcerns.find((c) => c.id === hoveredConcern)
    : null;

  return (
    <div className="min-h-screen bg-[#060608] flex flex-col">
      <div className="holo-grid fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[rgba(90,179,204,0.07)]">
        <MaxOSLogo size="md" />
        <div className="flex gap-3 items-center">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${i < step ? "bg-[#52b788]" : i === step ? "bg-[#5ab3cc]" : "bg-[#2a2a2e]"}`} />
              <span className={`text-[9px] tracking-widest hidden sm:block ${i <= step ? (i < step ? "text-[#52b788]" : "text-[#5ab3cc]") : "text-[#2a2a2e]"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <span className="text-[#1a1a1e] text-[10px] mx-1">—</span>}
            </div>
          ))}
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-start justify-center px-4 py-8">

        {/* ── STEP 1: BIOLOGICAL DATA ── */}
        {step === 0 && (
          <div className="glass-panel p-8 w-full max-w-lg">
            <p className="text-[9px] tracking-[4px] text-[#5ab3cc] mb-1">STEP 01 / 03</p>
            <h2 className="text-xl font-bold text-[#e8e8e8] mb-1">Biological Data</h2>
            <p className="text-[#848484] text-xs mb-7">
              Required for parametric 3D modelling and AI context injection.
            </p>

            <div className="space-y-6">
              {/* Gender */}
              <div>
                <label className="text-[9px] tracking-[3px] text-[#848484] uppercase block mb-2">Biological Sex</label>
                <div className="flex gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button key={g} onClick={() => setGender(g)}
                      className={`flex-1 py-2 text-xs tracking-widest uppercase border transition-all ${gender === g ? "border-[#5ab3cc] text-[#5ab3cc] bg-[rgba(90,179,204,0.07)]" : "border-[rgba(255,255,255,0.06)] text-[#848484] hover:border-[rgba(90,179,204,0.25)]"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="text-[9px] tracking-[3px] text-[#848484] uppercase block mb-2">
                  Age — <span className="text-[#e8e8e8]">{age} years</span>
                </label>
                <input type="range" min={14} max={65} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-[9px] text-[#2a2a2e] mt-1"><span>14</span><span>65</span></div>
              </div>

              {/* Height */}
              <div>
                <label className="text-[9px] tracking-[3px] text-[#848484] uppercase block mb-2">
                  Height — <span className="text-[#e8e8e8]">{height}cm</span>
                  <span className="text-[#2a2a2e] ml-2">({Math.floor(height / 30.48)}&apos;{Math.round((height / 30.48 % 1) * 12)}&quot;)</span>
                </label>
                <input type="range" min={140} max={220} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-[9px] text-[#2a2a2e] mt-1"><span>140cm</span><span>220cm</span></div>
              </div>

              {/* Weight */}
              <div>
                <label className="text-[9px] tracking-[3px] text-[#848484] uppercase block mb-2">
                  Weight — <span className="text-[#e8e8e8]">{weight}kg</span>
                  <span className="text-[#2a2a2e] ml-2">({Math.round(weight * 2.205)}lbs)</span>
                </label>
                <input type="range" min={40} max={160} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-[9px] text-[#2a2a2e] mt-1"><span>40kg</span><span>160kg</span></div>
              </div>

              {/* BMI readout */}
              <div className="border border-[rgba(90,179,204,0.08)] p-3 grid grid-cols-2 gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#848484]">BMI</span>
                  <span className="text-[#5ab3cc] font-mono">{bmi.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#848484]">Class</span>
                  <span className="text-[#e8e8e8] font-mono text-[10px]">
                    {bmi < 18.5 ? "UNDERWEIGHT" : bmi < 25 ? "NORMAL" : bmi < 30 ? "OVERWEIGHT" : "OBESE"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#848484]">Est. LBM</span>
                  <span className="text-[#e8e8e8] font-mono text-[10px]">
                    {(weight * (gender === "male" ? 0.82 : 0.72)).toFixed(0)}kg
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#848484]">Est. BF%</span>
                  <span className="text-[#e8e8e8] font-mono text-[10px]">
                    {Math.max(5, Math.min(50, (1.2 * bmi + 0.23 * age - (gender === "male" ? 16.2 : 5.4)))).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(1)} className="btn-primary w-full mt-7 text-[11px] tracking-[3px]">
              CONTINUE →
            </button>
          </div>
        )}

        {/* ── STEP 2: CONCERN MAPPING ── */}
        {step === 1 && (
          <div className="w-full max-w-5xl flex gap-4">
            {/* Left: concern list */}
            <div className="glass-panel flex-1 flex flex-col" style={{ maxHeight: "80vh" }}>
              <div className="p-5 border-b border-[rgba(90,179,204,0.07)] flex-shrink-0">
                <p className="text-[9px] tracking-[4px] text-[#5ab3cc] mb-1">STEP 02 / 03</p>
                <h2 className="text-xl font-bold text-[#e8e8e8] mb-1">Concern Mapping</h2>
                <p className="text-[#848484] text-xs">
                  Select all areas you want to optimize.{" "}
                  <span className="text-[#5ab3cc] font-bold">{insecurities.length} selected</span>
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="border border-[rgba(255,255,255,0.04)]">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
                      onClick={() => setExpandedCategory(expandedCategory === cat.id ? "" : cat.id)}
                    >
                      <span className="text-[#5ab3cc] text-[10px]">{cat.icon}</span>
                      <span className="text-xs font-bold text-[#e8e8e8] flex-1">{cat.label}</span>
                      <span className="text-[9px] text-[#5ab3cc]">
                        {cat.concerns.filter((c) => insecurities.includes(c.id)).length > 0 &&
                          `${cat.concerns.filter((c) => insecurities.includes(c.id)).length} selected`}
                      </span>
                      <span className="text-[#2a2a2e] text-[10px]">
                        {expandedCategory === cat.id ? "▼" : "▶"}
                      </span>
                    </button>

                    {expandedCategory === cat.id && (
                      <div className="border-t border-[rgba(255,255,255,0.03)] px-3 py-2 grid grid-cols-1 gap-0.5">
                        {cat.concerns.map((concern) => {
                          const isSelected = insecurities.includes(concern.id);
                          return (
                            <button
                              key={concern.id}
                              onClick={() => toggleInsecurity(concern.id)}
                              onMouseEnter={() => setHoveredConcern(concern.id)}
                              onMouseLeave={() => setHoveredConcern(null)}
                              className={`flex items-center gap-2 px-2 py-1.5 text-left text-xs border transition-all ${
                                isSelected
                                  ? "border-[rgba(90,179,204,0.25)] text-[#e8e8e8] bg-[rgba(90,179,204,0.06)]"
                                  : "border-transparent text-[#848484] hover:text-[#c0c0c0] hover:border-[rgba(255,255,255,0.05)]"
                              }`}
                            >
                              <span className={`w-4 h-4 flex-shrink-0 border flex items-center justify-center text-[8px] ${
                                isSelected ? "border-[#5ab3cc] text-[#5ab3cc]" : "border-[rgba(255,255,255,0.1)]"
                              }`}>
                                {isSelected ? "✓" : ""}
                              </span>
                              <span className="flex-1">{concern.label}</span>
                              {concern.visualTag && (
                                <span className="text-[8px] text-[#2a2a2e] border border-[rgba(90,179,204,0.08)] px-1 flex-shrink-0">
                                  VISUAL
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-[rgba(90,179,204,0.07)] flex gap-2 flex-shrink-0">
                <button onClick={() => setStep(0)} className="btn-primary flex-1 text-[11px] tracking-[2px]">← BACK</button>
                <button onClick={() => setStep(2)} disabled={insecurities.length === 0}
                  className="btn-primary flex-1 text-[11px] tracking-[2px] disabled:opacity-30 disabled:cursor-not-allowed">
                  CONTINUE →
                </button>
              </div>
            </div>

            {/* Right: visual preview */}
            <div className="w-72 flex-shrink-0 glass-panel p-4 flex flex-col" style={{ maxHeight: "80vh" }}>
              <p className="text-[9px] tracking-[3px] text-[#2a2a2e] uppercase mb-3">VISUAL COMPARISON</p>

              {hoveredConcern && selectedConcern ? (
                <div className="flex-1 overflow-y-auto">
                  <p className="text-xs text-[#e8e8e8] font-bold mb-2">{selectedConcern.label}</p>
                  {selectedConcern.visualTag ? (
                    <ConcernVisual tag={selectedConcern.visualTag} />
                  ) : (
                    <div className="border border-[rgba(255,255,255,0.04)] p-4 text-center">
                      <div className="text-[#2a2a2e] text-2xl mb-2">◈</div>
                      <p className="text-[#2a2a2e] text-[10px]">Protocol-only concern. See Action Plan after onboarding.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <div className="text-[#2a2a2e] text-3xl">◉</div>
                  <p className="text-[#2a2a2e] text-xs text-center">
                    Hover a concern to see the visual comparison
                  </p>
                  {insecurities.length > 0 && (
                    <div className="mt-4 w-full">
                      <p className="text-[9px] tracking-widest text-[#2a2a2e] uppercase mb-2">SELECTED</p>
                      <div className="flex flex-wrap gap-1">
                        {insecurities.slice(0, 12).map((id) => {
                          const c = allConcerns.find((x) => x.id === id);
                          return (
                            <span key={id} className="text-[8px] border border-[rgba(90,179,204,0.15)] text-[#5ab3cc] px-1.5 py-0.5">
                              {c?.label.split(" ").slice(0, 2).join(" ")}
                            </span>
                          );
                        })}
                        {insecurities.length > 12 && (
                          <span className="text-[8px] text-[#2a2a2e]">+{insecurities.length - 12} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: SYSTEM INIT ── */}
        {step === 2 && (
          <div className="glass-panel p-8 w-full max-w-lg">
            <p className="text-[9px] tracking-[4px] text-[#5ab3cc] mb-6">STEP 03 / 03</p>
            <div className="text-4xl mb-5 text-[#5ab3cc]">◈</div>
            <h2 className="text-xl font-bold text-[#e8e8e8] mb-5">System Initialized</h2>

            <div className="space-y-2 mb-7 font-mono text-xs">
              {[
                `Biological baseline: ${height}cm · ${weight}kg · BMI ${bmi.toFixed(1)}`,
                `${insecurities.length} concern${insecurities.length !== 1 ? "s" : ""} mapped across ${new Set(CATEGORIES.filter((c) => c.concerns.some((x) => insecurities.includes(x.id))).map((c) => c.id)).size} categories`,
                "Groq AI context payload: ready",
                "MediaPipe analyzer: ready",
                "3D holographic renderer: ready",
                "Personalized action plan: generating...",
              ].map((msg, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-[#52b788]">✓</span>
                  <span className="text-[#848484]">{msg}</span>
                </div>
              ))}
            </div>

            <div className="border border-[rgba(90,179,204,0.08)] p-4 mb-7">
              <p className="text-[9px] tracking-widest text-[#848484] mb-2">CONCERN STACK</p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {insecurities.map((id) => {
                  const c = allConcerns.find((x) => x.id === id);
                  return (
                    <span key={id} className="text-[9px] border border-[rgba(90,179,204,0.15)] text-[#5ab3cc] px-2 py-0.5">
                      {c?.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-primary text-[11px] tracking-[2px] px-4">← BACK</button>
              <button onClick={handleComplete} disabled={saving}
                className="btn-primary flex-1 text-[11px] tracking-[3px]">
                {saving ? "INITIALIZING..." : "▶  LAUNCH DASHBOARD"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
