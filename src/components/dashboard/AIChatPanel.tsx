"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { ChatMessage } from "@/types";

const SUGGESTED_QUERIES = [
  "Analyze my jaw ratios and give me a protocol",
  "Best skin routine for my skin type",
  "How do I fix anterior pelvic tilt?",
  "Explain the mewing mechanism with evidence",
  "What should my shoulder-to-waist ratio be?",
  "How to reduce submental fat without surgery",
  "Best actives for hyperpigmentation on my type",
  "Posture correction priority stack",
];

export function AIChatPanel() {
  const { chatMessages, addChatMessage, userProfile, diagnosisReport } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: content.trim() };
    addChatMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          userProfile,
          diagnosisReport,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        addChatMessage({ role: "assistant", content: data.reply });
      }
    } catch {
      addChatMessage({
        role: "assistant",
        content: "CONNECTION ERROR. Check GROQ_API_KEY environment variable.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[rgba(90,179,204,0.07)] flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-[9px] tracking-[3px] text-[#2a2a2e] uppercase">AI ENGINE</p>
          <p className="text-xs text-[#5ab3cc] font-bold">bemaxxed Assistant</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-pulse" />
          <span className="text-[9px] text-[#52b788] tracking-wider">GROQ LIVE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {chatMessages.length === 0 && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-2xl text-[#5ab3cc] mb-2">◈</div>
              <p className="text-[#848484] text-xs">Clinical AI. Biometric context injected.</p>
              <p className="text-[#2a2a2e] text-[10px] mt-1">Llama 3.3 70B · Groq · Ultra-low latency</p>
            </div>
            <div>
              <p className="text-[9px] tracking-[2px] text-[#2a2a2e] uppercase mb-2">SUGGESTED</p>
              <div className="space-y-1">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left text-[11px] text-[#848484] hover:text-[#5ab3cc] border border-[rgba(255,255,255,0.03)] hover:border-[rgba(90,179,204,0.15)] px-3 py-1.5 transition-all"
                  >
                    ▸ {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-5 h-5 rounded-full bg-[rgba(90,179,204,0.08)] border border-[rgba(90,179,204,0.2)] flex items-center justify-center text-[8px] text-[#5ab3cc] flex-shrink-0 mt-0.5 mr-2">
                ◈
              </div>
            )}
            <div className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed ${
              msg.role === "user"
                ? "bg-[rgba(90,179,204,0.07)] border border-[rgba(90,179,204,0.15)] text-[#e8e8e8]"
                : "bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.04)] text-[#b0b0b0]"
            }`}>
              {msg.content.split("\n").map((line, li) => (
                <p key={li} className={li > 0 ? "mt-1" : ""}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[rgba(90,179,204,0.08)] border border-[rgba(90,179,204,0.2)] flex items-center justify-center text-[8px] text-[#5ab3cc]">◈</div>
            <div className="flex gap-1 px-3 py-2 bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.04)]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-[#5ab3cc] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[rgba(90,179,204,0.07)] flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Query the engine..."
            rows={2}
            className="flex-1 bg-[rgba(0,0,0,0.5)] border border-[rgba(90,179,204,0.12)] text-[#e8e8e8] text-xs p-2 resize-none focus:border-[rgba(90,179,204,0.4)] focus:outline-none placeholder-[#2a2a2e] transition-colors"
            style={{ fontFamily: "Verdana, sans-serif" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-3 py-2 border border-[#5ab3cc] text-[#5ab3cc] text-xs hover:bg-[rgba(90,179,204,0.08)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            ▶
          </button>
        </div>
        <p className="text-[9px] text-[#2a2a2e] mt-1.5">ENTER to send · SHIFT+ENTER for newline</p>
      </div>
    </div>
  );
}
