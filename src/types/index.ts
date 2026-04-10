export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  gender: "male" | "female" | "other" | null;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  insecurities: string[];
  onboarding_complete: boolean;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface DiagnosisReport {
  faceSymmetry?: number;
  jawWidthRatio?: number;
  shoulderHipRatio?: number;
  postureScore?: number;
  bizygomatic?: number;
  bigonial?: number;
  raw?: Record<string, number>;
}

export interface ContentFile {
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  timeframe: string;
  summary: string;
  content: string;
}

export interface FileTreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: FileTreeNode[];
  tag?: string;
  meshName?: string;
}

export const FILE_TREE: FileTreeNode[] = [
  {
    id: "face",
    label: "Face",
    icon: "◈",
    children: [
      {
        id: "skin",
        label: "Skin",
        icon: "▸",
        tag: "skin",
        children: [
          { id: "acne", label: "Acne / Texture", tag: "acne", meshName: "Mesh_Face" },
          { id: "hyperpigmentation", label: "Hyperpigmentation", tag: "hyperpigmentation", meshName: "Mesh_Face" },
          { id: "dark-circles", label: "Dark Circles", tag: "dark-circles", meshName: "Mesh_Eye" },
        ],
      },
      {
        id: "jawline",
        label: "Jawline",
        icon: "▸",
        tag: "jawline",
        children: [
          { id: "mewing", label: "Mewing / Tongue Posture", tag: "mewing", meshName: "Mesh_Jaw" },
          { id: "chewing", label: "Chewing & Hypertrophy", tag: "chewing", meshName: "Mesh_Jaw" },
          { id: "jaw-fat", label: "Submental Fat", tag: "jaw-fat", meshName: "Mesh_Jaw" },
        ],
      },
      {
        id: "eyes",
        label: "Eyes",
        icon: "▸",
        tag: "eyes",
        children: [
          { id: "eye-area", label: "Eye Area / Periorbital", tag: "eye-area", meshName: "Mesh_Eye" },
          { id: "brows", label: "Brow Framing", tag: "brows", meshName: "Mesh_Brow" },
        ],
      },
    ],
  },
  {
    id: "physique",
    label: "Physique",
    icon: "◈",
    children: [
      {
        id: "posture",
        label: "Posture",
        icon: "▸",
        tag: "posture",
        children: [
          { id: "forward-head", label: "Forward Head", tag: "forward-head", meshName: "Mesh_Head" },
          { id: "shoulder-asymmetry", label: "Shoulder Asymmetry", tag: "shoulder-asymmetry", meshName: "Mesh_Shoulder" },
          { id: "anterior-pelvic", label: "Anterior Pelvic Tilt", tag: "anterior-pelvic", meshName: "Mesh_Pelvis" },
        ],
      },
      {
        id: "body",
        label: "Body Composition",
        icon: "▸",
        tag: "body",
        children: [
          { id: "body-fat", label: "Body Fat Reduction", tag: "body-fat", meshName: "Mesh_Torso" },
          { id: "muscle-mass", label: "Muscle Mass", tag: "muscle-mass", meshName: "Mesh_Torso" },
          { id: "shoulder-width", label: "Shoulder Width", tag: "shoulder-width", meshName: "Mesh_Shoulder" },
        ],
      },
    ],
  },
  {
    id: "hair",
    label: "Hair",
    icon: "◈",
    children: [
      { id: "hair-loss", label: "Hair Loss / Thinning", tag: "hair-loss", meshName: "Mesh_Hair" },
      { id: "hair-texture", label: "Texture & Health", tag: "hair-texture", meshName: "Mesh_Hair" },
      { id: "hair-style", label: "Style Optimization", tag: "hair-style", meshName: "Mesh_Hair" },
    ],
  },
  {
    id: "grooming",
    label: "Grooming",
    icon: "◈",
    children: [
      { id: "beard", label: "Beard Architecture", tag: "beard", meshName: "Mesh_Jaw" },
      { id: "skincare-routine", label: "Protocol Stack", tag: "skincare-routine", meshName: "Mesh_Face" },
    ],
  },
];
