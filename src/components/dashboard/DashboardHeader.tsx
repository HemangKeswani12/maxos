"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MaxOSLogo } from "@/components/ui/MaxOSLogo";
import { useAppStore } from "@/store/useAppStore";
import Image from "next/image";

export function DashboardHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const { userProfile, leftSidebarOpen, setLeftSidebarOpen } = useAppStore();

  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(0,191,255,0.08)] bg-[rgba(5,5,5,0.95)] backdrop-blur-md flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="text-[#a0a0a0] hover:text-[#00bfff] transition-colors text-xs"
          title="Toggle sidebar"
        >
          ☰
        </button>
        <MaxOSLogo size="sm" />
        <div className="hidden lg:flex items-center gap-1 text-[9px] text-[#3a3a3a] font-mono">
          <span>DASHBOARD</span>
          <span className="text-[#1a1a1a]">/</span>
          <span className="text-[#00bfff]">v2.4.1</span>
        </div>
      </div>

      {/* System stats */}
      <div className="hidden md:flex items-center gap-4 text-[9px] font-mono">
        {userProfile?.height_cm && (
          <span className="text-[#3a3a3a]">
            H:<span className="text-[#a0a0a0]">{userProfile.height_cm}cm</span>
          </span>
        )}
        {userProfile?.weight_kg && (
          <span className="text-[#3a3a3a]">
            W:<span className="text-[#a0a0a0]">{userProfile.weight_kg}kg</span>
          </span>
        )}
        {userProfile?.height_cm && userProfile?.weight_kg && (
          <span className="text-[#3a3a3a]">
            BMI:<span className="text-[#00bfff]">
              {(userProfile.weight_kg / ((userProfile.height_cm / 100) ** 2)).toFixed(1)}
            </span>
          </span>
        )}
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-[#00ff00] animate-pulse" />
          <span className="text-[#3a3a3a]">LIVE</span>
        </div>
      </div>

      {/* User menu */}
      <div className="flex items-center gap-3">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full border border-[rgba(0,191,255,0.2)]"
          />
        )}
        <span className="hidden sm:block text-[10px] text-[#a0a0a0] max-w-[120px] truncate">
          {session?.user?.name ?? session?.user?.email}
        </span>
        <button
          onClick={() => router.push("/onboarding")}
          className="text-[9px] tracking-wider text-[#3a3a3a] hover:text-[#a0a0a0] transition-colors"
        >
          PROFILE
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-[9px] tracking-wider text-[#3a3a3a] hover:text-red-400 transition-colors border border-[rgba(255,0,0,0.1)] hover:border-[rgba(255,0,0,0.3)] px-2 py-1"
        >
          EXIT
        </button>
      </div>
    </header>
  );
}
