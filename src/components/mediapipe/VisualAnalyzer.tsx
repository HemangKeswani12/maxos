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

      // Dynamic import of MediaPipe to avoid SSR issues
      const { FaceLandmarker, FilesetResolver, PoseLandmarker } = await import(
        "@mediapipe/tasks-vision"
      );

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: false,
        runningMode: "VIDEO",
        numFaces: 1,
      });

      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
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
        if (!ctx || video.readyState < 2) {
          animRef.current = requestAnimationFrame(detect);
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame
        ctx.drawImage(video, 0, 0);

        const now = performance.now();
        if (now === lastTime) {
          animRef.current = requestAnimationFrame(detect);
          return;
        }
        lastTime = now;

        // Face landmarks
        const faceResult = faceLandmarker.detectForVideo(video, now);
        const poseResult = poseLandmarker.detectForVideo(video, now);

        const report: DiagnosisReport = {};

        if (faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0) {
          const lm = faceResult.faceLandmarks[0];
          const w = canvas.width;
          const h = canvas.height;

          // Draw landmarks
          ctx.fillStyle = "rgba(0,191,255,0.6)";
          for (let i = 0; i < lm.length; i += 4) {
            ctx.beginPath();
            ctx.arc(lm[i].x * w, lm[i].y * h, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Bizygomatic: landmarks ~234 (left cheekbone) and ~454 (right cheekbone)
          if (lm[234] && lm[454]) {
            const biz =
              Math.abs(lm[234].x - lm[454].x) * w;
            report.bizygomatic = parseFloat(biz.toFixed(1));

            // Bigonial: landmarks ~172 (left jaw) and ~397 (right jaw)
            if (lm[172] && lm[397]) {
              const big = Math.abs(lm[172].x - lm[397].x) * w;
              report.bigonial = parseFloat(big.toFixed(1));
              report.jawWidthRatio = parseFloat((biz / big).toFixed(3));

              // Draw measurement lines
              ctx.strokeStyle = "#00bfff";
              ctx.lineWidth = 1.5;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(lm[234].x * w, lm[234].y * h);
              ctx.lineTo(lm[454].x * w, lm[454].y * h);
              ctx.stroke();

              ctx.strokeStyle = "#d4af37";
              ctx.beginPath();
              ctx.moveTo(lm[172].x * w, lm[172].y * h);
              ctx.lineTo(lm[397].x * w, lm[397].y * h);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }

          // Symmetry: compare left/right landmark distances from center
          const centerX = lm[0]?.x ?? 0.5;
          let symmetryScore = 0;
          const pairs = [
            [33, 263],  // eyes
            [61, 291],  // mouth corners
            [234, 454], // cheekbones
          ];
          let pairCount = 0;
          for (const [l, r] of pairs) {
            if (lm[l] && lm[r]) {
              const leftDist = Math.abs(lm[l].x - centerX);
              const rightDist = Math.abs(lm[r].x - centerX);
              const maxDist = Math.max(leftDist, rightDist);
              if (maxDist > 0) {
                symmetryScore += (Math.min(leftDist, rightDist) / maxDist) * 100;
                pairCount++;
              }
            }
          }
          if (pairCount > 0) {
            report.faceSymmetry = parseFloat((symmetryScore / pairCount).toFixed(1));
          }
        }

        // Pose landmarks for posture
        if (poseResult.landmarks && poseResult.landmarks.length > 0) {
          const pl = poseResult.landmarks[0];
          const w = canvas.width;
          const h = canvas.height;

          // Draw key pose points
          ctx.fillStyle = "#00ff00";
          const keyPoints = [11, 12, 23, 24]; // shoulders + hips
          for (const idx of keyPoints) {
            if (pl[idx]) {
              ctx.beginPath();
              ctx.arc(pl[idx].x * w, pl[idx].y * h, 5, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Shoulder asymmetry (Y-axis difference)
          if (pl[11] && pl[12]) {
            const shoulderDiff = Math.abs(pl[11].y - pl[12].y);
            const postureScore = Math.max(0, 100 - shoulderDiff * 500);
            report.postureScore = parseFloat(postureScore.toFixed(1));

            // Shoulder-hip ratio
            if (pl[23] && pl[24]) {
              const shoulderWidth = Math.abs(pl[11].x - pl[12].x);
              const hipWidth = Math.abs(pl[23].x - pl[24].x);
              if (hipWidth > 0) {
                report.shoulderHipRatio = parseFloat((shoulderWidth / hipWidth).toFixed(3));
              }
            }
          }
        }

        // HUD overlay
        ctx.fillStyle = "rgba(0,191,255,0.8)";
        ctx.font = "10px Verdana";
        ctx.fillText(`maxOS ANALYZER — LIVE`, 10, 18);
        ctx.fillStyle = "rgba(0,255,0,0.8)";
        ctx.fillText(`FACE: ${faceResult.faceLandmarks?.length > 0 ? "DETECTED" : "SEARCHING..."}`, 10, 34);
        ctx.fillText(`POSE: ${poseResult.landmarks?.length > 0 ? "DETECTED" : "SEARCHING..."}`, 10, 50);

        if (Object.keys(report).length > 0) {
          setDiagnosisReport(report);
        }

        animRef.current = requestAnimationFrame(detect);
      };

      animRef.current = requestAnimationFrame(detect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Camera access denied");
      setStatus("ERROR");
      setActive(false);
    }
  }, [setDiagnosisReport]);

  useEffect(() => {
    return () => {
      stopAnalysis();
    };
  }, [stopAnalysis]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[9px] tracking-[3px] text-[#3a3a3a] uppercase">VISUAL ANALYZER</p>
          <p className="text-xs text-white font-bold">MediaPipe Vision</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              active ? "bg-[#00ff00] animate-pulse" : "bg-[#3a3a3a]"
            }`}
          />
          <span className="text-[9px] font-mono text-[#a0a0a0]">{status}</span>
        </div>
      </div>

      <div className="relative bg-black border border-[rgba(0,191,255,0.1)] mb-3 aspect-video overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain"
        />
        {!active && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="text-[#3a3a3a] text-3xl">◉</div>
            <p className="text-[#3a3a3a] text-xs">Camera inactive</p>
            <p className="text-[9px] text-[#1a1a1a]">100% client-side · zero uploads</p>
          </div>
        )}
      </div>

      {error && (
        <div className="border border-red-900 bg-[rgba(255,0,0,0.05)] p-2 mb-3">
          <p className="text-red-400 text-[10px]">[ERROR] {error}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!active ? (
          <button
            onClick={startAnalysis}
            className="btn-primary flex-1 text-[10px] tracking-[2px]"
          >
            ▶ START ANALYSIS
          </button>
        ) : (
          <button
            onClick={stopAnalysis}
            className="flex-1 py-2 text-[10px] tracking-[2px] border border-red-800 text-red-400 hover:bg-[rgba(255,0,0,0.05)] transition-all"
          >
            ■ STOP
          </button>
        )}
      </div>

      <p className="text-[9px] text-[#3a3a3a] mt-2">
        All processing occurs in your browser. No data is transmitted.
      </p>

      {diagnosisReport && Object.keys(diagnosisReport).length > 0 && (
        <div className="mt-3 border border-[rgba(0,255,0,0.1)] p-3">
          <p className="text-[9px] tracking-[2px] text-[#00ff00] uppercase mb-2">
            LIVE MEASUREMENTS
          </p>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(diagnosisReport).map(([key, val]) => (
              <div key={key} className="text-[10px]">
                <span className="text-[#3a3a3a]">{key}: </span>
                <span className="text-white font-mono">{String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
