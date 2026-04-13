"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { DiagnosisReport } from "@/types";

export function VisualAnalyzer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("IDLE");
  const [error, setError] = useState<string | null>(null);
  const animRef = useRef<number>(0);
  const setDiagnosisReport = useAppStore((s) => s.setDiagnosisReport);
  const diagnosisReport = useAppStore((s) => s.diagnosisReport);

  const stopAnalysis = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setActive(false);
    setStatus("IDLE");
  }, []);

  const startAnalysis = useCallback(async () => {
    setError(null);
    setStatus("REQUESTING CAMERA...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });

      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setActive(true);
      setStatus("ANALYZING...");

      const { FaceLandmarker, FilesetResolver, PoseLandmarker } = await import("@mediapipe/tasks-vision");

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: false,
        runningMode: "VIDEO",
        numFaces: 1,
      });

      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      setStatus("LANDMARK DETECTION ACTIVE");
      let lastTime = -1;

      const detect = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx || video.readyState < 2) { animRef.current = requestAnimationFrame(detect); return; }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const now = performance.now();
        if (now === lastTime) { animRef.current = requestAnimationFrame(detect); return; }
        lastTime = now;

        const faceResult = faceLandmarker.detectForVideo(video, now);
        const poseResult = poseLandmarker.detectForVideo(video, now);
        const report: DiagnosisReport = {};

        if (faceResult.faceLandmarks?.length > 0) {
          const lm = faceResult.faceLandmarks[0];
          const w = canvas.width;
          const h = canvas.height;

          ctx.fillStyle = "rgba(90,179,204,0.5)";
          for (let i = 0; i < lm.length; i += 4) {
            ctx.beginPath();
            ctx.arc(lm[i].x * w, lm[i].y * h, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }

          if (lm[234] && lm[454]) {
            const biz = Math.abs(lm[234].x - lm[454].x) * w;
            report.bizygomatic = parseFloat(biz.toFixed(1));
            if (lm[172] && lm[397]) {
              const big = Math.abs(lm[172].x - lm[397].x) * w;
              report.bigonial = parseFloat(big.toFixed(1));
              report.jawWidthRatio = parseFloat((biz / big).toFixed(3));
              ctx.strokeStyle = "#5ab3cc"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
              ctx.beginPath(); ctx.moveTo(lm[234].x * w, lm[234].y * h); ctx.lineTo(lm[454].x * w, lm[454].y * h); ctx.stroke();
              ctx.strokeStyle = "#c4a44a";
              ctx.beginPath(); ctx.moveTo(lm[172].x * w, lm[172].y * h); ctx.lineTo(lm[397].x * w, lm[397].y * h); ctx.stroke();
              ctx.setLineDash([]);
            }
          }

          const centerX = lm[0]?.x ?? 0.5;
          let symmetryScore = 0; let pairCount = 0;
          const pairs = [[33, 263], [61, 291], [234, 454]];
          for (const [l, r] of pairs) {
            if (lm[l] && lm[r]) {
              const ld = Math.abs(lm[l].x - centerX);
              const rd = Math.abs(lm[r].x - centerX);
              const mx = Math.max(ld, rd);
              if (mx > 0) { symmetryScore += (Math.min(ld, rd) / mx) * 100; pairCount++; }
            }
          }
          if (pairCount > 0) report.faceSymmetry = parseFloat((symmetryScore / pairCount).toFixed(1));
        }

        if (poseResult.landmarks?.length > 0) {
          const pl = poseResult.landmarks[0];
          const w = canvas.width; const h = canvas.height;
          ctx.fillStyle = "#52b788";
          for (const idx of [11, 12, 23, 24]) {
            if (pl[idx]) { ctx.beginPath(); ctx.arc(pl[idx].x * w, pl[idx].y * h, 5, 0, Math.PI * 2); ctx.fill(); }
          }
          if (pl[11] && pl[12]) {
            report.postureScore = parseFloat(Math.max(0, 100 - Math.abs(pl[11].y - pl[12].y) * 500).toFixed(1));
            if (pl[23] && pl[24]) {
              const sw = Math.abs(pl[11].x - pl[12].x);
              const hw = Math.abs(pl[23].x - pl[24].x);
              if (hw > 0) report.shoulderHipRatio = parseFloat((sw / hw).toFixed(3));
            }
          }
        }

        ctx.fillStyle = "rgba(90,179,204,0.75)"; ctx.font = "10px Verdana";
        ctx.fillText("bemaxxed ANALYZER — LIVE", 10, 18);
        ctx.fillStyle = "rgba(82,183,136,0.75)";
        ctx.fillText(`FACE: ${faceResult.faceLandmarks?.length > 0 ? "DETECTED" : "SEARCHING..."}`, 10, 34);
        ctx.fillText(`POSE: ${poseResult.landmarks?.length > 0 ? "DETECTED" : "SEARCHING..."}`, 10, 50);

        if (Object.keys(report).length > 0) setDiagnosisReport(report);
        animRef.current = requestAnimationFrame(detect);
      };

      animRef.current = requestAnimationFrame(detect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Camera access denied");
      setStatus("ERROR");
      setActive(false);
    }
  }, [setDiagnosisReport]);

  useEffect(() => { return () => { stopAnalysis(); }; }, [stopAnalysis]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[9px] tracking-[3px] text-[#2a2a2e] uppercase">VISUAL ANALYZER</p>
          <p className="text-xs text-[#e8e8e8] font-bold">MediaPipe Vision</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#52b788] animate-pulse" : "bg-[#2a2a2e]"}`} />
          <span className="text-[9px] font-mono text-[#848484]">{status}</span>
        </div>
      </div>

      <div className="relative bg-black border border-[rgba(90,179,204,0.08)] mb-3 aspect-video overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-0" muted playsInline />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain" />
        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="text-[#2a2a2e] text-3xl">◉</div>
            <p className="text-[#2a2a2e] text-xs">Camera inactive</p>
            <p className="text-[9px] text-[#1a1a1e]">100% client-side · zero uploads</p>
          </div>
        )}
      </div>

      {error && (
        <div className="border border-red-900 bg-[rgba(255,0,0,0.04)] p-2 mb-3">
          <p className="text-red-400 text-[10px]">[ERROR] {error}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!active ? (
          <button onClick={startAnalysis} className="btn-primary flex-1 text-[10px] tracking-[2px]">
            ▶ START ANALYSIS
          </button>
        ) : (
          <button onClick={stopAnalysis} className="flex-1 py-2 text-[10px] tracking-[2px] border border-red-900 text-red-400 hover:bg-[rgba(255,0,0,0.04)] transition-all">
            ■ STOP
          </button>
        )}
      </div>

      <p className="text-[9px] text-[#2a2a2e] mt-2">All processing occurs in your browser. No data is transmitted.</p>

      {diagnosisReport && Object.keys(diagnosisReport).length > 0 && (
        <div className="mt-3 border border-[rgba(82,183,136,0.1)] p-3">
          <p className="text-[9px] tracking-[2px] text-[#52b788] uppercase mb-2">LIVE MEASUREMENTS</p>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(diagnosisReport).map(([key, val]) => (
              <div key={key} className="text-[10px]">
                <span className="text-[#2a2a2e]">{key}: </span>
                <span className="text-[#e8e8e8] font-mono">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
