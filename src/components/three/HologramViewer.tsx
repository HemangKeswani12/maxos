"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Edges } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";

// ─── Anatomy constants (8-head proportion rule) ──────────────────────────────
const H = 0.21; // half-head height (one "head unit")

function buildTorsoPoints(widthScale: number) {
  // LatheGeometry creates a revolution solid — define silhouette profile
  return [
    new THREE.Vector2(0.13 * widthScale, 0),        // waist start
    new THREE.Vector2(0.16 * widthScale, 0.06),
    new THREE.Vector2(0.22 * widthScale, 0.18),      // lower torso
    new THREE.Vector2(0.26 * widthScale, 0.34),      // mid chest
    new THREE.Vector2(0.27 * widthScale, 0.46),      // pec line
    new THREE.Vector2(0.24 * widthScale, 0.56),      // upper chest
    new THREE.Vector2(0.16 * widthScale, 0.64),      // trapezius base
    new THREE.Vector2(0.10, 0.70),                    // neck
    new THREE.Vector2(0.09, 0.76),
  ];
}

function buildPelvisPoints(widthScale: number) {
  return [
    new THREE.Vector2(0.14 * widthScale, 0),
    new THREE.Vector2(0.17 * widthScale, 0.06),
    new THREE.Vector2(0.19 * widthScale, 0.14),
    new THREE.Vector2(0.18 * widthScale, 0.22),
    new THREE.Vector2(0.14 * widthScale, 0.28),
    new THREE.Vector2(0.10 * widthScale, 0.30),
  ];
}

// ─── Single body figure ──────────────────────────────────────────────────────
interface FigureProps {
  primaryColor: string;
  emissiveColor: string;
  position: [number, number, number];
  heightScale: number;
  widthScale: number;
  hoveredMesh: string | null;
  wireframe?: boolean;
}

function AnatomyFigure({
  primaryColor,
  emissiveColor,
  position,
  heightScale: hs,
  widthScale: ws,
  hoveredMesh,
  wireframe = false,
}: FigureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta * 0.25;
    groupRef.current.rotation.y = Math.sin(timeRef.current) * 0.18;
  });

  const isHighlighted = (name: string) => hoveredMesh === name;
  const getColor = (meshName: string) =>
    isHighlighted(meshName) ? "#52b788" : primaryColor;
  const getEmissive = (meshName: string) =>
    isHighlighted(meshName) ? "#52b788" : emissiveColor;
  const getEmissiveIntensity = (meshName: string) =>
    isHighlighted(meshName) ? 0.5 : 0.2;

  const mat = (name: string) => (
    <meshPhysicalMaterial
      color={getColor(name)}
      emissive={getEmissive(name)}
      emissiveIntensity={getEmissiveIntensity(name)}
      roughness={0.55}
      metalness={0.08}
      transparent
      opacity={wireframe ? 0.25 : 0.88}
      wireframe={wireframe}
      side={THREE.DoubleSide}
    />
  );

  const torsoPoints = useMemo(() => buildTorsoPoints(ws), [ws]);
  const pelvisPoints = useMemo(() => buildPelvisPoints(ws), [ws]);

  // All Y positions are relative to group root, scaled by hs
  const y = (v: number) => v * hs;

  return (
    <group ref={groupRef} position={position}>
      {/* ── HEAD ── */}
      <mesh name="Mesh_Head" position={[0, y(1.64), 0]}>
        <sphereGeometry args={[H * hs, 28, 22]} />
        {mat("Mesh_Head")}
      </mesh>

      {/* ── FACE detail: brow ridge ── */}
      <mesh name="Mesh_Brow" position={[0, y(1.71), H * hs * 0.82]}>
        <cylinderGeometry args={[H * hs * 0.55, H * hs * 0.5, 0.03 * hs, 18]} />
        {mat("Mesh_Brow")}
      </mesh>

      {/* ── EYES ── */}
      <mesh name="Mesh_Eye" position={[-H * hs * 0.38, y(1.67), H * hs * 0.82]}>
        <sphereGeometry args={[0.035 * hs, 10, 8]} />
        {mat("Mesh_Eye")}
      </mesh>
      <mesh name="Mesh_Eye" position={[H * hs * 0.38, y(1.67), H * hs * 0.82]}>
        <sphereGeometry args={[0.035 * hs, 10, 8]} />
        {mat("Mesh_Eye")}
      </mesh>

      {/* ── JAW ── */}
      <mesh name="Mesh_Jaw" position={[0, y(1.46), 0.04 * hs]}>
        <sphereGeometry args={[H * hs * 0.72, 20, 12]} />
        {mat("Mesh_Jaw")}
      </mesh>

      {/* ── NECK ── */}
      <mesh name="Mesh_Head" position={[0, y(1.35), 0]}>
        <cylinderGeometry args={[0.09 * ws, 0.10 * ws, 0.20 * hs, 16]} />
        {mat("Mesh_Head")}
      </mesh>

      {/* ── TORSO (Lathe) ── */}
      <mesh name="Mesh_Torso" position={[0, y(0.62), 0]}>
        <latheGeometry args={[torsoPoints, 28]} />
        {mat("Mesh_Torso")}
      </mesh>

      {/* ── PELVIS (Lathe) ── */}
      <mesh name="Mesh_Pelvis" position={[0, y(0.32), 0]}>
        <latheGeometry args={[pelvisPoints, 28]} />
        {mat("Mesh_Pelvis")}
      </mesh>

      {/* ── CLAVICLE bars ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Shoulder"
          position={[side * 0.19 * ws, y(1.25), 0]}
          rotation={[0, 0, side * 0.18]}
        >
          <capsuleGeometry args={[0.045 * ws, 0.18 * ws, 6, 10]} />
          {mat("Mesh_Shoulder")}
        </mesh>
      ))}

      {/* ── SHOULDER JOINTS ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Shoulder"
          position={[side * 0.34 * ws, y(1.22), 0]}
        >
          <sphereGeometry args={[0.085 * ws, 14, 12]} />
          {mat("Mesh_Shoulder")}
        </mesh>
      ))}

      {/* ── UPPER ARMS ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Shoulder"
          position={[side * 0.40 * ws, y(0.98), 0]}
          rotation={[0, 0, side * 0.12]}
        >
          <capsuleGeometry args={[0.066 * ws, 0.32 * hs, 6, 12]} />
          {mat("Mesh_Shoulder")}
        </mesh>
      ))}

      {/* ── ELBOW JOINTS ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Shoulder"
          position={[side * 0.43 * ws, y(0.70), 0]}
        >
          <sphereGeometry args={[0.060 * ws, 12, 10]} />
          {mat("Mesh_Shoulder")}
        </mesh>
      ))}

      {/* ── FOREARMS ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Shoulder"
          position={[side * 0.45 * ws, y(0.44), 0]}
          rotation={[0, 0, side * 0.08]}
        >
          <capsuleGeometry args={[0.052 * ws, 0.30 * hs, 6, 12]} />
          {mat("Mesh_Shoulder")}
        </mesh>
      ))}

      {/* ── HANDS ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Shoulder"
          position={[side * 0.47 * ws, y(0.18), 0]}
        >
          <sphereGeometry args={[0.055 * ws, 10, 8]} />
          {mat("Mesh_Shoulder")}
        </mesh>
      ))}

      {/* ── HIP JOINTS ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Pelvis"
          position={[side * 0.16 * ws, y(0.42), 0]}
        >
          <sphereGeometry args={[0.09 * ws, 14, 12]} />
          {mat("Mesh_Pelvis")}
        </mesh>
      ))}

      {/* ── UPPER THIGHS ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Leg"
          position={[side * 0.155 * ws, y(0.12), 0]}
        >
          <capsuleGeometry args={[0.095 * ws, 0.38 * hs, 6, 14]} />
          {mat("Mesh_Leg")}
        </mesh>
      ))}

      {/* ── KNEE JOINTS ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Leg"
          position={[side * 0.15 * ws, y(-0.24), 0]}
        >
          <sphereGeometry args={[0.080 * ws, 14, 10]} />
          {mat("Mesh_Leg")}
        </mesh>
      ))}

      {/* ── LOWER LEGS ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Leg"
          position={[side * 0.14 * ws, y(-0.54), 0]}
        >
          <capsuleGeometry args={[0.072 * ws, 0.36 * hs, 6, 14]} />
          {mat("Mesh_Leg")}
        </mesh>
      ))}

      {/* ── ANKLE JOINTS ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Leg"
          position={[side * 0.135 * ws, y(-0.84), 0]}
        >
          <sphereGeometry args={[0.058 * ws, 10, 8]} />
          {mat("Mesh_Leg")}
        </mesh>
      ))}

      {/* ── FEET ── */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          name="Mesh_Leg"
          position={[side * 0.13 * ws, y(-0.91), 0.06]}
          rotation={[0.2, 0, 0]}
        >
          <capsuleGeometry args={[0.048 * ws, 0.14, 4, 8]} />
          {mat("Mesh_Leg")}
        </mesh>
      ))}

      {/* Wireframe outline on hover */}
      {hoveredMesh && (
        <mesh position={[0, y(0.5), 0]} visible={false}>
          <boxGeometry args={[0.001, 0.001, 0.001]} />
          <meshBasicMaterial />
        </mesh>
      )}
    </group>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}>
      <planeGeometry args={[5, 5, 18, 18]} />
      <meshBasicMaterial color="#5ab3cc" transparent opacity={0.03} wireframe />
    </mesh>
  );
}

function ScanRing({ y }: { y: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.6;
    const pos = ((t % 2.8) / 2.8) * 2.8 - 1.05;
    ref.current.position.y = pos;
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.25 - Math.abs(pos - y * 0.5) * 0.05;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.7, 0.72, 48]} />
      <meshBasicMaterial color="#5ab3cc" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

interface HologramViewerProps {
  heightCm?: number;
  weightKg?: number;
}

export function HologramViewer({ heightCm = 175, weightKg = 70 }: HologramViewerProps) {
  const hoveredBodyPart = useAppStore((s) => s.hoveredBodyPart);

  const bmi = weightKg / ((heightCm / 100) ** 2);
  const heightScale = (heightCm / 175) * 0.95;
  // BMI-driven width: narrow at 18.5, wider at 30+
  const widthScale = Math.max(0.82, Math.min(1.45, 0.78 + bmi / 30));
  const idealWidthScale = Math.max(0.84, Math.min(1.05, 0.84 + 20 / 30));

  return (
    <div className="w-full h-full relative">
      {/* Legend */}
      <div className="absolute top-2 left-3 z-10 space-y-1.5">
        <div className="flex items-center gap-2 text-[10px]">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#c4a44a", boxShadow: "0 0 6px #c4a44a55" }} />
          <span className="text-[#848484]">CURRENT</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#d0d0d0", boxShadow: "0 0 6px #d0d0d055" }} />
          <span className="text-[#848484]">POTENTIAL</span>
        </div>
        {hoveredBodyPart && (
          <div className="flex items-center gap-2 text-[10px]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#52b788]" style={{ boxShadow: "0 0 6px #52b78855" }} />
            <span className="text-[#52b788] font-bold">{hoveredBodyPart.replace("Mesh_", "")}</span>
          </div>
        )}
      </div>

      {/* Biometrics overlay */}
      <div className="absolute top-2 right-3 z-10 text-[9px] font-mono space-y-0.5 text-right">
        <div><span className="text-[#2a2a2e]">HEIGHT </span><span className="text-[#e8e8e8]">{heightCm}cm</span></div>
        <div><span className="text-[#2a2a2e]">WEIGHT </span><span className="text-[#e8e8e8]">{weightKg}kg</span></div>
        <div><span className="text-[#2a2a2e]">BMI </span><span className="text-[#5ab3cc]">{bmi.toFixed(1)}</span></div>
        <div>
          <span className="text-[#2a2a2e]">CLASS </span>
          <span className="text-[#c4a44a] text-[8px]">
            {bmi < 18.5 ? "UNDERWEIGHT" : bmi < 25 ? "NORMAL" : bmi < 30 ? "OVERWEIGHT" : "OBESE"}
          </span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-around z-10 px-8">
        <span className="text-[9px] text-[#c4a44a] tracking-widest">CURRENT STATE</span>
        <span className="text-[9px] text-[#d0d0d0] tracking-widest">POTENTIAL</span>
      </div>

      <Canvas
        camera={{ position: [0, 0.2, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 5, 3]} intensity={1.2} color="#ffffff" castShadow />
          <pointLight position={[-2, 3, -1]} intensity={0.8} color="#5ab3cc" />
          <pointLight position={[2, 1, 2]} intensity={0.6} color="#c4a44a" />
          <pointLight position={[0, -1, 2]} intensity={0.3} color="#8888aa" />

          {/* Current figure (left) */}
          <AnatomyFigure
            primaryColor="#c4a44a"
            emissiveColor="#a07830"
            position={[-0.85, -0.85, 0]}
            heightScale={heightScale}
            widthScale={widthScale}
            hoveredMesh={hoveredBodyPart}
          />

          {/* Potential figure (right, with wireframe accent) */}
          <AnatomyFigure
            primaryColor="#c8c8c8"
            emissiveColor="#6080a8"
            position={[0.85, -0.85, 0]}
            heightScale={heightScale}
            widthScale={idealWidthScale}
            hoveredMesh={hoveredBodyPart}
          />

          <GridFloor />
          <ScanRing y={0} />

          <OrbitControls
            enablePan={false}
            minDistance={2.5}
            maxDistance={7}
            target={[0, 0.1, 0]}
            minPolarAngle={0.3}
            maxPolarAngle={Math.PI - 0.3}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
