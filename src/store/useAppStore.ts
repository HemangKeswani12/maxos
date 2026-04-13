import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, DiagnosisReport, ChatMessage } from "@/types";

interface AppState {
  // User profile
  userProfile: Partial<UserProfile> | null;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  clearUserProfile: () => void;

  // Hovered body part (from file tree → 3D mesh)
  hoveredBodyPart: string | null;
  setHoveredBodyPart: (meshName: string | null) => void;

  // Active file tree node
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;

  // Diagnosis report from MediaPipe
  diagnosisReport: DiagnosisReport | null;
  setDiagnosisReport: (report: DiagnosisReport) => void;

  // Chat messages
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  // UI state
  analyzerOpen: boolean;
  setAnalyzerOpen: (open: boolean) => void;

  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userProfile: null,
      setUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),
      clearUserProfile: () => set({ userProfile: null }),

      hoveredBodyPart: null,
      setHoveredBodyPart: (meshName) => set({ hoveredBodyPart: meshName }),

      activeNodeId: null,
      setActiveNodeId: (id) => set({ activeNodeId: id }),

      diagnosisReport: null,
      setDiagnosisReport: (report) => set({ diagnosisReport: report }),

      chatMessages: [],
      addChatMessage: (msg) =>
        set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
      clearChat: () => set({ chatMessages: [] }),

      analyzerOpen: false,
      setAnalyzerOpen: (open) => set({ analyzerOpen: open }),

      leftSidebarOpen: true,
      setLeftSidebarOpen: (open) => set({ leftSidebarOpen: open }),
    }),
    {
      name: "bemaxxed-store",
      partialize: (state) => ({
        userProfile: state.userProfile,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
