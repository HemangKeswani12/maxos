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
    id: "skin",
    label: "Skin",
    icon: "◈",
    children: [
      {
        id: "skin-face",
        label: "Face",
        children: [
          { id: "acne", label: "Acne / Breakouts", tag: "acne", meshName: "Mesh_Face" },
          { id: "hyperpigmentation", label: "Hyperpigmentation", tag: "hyperpigmentation", meshName: "Mesh_Face" },
          { id: "dark-circles", label: "Dark Circles", tag: "dark-circles", meshName: "Mesh_Eye" },
          { id: "eye-bags", label: "Eye Bags / Puffiness", tag: "eye-bags", meshName: "Mesh_Eye" },
          { id: "redness", label: "Redness / Rosacea", tag: "redness", meshName: "Mesh_Face" },
          { id: "large-pores", label: "Large Pores", tag: "large-pores", meshName: "Mesh_Face" },
          { id: "oily-skin", label: "Oily Skin", tag: "oily-skin", meshName: "Mesh_Face" },
          { id: "dry-skin", label: "Dry / Flaky Skin", tag: "dry-skin", meshName: "Mesh_Face" },
          { id: "fine-lines", label: "Fine Lines / Aging", tag: "fine-lines", meshName: "Mesh_Face" },
        ],
      },
      {
        id: "skin-body",
        label: "Body",
        children: [
          { id: "body-acne", label: "Body / Back Acne", tag: "body-acne", meshName: "Mesh_Torso" },
          { id: "stretch-marks", label: "Stretch Marks", tag: "stretch-marks", meshName: "Mesh_Torso" },
          { id: "keratosis-pilaris", label: "Keratosis Pilaris", tag: "keratosis-pilaris", meshName: "Mesh_Shoulder" },
        ],
      },
    ],
  },
  {
    id: "face-structure",
    label: "Face Structure",
    icon: "◉",
    children: [
      {
        id: "jaw-section",
        label: "Jaw / Chin",
        children: [
          { id: "jawline", label: "Soft Jawline", tag: "jawline", meshName: "Mesh_Jaw" },
          { id: "jaw-fat", label: "Double Chin / Submental Fat", tag: "jaw-fat", meshName: "Mesh_Jaw" },
          { id: "weak-chin", label: "Recessed Chin", tag: "weak-chin", meshName: "Mesh_Jaw" },
          { id: "mewing", label: "Tongue Posture (Mewing)", tag: "mewing", meshName: "Mesh_Jaw" },
          { id: "masseter-hypertrophy", label: "Jaw / Masseter Width", tag: "masseter-hypertrophy", meshName: "Mesh_Jaw" },
        ],
      },
      {
        id: "eyes-section",
        label: "Eyes & Brows",
        children: [
          { id: "eye-area", label: "Eye Area / Canthal Tilt", tag: "eye-area", meshName: "Mesh_Eye" },
          { id: "brows", label: "Sparse / Uneven Brows", tag: "brows", meshName: "Mesh_Brow" },
        ],
      },
      {
        id: "other-features",
        label: "Other Features",
        children: [
          { id: "cheekbones", label: "Cheekbone Prominence", tag: "cheekbones", meshName: "Mesh_Face" },
          { id: "nose-appearance", label: "Nose Appearance", tag: "nose-appearance", meshName: "Mesh_Face" },
          { id: "face-symmetry", label: "Facial Symmetry", tag: "face-symmetry", meshName: "Mesh_Face" },
          { id: "lips", label: "Thin / Undefined Lips", tag: "lips", meshName: "Mesh_Jaw" },
        ],
      },
    ],
  },
  {
    id: "posture",
    label: "Posture & Alignment",
    icon: "◎",
    children: [
      {
        id: "head-neck",
        label: "Head & Neck",
        children: [
          { id: "forward-head", label: "Forward Head Posture", tag: "forward-head", meshName: "Mesh_Head" },
        ],
      },
      {
        id: "upper-body-posture",
        label: "Upper Body",
        children: [
          { id: "rounded-shoulders", label: "Rounded Shoulders", tag: "rounded-shoulders", meshName: "Mesh_Shoulder" },
          { id: "kyphosis", label: "Kyphosis (Upper Rounding)", tag: "kyphosis", meshName: "Mesh_Torso" },
          { id: "shoulder-asymmetry", label: "Shoulder Asymmetry", tag: "shoulder-asymmetry", meshName: "Mesh_Shoulder" },
        ],
      },
      {
        id: "lower-body-posture",
        label: "Lower Body",
        children: [
          { id: "anterior-pelvic", label: "Anterior Pelvic Tilt", tag: "anterior-pelvic", meshName: "Mesh_Pelvis" },
          { id: "posterior-pelvic", label: "Posterior Pelvic Tilt", tag: "posterior-pelvic", meshName: "Mesh_Pelvis" },
          { id: "scoliosis", label: "Scoliosis", tag: "scoliosis", meshName: "Mesh_Torso" },
          { id: "knee-valgus", label: "Knock Knees", tag: "knee-valgus", meshName: "Mesh_Leg" },
          { id: "flat-feet", label: "Flat Feet", tag: "flat-feet", meshName: "Mesh_Leg" },
        ],
      },
    ],
  },
  {
    id: "physique",
    label: "Physique",
    icon: "⬡",
    children: [
      {
        id: "composition",
        label: "Composition",
        children: [
          { id: "body-fat", label: "High Body Fat", tag: "body-fat", meshName: "Mesh_Torso" },
          { id: "muscle-mass", label: "Low Muscle Mass", tag: "muscle-mass", meshName: "Mesh_Torso" },
          { id: "visceral-fat", label: "Visceral Fat / Beer Belly", tag: "visceral-fat", meshName: "Mesh_Torso" },
          { id: "love-handles", label: "Love Handles", tag: "love-handles", meshName: "Mesh_Torso" },
        ],
      },
      {
        id: "upper-physique",
        label: "Upper Body",
        children: [
          { id: "shoulder-width", label: "Narrow Shoulders / V-Taper", tag: "shoulder-width", meshName: "Mesh_Shoulder" },
          { id: "underdeveloped-chest", label: "Underdeveloped Chest", tag: "underdeveloped-chest", meshName: "Mesh_Torso" },
          { id: "gynecomastia", label: "Gynecomastia", tag: "gynecomastia", meshName: "Mesh_Torso" },
          { id: "spindly-arms", label: "Thin Arms", tag: "spindly-arms", meshName: "Mesh_Shoulder" },
          { id: "thin-neck", label: "Thin Neck", tag: "thin-neck", meshName: "Mesh_Head" },
        ],
      },
      {
        id: "lower-physique",
        label: "Lower Body",
        children: [
          { id: "small-calves", label: "Underdeveloped Calves", tag: "small-calves", meshName: "Mesh_Leg" },
          { id: "glute-development", label: "Poor Glute Development", tag: "glute-development", meshName: "Mesh_Pelvis" },
        ],
      },
    ],
  },
  {
    id: "hair",
    label: "Hair",
    icon: "◆",
    children: [
      { id: "hair-loss", label: "Hair Loss / Thinning", tag: "hair-loss", meshName: "Mesh_Head" },
      { id: "receding-hairline", label: "Receding Hairline", tag: "receding-hairline", meshName: "Mesh_Head" },
      { id: "hair-texture", label: "Frizzy / Brittle Hair", tag: "hair-texture", meshName: "Mesh_Head" },
      { id: "dandruff", label: "Dandruff / Scalp Flaking", tag: "dandruff", meshName: "Mesh_Head" },
      { id: "hair-style", label: "Hairstyle Optimization", tag: "hair-style", meshName: "Mesh_Head" },
      { id: "beard", label: "Patchy Beard", tag: "beard", meshName: "Mesh_Jaw" },
    ],
  },
  {
    id: "grooming",
    label: "Grooming & Oral",
    icon: "◇",
    children: [
      { id: "skincare-routine", label: "Skincare Protocol Stack", tag: "skincare-routine", meshName: "Mesh_Face" },
      { id: "yellow-teeth", label: "Teeth Discoloration", tag: "yellow-teeth", meshName: "Mesh_Jaw" },
      { id: "gum-health", label: "Gum Health", tag: "gum-health", meshName: "Mesh_Jaw" },
      { id: "nail-health", label: "Nail Health", tag: "nail-health" },
      { id: "fragrance", label: "Fragrance Strategy", tag: "fragrance" },
      { id: "clothing-fit", label: "Clothing Fit & Proportion", tag: "clothing-fit" },
    ],
  },
  {
    id: "sleep-recovery",
    label: "Sleep & Recovery",
    icon: "◈",
    children: [
      { id: "sleep-quality", label: "Poor Sleep Quality", tag: "sleep-quality", meshName: "Mesh_Head" },
      { id: "low-energy", label: "Chronic Fatigue / Low Energy", tag: "low-energy" },
      { id: "poor-recovery", label: "Poor Workout Recovery", tag: "poor-recovery" },
    ],
  },
];
