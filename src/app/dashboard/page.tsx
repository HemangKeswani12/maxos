"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FileTree } from "@/components/dashboard/FileTree";
import { AIChatPanel } from "@/components/dashboard/AIChatPanel";
import { DiagnosisReport } from "@/components/dashboard/DiagnosisReport";
import { RoutineTracker } from "@/components/dashboard/RoutineTracker";
import { ActionPlan } from "@/components/dashboard/ActionPlan";
import { VisualAnalyzer } from "@/components/mediapipe/VisualAnalyzer";
import { useAppStore } from "@/store/useAppStore";

const HologramViewer = dynamic(
  () => import("@/components/three/HologramViewer").then((m) => m.HologramViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#5ab3cc] text-4xl mb-3 animate-pulse">◈</div>
          <p className="text-[#2a2a2e] text-xs font-mono tracking-widest">LOADING HOLOGRAPHIC ENGINE...</p>
        </div>
      </div>
    ),
  }
);

type CenterTab = "hologram" | "analyzer" | "routine" | "plan";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userProfile, leftSidebarOpen } = useAppStore();
  const [centerTab, setCenterTab] = useState<CenterTab>("hologram");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    // If authenticated but onboarding not done, redirect to onboarding
    if (status === "authenticated" && userProfile !== null && !userProfile.onboarding_complete) {
      router.push("/onboarding");
    }
  }, [status, router, userProfile]);

  // First time visitor — no profile yet, send to onboarding
  useEffect(() => {
    if (status === "authenticated" && userProfile === null) {
      router.push("/onboarding");
    }
  }, [status, userProfile, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#5ab3cc] text-4xl mb-4 animate-pulse">◈</div>
          <p className="text-[#848484] text-xs font-mono tracking-widest">AUTHENTICATING...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const heightCm = userProfile?.height_cm ?? 175;
  const weightKg = userProfile?.weight_kg ?? 70;

  const tabs: { id: CenterTab; label: string; icon: string }[] = [
    { id: "hologram", label: "HOLOGRAM", icon: "◈" },
    { id: "analyzer", label: "ANALYZER", icon: "◉" },
    { id: "routine", label: "ROUTINE", icon: "◎" },
    { id: "plan", label: "ACTION PLAN", icon: "⬡" },
  ];

  return (
    <div className="h-screen bg-[#060608] flex flex-col overflow-hidden">
      <div className="holo-grid fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden relative z-10 min-h-0">
        {/* LEFT SIDEBAR */}
        {leftSidebarOpen && (
          <aside
            className="flex-shrink-0 flex flex-col overflow-hidden"
            style={{
              width: "220px",
              background: "rgba(6,6,8,0.82)",
              backdropFilter: "blur(12px)",
              borderRight: "1px solid rgba(90,179,204,0.07)",
            }}
          >
            <FileTree />

            <div className="mt-auto p-2 border-t border-[rgba(90,179,204,0.04)]">
              <ins
                className="adsbygoogle"
                style={{ display: "block", width: "160px", height: "300px" }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID ?? "ca-pub-XXXXXXXXXXXXXXXX"}
                data-ad-slot="YYYYYYYYYY"
                data-ad-format="vertical"
              />
            </div>
          </aside>
        )}

        {/* CENTER */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Tabs */}
          <div className="flex border-b border-[rgba(90,179,204,0.07)] flex-shrink-0 bg-[rgba(6,6,8,0.6)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCenterTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] tracking-[2px] border-r border-[rgba(90,179,204,0.05)] transition-all ${
                  centerTab === tab.id
                    ? "text-[#5ab3cc] bg-[rgba(90,179,204,0.05)] border-b border-b-[#5ab3cc]"
                    : "text-[#2a2a2e] hover:text-[#848484]"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {centerTab === "hologram" && (
              <div className="h-full flex flex-col min-h-0">
                <div className="flex-1 min-h-0" style={{ minHeight: "360px" }}>
                  <HologramViewer heightCm={heightCm} weightKg={weightKg} />
                </div>
                <div className="border-t border-[rgba(90,179,204,0.07)] flex-shrink-0">
                  <DiagnosisReport />
                </div>
              </div>
            )}

            {centerTab === "analyzer" && (
              <div className="max-w-2xl mx-auto py-4 px-4">
                <VisualAnalyzer />
              </div>
            )}

            {centerTab === "routine" && (
              <div className="max-w-2xl mx-auto">
                <RoutineTracker />
              </div>
            )}

            {centerTab === "plan" && (
              <div className="max-w-2xl mx-auto">
                <ActionPlan />
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside
          className="flex-shrink-0 flex flex-col overflow-hidden"
          style={{
            width: "288px",
            background: "rgba(6,6,8,0.82)",
            backdropFilter: "blur(12px)",
            borderLeft: "1px solid rgba(90,179,204,0.07)",
          }}
        >
          <AIChatPanel />
        </aside>
      </div>

      {/* Bottom AdSense */}
      <div className="flex-shrink-0 flex justify-center py-1 border-t border-[rgba(255,255,255,0.02)] bg-[#060608] relative z-10">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "728px", height: "60px" }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID ?? "ca-pub-XXXXXXXXXXXXXXXX"}
          data-ad-slot="ZZZZZZZZZZ"
          data-ad-format="horizontal"
        />
      </div>
    </div>
  );
}
