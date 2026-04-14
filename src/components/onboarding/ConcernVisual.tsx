"use client";

import React from "react";

interface VisualPair {
  concern: React.ReactNode;
  ideal: React.ReactNode;
  concernLabel: string;
  idealLabel: string;
}

// ─── SVG Primitives ──────────────────────────────────────────────────────────
const FaceBase = ({ cx = 50, cy = 44, rx = 22, ry = 28, fill = "none", stroke = "#5ab3cc", strokeWidth = 1.2 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
);

const Eye = ({ cx, cy, open = true, dark = false }: { cx: number; cy: number; open?: boolean; dark?: boolean }) => (
  <g>
    <ellipse cx={cx} cy={cy} rx={5} ry={open ? 3 : 1.5} fill="#1a1a1e" stroke="#5ab3cc" strokeWidth={0.8} />
    {dark && <ellipse cx={cx} cy={cy + 4} rx={5.5} ry={2.5} fill="rgba(80,50,120,0.7)" />}
  </g>
);

const EyeBag = ({ cx, cy }: { cx: number; cy: number }) => (
  <ellipse cx={cx} cy={cy + 5} rx={6} ry={3.5} fill="rgba(100,80,140,0.55)" stroke="none" />
);

const SpineBase = ({ x, yTop, height, curved = 0 }: { x: number; yTop: number; height: number; curved?: number }) => {
  const mid = yTop + height / 2;
  return (
    <path
      d={`M ${x} ${yTop} C ${x + curved} ${mid - 20}, ${x - curved} ${mid + 20}, ${x} ${yTop + height}`}
      stroke="#5ab3cc"
      strokeWidth={2.5}
      fill="none"
      strokeLinecap="round"
    />
  );
};

const Vertebra = ({ x, y, w = 8 }: { x: number; y: number; w?: number }) => (
  <rect x={x - w / 2} y={y - 1.5} width={w} height={3} rx={1} fill="#5ab3cc" opacity={0.6} />
);

// ─── Individual illustrations ──────────────────────────────────────────────
const VISUALS: Record<string, VisualPair> = {

  // ── SKIN ──────────────────────────────────────────────────────────────────
  acne: {
    concernLabel: "Acne / Breakouts",
    idealLabel: "Clear Skin",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase fill="rgba(180,120,80,0.15)" />
        {[
          [40, 30, 3], [58, 32, 2.5], [35, 45, 2], [62, 47, 3.2], [45, 55, 2.8],
          [55, 38, 2], [42, 62, 2.2], [60, 58, 2.5], [50, 28, 2], [38, 52, 2],
          [63, 35, 1.8], [47, 42, 3], [56, 52, 2.2],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#c06060" stroke="#a03030" strokeWidth={0.4} opacity={0.85} />
        ))}
        <Eye cx={40} cy={38} />
        <Eye cx={60} cy={38} />
        <path d="M 43 68 Q 50 72 57 68" stroke="#5ab3cc" strokeWidth={1} fill="none" />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase fill="rgba(100,160,130,0.1)" stroke="#52b788" />
        <Eye cx={40} cy={38} />
        <Eye cx={60} cy={38} />
        <path d="M 43 68 Q 50 74 57 68" stroke="#52b788" strokeWidth={1} fill="none" />
        <circle cx={50} cy={50} r={22} fill="none" stroke="#52b788" strokeWidth={0.3} strokeDasharray="2 4" opacity={0.4} />
      </svg>
    ),
  },

  "dark-circles": {
    concernLabel: "Dark Circles",
    idealLabel: "Bright Eyes",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase fill="rgba(80,60,60,0.1)" />
        <Eye cx={38} cy={44} dark />
        <Eye cx={62} cy={44} dark />
        <EyeBag cx={38} cy={44} />
        <EyeBag cx={62} cy={44} />
        <ellipse cx={38} cy={52} rx={7} ry={4} fill="rgba(60,40,90,0.4)" />
        <ellipse cx={62} cy={52} rx={7} ry={4} fill="rgba(60,40,90,0.4)" />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase fill="rgba(100,160,130,0.08)" stroke="#52b788" />
        <Eye cx={38} cy={44} />
        <Eye cx={62} cy={44} />
        {[[-2, -2], [2, -1], [-1, 2]].map(([dx, dy], i) => (
          <circle key={i} cx={38 + dx} cy={44 + dy} r={0.5} fill="#52b788" opacity={0.6} />
        ))}
      </svg>
    ),
  },

  hyperpigmentation: {
    concernLabel: "Hyperpigmentation",
    idealLabel: "Even Tone",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase fill="rgba(140,100,60,0.15)" />
        <ellipse cx={42} cy={38} rx={8} ry={6} fill="rgba(120,70,40,0.6)" opacity={0.7} />
        <ellipse cx={60} cy={42} rx={7} ry={5} fill="rgba(110,65,35,0.55)" opacity={0.7} />
        <ellipse cx={48} cy={58} rx={6} ry={4} fill="rgba(130,75,45,0.5)" opacity={0.65} />
        <ellipse cx={36} cy={52} rx={5} ry={4} fill="rgba(100,60,30,0.5)" opacity={0.6} />
        <Eye cx={40} cy={38} />
        <Eye cx={60} cy={38} />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase fill="rgba(200,170,140,0.2)" stroke="#52b788" />
        <Eye cx={40} cy={38} />
        <Eye cx={60} cy={38} />
        <ellipse cx={50} cy={50} rx={22} ry={27} fill="rgba(210,180,150,0.1)" stroke="none" />
      </svg>
    ),
  },

  redness: {
    concernLabel: "Redness / Rosacea",
    idealLabel: "Calm Skin",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase fill="rgba(200,80,80,0.18)" stroke="#c06060" />
        <ellipse cx={38} cy={52} rx={12} ry={9} fill="rgba(220,80,80,0.35)" />
        <ellipse cx={62} cy={52} rx={12} ry={9} fill="rgba(220,80,80,0.35)" />
        <ellipse cx={50} cy={45} rx={8} ry={6} fill="rgba(200,70,70,0.25)" />
        <Eye cx={40} cy={38} />
        <Eye cx={60} cy={38} />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase fill="rgba(220,190,170,0.15)" stroke="#52b788" />
        <Eye cx={40} cy={38} />
        <Eye cx={60} cy={38} />
      </svg>
    ),
  },

  "large-pores": {
    concernLabel: "Large Pores",
    idealLabel: "Smooth Texture",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <rect x={20} y={20} width={60} height={60} rx={4} fill="rgba(140,110,80,0.15)" stroke="#5ab3cc" strokeWidth={0.8} />
        {Array.from({ length: 24 }).map((_, i) => {
          const x = 28 + (i % 6) * 9;
          const y = 28 + Math.floor(i / 6) * 9;
          const r = 1 + Math.random() * 1.5;
          return <circle key={i} cx={x} cy={y} r={r} fill="#666" opacity={0.6} />;
        })}
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <rect x={20} y={20} width={60} height={60} rx={4} fill="rgba(200,180,160,0.2)" stroke="#52b788" strokeWidth={0.8} />
        <rect x={20} y={20} width={60} height={60} rx={4} fill="url(#smoothGrad)" opacity={0.3} />
        <defs>
          <linearGradient id="smoothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#52b788" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#5ab3cc" stopOpacity={0.05} />
          </linearGradient>
        </defs>
      </svg>
    ),
  },

  "eye-bags": {
    concernLabel: "Eye Bags / Puffiness",
    idealLabel: "Flat Under-Eye",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase />
        <Eye cx={38} cy={42} />
        <Eye cx={62} cy={42} />
        <ellipse cx={38} cy={49} rx={8} ry={5} fill="rgba(160,140,180,0.5)" />
        <ellipse cx={62} cy={49} rx={8} ry={5} fill="rgba(160,140,180,0.5)" />
        <path d="M 30 46 Q 38 52 46 46" stroke="#9080a0" strokeWidth={0.8} fill="none" opacity={0.7} />
        <path d="M 54 46 Q 62 52 70 46" stroke="#9080a0" strokeWidth={0.8} fill="none" opacity={0.7} />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase stroke="#52b788" />
        <Eye cx={38} cy={42} />
        <Eye cx={62} cy={42} />
      </svg>
    ),
  },

  // ── FACE STRUCTURE ─────────────────────────────────────────────────────────
  jawline: {
    concernLabel: "Soft / Undefined Jaw",
    idealLabel: "Defined Jawline",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* Side profile - soft jaw */}
        <path d="M 35 20 Q 58 20 62 30 Q 68 40 66 55 Q 65 72 55 80 Q 45 87 40 75 Q 32 60 32 45 Q 32 30 35 20 Z"
          fill="rgba(140,110,80,0.15)" stroke="#5ab3cc" strokeWidth={1.2} />
        <ellipse cx={55} cy={73} rx={12} ry={7} fill="rgba(140,100,70,0.3)" />
        <circle cx={58} cy={28} r={3} fill="#5ab3cc" opacity={0.4} />
        <Eye cx={57} cy={34} />
        <path d="M 44 78 Q 50 83 57 79" stroke="#5ab3cc" strokeWidth={0.8} fill="none" />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 35 20 Q 58 20 63 30 Q 68 40 67 54 Q 67 65 62 73 Q 55 80 50 80 Q 43 80 38 73 Q 33 65 33 54 Q 33 35 35 20 Z"
          fill="rgba(100,160,130,0.1)" stroke="#52b788" strokeWidth={1.2} />
        <path d="M 38 73 L 50 80 L 62 73" stroke="#52b788" strokeWidth={1.5} fill="none" strokeLinejoin="round" />
        <Eye cx={57} cy={34} />
        <path d="M 44 78 Q 50 83 57 79" stroke="#52b788" strokeWidth={0.8} fill="none" />
      </svg>
    ),
  },

  "jaw-fat": {
    concernLabel: "Double Chin",
    idealLabel: "Clean Jaw Angle",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 30 25 Q 50 20 70 25 Q 74 40 73 56 Q 70 72 60 80 Q 50 84 40 80 Q 30 72 27 56 Q 26 40 30 25 Z"
          fill="rgba(160,120,80,0.15)" stroke="#5ab3cc" strokeWidth={1.2} />
        <ellipse cx={50} cy={86} rx={20} ry={9} fill="rgba(160,120,80,0.4)" />
        <ellipse cx={50} cy={81} rx={18} ry={6} fill="rgba(140,110,70,0.3)" />
        <Eye cx={40} cy={42} />
        <Eye cx={60} cy={42} />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 32 25 Q 50 20 68 25 Q 72 40 71 56 Q 68 70 58 77 Q 50 80 42 77 Q 32 70 29 56 Q 28 40 32 25 Z"
          fill="rgba(100,160,130,0.1)" stroke="#52b788" strokeWidth={1.2} />
        <path d="M 38 77 L 50 82 L 62 77" stroke="#52b788" strokeWidth={1.5} fill="none" />
        <Eye cx={40} cy={42} />
        <Eye cx={60} cy={42} />
      </svg>
    ),
  },

  mewing: {
    concernLabel: "Incorrect Tongue Posture",
    idealLabel: "Correct Tongue Posture",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* Side head with tongue down */}
        <ellipse cx={50} cy={40} rx={24} ry={28} fill="rgba(140,110,80,0.12)" stroke="#5ab3cc" strokeWidth={1} />
        <rect x={32} y={58} width={30} height={8} rx={2} fill="rgba(80,80,100,0.3)" stroke="#5ab3cc" strokeWidth={0.8} />
        <rect x={32} y={60} width={30} height={8} rx={2} fill="rgba(180,100,100,0.4)" />
        <text x={50} y={86} textAnchor="middle" fontSize={7} fill="#848484">tongue low</text>
        <path d="M 36 58 Q 50 74 64 58" stroke="#c06060" strokeWidth={1} fill="none" strokeDasharray="2 2" />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <ellipse cx={50} cy={40} rx={24} ry={28} fill="rgba(100,160,130,0.08)" stroke="#52b788" strokeWidth={1} />
        <rect x={32} y={48} width={30} height={6} rx={2} fill="rgba(82,183,136,0.4)" />
        <rect x={32} y={54} width={30} height={4} rx={2} fill="rgba(80,80,100,0.2)" stroke="#5ab3cc" strokeWidth={0.5} />
        <text x={50} y={82} textAnchor="middle" fontSize={7} fill="#52b788">tongue on palate</text>
        <line x1={34} y1={48} x2={62} y2={48} stroke="#52b788" strokeWidth={1.5} opacity={0.8} />
      </svg>
    ),
  },

  // ── POSTURE ────────────────────────────────────────────────────────────────
  "forward-head": {
    concernLabel: "Forward Head Posture",
    idealLabel: "Neutral Alignment",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* Side silhouette with FHP */}
        <line x1={50} y1={5} x2={50} y2={95} stroke="#2a2a2e" strokeWidth={0.8} strokeDasharray="3 3" />
        {/* Spine */}
        <path d="M 54 50 C 56 45 58 35 65 20" stroke="#5ab3cc" strokeWidth={2} fill="none" />
        <path d="M 54 50 C 52 60 52 70 53 85" stroke="#5ab3cc" strokeWidth={2} fill="none" />
        {/* Head - forward */}
        <circle cx={68} cy={16} r={10} fill="rgba(140,110,80,0.2)" stroke="#c4a44a" strokeWidth={1.2} />
        {/* Body */}
        <ellipse cx={53} cy={62} rx={8} ry={16} fill="rgba(90,179,204,0.1)" stroke="#5ab3cc" strokeWidth={0.8} />
        <text x={50} y={97} textAnchor="middle" fontSize={7} fill="#c06060">ear ahead of shoulder</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <line x1={50} y1={5} x2={50} y2={95} stroke="#2a2a2e" strokeWidth={0.8} strokeDasharray="3 3" />
        <path d="M 50 50 C 51 44 51 35 50 20" stroke="#52b788" strokeWidth={2} fill="none" />
        <path d="M 50 50 C 49 60 50 70 50 85" stroke="#52b788" strokeWidth={2} fill="none" />
        <circle cx={50} cy={16} r={10} fill="rgba(82,183,136,0.15)" stroke="#52b788" strokeWidth={1.2} />
        <ellipse cx={50} cy={62} rx={8} ry={16} fill="rgba(82,183,136,0.08)" stroke="#52b788" strokeWidth={0.8} />
        <text x={50} y={97} textAnchor="middle" fontSize={7} fill="#52b788">ear over shoulder</text>
      </svg>
    ),
  },

  "anterior-pelvic": {
    concernLabel: "Anterior Pelvic Tilt",
    idealLabel: "Neutral Pelvis",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* Spine exaggerated lordosis */}
        <path d="M 50 20 C 58 30 58 42 50 50 C 42 55 42 65 50 72" stroke="#5ab3cc" strokeWidth={2} fill="none" />
        {/* Pelvis tilted */}
        <path d="M 35 58 L 65 54 L 65 68 L 35 72 Z" fill="rgba(196,164,74,0.25)" stroke="#c4a44a" strokeWidth={1.2} />
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#c06060">front tilts down</text>
        {/* Arrow showing tilt */}
        <path d="M 55 56 L 60 52 L 60 56" fill="#c06060" stroke="#c06060" strokeWidth={0.5} />
        <path d="M 45 70 L 40 74 L 40 70" fill="#c06060" stroke="#c06060" strokeWidth={0.5} />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 50 20 C 52 30 50 40 50 50 C 50 58 50 65 50 72" stroke="#52b788" strokeWidth={2} fill="none" />
        <path d="M 35 58 L 65 58 L 65 68 L 35 68 Z" fill="rgba(82,183,136,0.2)" stroke="#52b788" strokeWidth={1.2} />
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#52b788">neutral position</text>
      </svg>
    ),
  },

  kyphosis: {
    concernLabel: "Kyphosis (Rounded Back)",
    idealLabel: "Upright Posture",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 50 22 C 50 22 58 30 64 42 C 68 50 62 60 56 68 C 52 75 52 82 52 88"
          stroke="#5ab3cc" strokeWidth={2} fill="none" strokeLinecap="round" />
        <circle cx={50} cy={18} r={9} fill="rgba(140,110,80,0.15)" stroke="#5ab3cc" strokeWidth={1} />
        {/* Spine vertebrae */}
        {[30, 38, 46, 56, 65, 74].map((y, i) => {
          const x = i < 3 ? 50 + i * 3 : 52 - (i - 3) * 2;
          return <circle key={i} cx={x} cy={y} r={2} fill="#5ab3cc" opacity={0.5} />;
        })}
        <text x={50} y={98} textAnchor="middle" fontSize={7} fill="#c06060">excessive curve</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 50 22 C 52 32 48 42 50 52 C 52 62 48 72 50 88"
          stroke="#52b788" strokeWidth={2} fill="none" strokeLinecap="round" />
        <circle cx={50} cy={18} r={9} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={1} />
        {[30, 40, 50, 60, 70, 80].map((y, i) => (
          <circle key={i} cx={50} cy={y} r={2} fill="#52b788" opacity={0.5} />
        ))}
        <text x={50} y={98} textAnchor="middle" fontSize={7} fill="#52b788">natural S-curve</text>
      </svg>
    ),
  },

  "rounded-shoulders": {
    concernLabel: "Rounded / Rolled Shoulders",
    idealLabel: "Open, Retracted",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx={50} cy={22} r={10} fill="rgba(90,179,204,0.12)" stroke="#5ab3cc" strokeWidth={1} />
        <rect x={32} y={34} width={36} height={30} rx={4} fill="rgba(90,179,204,0.1)" stroke="#5ab3cc" strokeWidth={1} />
        {/* Rounded shoulder curves */}
        <path d="M 32 38 Q 22 44 26 54" stroke="#c4a44a" strokeWidth={2} fill="none" />
        <path d="M 68 38 Q 78 44 74 54" stroke="#c4a44a" strokeWidth={2} fill="none" />
        <text x={50} y={80} textAnchor="middle" fontSize={7} fill="#c06060">shoulders rolled in</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx={50} cy={22} r={10} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={1} />
        <rect x={30} y={34} width={40} height={30} rx={4} fill="rgba(82,183,136,0.08)" stroke="#52b788" strokeWidth={1} />
        <path d="M 30 40 Q 20 38 22 48" stroke="#52b788" strokeWidth={2} fill="none" />
        <path d="M 70 40 Q 80 38 78 48" stroke="#52b788" strokeWidth={2} fill="none" />
        <text x={50} y={80} textAnchor="middle" fontSize={7} fill="#52b788">open, retracted</text>
      </svg>
    ),
  },

  "shoulder-asymmetry": {
    concernLabel: "Uneven Shoulders",
    idealLabel: "Level Shoulders",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx={50} cy={25} r={10} fill="rgba(90,179,204,0.12)" stroke="#5ab3cc" strokeWidth={1} />
        <path d="M 20 45 L 80 52" stroke="#c4a44a" strokeWidth={3} strokeLinecap="round" />
        <rect x={28} y={45} width={44} height={28} rx={3} fill="rgba(90,179,204,0.1)" stroke="#5ab3cc" strokeWidth={0.8} />
        <line x1={20} y1={45} x2={80} y2={45} stroke="#2a2a2e" strokeWidth={0.8} strokeDasharray="3 3" />
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#c06060">one shoulder higher</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx={50} cy={25} r={10} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={1} />
        <path d="M 20 45 L 80 45" stroke="#52b788" strokeWidth={3} strokeLinecap="round" />
        <rect x={28} y={45} width={44} height={28} rx={3} fill="rgba(82,183,136,0.08)" stroke="#52b788" strokeWidth={0.8} />
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#52b788">level alignment</text>
      </svg>
    ),
  },

  // ── PHYSIQUE ───────────────────────────────────────────────────────────────
  "body-fat": {
    concernLabel: "High Body Fat",
    idealLabel: "Lean Composition",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx={50} cy={18} r={9} fill="rgba(196,164,74,0.2)" stroke="#c4a44a" strokeWidth={1} />
        <ellipse cx={50} cy={48} rx={22} ry={26} fill="rgba(196,164,74,0.2)" stroke="#c4a44a" strokeWidth={1.2} />
        <ellipse cx={50} cy={42} rx={20} ry={10} fill="rgba(196,164,74,0.3)" />
        <ellipse cx={38} cy={72} rx={8} ry={18} fill="rgba(196,164,74,0.2)" stroke="#c4a44a" strokeWidth={0.8} />
        <ellipse cx={62} cy={72} rx={8} ry={18} fill="rgba(196,164,74,0.2)" stroke="#c4a44a" strokeWidth={0.8} />
        <text x={50} y={97} textAnchor="middle" fontSize={7} fill="#c4a44a">high BF%</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx={50} cy={18} r={9} fill="rgba(82,183,136,0.15)" stroke="#52b788" strokeWidth={1} />
        <ellipse cx={50} cy={48} rx={16} ry={26} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={1.2} />
        <ellipse cx={36} cy={72} rx={7} ry={18} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={0.8} />
        <ellipse cx={64} cy={72} rx={7} ry={18} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={0.8} />
        {/* Muscle lines */}
        <line x1={48} y1={38} x2={48} y2={58} stroke="#52b788" strokeWidth={0.8} opacity={0.5} />
        <line x1={52} y1={38} x2={52} y2={58} stroke="#52b788" strokeWidth={0.8} opacity={0.5} />
        <text x={50} y={97} textAnchor="middle" fontSize={7} fill="#52b788">lean 12–15%</text>
      </svg>
    ),
  },

  "shoulder-width": {
    concernLabel: "Narrow Shoulders",
    idealLabel: "V-Taper",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx={50} cy={14} r={8} fill="rgba(90,179,204,0.12)" stroke="#5ab3cc" strokeWidth={1} />
        {/* Narrow torso trapezoid */}
        <path d="M 38 24 L 62 24 L 60 70 L 40 70 Z" fill="rgba(196,164,74,0.15)" stroke="#c4a44a" strokeWidth={1.2} />
        {/* Legs */}
        <rect x={38} y={70} width={10} height={22} rx={3} fill="rgba(90,179,204,0.12)" stroke="#5ab3cc" strokeWidth={0.8} />
        <rect x={52} y={70} width={10} height={22} rx={3} fill="rgba(90,179,204,0.12)" stroke="#5ab3cc" strokeWidth={0.8} />
        <text x={50} y={98} textAnchor="middle" fontSize={7} fill="#c06060">shoulder:hip ≈ 1.1</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx={50} cy={14} r={8} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={1} />
        {/* Wide shoulder, narrow waist V-taper */}
        <path d="M 28 24 L 72 24 L 62 70 L 38 70 Z" fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={1.2} />
        <rect x={37} y={70} width={10} height={22} rx={3} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={0.8} />
        <rect x={53} y={70} width={10} height={22} rx={3} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={0.8} />
        <text x={50} y={98} textAnchor="middle" fontSize={7} fill="#52b788">shoulder:hip ≈ 1.6</text>
      </svg>
    ),
  },

  "muscle-mass": {
    concernLabel: "Low Muscle Mass",
    idealLabel: "Developed Physique",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx={50} cy={14} r={8} fill="rgba(90,179,204,0.1)" stroke="#5ab3cc" strokeWidth={1} />
        {/* Thin arms */}
        <rect x={25} y={26} width={5} height={28} rx={2} fill="rgba(90,179,204,0.1)" stroke="#5ab3cc" strokeWidth={0.8} />
        <rect x={70} y={26} width={5} height={28} rx={2} fill="rgba(90,179,204,0.1)" stroke="#5ab3cc" strokeWidth={0.8} />
        <rect x={36} y={24} width={28} height={30} rx={4} fill="rgba(90,179,204,0.1)" stroke="#5ab3cc" strokeWidth={1} />
        <rect x={37} y={54} width={10} height={24} rx={3} fill="rgba(90,179,204,0.1)" stroke="#5ab3cc" strokeWidth={0.8} />
        <rect x={53} y={54} width={10} height={24} rx={3} fill="rgba(90,179,204,0.1)" stroke="#5ab3cc" strokeWidth={0.8} />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <circle cx={50} cy={14} r={8} fill="rgba(82,183,136,0.15)" stroke="#52b788" strokeWidth={1} />
        {/* Wider arms with muscle */}
        <rect x={20} y={26} width={10} height={28} rx={3} fill="rgba(82,183,136,0.2)" stroke="#52b788" strokeWidth={0.8} />
        <rect x={70} y={26} width={10} height={28} rx={3} fill="rgba(82,183,136,0.2)" stroke="#52b788" strokeWidth={0.8} />
        <path d="M 30 26 L 70 26 L 66 54 L 34 54 Z" fill="rgba(82,183,136,0.15)" stroke="#52b788" strokeWidth={1} />
        <rect x={36} y={54} width={12} height={24} rx={4} fill="rgba(82,183,136,0.15)" stroke="#52b788" strokeWidth={0.8} />
        <rect x={52} y={54} width={12} height={24} rx={4} fill="rgba(82,183,136,0.15)" stroke="#52b788" strokeWidth={0.8} />
      </svg>
    ),
  },

  // ── HAIR ──────────────────────────────────────────────────────────────────
  "hair-loss": {
    concernLabel: "Hair Thinning / Loss",
    idealLabel: "Full Density",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* Top-down head view */}
        <ellipse cx={50} cy={50} rx={32} ry={38} fill="rgba(200,170,130,0.2)" stroke="#5ab3cc" strokeWidth={1} />
        {/* Visible scalp / thinning crown */}
        <ellipse cx={50} cy={44} rx={14} ry={16} fill="rgba(200,170,130,0.5)" stroke="#c4a44a" strokeWidth={0.8} strokeDasharray="2 2" />
        {/* Sparse hairs */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const r = 22 + Math.random() * 8;
          return <line key={i} x1={50} y1={50} x2={50 + Math.cos(angle) * r} y2={50 + Math.sin(angle) * r} stroke="#848484" strokeWidth={0.8} opacity={0.5} />;
        })}
        <text x={50} y={96} textAnchor="middle" fontSize={7} fill="#c06060">visible scalp</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <ellipse cx={50} cy={50} rx={32} ry={38} fill="rgba(82,183,136,0.1)" stroke="#52b788" strokeWidth={1} />
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = (i / 40) * Math.PI * 2;
          const r = 8 + Math.random() * 22;
          return <line key={i} x1={50} y1={50} x2={50 + Math.cos(angle) * r} y2={50 + Math.sin(angle) * r} stroke="#52b788" strokeWidth={0.8} opacity={0.6} />;
        })}
        <text x={50} y={96} textAnchor="middle" fontSize={7} fill="#52b788">full coverage</text>
      </svg>
    ),
  },

  "hair-texture": {
    concernLabel: "Frizzy / Brittle Hair",
    idealLabel: "Smooth & Healthy",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <ellipse cx={50} cy={30} rx={20} ry={24} fill="rgba(140,110,80,0.15)" stroke="#5ab3cc" strokeWidth={1} />
        {/* Frizzy lines emanating */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = ((i / 20) * Math.PI * 2) - Math.PI * 0.3;
          const len = 8 + Math.random() * 12;
          const sx = 50 + Math.cos(angle) * 20;
          const sy = 30 + Math.sin(angle) * 24;
          return <line key={i} x1={sx} y1={sy} x2={sx + Math.cos(angle) * len} y2={sy + Math.sin(angle) * len} stroke="#a08060" strokeWidth={0.8} opacity={0.7} />;
        })}
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#c06060">frizz / breakage</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <ellipse cx={50} cy={30} rx={20} ry={24} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={1} />
        {/* Smooth flowing lines */}
        {[-8, -4, 0, 4, 8].map((offset, i) => (
          <path key={i} d={`M ${50 + offset} 54 C ${50 + offset} 65 ${52 + offset} 72 ${50 + offset} 80`}
            stroke="#52b788" strokeWidth={1.2} fill="none" opacity={0.7} />
        ))}
        <text x={50} y={90} textAnchor="middle" fontSize={7} fill="#52b788">smooth, hydrated</text>
      </svg>
    ),
  },

  "hair-style": {
    concernLabel: "Unflattering Style",
    idealLabel: "Optimized Cut",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <ellipse cx={50} cy={42} rx={20} ry={26} fill="rgba(140,110,80,0.15)" stroke="#5ab3cc" strokeWidth={1} />
        <Eye cx={43} cy={45} />
        <Eye cx={57} cy={45} />
        {/* Combover / unflattering */}
        <path d="M 28 28 Q 40 20 72 28" stroke="#a08060" strokeWidth={3} fill="none" opacity={0.7} />
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#c06060">poor fit for face</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <ellipse cx={50} cy={42} rx={20} ry={26} fill="rgba(82,183,136,0.1)" stroke="#52b788" strokeWidth={1} />
        <Eye cx={43} cy={45} />
        <Eye cx={57} cy={45} />
        {/* Clean taper with height */}
        <path d="M 30 30 Q 50 18 70 30" stroke="#52b788" strokeWidth={2.5} fill="none" opacity={0.8} />
        <path d="M 30 30 Q 32 40 30 50" stroke="#5ab3cc" strokeWidth={1.5} fill="none" opacity={0.5} />
        <path d="M 70 30 Q 68 40 70 50" stroke="#5ab3cc" strokeWidth={1.5} fill="none" opacity={0.5} />
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#52b788">face-shape matched</text>
      </svg>
    ),
  },

  beard: {
    concernLabel: "Patchy / Sparse Beard",
    idealLabel: "Full Architecture",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase />
        <Eye cx={40} cy={38} />
        <Eye cx={60} cy={38} />
        {/* Sparse patches */}
        {[[35, 62, 8, 5], [55, 64, 6, 4], [45, 72, 10, 5]].map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(100,80,60,0.25)" />
        ))}
        <text x={50} y={90} textAnchor="middle" fontSize={7} fill="#c06060">patchy coverage</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase stroke="#52b788" />
        <Eye cx={40} cy={38} />
        <Eye cx={60} cy={38} />
        {/* Full beard coverage */}
        <path d="M 28 58 Q 50 85 72 58 Q 68 50 65 52 Q 50 57 35 52 Q 32 50 28 58 Z"
          fill="rgba(80,60,40,0.55)" stroke="#52b788" strokeWidth={0.8} />
        <text x={50} y={94} textAnchor="middle" fontSize={7} fill="#52b788">defined architecture</text>
      </svg>
    ),
  },

  // ── ORAL ──────────────────────────────────────────────────────────────────
  "yellow-teeth": {
    concernLabel: "Stained / Yellow Teeth",
    idealLabel: "Bright Enamel",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 28 42 Q 50 30 72 42 Q 74 60 72 70 Q 60 82 50 82 Q 40 82 28 70 Q 26 60 28 42 Z"
          fill="rgba(140,110,80,0.15)" stroke="#5ab3cc" strokeWidth={1} />
        {/* Yellow teeth */}
        <rect x={34} y={54} width={8} height={12} rx={2} fill="#c8a830" opacity={0.8} />
        <rect x={43} y={52} width={8} height={14} rx={2} fill="#c0a025" opacity={0.8} />
        <rect x={52} y={52} width={8} height={14} rx={2} fill="#c8a830" opacity={0.8} />
        <rect x={61} y={54} width={7} height={12} rx={2} fill="#c0a025" opacity={0.8} />
        <text x={50} y={92} textAnchor="middle" fontSize={7} fill="#c06060">discoloration</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 28 42 Q 50 30 72 42 Q 74 60 72 70 Q 60 82 50 82 Q 40 82 28 70 Q 26 60 28 42 Z"
          fill="rgba(82,183,136,0.1)" stroke="#52b788" strokeWidth={1} />
        <rect x={34} y={54} width={8} height={12} rx={2} fill="#e8e8e8" opacity={0.9} />
        <rect x={43} y={52} width={8} height={14} rx={2} fill="#f0f0f0" opacity={0.9} />
        <rect x={52} y={52} width={8} height={14} rx={2} fill="#f0f0f0" opacity={0.9} />
        <rect x={61} y={54} width={7} height={12} rx={2} fill="#e8e8e8" opacity={0.9} />
        <text x={50} y={92} textAnchor="middle" fontSize={7} fill="#52b788">bright enamel</text>
      </svg>
    ),
  },

  // ── POSTURE EXTRA ─────────────────────────────────────────────────────────
  "posterior-pelvic": {
    concernLabel: "Posterior Pelvic Tilt",
    idealLabel: "Neutral Pelvis",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 50 20 C 42 30 42 42 50 50 C 58 55 58 65 50 72" stroke="#5ab3cc" strokeWidth={2} fill="none" />
        <path d="M 35 62 L 65 66 L 65 76 L 35 72 Z" fill="rgba(196,164,74,0.25)" stroke="#c4a44a" strokeWidth={1.2} />
        <text x={50} y={86} textAnchor="middle" fontSize={7} fill="#c06060">back tilts down</text>
        <path d="M 35 72 L 30 76 L 30 72" fill="#c06060" stroke="#c06060" strokeWidth={0.5} />
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 50 20 C 52 30 50 40 50 50 C 50 58 50 65 50 72" stroke="#52b788" strokeWidth={2} fill="none" />
        <path d="M 35 62 L 65 62 L 65 72 L 35 72 Z" fill="rgba(82,183,136,0.2)" stroke="#52b788" strokeWidth={1.2} />
        <text x={50} y={86} textAnchor="middle" fontSize={7} fill="#52b788">neutral position</text>
      </svg>
    ),
  },

  scoliosis: {
    concernLabel: "Scoliosis / Spinal Curve",
    idealLabel: "Straight Spine",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* S-curve spine */}
        <path d="M 50 15 C 60 25 40 40 55 55 C 65 65 40 78 50 88"
          stroke="#c4a44a" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        {[20, 30, 42, 54, 65, 78].map((y, i) => {
          const x = i < 2 ? 55 - i * 3 : i < 4 ? 52 + i * 2 : 54 - i;
          return <circle key={i} cx={x} cy={y} r={2.5} fill="#c4a44a" opacity={0.6} />;
        })}
        <text x={50} y={98} textAnchor="middle" fontSize={7} fill="#c06060">lateral curve</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 50 15 C 52 35 48 55 50 88" stroke="#52b788" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        {[20, 32, 44, 56, 68, 80].map((y) => (
          <circle key={y} cx={50} cy={y} r={2.5} fill="#52b788" opacity={0.6} />
        ))}
        <text x={50} y={98} textAnchor="middle" fontSize={7} fill="#52b788">aligned</text>
      </svg>
    ),
  },

  "knee-valgus": {
    concernLabel: "Knock Knees (Valgus)",
    idealLabel: "Straight Alignment",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* Left leg bent in, right bent in */}
        <path d="M 35 20 L 45 55 L 38 90" stroke="#c4a44a" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M 65 20 L 55 55 L 62 90" stroke="#c4a44a" strokeWidth={3} fill="none" strokeLinecap="round" />
        <circle cx={45} cy={55} r={5} fill="rgba(196,164,74,0.3)" stroke="#c4a44a" strokeWidth={1} />
        <circle cx={55} cy={55} r={5} fill="rgba(196,164,74,0.3)" stroke="#c4a44a" strokeWidth={1} />
        <text x={50} y={98} textAnchor="middle" fontSize={7} fill="#c06060">knees cave in</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 35 20 L 36 55 L 36 90" stroke="#52b788" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M 65 20 L 64 55 L 64 90" stroke="#52b788" strokeWidth={3} fill="none" strokeLinecap="round" />
        <circle cx={36} cy={55} r={5} fill="rgba(82,183,136,0.2)" stroke="#52b788" strokeWidth={1} />
        <circle cx={64} cy={55} r={5} fill="rgba(82,183,136,0.2)" stroke="#52b788" strokeWidth={1} />
        <text x={50} y={98} textAnchor="middle" fontSize={7} fill="#52b788">neutral axis</text>
      </svg>
    ),
  },

  "flat-feet": {
    concernLabel: "Flat Feet / Overpronation",
    idealLabel: "Normal Arch",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* Foot side view, collapsed arch */}
        <path d="M 20 65 Q 50 68 80 65 L 78 72 Q 50 73 22 72 Z"
          fill="rgba(196,164,74,0.25)" stroke="#c4a44a" strokeWidth={1.2} />
        <line x1={20} y1={72} x2={80} y2={72} stroke="#5ab3cc" strokeWidth={1} strokeDasharray="3 2" />
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#c06060">collapsed arch</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 20 65 Q 35 58 50 62 Q 65 58 80 65 L 78 72 Q 50 73 22 72 Z"
          fill="rgba(82,183,136,0.2)" stroke="#52b788" strokeWidth={1.2} />
        <line x1={20} y1={72} x2={80} y2={72} stroke="#5ab3cc" strokeWidth={1} strokeDasharray="3 2" />
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#52b788">natural arch</text>
      </svg>
    ),
  },

  // ── EXTRAS ────────────────────────────────────────────────────────────────
  "stretch-marks": {
    concernLabel: "Stretch Marks",
    idealLabel: "Smooth Skin",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <rect x={20} y={20} width={60} height={60} rx={4} fill="rgba(140,100,80,0.12)" stroke="#5ab3cc" strokeWidth={0.8} />
        {[
          "M 30 30 Q 35 40 32 55", "M 40 25 Q 44 38 42 58", "M 52 28 Q 55 42 53 60",
          "M 62 32 Q 66 45 63 58", "M 36 35 Q 38 48 37 62",
        ].map((d, i) => (
          <path key={i} d={d} stroke="rgba(200,130,130,0.7)" strokeWidth={1.5} fill="none" />
        ))}
        <text x={50} y={92} textAnchor="middle" fontSize={7} fill="#c06060">stretch marks</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <rect x={20} y={20} width={60} height={60} rx={4} fill="rgba(82,183,136,0.1)" stroke="#52b788" strokeWidth={0.8} />
        <text x={50} y={55} textAnchor="middle" fontSize={8} fill="#52b788">smooth</text>
        <text x={50} y={92} textAnchor="middle" fontSize={7} fill="#52b788">even surface</text>
      </svg>
    ),
  },

  "keratosis-pilaris": {
    concernLabel: "Keratosis Pilaris",
    idealLabel: "Smooth Arms",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <rect x={35} y={10} width={30} height={80} rx={10} fill="rgba(140,110,80,0.15)" stroke="#5ab3cc" strokeWidth={1} />
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={40 + (i % 4) * 7} cy={18 + Math.floor(i / 4) * 9} r={1.5} fill="rgba(200,140,100,0.7)" />
        ))}
        <text x={50} y={96} textAnchor="middle" fontSize={7} fill="#c06060">chicken skin</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <rect x={35} y={10} width={30} height={80} rx={10} fill="rgba(82,183,136,0.12)" stroke="#52b788" strokeWidth={1} />
        <text x={50} y={96} textAnchor="middle" fontSize={7} fill="#52b788">smooth</text>
      </svg>
    ),
  },

  "weak-chin": {
    concernLabel: "Recessed Chin",
    idealLabel: "Projected Chin",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* Side profile - recessed chin */}
        <path d="M 45 20 Q 66 22 68 38 Q 70 52 65 66 Q 58 75 52 76 Q 46 74 44 70 Q 42 62 44 58 Q 46 50 43 44 Q 42 35 45 20 Z"
          fill="rgba(140,110,80,0.15)" stroke="#5ab3cc" strokeWidth={1} />
        <Eye cx={62} cy={34} />
        <line x1={52} y1={20} x2={52} y2={80} stroke="#c4a44a" strokeWidth={0.8} strokeDasharray="2 2" opacity={0.5} />
        <text x={50} y={90} textAnchor="middle" fontSize={7} fill="#c06060">chin behind nose line</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 45 20 Q 66 22 68 38 Q 70 52 65 66 Q 58 76 53 78 Q 48 76 47 70 Q 48 62 52 58 Q 54 50 52 44 Q 50 35 45 20 Z"
          fill="rgba(82,183,136,0.1)" stroke="#52b788" strokeWidth={1} />
        <Eye cx={62} cy={34} />
        <line x1={53} y1={20} x2={53} y2={82} stroke="#52b788" strokeWidth={0.8} strokeDasharray="2 2" opacity={0.5} />
        <text x={50} y={90} textAnchor="middle" fontSize={7} fill="#52b788">chin on vertical line</text>
      </svg>
    ),
  },

  "sleep-quality": {
    concernLabel: "Poor Sleep",
    idealLabel: "Quality Rest",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase fill="rgba(80,60,80,0.15)" />
        <Eye cx={40} cy={40} open={false} dark />
        <Eye cx={60} cy={40} open={false} dark />
        <EyeBag cx={40} cy={40} />
        <EyeBag cx={60} cy={40} />
        {/* Z's indicating sleeplessness */}
        <text x={68} y={30} fontSize={10} fill="#5ab3cc" opacity={0.5}>z</text>
        <text x={74} y={22} fontSize={8} fill="#5ab3cc" opacity={0.4}>z</text>
        <text x={79} y={16} fontSize={6} fill="#5ab3cc" opacity={0.3}>z</text>
        <path d="M 43 68 Q 50 64 57 68" stroke="#c06060" strokeWidth={1} fill="none" />
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#c06060">fatigue, puffiness</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase fill="rgba(82,183,136,0.1)" stroke="#52b788" />
        <Eye cx={40} cy={40} />
        <Eye cx={60} cy={40} />
        <path d="M 43 68 Q 50 74 57 68" stroke="#52b788" strokeWidth={1} fill="none" />
        <circle cx={38} cy={48} r={2} fill="rgba(255,220,180,0.4)" />
        <circle cx={62} cy={48} r={2} fill="rgba(255,220,180,0.4)" />
        <text x={50} y={85} textAnchor="middle" fontSize={7} fill="#52b788">7–9h, rested</text>
      </svg>
    ),
  },

  "visceral-fat": {
    concernLabel: "Visceral Fat / Beer Belly",
    idealLabel: "Flat Abdomen",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {/* Front torso view with protruding belly */}
        <path d="M 30 20 L 70 20 L 72 50 Q 72 70 50 78 Q 28 70 28 50 Z"
          fill="rgba(196,164,74,0.2)" stroke="#c4a44a" strokeWidth={1.2} />
        <ellipse cx={50} cy={52} rx={20} ry={16} fill="rgba(196,164,74,0.35)" />
        <text x={50} y={90} textAnchor="middle" fontSize={7} fill="#c06060">visceral fat</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 32 20 L 68 20 L 66 50 Q 64 68 50 74 Q 36 68 34 50 Z"
          fill="rgba(82,183,136,0.1)" stroke="#52b788" strokeWidth={1.2} />
        {/* Subtle ab lines */}
        <line x1={50} y1={30} x2={50} y2={62} stroke="#52b788" strokeWidth={0.8} opacity={0.4} />
        <line x1={42} y1={38} x2={58} y2={38} stroke="#52b788" strokeWidth={0.8} opacity={0.3} />
        <line x1={42} y1={50} x2={58} y2={50} stroke="#52b788" strokeWidth={0.8} opacity={0.3} />
        <text x={50} y={86} textAnchor="middle" fontSize={7} fill="#52b788">flat, defined</text>
      </svg>
    ),
  },

  brows: {
    concernLabel: "Sparse / Uneven Brows",
    idealLabel: "Shaped Brows",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase />
        <Eye cx={38} cy={48} />
        <Eye cx={62} cy={48} />
        {/* Sparse brows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1={28 + i * 4} y1={38 - i * 0.3} x2={30 + i * 4} y2={36 - i * 0.3}
            stroke="#848484" strokeWidth={1} opacity={0.5} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1={56 + i * 3} y1={37 + i * 0.3} x2={58 + i * 3} y2={35 + i * 0.3}
            stroke="#848484" strokeWidth={1} opacity={0.4} />
        ))}
        <text x={50} y={82} textAnchor="middle" fontSize={7} fill="#c06060">sparse / uneven</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <FaceBase stroke="#52b788" />
        <Eye cx={38} cy={48} />
        <Eye cx={62} cy={48} />
        <path d="M 26 37 Q 38 32 48 36" stroke="#52b788" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M 52 36 Q 62 32 74 37" stroke="#52b788" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <text x={50} y={82} textAnchor="middle" fontSize={7} fill="#52b788">defined arch</text>
      </svg>
    ),
  },

  dandruff: {
    concernLabel: "Dandruff / Flaky Scalp",
    idealLabel: "Healthy Scalp",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <ellipse cx={50} cy={38} rx={26} ry={30} fill="rgba(140,110,80,0.12)" stroke="#5ab3cc" strokeWidth={1} />
        {Array.from({ length: 20 }).map((_, i) => (
          <rect key={i} x={24 + Math.random() * 48} y={30 + Math.random() * 40} width={2} height={2} rx={0.5}
            fill="#e8e8e8" opacity={0.6} />
        ))}
        <text x={50} y={80} textAnchor="middle" fontSize={7} fill="#c06060">flaking / seborrheic</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <ellipse cx={50} cy={38} rx={26} ry={30} fill="rgba(82,183,136,0.1)" stroke="#52b788" strokeWidth={1} />
        <text x={50} y={42} textAnchor="middle" fontSize={8} fill="#52b788">clean</text>
        <text x={50} y={80} textAnchor="middle" fontSize={7} fill="#52b788">balanced scalp</text>
      </svg>
    ),
  },

  "body-acne": {
    concernLabel: "Body Acne",
    idealLabel: "Clear Back/Chest",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 35 10 L 65 10 L 68 50 L 62 80 L 50 85 L 38 80 L 32 50 Z"
          fill="rgba(140,100,80,0.15)" stroke="#5ab3cc" strokeWidth={1} />
        {[
          [42, 22, 2.5], [55, 26, 2], [48, 36, 3], [60, 42, 2.5], [38, 44, 2],
          [52, 56, 2.8], [44, 64, 2.2], [58, 60, 2],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#c06060" opacity={0.75} />
        ))}
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        <path d="M 35 10 L 65 10 L 68 50 L 62 80 L 50 85 L 38 80 L 32 50 Z"
          fill="rgba(82,183,136,0.1)" stroke="#52b788" strokeWidth={1} />
      </svg>
    ),
  },

  "nail-health": {
    concernLabel: "Brittle / Damaged Nails",
    idealLabel: "Healthy Nails",
    concern: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {[20, 34, 48, 62, 74].map((x, i) => (
          <g key={i}>
            <rect x={x} y={40} width={10} height={22} rx={3} fill="rgba(140,110,80,0.3)" stroke="#5ab3cc" strokeWidth={0.8} />
            <line x1={x + 2} y1={44} x2={x + 8} y2={55} stroke="#c06060" strokeWidth={0.8} opacity={0.7} />
          </g>
        ))}
        <text x={50} y={80} textAnchor="middle" fontSize={7} fill="#c06060">ridged / brittle</text>
      </svg>
    ),
    ideal: (
      <svg viewBox="0 0 100 100" width="100" height="100">
        {[20, 34, 48, 62, 74].map((x) => (
          <rect key={x} x={x} y={40} width={10} height={22} rx={3} fill="rgba(82,183,136,0.2)" stroke="#52b788" strokeWidth={0.8} />
        ))}
        <text x={50} y={80} textAnchor="middle" fontSize={7} fill="#52b788">smooth, strong</text>
      </svg>
    ),
  },
};

// ─── Public component ─────────────────────────────────────────────────────────
export function ConcernVisual({ tag }: { tag: string }) {
  const visual = VISUALS[tag];
  if (!visual) return null;

  return (
    <div className="flex items-center gap-1 mt-1.5 mb-0.5">
      {/* Concern */}
      <div className="flex flex-col items-center gap-0.5 flex-1">
        <div className="border border-[rgba(196,164,74,0.2)] bg-[rgba(196,164,74,0.03)] p-1" style={{ lineHeight: 0 }}>
          {visual.concern}
        </div>
        <p className="text-[8px] text-[#c4a44a] text-center leading-tight">{visual.concernLabel}</p>
      </div>

      <div className="text-[#2a2a2e] text-xs flex-shrink-0">→</div>

      {/* Ideal */}
      <div className="flex flex-col items-center gap-0.5 flex-1">
        <div className="border border-[rgba(82,183,136,0.2)] bg-[rgba(82,183,136,0.03)] p-1" style={{ lineHeight: 0 }}>
          {visual.ideal}
        </div>
        <p className="text-[8px] text-[#52b788] text-center leading-tight">{visual.idealLabel}</p>
      </div>
    </div>
  );
}
