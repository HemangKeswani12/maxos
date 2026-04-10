"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MaxOSLogo } from "@/components/ui/MaxOSLogo";
import { useAppStore } from "@/store/useAppStore";
import { upsertUserProfile } from "@/lib/supabase";

const INSECURITY_OPTIONS = [
  { id: "acne", label: "Acne / Texture", category: "Skin", icon: "◈" },
  { id: "hyperpigmentation", label: "Hyperpigmentation", category: "Skin", icon: "◈" },
  { id: "dark-circles", label: "Dark Circles", category: "Skin", icon: "◈" },
  { id: "jawline", label: "Jawline Definition", category: "Face", icon: "◉" },
  { id: "mewing", label: "Facial Structure (Mewing)", category: "Face", icon: "◉" },
  { id: "eye-area", label: "Eye Area", category: "Face", icon: "◉" },
  { id: "forward-head", label: "Forward Head Posture", category: "Posture", icon: "◎" },
  { id: "shoulder-asymmetry", label: "Shoulder Asymmetry", category: "Posture", icon: "◎" },
  { id: "anterior-pelvic", label: "Anterior Pelvic Tilt", category: "Posture", icon: "◎" },
  { id: "body-fat", label: "Body Fat", category: "Physique", icon: "⬡" },
  { id: "muscle-mass", label: "Muscle Mass / Build", category: "Physique", icon: "⬡" },
  { id: "shoulder-width", label: "Shoulder Width", category: "Physique", icon: "⬡" },
  { id: "hair-loss", label: "Hair Loss / Thinning", category: "Hair", icon: "◆" },
  { id: "hair-texture", label: "Hair Texture", category: "Hair", icon: "◆" },
  { id: "beard", label: "Beard / Facial Hair", category: "Grooming", icon: "◇" },
  { id: "skincare-routine", label: "Skincare Protocol", category: "Grooming", icon: "◇" },
];

const categories = [...new Set(INSECURITY_OPTIONS.map((o) => o.category))];

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
      // continue even if Supabase fails (env not configured)
    }
    setUserProfile(profile);
    router.push("/dashboard");
  };

  const steps = [
    { label: "BIOLOGICAL DATA", icon: "◈" },
    { label: "CONCERN MAPPING", icon: "◉" },
    { label: "SYSTEM INIT", icon: "◎" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      <div className="holo-grid fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[rgba(0,191,255,0.08)]">
        <MaxOSLogo size="md" />
        <div className="flex gap-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={`text-xs ${
                  i <= step ? "text-[#00bfff]" : "text-[#3a3a3a]"
                }`}
              >
                {s.icon}
              </span>
              <span
                className={`text-[10px] tracking-widest hidden sm:block ${
                  i <= step ? "text-[#00bfff]" : "text-[#3a3a3a]"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <span className="text-[#1a1a1a] mx-2">—</span>
              )}
            </div>
          ))}
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        {step === 0 && (
          <div className="glass-panel p-8 w-full max-w-lg">
            <p className="text-[10px] tracking-[4px] text-[#00bfff] mb-2">
              STEP 01 / 03
            </p>
            <h2 className="text-xl font-bold text-white mb-1">Biological Data</h2>
            <p className="text-[#a0a0a0] text-xs mb-8">
              Required for parametric 3D modeling and AI context injection. Stored locally.
            </p>

            <div className="space-y-6">
              {/* Gender */}
              <div>
                <label className="text-[10px] tracking-[3px] text-[#a0a0a0] uppercase block mb-2">
                  Biological Sex
                </label>
                <div className="flex gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2 text-xs tracking-widest uppercase border transition-all ${
                        gender === g
                          ? "border-[#00bfff] text-[#00bfff] bg-[rgba(0,191,255,0.08)]"
                          : "border-[rgba(255,255,255,0.08)] text-[#a0a0a0] hover:border-[rgba(0,191,255,0.3)]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="text-[10px] tracking-[3px] text-[#a0a0a0] uppercase block mb-2">
                  Age: <span className="text-white">{age}</span>
                </label>
                <input
                  type="range"
                  min={14}
                  max={60}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[9px] text-[#3a3a3a] mt-1">
                  <span>14</span><span>60</span>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="text-[10px] tracking-[3px] text-[#a0a0a0] uppercase block mb-2">
                  Height: <span className="text-white">{height}cm</span>{" "}
                  <span className="text-[#3a3a3a]">({Math.floor(height / 30.48)}&apos;{Math.round((height / 30.48 % 1) * 12)}&quot;)</span>
                </label>
                <input
                  type="range"
                  min={140}
                  max={220}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[9px] text-[#3a3a3a] mt-1">
                  <span>140cm</span><span>220cm</span>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="text-[10px] tracking-[3px] text-[#a0a0a0] uppercase block mb-2">
                  Weight: <span className="text-white">{weight}kg</span>{" "}
                  <span className="text-[#3a3a3a]">({Math.round(weight * 2.205)}lbs)</span>
                </label>
                <input
                  type="range"
                  min={40}
                  max={160}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[9px] text-[#3a3a3a] mt-1">
                  <span>40kg</span><span>160kg</span>
                </div>
              </div>

              {/* BMI */}
              <div className="border border-[rgba(0,191,255,0.1)] p-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#a0a0a0]">BMI</span>
                  <span className="text-[#00bfff] font-mono">
                    {(weight / ((height / 100) ** 2)).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-[#a0a0a0]">Classification</span>
                  <span className="text-white font-mono text-[10px]">
                    {(() => {
                      const bmi = weight / ((height / 100) ** 2);
                      if (bmi < 18.5) return "UNDERWEIGHT";
                      if (bmi < 25) return "NORMAL";
                      if (bmi < 30) return "OVERWEIGHT";
                      return "OBESE";
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <button onClick={() => setStep(1)} className="btn-primary w-full mt-8 text-[11px] tracking-[3px]">
              CONTINUE →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="glass-panel p-8 w-full max-w-2xl">
            <p className="text-[10px] tracking-[4px] text-[#00bfff] mb-2">
              STEP 02 / 03
            </p>
            <h2 className="text-xl font-bold text-white mb-1">Concern Mapping</h2>
            <p className="text-[#a0a0a0] text-xs mb-8">
              Select all areas you want to optimize. maxOS will surface relevant protocols.{" "}
              <span className="text-white">{insecurities.length} selected.</span>
            </p>

            <div className="space-y-6">
              {categories.map((cat) => (
                <div key={cat}>
                  <p className="text-[10px] tracking-[3px] text-[#a0a0a0] uppercase mb-2 border-b border-[rgba(255,255,255,0.05)] pb-1">
                    {cat}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {INSECURITY_OPTIONS.filter((o) => o.category === cat).map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => toggleInsecurity(opt.id)}
                        className={`flex items-center gap-2 p-2.5 text-left text-xs border transition-all ${
                          insecurities.includes(opt.id)
                            ? "border-[#00bfff] text-white bg-[rgba(0,191,255,0.08)]"
                            : "border-[rgba(255,255,255,0.06)] text-[#a0a0a0] hover:border-[rgba(0,191,255,0.2)]"
                        }`}
                      >
                        <span className="text-[#00bfff]">{opt.icon}</span>
                        {opt.label}
                        {insecurities.includes(opt.id) && (
                          <span className="ml-auto text-[#00ff00] text-[10px]">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(0)} className="btn-primary flex-1 text-[11px] tracking-[2px]">
                ← BACK
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={insecurities.length === 0}
                className="btn-primary flex-1 text-[11px] tracking-[2px] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                CONTINUE →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="glass-panel p-8 w-full max-w-lg text-center">
            <p className="text-[10px] tracking-[4px] text-[#00bfff] mb-6">
              STEP 03 / 03
            </p>
            <div className="text-5xl mb-6 text-[#00bfff]">◈</div>
            <h2 className="text-xl font-bold text-white mb-4">System Initialized</h2>

            <div className="text-left space-y-2 mb-8 font-mono text-xs">
              <div className="flex gap-3">
                <span className="text-[#00ff00]">✓</span>
                <span className="text-[#a0a0a0]">Biological baseline recorded</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#00ff00]">✓</span>
                <span className="text-[#a0a0a0]">
                  {insecurities.length} concern{insecurities.length !== 1 ? "s" : ""} mapped
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#00ff00]">✓</span>
                <span className="text-[#a0a0a0]">
                  BMI: {(weight / ((height / 100) ** 2)).toFixed(1)} — protocols calibrated
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#00bfff] blink">▶</span>
                <span className="text-[#00bfff]">Generating personalized action plan...</span>
              </div>
            </div>

            <div className="border border-[rgba(0,191,255,0.1)] p-4 text-left mb-8">
              <p className="text-[10px] tracking-widest text-[#a0a0a0] mb-3">PRIORITY CONCERNS</p>
              <div className="flex flex-wrap gap-2">
                {insecurities.map((id) => {
                  const opt = INSECURITY_OPTIONS.find((o) => o.id === id);
                  return (
                    <span
                      key={id}
                      className="text-[10px] border border-[rgba(0,191,255,0.2)] text-[#00bfff] px-2 py-0.5"
                    >
                      {opt?.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={saving}
              className="btn-primary w-full text-[11px] tracking-[3px]"
            >
              {saving ? "INITIALIZING..." : "▶  LAUNCH DASHBOARD"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
