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

// 3D viewer must be dynamic (no SSR)
const HologramViewer = dynamic(
  () => import("@/components/three/HologramViewer").then((m) => m.HologramViewer),
  { ssr: false, loading: () => <HologramPlaceholder /> }
);

function HologramPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#00bfff] text-4xl mb-3 animate-pulse">◈</div>
        <p className="text-[#3a3a3a] text-xs font-mono">LOADING HOLOGRAPHIC ENGINE...</p>
      </div>
    </div>
  );
}

type CenterTab = "hologram" | "analyzer" | "routine" | "plan";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userProfile, leftSidebarOpen } = useAppStore();
  const [centerTab, setCenterTab] = useState<CenterTab>("hologram");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#00bfff] text-4xl mb-4 animate-pulse">◈</div>
          <p className="text-[#a0a0a0] text-xs font-mono tracking-widest">AUTHENTICATING...</p>
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
    <div className="h-screen bg-[#050505] flex flex-col overflow-hidden">
      <div className="holo-grid fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      <DashboardHeader />

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* LEFT SIDEBAR — File Tree */}
        {leftSidebarOpen && (
          <aside className="w-56 flex-shrink-0 glass-panel border-r border-[rgba(0,191,255,0.08)] border-t-0 border-l-0 border-b-0 overflow-hidden flex flex-col">
            <FileTree />

            {/* AdSense sidebar slot */}
            <div className="mt-auto p-2 border-t border-[rgba(0,191,255,0.04)]">
              <ins
                className="adsbygoogle"
                style={{ display: "block", width: "160px", height: "600px" }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID ?? "ca-pub-XXXXXXXXXXXXXXXX"}
                data-ad-slot="YYYYYYYYYY"
                data-ad-format="vertical"
              />
            </div>
          </aside>
        )}

        {/* CENTER — Main Engine */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Tab bar */}
          <div className="flex border-b border-[rgba(0,191,255,0.08)] flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCenterTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] tracking-[2px] border-r border-[rgba(0,191,255,0.06)] transition-all ${
                  centerTab === tab.id
                    ? "text-[#00bfff] bg-[rgba(0,191,255,0.06)] border-b border-b-[#00bfff]"
                    : "text-[#3a3a3a] hover:text-[#a0a0a0]"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {centerTab === "hologram" && (
              <div className="h-full flex flex-col">
                <div className="flex-1 min-h-0" style={{ minHeight: "400px" }}>
                  <HologramViewer heightCm={heightCm} weightKg={weightKg} />
                </div>
                <div className="border-t border-[rgba(0,191,255,0.08)] flex-shrink-0">
                  <DiagnosisReport />
                </div>
              </div>
            )}

            {centerTab === "analyzer" && (
              <div className="max-w-2xl mx-auto py-4">
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

        {/* RIGHT SIDEBAR — AI Chat */}
        <aside className="w-72 flex-shrink-0 glass-panel border-l border-[rgba(0,191,255,0.08)] border-t-0 border-r-0 border-b-0 flex flex-col overflow-hidden">
          <AIChatPanel />
        </aside>
      </div>

      {/* Bottom AdSense bar */}
      <div className="flex-shrink-0 flex justify-center py-1 border-t border-[rgba(255,255,255,0.02)] bg-[#050505] relative z-10">
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
