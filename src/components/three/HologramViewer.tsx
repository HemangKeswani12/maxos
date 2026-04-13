"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useAppStore } from "@/store/useAppStore";

interface BodyMeshProps {
  color: string;
  emissiveColor: string;
  position: [number, number, number];
  heightScale: number;
  widthScale: number;
  isHovered: boolean;
  hoveredMesh: string | null;
  label: string;
}

function BodyMesh({
  color,
  emissiveColor,
  position,
  heightScale,
  widthScale,
  isHovered,
  hoveredMesh,
  label,
}: BodyMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    time.current += delta;
    groupRef.current.rotation.y = Math.sin(time.current * 0.3) * 0.15;
    if (isHovered) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const meshes = useMemo(() => {
      const mats: Record<string, string> = {
        Mesh_Head: color,
        Mesh_Face: color,
        Mesh_Jaw: color,
        Mesh_Eye: color,
        Mesh_Brow: color,
        Mesh_Torso: color,
        Mesh_Shoulder: color,
        Mesh_Pelvis: color,
        Mesh_Leg: color,
        Mesh_Hair: color,
      };
      if (hoveredMesh && mats[hoveredMesh] !== undefined) {
        mats[hoveredMesh] = "#52b788";
      }
    return mats;
  }, [hoveredMesh, color]);

  const getMaterial = (meshName: string) =>
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(meshes[meshName] ?? color),
          emissive: new THREE.Color(
            meshes[meshName] === "#52b788" ? "#52b788" : emissiveColor
          ),
          emissiveIntensity: meshes[meshName] === "#52b788" ? 0.5 : 0.25,
      roughness: 0.4,
      metalness: 0.2,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });

  return (
    <group ref={groupRef} position={position}>
      {/* Head */}
      <mesh name="Mesh_Head" position={[0, 1.7 * heightScale, 0]} material={getMaterial("Mesh_Head")}>
        <sphereGeometry args={[0.22, 24, 24]} />
      </mesh>
      {/* Face overlay */}
      <mesh name="Mesh_Face" position={[0, 1.7 * heightScale, 0.15]} material={getMaterial("Mesh_Face")}>
        <sphereGeometry args={[0.18, 16, 16]} />
      </mesh>
      {/* Hair cap */}
      <mesh name="Mesh_Hair" position={[0, 1.82 * heightScale, 0]} material={getMaterial("Mesh_Hair")}>
        <sphereGeometry args={[0.23, 16, 8]} />
      </mesh>
      {/* Jaw */}
      <mesh name="Mesh_Jaw" position={[0, 1.55 * heightScale, 0.08]} material={getMaterial("Mesh_Jaw")}>
        <boxGeometry args={[0.28 * widthScale, 0.1, 0.2]} />
      </mesh>
      {/* Eye L */}
      <mesh name="Mesh_Eye" position={[-0.08, 1.72 * heightScale, 0.2]} material={getMaterial("Mesh_Eye")}>
        <sphereGeometry args={[0.04, 8, 8]} />
      </mesh>
      {/* Eye R */}
      <mesh name="Mesh_Eye" position={[0.08, 1.72 * heightScale, 0.2]} material={getMaterial("Mesh_Eye")}>
        <sphereGeometry args={[0.04, 8, 8]} />
      </mesh>
      {/* Brow */}
      <mesh name="Mesh_Brow" position={[0, 1.76 * heightScale, 0.18]} material={getMaterial("Mesh_Brow")}>
        <boxGeometry args={[0.24, 0.02, 0.06]} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.45 * heightScale, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.2, 12]} />
        <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Shoulders */}
      <mesh name="Mesh_Shoulder" position={[0, 1.3 * heightScale, 0]} material={getMaterial("Mesh_Shoulder")}>
        <boxGeometry args={[0.9 * widthScale, 0.12, 0.28]} />
      </mesh>
      {/* Torso */}
      <mesh name="Mesh_Torso" position={[0, 1.0 * heightScale, 0]} material={getMaterial("Mesh_Torso")}>
        <boxGeometry args={[0.55 * widthScale, 0.5, 0.28]} />
      </mesh>
      {/* Lower torso */}
      <mesh name="Mesh_Pelvis" position={[0, 0.65 * heightScale, 0]} material={getMaterial("Mesh_Pelvis")}>
        <boxGeometry args={[0.48 * widthScale, 0.3, 0.26]} />
      </mesh>
      {/* Arm L */}
      <mesh position={[-0.52 * widthScale, 1.1 * heightScale, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.5, 12]} />
        <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Arm R */}
      <mesh position={[0.52 * widthScale, 1.1 * heightScale, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.5, 12]} />
        <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Forearm L */}
      <mesh position={[-0.56 * widthScale, 0.8 * heightScale, 0]}>
        <cylinderGeometry args={[0.065, 0.055, 0.45, 12]} />
        <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Forearm R */}
      <mesh position={[0.56 * widthScale, 0.8 * heightScale, 0]}>
        <cylinderGeometry args={[0.065, 0.055, 0.45, 12]} />
        <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Leg L */}
      <mesh name="Mesh_Leg" position={[-0.16 * widthScale, 0.28 * heightScale, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.55, 12]} />
        <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Leg R */}
      <mesh name="Mesh_Leg" position={[0.16 * widthScale, 0.28 * heightScale, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.55, 12]} />
        <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Calf L */}
      <mesh position={[-0.15 * widthScale, -0.07 * heightScale, 0]}>
        <cylinderGeometry args={[0.09, 0.07, 0.52, 12]} />
        <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} roughness={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Calf R */}
      <mesh position={[0.15 * widthScale, -0.07 * heightScale, 0]}>
        <cylinderGeometry args={[0.09, 0.07, 0.52, 12]} />
        <meshStandardMaterial color={color} emissive={emissiveColor} emissiveIntensity={0.2} roughness={0.5} transparent opacity={0.8} />
      </mesh>

      {/* Label */}
      <mesh position={[0, 2.2 * heightScale, 0]}>
        <planeGeometry args={[0.001, 0.001]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
      <planeGeometry args={[6, 6, 20, 20]} />
      <meshBasicMaterial
        color="#00bfff"
        transparent
        opacity={0.04}
        wireframe
      />
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
  const heightScale = heightCm / 175;
  const widthScale = Math.max(0.8, Math.min(1.4, bmi / 22));

  const idealBmi = 21;
  const idealWidthScale = Math.max(0.8, Math.min(1.1, idealBmi / 22));

  return (
    <div className="w-full h-full relative">
      {/* Legend */}
      <div className="absolute top-2 left-2 z-10 space-y-1">
        <div className="flex items-center gap-2 text-[10px]">
          <div className="w-3 h-3 rounded-full" style={{ background: "#c4a44a" }} />
          <span className="text-[#848484]">CURRENT STATE</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <div className="w-3 h-3 rounded-full" style={{ background: "#d0d0d0" }} />
          <span className="text-[#848484]">POTENTIAL</span>
        </div>
        {hoveredBodyPart && (
          <div className="flex items-center gap-2 text-[10px]">
            <div className="w-3 h-3 rounded-full bg-[#52b788]" />
            <span className="text-[#52b788]">ACTIVE: {hoveredBodyPart.replace("Mesh_", "")}</span>
          </div>
        )}
      </div>

      {/* Stats overlay */}
      <div className="absolute top-2 right-2 z-10 text-[10px] font-mono space-y-0.5">
        <div className="text-[#a0a0a0]">H: <span className="text-white">{heightCm}cm</span></div>
        <div className="text-[#a0a0a0]">W: <span className="text-white">{weightKg}kg</span></div>
        <div className="text-[#a0a0a0]">BMI: <span className="text-[#00bfff]">{bmi.toFixed(1)}</span></div>
      </div>

      <Canvas
        camera={{ position: [0, 0.9, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[2, 4, 2]} intensity={1.5} color="#5ab3cc" />
          <pointLight position={[-2, 2, -1]} intensity={0.8} color="#d4af37" />
          <pointLight position={[0, -1, 2]} intensity={0.4} color="#ffffff" />

          {/* Current state */}
          <BodyMesh
            color="#c4a44a"
            emissiveColor="#c4a44a"
            position={[-0.7, -0.9, 0]}
            heightScale={heightScale}
            widthScale={widthScale}
            isHovered={false}
            hoveredMesh={hoveredBodyPart}
            label="CURRENT"
          />

          {/* Potential state */}
          <BodyMesh
            color="#d0d0d0"
            emissiveColor="#6080a8"
            position={[0.7, -0.9, 0]}
            heightScale={heightScale}
            widthScale={idealWidthScale}
            isHovered={false}
            hoveredMesh={hoveredBodyPart}
            label="POTENTIAL"
          />

          <GridFloor />
          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={6}
            target={[0, 0.3, 0]}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
