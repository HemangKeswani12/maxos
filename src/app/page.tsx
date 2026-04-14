"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { HeroBackground } from "@/components/landing/HeroBackground";
import { Testimonials } from "@/components/landing/Testimonials";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { MaxOSLogo } from "@/components/ui/MaxOSLogo";
import { useAppStore } from "@/store/useAppStore";

const TYPEWRITER_LINES = [
  "Your jawline is a geometric problem.",
  "Your skin is a chemistry problem.",
  "Your posture is a biomechanics problem.",
  "Your body composition is a physics problem.",
  "Every problem has a documented solution.",
  "bemaxxed is the solution stack.",
];

function TypewriterHero() {
  const [lineIdx, setLineIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const line = TYPEWRITER_LINES[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < line.length) {
      timeout = setTimeout(() => {
        setDisplayed(line.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, 38);
    } else if (!deleting && charIdx === line.length) {
      timeout = setTimeout(() => setDeleting(true), 2400);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplayed(line.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, 16);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setLineIdx((l) => (l + 1) % TYPEWRITER_LINES.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, lineIdx]);

  return (
    <div className="h-8 flex items-center justify-center">
      <span className="text-[#848484] text-base font-mono">
        {displayed}
        <span className="blink text-[#5ab3cc]">_</span>
      </span>
    </div>
  );
}

function LoadingSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    "INITIALIZING bemaxxed v2.4.1...",
    "LOADING BIOMETRIC ENGINE...",
    "CALIBRATING HOLOGRAPHIC RENDERER...",
    "CONNECTING TO GROQ API...",
    "SYSTEM READY.",
  ];

  useEffect(() => {
    if (step < steps.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 400);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(onComplete, 300);
      return () => clearTimeout(t);
    }
  }, [step, steps.length, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <MaxOSLogo size="xl" className="mb-12" />
      <div className="w-80 space-y-2 font-mono text-xs">
        {steps.slice(0, step).map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[#52b788]">✓</span>
            <span className="text-[#848484]">{s}</span>
          </div>
        ))}
        {step < steps.length && (
          <div className="flex items-center gap-3">
            <span className="text-[#5ab3cc] blink">▶</span>
            <span className="text-[#5ab3cc]">{steps[step]}</span>
          </div>
        )}
      </div>
      <div className="mt-8 w-80 h-px bg-[#0a0a0c] overflow-hidden">
        <div
          className="h-full bg-[#5ab3cc] transition-all duration-300"
          style={{ width: `${(step / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session) {
      // If onboarding complete, go to dashboard. Otherwise onboarding.
      const store = useAppStore.getState();
      const profile = store.userProfile;
      if (profile?.onboarding_complete) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [status, session, router]);

  const handleLoadComplete = () => {
    signIn("google", { callbackUrl: "/onboarding" });
  };

  if (launched) {
    return <LoadingSequence onComplete={handleLoadComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#060608] relative">
      <HeroBackground />
      <div className="holo-grid fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-[rgba(90,179,204,0.07)]">
        <MaxOSLogo size="md" />
        <div className="flex items-center gap-6">
          <span className="text-[#848484] text-xs tracking-widest hidden sm:block">
            objectively better, open source.
          </span>
          <button
            onClick={() => signIn("google")}
            className="btn-primary text-[10px] tracking-[3px]"
          >
            SIGN IN
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-10">
        <div className="mb-6">
          <span className="text-[10px] tracking-[4px] text-[#5ab3cc] border border-[rgba(90,179,204,0.2)] px-4 py-1.5">
            OPEN SOURCE · CLIENT-SIDE · ZERO BULLSHIT
          </span>
        </div>

        <MaxOSLogo size="xl" className="mb-4" />

        <p className="text-[#848484] text-xs tracking-[6px] uppercase mb-10">
          objectively better, open source.
        </p>

        <div className="max-w-2xl mb-8">
          <TypewriterHero />
        </div>

        <p className="text-[#848484] text-sm max-w-xl leading-relaxed mb-3">
          Not a course. Not a coach. Not a Discord server charging $97/month to tell you to &quot;trust the process.&quot;
        </p>
        <p className="text-[#e8e8e8] text-sm max-w-xl leading-relaxed mb-12">
          bemaxxed is an <span className="text-[#5ab3cc]">engineering stack</span> for human aesthetics.
          MediaPipe biometrics. 3D holographic modeling. Groq AI with your actual measurements
          injected into context. Evidence-based protocols. No fluff.
        </p>

        <button
          onClick={() => setLaunched(true)}
          className="btn-primary text-sm tracking-[4px] px-10 py-4 relative group"
          style={{ fontSize: "13px" }}
        >
          <span className="relative z-10">▶&nbsp; LAUNCH bemaxxed</span>
          <div className="absolute inset-0 border border-[#5ab3cc] opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-105" />
        </button>

        <p className="text-[#2a2a2e] text-[10px] mt-6 tracking-widest">
          REQUIRES GOOGLE ACCOUNT · ZERO COST · OPEN SOURCE
        </p>

        {/* Stats */}
        <div className="mt-16 flex gap-12 flex-wrap justify-center">
          {[
            { val: "100%", label: "Client-Side Vision" },
            { val: "$0", label: "Cost to Users" },
            { val: "0", label: "Courses Sold" },
            { val: "30+", label: "Evidence-Based Protocols" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-[#5ab3cc]">{s.val}</div>
              <div className="text-[#848484] text-[10px] tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Diagnostic log */}
      <section className="relative z-10 py-16 px-4 border-y border-[rgba(90,179,204,0.05)]">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel p-8">
            <p className="text-xs tracking-[4px] text-[#5ab3cc] mb-6 uppercase">
              DIAGNOSTIC LOG
            </p>
            <div className="font-mono text-xs space-y-3">
              {[
                { type: "ERROR", msg: "Course seller detected. Charging $497 for publicly available PubMed data." },
                { type: "ERROR", msg: "Supplement stack recommended without bloodwork context. Margin: 340%." },
                { type: "ERROR", msg: '"Mindset" content detected. Zero biometric variables. Omitting.' },
                { type: "WARN", msg: "Before/after photos detected. No control group. No timeframe. Dismissed." },
                { type: "INFO", msg: "bemaxxed alternative loaded. Protocol stack initialized. Cost: $0.00." },
                { type: "SUCCESS", msg: "Biometric baseline established. Personalized action plan generating..." },
              ].map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className={`flex-shrink-0 ${
                    log.type === "ERROR" ? "text-red-400"
                    : log.type === "WARN" ? "text-yellow-500"
                    : log.type === "SUCCESS" ? "text-[#52b788]"
                    : "text-[#5ab3cc]"
                  }`}>
                    [{log.type}]
                  </span>
                  <span className="text-[#848484]">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeatureGrid />
      <Testimonials />

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(90,179,204,0.06)] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <MaxOSLogo size="sm" />
          <p className="text-[#2a2a2e] text-[10px] tracking-widest text-center">
            NOT MEDICAL ADVICE · OPEN SOURCE · {new Date().getFullYear()}
          </p>
          <div className="flex gap-4 text-[10px] text-[#848484] tracking-widest">
            <a href="https://github.com/HemangKeswani12/maxos" className="hover:text-[#5ab3cc] transition-colors">
              GITHUB
            </a>
            <span className="text-[#2a2a2e]">·</span>
            <span>BUILT WITH NEXT.JS</span>
          </div>
        </div>
      </footer>

      <div className="relative z-10 w-full flex justify-center py-2 bg-[#060608] border-t border-[rgba(255,255,255,0.02)]">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "728px", height: "90px" }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID ?? "ca-pub-XXXXXXXXXXXXXXXX"}
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="horizontal"
        />
      </div>
    </div>
  );
}
