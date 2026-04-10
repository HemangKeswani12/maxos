"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { ChatMessage } from "@/types";

const SUGGESTED_QUERIES = [
  "Analyze my jaw ratios",
  "Best protocol for my BMI",
  "Explain mewing mechanism",
  "Skin texture fix stack",
  "Posture correction plan",
];

export function AIChatPanel() {
  const { chatMessages, addChatMessage, userProfile, diagnosisReport } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
          messages: [...chatMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[rgba(0,191,255,0.08)] flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-[9px] tracking-[3px] text-[#3a3a3a] uppercase">AI ENGINE</p>
          <p className="text-xs text-[#00bfff] font-bold">maxOS Assistant</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
          <span className="text-[9px] text-[#00ff00] tracking-wider">GROQ LIVE</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {chatMessages.length === 0 && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-2xl text-[#00bfff] mb-2">◈</div>
              <p className="text-[#a0a0a0] text-xs">
                Clinical AI. Biometric context injected.
              </p>
              <p className="text-[#3a3a3a] text-[10px] mt-1">
                Llama 3.3 70B · Groq · Ultra-low latency
              </p>
            </div>

            <div>
              <p className="text-[9px] tracking-[2px] text-[#3a3a3a] uppercase mb-2">
                SUGGESTED QUERIES
              </p>
              <div className="space-y-1">
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left text-[11px] text-[#a0a0a0] hover:text-[#00bfff] border border-[rgba(255,255,255,0.04)] hover:border-[rgba(0,191,255,0.2)] px-3 py-2 transition-all"
                  >
                    ▸ {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-5 h-5 rounded-full bg-[rgba(0,191,255,0.1)] border border-[rgba(0,191,255,0.3)] flex items-center justify-center text-[8px] text-[#00bfff] flex-shrink-0 mt-0.5 mr-2">
                ◈
              </div>
            )}
            <div
              className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-[rgba(0,191,255,0.08)] border border-[rgba(0,191,255,0.2)] text-white"
                  : "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#c0c0c0]"
              }`}
            >
              {msg.content.split("\n").map((line, li) => (
                <p key={li} className={li > 0 ? "mt-1" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[rgba(0,191,255,0.1)] border border-[rgba(0,191,255,0.3)] flex items-center justify-center text-[8px] text-[#00bfff]">
              ◈
            </div>
            <div className="flex gap-1 px-3 py-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-[#00bfff] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[rgba(0,191,255,0.08)] flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Query the engine..."
            rows={2}
            className="flex-1 bg-[rgba(0,0,0,0.4)] border border-[rgba(0,191,255,0.15)] text-white text-xs p-2 resize-none focus:border-[rgba(0,191,255,0.5)] focus:outline-none placeholder-[#3a3a3a] transition-colors"
            style={{ fontFamily: "Verdana, sans-serif" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-3 py-2 border border-[#00bfff] text-[#00bfff] text-xs hover:bg-[rgba(0,191,255,0.1)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            ▶
          </button>
        </div>
        <p className="text-[9px] text-[#3a3a3a] mt-1.5">
          ENTER to send · SHIFT+ENTER for newline · Context-injected
        </p>
      </div>
    </div>
  );
}
