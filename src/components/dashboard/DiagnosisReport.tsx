"use client";

import { useAppStore } from "@/store/useAppStore";

interface MetricBarProps {
  label: string;
  value: number;
  optimal: number;
  unit?: string;
  higherIsBetter?: boolean;
}

function MetricBar({ label, value, optimal, unit = "", higherIsBetter = true }: MetricBarProps) {
  const ratio = value / optimal;
  const pct = Math.min(100, (value / (optimal * 1.5)) * 100);
  const isGood = higherIsBetter ? ratio >= 0.9 : ratio <= 1.1;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-[#848484]">{label}</span>
        <span className={isGood ? "text-[#52b788]" : "text-[#c4a44a]"}>
          {value.toFixed(2)}{unit}
          <span className="text-[#2a2a2e] ml-1">/ {optimal.toFixed(2)}{unit}</span>
        </span>
      </div>
      <div className="h-0.5 bg-[rgba(255,255,255,0.04)] relative">
        <div
          className="h-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: isGood ? "#52b788" : "#c4a44a" }}
        />
        <div
          className="absolute top-0 h-full w-px bg-[rgba(90,179,204,0.4)]"
          style={{ left: `${(optimal / (optimal * 1.5)) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function DiagnosisReport() {
  const { diagnosisReport } = useAppStore();

  if (!diagnosisReport || Object.keys(diagnosisReport).length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-[#2a2a2e] text-2xl mb-3">◉</div>
        <p className="text-[#2a2a2e] text-xs">No diagnosis data. Run the Visual Analyzer.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="text-[9px] tracking-[3px] text-[#5ab3cc] uppercase mb-4">BIOMETRIC DIAGNOSIS</p>
      {diagnosisReport.bizygomatic !== undefined && (
        <MetricBar label="Bizygomatic Width" value={diagnosisReport.bizygomatic} optimal={150} unit="mm" />
      )}
      {diagnosisReport.bigonial !== undefined && (
        <MetricBar label="Bigonial Width" value={diagnosisReport.bigonial} optimal={120} unit="mm" />
      )}
      {diagnosisReport.jawWidthRatio !== undefined && (
        <MetricBar label="Jaw Width Ratio (biz/big)" value={diagnosisReport.jawWidthRatio} optimal={1.3} unit="x" />
      )}
      {diagnosisReport.faceSymmetry !== undefined && (
        <MetricBar label="Facial Symmetry Score" value={diagnosisReport.faceSymmetry} optimal={95} unit="%" />
      )}
      {diagnosisReport.postureScore !== undefined && (
        <MetricBar label="Posture Score" value={diagnosisReport.postureScore} optimal={90} unit="%" />
      )}
      {diagnosisReport.shoulderHipRatio !== undefined && (
        <MetricBar label="Shoulder-Hip Ratio" value={diagnosisReport.shoulderHipRatio} optimal={1.6} unit="x" />
      )}
    </div>
  );
}
