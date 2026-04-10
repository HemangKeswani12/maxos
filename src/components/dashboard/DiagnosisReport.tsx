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
        <span className="text-[#a0a0a0]">{label}</span>
        <span className={isGood ? "text-[#00ff00]" : "text-[#d4af37]"}>
          {value.toFixed(2)}{unit}
          <span className="text-[#3a3a3a] ml-1">/ {optimal.toFixed(2)}{unit}</span>
        </span>
      </div>
      <div className="h-1 bg-[rgba(255,255,255,0.05)] relative">
        <div
          className="h-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: isGood ? "#00ff00" : "#d4af37",
          }}
        />
        <div
          className="absolute top-0 h-full w-px bg-[rgba(0,191,255,0.5)]"
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
        <div className="text-[#3a3a3a] text-2xl mb-3">◉</div>
        <p className="text-[#3a3a3a] text-xs">
          No diagnosis data. Run the Visual Analyzer below.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="text-[9px] tracking-[3px] text-[#00bfff] uppercase mb-4">
        BIOMETRIC DIAGNOSIS
      </p>

      {diagnosisReport.bizygomatic !== undefined && (
        <MetricBar
          label="Bizygomatic Width"
          value={diagnosisReport.bizygomatic}
          optimal={150}
          unit="mm"
        />
      )}

      {diagnosisReport.bigonial !== undefined && (
        <MetricBar
          label="Bigonial Width"
          value={diagnosisReport.bigonial}
          optimal={120}
          unit="mm"
        />
      )}

      {diagnosisReport.jawWidthRatio !== undefined && (
        <MetricBar
          label="Jaw Width Ratio (biz/big)"
          value={diagnosisReport.jawWidthRatio}
          optimal={1.3}
          unit="x"
        />
      )}

      {diagnosisReport.faceSymmetry !== undefined && (
        <MetricBar
          label="Facial Symmetry Score"
          value={diagnosisReport.faceSymmetry}
          optimal={95}
          unit="%"
        />
      )}

      {diagnosisReport.postureScore !== undefined && (
        <MetricBar
          label="Posture Score"
          value={diagnosisReport.postureScore}
          optimal={90}
          unit="%"
        />
      )}

      {diagnosisReport.shoulderHipRatio !== undefined && (
        <MetricBar
          label="Shoulder-Hip Ratio"
          value={diagnosisReport.shoulderHipRatio}
          optimal={1.6}
          unit="x"
        />
      )}
    </div>
  );
}
