"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

interface Protocol {
  id: string;
  title: string;
  category: string;
  timeframe: string;
  steps: string[];
  tags: string[];
  evidence: "strong" | "moderate" | "emerging";
}

const PROTOCOLS: Protocol[] = [
  // ─── SKIN ───────────────────────────────────────────────────────────────────
  {
    id: "acne-stack",
    title: "Inflammatory & Comedonal Acne",
    category: "Skin",
    timeframe: "8–12 weeks",
    evidence: "strong",
    tags: ["acne", "skincare-routine"],
    steps: [
      "AM: Gentle cleanser (pH 4.5–6.5) → Niacinamide 10% (sebum regulation, anti-inflammatory) → SPF 50+ (non-negotiable, UV worsens PIH)",
      "PM: Double cleanse if wearing SPF → Salicylic acid 2% BHA (4×/week, comedolytic) → Ceramide moisturizer",
      "3×/week PM: Tretinoin 0.025% — begin 2×/week, titrate to nightly over 8 weeks to minimise purge severity",
      "Do NOT layer benzoyl peroxide with tretinoin (oxidises retinol, renders it inactive)",
      "Dietary elimination trial: Remove dairy (IGF-1 elevation) and high-GI foods for 4 weeks. Document with photos weekly.",
      "Change pillowcase every 2–3 days. Hair products off the face. No touching.",
      "Expected: Purge weeks 2–6 (increased cell turnover). Significant clearance weeks 8–12.",
    ],
  },
  {
    id: "hyperpig-stack",
    title: "Hyperpigmentation & Post-Inflammatory Marks",
    category: "Skin",
    timeframe: "12–20 weeks",
    evidence: "strong",
    tags: ["hyperpigmentation", "skincare-routine"],
    steps: [
      "SPF 50+ every single morning — without this, every other step is placebo. UV stimulates melanogenesis.",
      "AM: Vitamin C (L-ascorbic acid 15–20%) → SPF. Must apply vitamin C under SPF, not over.",
      "PM: Azelaic acid 15–20% (inhibits tyrosinase, anti-inflammatory) OR alpha arbutin 2%",
      "Alternate with: Kojic acid 1–2% for PIH. Tranexamic acid 3–5% is excellent for melasma-type.",
      "Weekly: AHA glycolic acid 10% toner — accelerates cell turnover, brings pigment to surface faster",
      "Fitzpatrick types IV–VI: Avoid high-concentration acids initially. Start AHA at 5%, increase gradually.",
      "Timeline: 10–12 weeks for measurable fading. Full resolution: 20–24 weeks depending on depth.",
    ],
  },
  {
    id: "dark-circles",
    title: "Periorbital Dark Circles",
    category: "Skin",
    timeframe: "6–16 weeks",
    evidence: "moderate",
    tags: ["dark-circles", "eye-area"],
    steps: [
      "Step 1: Diagnose cause — vascular (blue/purple hue, worsens with fatigue) vs pigment (brown, same when rested) vs structural (hollow tear trough)",
      "Vascular: Caffeine 5% eye cream (vasoconstriction, reduces pooling). Prioritise 7–9h sleep. Sleep elevated.",
      "Pigment: Retinol eye cream (0.025% — thin periorbital skin requires lower concentration). Vitamin K.",
      "Structural: Facial fat loss worsens this. Maintain lean but not underweight. Hyaluronic acid filler is the only effective structural fix.",
      "All types: Cold compress for 5 min each morning — reduces acute vascular pooling.",
      "Avoid rubbing eyes — breaks capillaries, worsens pigment deposition over time.",
    ],
  },
  {
    id: "redness-rosacea",
    title: "Redness, Rosacea & Reactive Skin",
    category: "Skin",
    timeframe: "8–16 weeks",
    evidence: "strong",
    tags: ["acne", "skincare-routine"],
    steps: [
      "Rosacea is a chronic condition. Management, not cure. Identify and eliminate triggers first.",
      "Common triggers: UV (biggest), alcohol, spicy food, extreme temperatures, certain actives (acids, high-% retinol)",
      "Active ingredients: Azelaic acid 15–20% (Rx-level efficacy for rosacea, anti-inflammatory, keratolytic)",
      "Topical ivermectin 1% cream (Rx) — most effective pharmaceutical for papulopustular rosacea",
      "Niacinamide 5–10% — reduces erythema and improves barrier. Well-tolerated by reactive skin.",
      "Barrier repair priority: Ceramides + hyaluronic acid + no fragrance/alcohol in formulas",
      "Avoid: Physical exfoliants, high-% AHA/BHA, high-% vitamin C (stings, can worsen flushing)",
      "SPF: Mineral (zinc oxide) only — chemical UV filters can trigger flushing in rosacea skin",
    ],
  },
  {
    id: "pores-texture",
    title: "Enlarged Pores & Skin Texture",
    category: "Skin",
    timeframe: "8–12 weeks",
    evidence: "strong",
    tags: ["acne", "skincare-routine"],
    steps: [
      "Pores cannot physically 'shrink' — they can appear smaller when cleared and skin tightened",
      "BHA salicylic acid 2% (oil-soluble, enters follicle, dissolves sebum plugs) — 3–4×/week PM",
      "Retinoids: Tretinoin or adapalene stimulate collagen, tighten pore walls over 3–6 months",
      "Niacinamide 10%: Reduces sebum production, measurably reduces pore appearance in trials",
      "Clay mask 1×/week: Draws out sebaceous filaments. Does not eliminate them permanently.",
      "Never use pore strips — they widen pore walls, causing long-term enlargement",
      "Mechanical exfoliants: Avoid. Micro-tears worsen texture. Chemical exfoliation only.",
      "SPF daily — UV degrades collagen, which forms the structural walls around pores",
    ],
  },
  {
    id: "anti-aging",
    title: "Anti-Aging & Collagen Preservation",
    category: "Skin",
    timeframe: "Ongoing",
    evidence: "strong",
    tags: ["skincare-routine", "skin"],
    steps: [
      "The hierarchy: SPF > Retinoids > Antioxidants > Everything else. In that order.",
      "SPF 50+ daily: UV is responsible for ~80% of visible skin aging. Non-negotiable.",
      "Tretinoin 0.05–0.1%: Only topical ingredient with RCT-level evidence for wrinkle reduction and collagen synthesis",
      "Vitamin C 15–20% AM: Antioxidant protection from UV free radicals, collagen cofactor",
      "Peptides (palmitoyl pentapeptide, matrixyl): Signal fibroblasts to produce collagen. Additive to retinoids, not equivalent.",
      "Glycolic acid 10% weekly: Accelerates epidermal turnover, thins stratum corneum for better penetration",
      "Diet: Glycation from high sugar degrades collagen cross-links. Low-GI diet has measurable skin effects.",
      "Lifestyle: Sleep 7–9h (peak growth hormone release for tissue repair). No smoking (directly destroys collagen).",
    ],
  },
  // ─── FACE STRUCTURE ─────────────────────────────────────────────────────────
  {
    id: "mewing-protocol",
    title: "Mewing & Maxillary Expansion",
    category: "Face Structure",
    timeframe: "12–24 months",
    evidence: "emerging",
    tags: ["mewing", "jawline"],
    steps: [
      "Correct posture: Full tongue body contact with entire palate. Tip behind upper incisors (NOT touching). Back third elevated.",
      "Lips sealed at rest, teeth lightly touching or 1–2mm apart. Nasal breathing exclusively.",
      "Swallowing: Tongue should push against palate during swallow. 'Tongue-thrusting' swallow (forward push) is incorrect.",
      "Nasal breathing — use nasal strips or saline rinse if congested. Mouth tape during sleep if habitual mouth-breather.",
      "Evidence base: Suture remodeling in adolescents (<20) is plausible via orthopedic force. Adults: primarily soft tissue and masseter development.",
      "Supplement: Mastic gum 20–30min/day for masseter hypertrophy. Measurable jaw angle definition in 6–12 months.",
      "Do NOT force the tongue — constant, passive, light pressure. Headaches indicate incorrect form.",
    ],
  },
  {
    id: "jawline-fat",
    title: "Submental Fat Reduction",
    category: "Face Structure",
    timeframe: "12–24 weeks",
    evidence: "strong",
    tags: ["jaw-fat", "jawline"],
    steps: [
      "Submental fat is primarily reduced through systemic body fat reduction — spot reduction is not possible via exercise.",
      "Caloric deficit required: 300–500 kcal/day below TDEE. Face fat typically responds early to weight loss.",
      "For most people: Getting to 10–15% body fat (male) or 18–22% (female) reveals jawline definition.",
      "Masseter hypertrophy (mewing, gum chewing) creates jaw angle definition independent of fat levels.",
      "Kybella (deoxycholic acid injections): Medically destroys fat cells in submental region. Permanent. Requires physician.",
      "Posture effect: Forward head posture compresses submental tissue, creating visual double chin. Fix posture first.",
      "Water retention: High-sodium diet bloats face. Low-sodium, high-water protocol 48h before photos/events.",
    ],
  },
  {
    id: "masseter-hypertrophy",
    title: "Masseter Development & Jaw Definition",
    category: "Face Structure",
    timeframe: "6–12 months",
    evidence: "moderate",
    tags: ["jawline", "chewing"],
    steps: [
      "Masseter is a muscle. It responds to resistance training principles: progressive overload, sufficient volume.",
      "Mastic gum: Natural resin (Amazon or health store). Harder than regular gum. 20–30min/day, both sides equally.",
      "Progression: Start with 10 min/day. Increase by 5 min every 2 weeks. Overuse causes TMJ — do not exceed 40 min/day.",
      "Falim gum (Turkish gum): Extremely tough, minimal sweetener — good alternative to mastic.",
      "Jaw exercises: Clench teeth, hold 5s, release. 3×15 daily. Works the masseter body.",
      "Expected results: Visible jaw angle widening and definition in 6–12 months of consistent training.",
      "Stop immediately if jaw clicking, pain, or locking occurs — signs of TMJ dysfunction.",
    ],
  },
  {
    id: "canthal-tilt",
    title: "Canthal Tilt & Eye Appearance",
    category: "Face Structure",
    timeframe: "3–6 months",
    evidence: "emerging",
    tags: ["eye-area", "eyes"],
    steps: [
      "Canthal tilt: Angle of the outer eye corner relative to inner. Positive tilt (outer higher) is associated with aesthetic preference in research.",
      "Mewing contribution: Maxillary expansion can influence orbital support. Long-term, adolescent effect.",
      "Eye appearance improvement without surgery: Reduce periorbital fat/dark circles (see relevant protocol).",
      "Brow position: Brow grooming profoundly affects perceived eye shape. Shape brows to lift outer third slightly.",
      "Malar fat pad: Volume loss from low body fat makes eyes look more recessed. Moderate body fat preserves this.",
      "Sleep quality: Periorbital puffiness from poor sleep dramatically affects eye appearance. 7–9h, head slightly elevated.",
      "For significant canthal tilt change: Canthoplasty (surgical). Non-surgical options have limited evidence.",
    ],
  },
  {
    id: "nose-appearance",
    title: "Non-Surgical Nose Optimization",
    category: "Face Structure",
    timeframe: "Immediate + long-term",
    evidence: "moderate",
    tags: ["jawline", "mewing"],
    steps: [
      "Mewing and maxillary expansion can affect nasal tip support and dorsal projection over time in adolescents.",
      "Body fat reduction: Fat pads around the alar base visually widen the nose. Reduction helps.",
      "Makeup/contouring: Contour on nose sides with matte product 1–2 shades darker. Effective optical illusion.",
      "Rhinoplasty: Only intervention with guaranteed permanent results. Do not rush — surgeon selection is critical.",
      "Nasal strips: Do not change nasal structure but can improve breathing and nasal appearance temporarily.",
      "Hair and frame: High fade or slicked-back styles emphasise the nose. Fringe or forward styles reduce visual prominence.",
    ],
  },
  // ─── POSTURE ────────────────────────────────────────────────────────────────
  {
    id: "forward-head",
    title: "Forward Head Posture Correction",
    category: "Posture",
    timeframe: "8–12 weeks",
    evidence: "strong",
    tags: ["forward-head", "shoulder-asymmetry"],
    steps: [
      "Assessment: Stand against wall. Ideal — occiput, thoracic spine, and heels all contact wall simultaneously.",
      "Chin tucks: 3×15 reps daily. Pull chin straight back (NOT down). Hold 5 seconds. Feel the stretch at the base of skull.",
      "Deep cervical flexor activation: Progressive resistance with your own hand or a rolled towel under the neck.",
      "Stretch: Suboccipital muscles — hands clasped behind head, gently traction chin toward chest. 30s × 3.",
      "Stretch: Levator scapulae (each side 30s × 3) + Upper trapezius (each side 30s × 3).",
      "Strengthen: Rhomboids and mid/lower traps — face pulls, band pull-aparts, prone Y-T-W raises. 3×15–20, 3×/week.",
      "Ergonomics: Monitor top at eye level. Phone raised to eye level. Car headrest supporting C-curve.",
      "Timeline: Noticeable improvement in 4 weeks. Structural re-patterning: 8–12 weeks consistent work.",
    ],
  },
  {
    id: "anterior-pelvic-tilt",
    title: "Anterior Pelvic Tilt Correction",
    category: "Posture",
    timeframe: "8–16 weeks",
    evidence: "strong",
    tags: ["anterior-pelvic", "posture"],
    steps: [
      "Assessment: Lie on floor. If you can slide a hand flat under your lumbar, APT is likely. If fist fits, significant tilt.",
      "Hip flexors are the primary driver: Psoas and rectus femoris in chronic shortening from seated lifestyle.",
      "Stretch: Hip flexor (kneeling lunge) 60s × 3 each side, 2×/day. Must feel stretch at front of hip, not knee.",
      "Stretch: Rectus femoris (standing quad stretch with posterior tilt) 45s × 3 each side.",
      "Strengthen the antagonists: Glutes (hip thrusts, glute bridges 3×15) and hamstrings (RDLs 3×10–12).",
      "Strengthen core: Dead bugs 3×10, hollow body holds 3×20s — anterior core opposes the tilt force.",
      "Cue throughout the day: Think 'tuck' when standing. Squeeze glutes for 10 seconds. Repeat every hour.",
      "Deadlifts and squats with correct form actively pattern correct pelvis position under load.",
    ],
  },
  {
    id: "shoulder-asymmetry",
    title: "Shoulder Asymmetry Correction",
    category: "Posture",
    timeframe: "8–12 weeks",
    evidence: "strong",
    tags: ["shoulder-asymmetry", "posture"],
    steps: [
      "Common causes: Dominant side overuse, scoliosis, leg length discrepancy, uneven muscle development.",
      "Assessment: Stand relaxed in front of mirror. Note which shoulder sits higher. Check trap size on each side.",
      "Unilateral work: All pressing and pulling movements done with dumbbells (not barbell) temporarily to allow weak side to catch up.",
      "Serratus anterior: Often weak on one side. Wall slides 3×15. Cable punches 3×15 each side.",
      "Thoracic rotation stretch: 30s each side daily. Tight thoracic spine causes compensatory shoulder elevation.",
      "Carry bags on the weaker-shoulder side. Sleep on back, not the dominant side.",
      "If significant structural scoliosis suspected: Physiotherapist assessment before aggressive training.",
    ],
  },
  {
    id: "thoracic-kyphosis",
    title: "Thoracic Kyphosis (Upper Back Rounding)",
    category: "Posture",
    timeframe: "12–20 weeks",
    evidence: "strong",
    tags: ["forward-head", "posture"],
    steps: [
      "Thoracic extension over a foam roller: 30–60s daily. Position roller at upper, mid, and lower thoracic segments.",
      "Wall slides: Back flat against wall, arms in W, slide to Y. 3×10–12 daily. The definitive thoracic opener.",
      "Cat-cow 3×10: Maximise both flexion and extension through each rep.",
      "Thoracic rotation in 90/90 position: 3×10 each side. Restores rotational mobility.",
      "Strengthen thoracic extensors: Prone Y raises, T raises — 3×15 with light weight. Back extensors maintain upright position.",
      "Pulling ratio: 2:1 (pulls to pushes). Excessive bench pressing without rows creates kyphotic posture from pec tightness.",
      "Fix your chair: Lumbar support preserves lumbar lordosis which reduces compensatory thoracic flexion.",
    ],
  },
  // ─── PHYSIQUE ────────────────────────────────────────────────────────────────
  {
    id: "body-fat",
    title: "Body Fat Reduction Protocol",
    category: "Physique",
    timeframe: "12–24 weeks",
    evidence: "strong",
    tags: ["body-fat", "muscle-mass"],
    steps: [
      "Caloric deficit: 300–500 kcal/day below TDEE. TDEE = BMR × activity multiplier. Use accurate tracking for 2 weeks.",
      "Rate of loss: 0.5–1% bodyweight/week. Faster = greater muscle loss. Slower = diminishing returns on time investment.",
      "Protein: 2.0–2.4g/kg bodyweight to preserve lean mass during deficit. This is the single most important dietary variable.",
      "Resistance training 3–5×/week during cut — signals muscle retention. Lifting intensity stays the same; volume may drop slightly.",
      "Cardio: LISS 150–200min/week OR HIIT 3×20min/week. Cardio is for additional deficit, not the primary driver.",
      "Track weekly average weight (7 days), not daily. Daily variance from water/food masks actual fat loss trend.",
      "Diet breaks: Every 8–10 weeks, return to maintenance for 1–2 weeks. Manages adaptive thermogenesis.",
      "Final 5kg is the hardest. As you approach your goal, reduce deficit to 200–300 kcal to preserve muscle.",
    ],
  },
  {
    id: "shoulder-width",
    title: "Shoulder Width & V-Taper Development",
    category: "Physique",
    timeframe: "16–24 weeks",
    evidence: "strong",
    tags: ["shoulder-width", "muscle-mass"],
    steps: [
      "The V-taper illusion: Wide shoulders + narrow waist = high shoulder-to-waist ratio. Target: >1.618 (golden ratio).",
      "Lateral deltoid is the primary driver of shoulder WIDTH. It is chronically undertrained in most programs.",
      "Lateral raises: 4×15–20 with strict form. Cable lateral raises for constant tension. Load is secondary to feel.",
      "Overhead press (barbell or dumbbell): 3–4×5–8 heavy. Foundational compound for overall shoulder mass and thickness.",
      "Rear delts (posterior head): Face pulls 3×15–20, band pull-aparts 3×20. Critical for health AND visual width from front.",
      "Waist width: Avoid direct heavy oblique work (landmines, weighted side bends). Keeps waist narrow.",
      "Frequency: 2×/week direct shoulder work minimum. Delts recover fast — high frequency works well.",
      "Clavicle length is genetic and sets the ceiling. Within that, maximise lateral delt and supraspinatus development.",
    ],
  },
  {
    id: "muscle-building",
    title: "Muscle Mass: Hypertrophy Fundamentals",
    category: "Physique",
    timeframe: "24–52 weeks",
    evidence: "strong",
    tags: ["muscle-mass", "body-fat"],
    steps: [
      "Protein: 1.6–2.2g/kg bodyweight. This is the ceiling — beyond 2.4g/kg provides no additional benefit.",
      "Progressive overload: Increase load, volume, or density over time. Without this, adaptation stops.",
      "Volume: 10–20 sets per muscle group per week for hypertrophy. Start at 10, add 2 sets every 4 weeks.",
      "Intensity: 8–30 reps per set, taken to within 2–3 reps of failure (RIR 2–3). Proximity to failure drives hypertrophy.",
      "Frequency: 2× per muscle group per week — splits protein synthesis stimulus across the week.",
      "Caloric surplus: 200–400 kcal/day above maintenance for lean bulk. More = more fat gain, not proportionally more muscle.",
      "Sleep: 7–9h — this is when protein synthesis peaks (growth hormone pulsatile release). Non-negotiable.",
      "Recovery: Soreness is not the goal and not a measure of effectiveness. Progressive performance is the metric.",
    ],
  },
  {
    id: "neck-training",
    title: "Neck Development Protocol",
    category: "Physique",
    timeframe: "12–16 weeks",
    evidence: "moderate",
    tags: ["muscle-mass", "shoulder-width"],
    steps: [
      "Neck circumference has significant impact on perceived size and masculinity. Undertrained in most routines.",
      "Neck flexion: Lay on bench, head hanging off edge. Controlled nodding movement with plate on forehead. 3×15–20.",
      "Neck extension: Same setup, face down. Plate on back of head. 3×15–20.",
      "Lateral neck flexion: Side-to-side. 3×15 each side. Targets sternocleidomastoid and scalenes.",
      "Neck isolation machine (if available): Excellent for all planes. Use 2–3×/week.",
      "Shrugs: 4×15–20 with barbell or dumbbells. Targets upper trapezius, which frames the neck visually.",
      "Start with bodyweight only (hand resistance) for 2 weeks before adding external load — neck is sensitive.",
    ],
  },
  {
    id: "waist-definition",
    title: "Waist Definition & Core Aesthetics",
    category: "Physique",
    timeframe: "12–24 weeks",
    evidence: "strong",
    tags: ["body-fat", "anterior-pelvic"],
    steps: [
      "Visible abs require <12% body fat (males), <18% (females). No amount of ab training creates visible abs through fat.",
      "Waist WIDTH: Avoid heavy oblique work (weighted side bends, landmine twists). External obliques widen waist.",
      "Vacuum exercise: Exhale fully, pull navel to spine, hold. 3×30–60s. Strengthens transverse abdominis (inner corset).",
      "Rectus abdominis: Weighted crunches, hanging leg raises. For detail and definition at low BF, not waist reduction.",
      "Anterior pelvic tilt creates a visual 'gut' even at low BF. Fix the tilt first (see APT protocol).",
      "Body fat distribution is primarily genetic (android vs gynoid pattern). Work within your genetics.",
    ],
  },
  {
    id: "calf-development",
    title: "Calf Development",
    category: "Physique",
    timeframe: "24–52 weeks",
    evidence: "strong",
    tags: ["muscle-mass", "body-fat"],
    steps: [
      "Calves are the most genetically-determined muscle in the body. Insertion point is fixed; belly size varies widely.",
      "High frequency: Calves respond to daily training. 3–5×/week, 4–6 sets per session.",
      "Full range of motion: Complete stretch at bottom (heel below platform), peak contraction at top (full plantarflexion). ROM matters more than load.",
      "Gastrocnemius: Standing calf raise (knee straight) targets this head. Heavier loads.",
      "Soleus: Seated calf raise (knee bent, takes gastroc out). Longer time under tension.",
      "Explosive training: Box jumps and plyometrics recruit fast-twitch calf fibres.",
      "Calves have very short recovery time — volume and frequency are the main drivers, not maximal load.",
    ],
  },
  {
    id: "forearm-development",
    title: "Forearm & Grip Development",
    category: "Physique",
    timeframe: "12–20 weeks",
    evidence: "strong",
    tags: ["muscle-mass"],
    steps: [
      "Forearm size is determined by: brachioradialis, wrist extensors/flexors, and pronator teres.",
      "Compound pulling (deadlifts, rows, pull-ups) provides significant forearm stimulus from grip demands.",
      "Wrist curls: Barbell or dumbbell. Seated, wrist over knee. 3×15–20 for flexors.",
      "Reverse wrist curls: 3×15 for extensors. Balance prevents wrist injury.",
      "Hammer curls: Targets brachioradialis specifically. 3×10–12. One of the best forearm-building movements.",
      "Farmer's carries: Heavy dumbbells, walk 30–40m. Builds crushing grip and forearm density simultaneously.",
      "Dead hangs from a bar: 3×max hold. Improves grip and stretches forearm flexors.",
      "Fat Gripz attachment on all pulling movements: Doubles forearm activation from every back session.",
    ],
  },
  // ─── HAIR ────────────────────────────────────────────────────────────────────
  {
    id: "hair-loss",
    title: "Androgenetic Alopecia (Male Pattern Hair Loss)",
    category: "Hair",
    timeframe: "6–12 months",
    evidence: "strong",
    tags: ["hair-loss"],
    steps: [
      "Diagnose first: AGA vs telogen effluvium vs nutritional vs other. Miniaturization pattern = AGA. Diffuse shed = likely TE or nutritional.",
      "Bloodwork before treating: Ferritin, zinc, vitamin D, thyroid panel, DHT (if accessible). Deficiencies mask as AGA.",
      "Finasteride 1mg/day: Inhibits 5α-reductase type II, blocks 60–70% of DHT. 80–90% of users halt loss. Some regrowth.",
      "Minoxidil 5% topical: 1mL 2×/day to affected areas. Mechanism unclear (vasodilation + ion channel). Works independently of DHT.",
      "Stack: Finasteride + Minoxidil + Dermarolling 0.5mm weekly (24h before minoxidil application) = maximum evidence-based protocol.",
      "Ketoconazole 2% shampoo 3×/week: Antifungal with anti-androgenic effect on scalp. Modest standalone benefit.",
      "Oral minoxidil 2.5–5mg/day: Increasingly prescribed off-label. More systemic absorption — more effective but more side effects.",
      "Timeline: Shedding may increase in weeks 1–6 (shock loss — old hairs clearing). Stabilisation: 3–6 months. Visible regrowth: 6–12 months minimum.",
    ],
  },
  {
    id: "hair-texture",
    title: "Hair Texture, Health & Density",
    category: "Hair",
    timeframe: "8–16 weeks",
    evidence: "moderate",
    tags: ["hair-texture"],
    steps: [
      "Protein-moisture balance: Hair needs protein (keratin treatments, protein-rich conditioners) and hydration (humectants, oils).",
      "Over-processed or chemically treated hair: Protein treatment first. Olaplex No.3 (bond repair) 1×/week.",
      "Shampoo frequency: Wash every 2–3 days max unless scalp acne or extreme oil. Over-washing strips natural lipids.",
      "Scalp health = hair health: Seborrheic dermatitis (flaking, itching) suppresses follicle function. Ketoconazole shampoo treats this.",
      "Diet: Biotin (5000mcg/day) helps only if you're deficient. If not deficient, it won't help. Check bloodwork.",
      "Ferritin >70ng/mL: Critical for hair cycling. Low ferritin is the most commonly missed cause of poor texture and shedding.",
      "Heat styling: Always use heat protectant. Limit to 2× per week. Max temperature 180°C.",
      "Satin/silk pillowcase: Reduces friction breakage significantly vs cotton. One-time purchase.",
    ],
  },
  {
    id: "hair-style-face",
    title: "Hairstyle Optimization for Face Shape",
    category: "Hair",
    timeframe: "Immediate",
    evidence: "moderate",
    tags: ["hair-style", "hair-texture"],
    steps: [
      "Oval face: Most styles work. Aim to preserve the oval outline — avoid extreme volume on sides.",
      "Round face: Add height at the crown (quiff, pompadour). Avoid width. High fade on sides reduces visual roundness.",
      "Square/angular jaw: Softer textures, length on top. Avoid super slick styles that emphasise jaw angles too sharply.",
      "Long/narrow face: Width on sides (textured fringe, curtain bangs). Avoid excessive height.",
      "Receding hairline: Short on top minimises contrast. Bald fade + beard is typically superior to combover.",
      "General principle: Hair should create or maintain a triangle from forehead width down to jaw. Narrow chin = more width on top.",
      "Eyebrow grooming and hair are the most powerful male-accessible facial framing tools.",
    ],
  },
  // ─── GROOMING ────────────────────────────────────────────────────────────────
  {
    id: "beard-architecture",
    title: "Beard Architecture & Optimization",
    category: "Grooming",
    timeframe: "4–12 weeks",
    evidence: "moderate",
    tags: ["beard", "jawline"],
    steps: [
      "Face shape principle: Beard should counteract face shape weaknesses. Round face = sharp squared-off beard lines. Long face = full sides, no goatee.",
      "Neckline: 2 finger-widths above Adam's apple. Sharp, clean neckline. A high neckline makes jaw look smaller — most common mistake.",
      "Cheek line: Natural or trimmed 1–2mm. A clean cheek line makes a beard look intentional vs unkempt.",
      "Minoxidil for beard growth: Topical 5% applied to cheeks 2×/day for patchy areas. 12–16 weeks for visible results. Evidence: growing.",
      "Beard oil: Jojoba or argan base with beard comb. Prevents brittleness and skin dryness underneath.",
      "Length and face ratio: A beard extending past the chin adds visual chin projection. Weak chin = keep beard long there.",
      "Maintenance: Trim neckline every 3–4 days. Let the rest grow. Most people over-trim and ruin shape.",
    ],
  },
  {
    id: "skincare-routine-build",
    title: "Building a Complete Skincare Stack",
    category: "Grooming",
    timeframe: "Immediate + 12 weeks to see results",
    evidence: "strong",
    tags: ["skincare-routine"],
    steps: [
      "Layer 1 — Cleanser: Gentle, pH-balanced (4.5–6.5). CeraVe Hydrating or La Roche-Posay Toleriane equivalent. Twice daily.",
      "Layer 2 — Active (AM): Vitamin C 15–20% for antioxidant protection and brightening. Apply to dry skin, wait 30s.",
      "Layer 3 — Active (PM): Retinoid (adapalene 0.1% OTC, or tretinoin Rx). The single most evidence-backed topical for anti-aging and texture.",
      "Layer 4 — Moisturiser: Ceramide-based (PM especially). Repairs barrier. Apply over retinoid when starting out (buffering).",
      "Layer 5 — SPF (AM only, after moisturiser): Mineral or chemical, SPF50+. This is the most impactful anti-aging step.",
      "Order matters: Thinnest to thickest. Water-based before oil-based. SPF always last in AM.",
      "Introduce actives one at a time over 4-week intervals. Cannot identify what's working if you introduce everything at once.",
      "Oily skin: Niacinamide 10% in AM instead of/alongside vitamin C. Reduces sebum production measurably.",
      "Dry/sensitive: Skip AHA/BHA in early weeks. Build barrier with ceramides first.",
    ],
  },
  {
    id: "fragrance",
    title: "Fragrance Selection & Application",
    category: "Grooming",
    timeframe: "Immediate",
    evidence: "moderate",
    tags: ["skincare-routine", "beard"],
    steps: [
      "Fragrance family orientation: Woody (cedarwood, sandalwood, vetiver) — mature, grounded. Citrus — fresh, clean. Oriental/Amber — warm, sexual. Fougère — classic masculine.",
      "Concentration hierarchy: Parfum (20–40%) > EDP (15–20%) > EDT (5–15%) > EDC (2–4%). Higher concentration = longer lasting.",
      "Application: Pulse points — wrists, neck, behind ears, chest. Do NOT rub wrists together — breaks fragrance chain.",
      "Projection vs longevity: Heavy base notes (musks, ambers, woods) last longer. Top notes (citrus, herbs) are the first impression only.",
      "Seasonal: Light citrus/aquatics in summer. Dense orientals/woods in winter. The chemistry behaves differently in heat.",
      "Blind buying: Use fragrance samples/decants before committing to a full bottle. Fragrance performs differently on your skin chemistry.",
      "Budget: Mid-range niche (Maison Margiela, Prada, Tom Ford basics) outperform drugstore dramatically. There is a quality ceiling at designer level.",
      "One signature scent: More powerful than rotating. People associate scent with memory — become a scent.",
    ],
  },
  {
    id: "clothing-body-type",
    title: "Clothing for Body Optimization",
    category: "Grooming",
    timeframe: "Immediate",
    evidence: "moderate",
    tags: ["shoulder-width", "body-fat"],
    steps: [
      "Principle: Clothing should emphasise shoulder width and de-emphasise waist width (or vice versa for narrow frames).",
      "Fit > brand: A $30 shirt that fits perfectly reads better than a $300 shirt that doesn't. Tailoring is cheap.",
      "Shoulder seam must sit exactly on the shoulder bone. Not inside it, not hanging off. This is non-negotiable.",
      "Slim fit trousers tapering to a clean break or no break elongates legs regardless of height.",
      "Colour blocking for V-taper: Light, structured top (white/light grey) — draws eye up. Dark bottoms — recedes hips.",
      "Layering: Structured blazer or overshirt adds shoulder structure for those without natural shoulder width.",
      "Horizontal stripes on top = visual width (good for narrow frames, avoid for wide). Vertical lines = elongating.",
      "Shoe height: Boots with 2–3cm heel add measurable height perception without obvious platform.",
    ],
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Skin": "◈",
  "Face Structure": "◉",
  "Posture": "◎",
  "Physique": "⬡",
  "Hair": "◆",
  "Grooming": "◇",
};

const EVIDENCE_LABELS: Record<string, { label: string; color: string }> = {
  strong: { label: "STRONG EVIDENCE", color: "#52b788" },
  moderate: { label: "MODERATE EVIDENCE", color: "#5ab3cc" },
  emerging: { label: "EMERGING EVIDENCE", color: "#c4a44a" },
};

export function ActionPlan() {
  const { userProfile } = useAppStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const relevantProtocols = userProfile?.insecurities?.length
    ? PROTOCOLS.filter((p) =>
        p.tags.some((tag) => userProfile.insecurities?.includes(tag))
      )
    : PROTOCOLS;

  const categories = ["All", ...Array.from(new Set(relevantProtocols.map((p) => p.category)))];

  const displayed = activeCategory === "All"
    ? relevantProtocols
    : relevantProtocols.filter((p) => p.category === activeCategory);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[9px] tracking-[3px] text-[#2a2a2e] uppercase">PERSONALIZED</p>
          <p className="text-sm font-bold text-[#e8e8e8]">Action Plan</p>
        </div>
        <span className="text-[10px] border border-[rgba(90,179,204,0.15)] text-[#5ab3cc] px-2 py-0.5">
          {relevantProtocols.length} protocols
        </span>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 flex-wrap mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[9px] tracking-wider px-2 py-1 border transition-all ${
              activeCategory === cat
                ? "border-[#5ab3cc] text-[#5ab3cc] bg-[rgba(90,179,204,0.08)]"
                : "border-[rgba(255,255,255,0.05)] text-[#848484] hover:border-[rgba(90,179,204,0.15)]"
            }`}
          >
            {CATEGORY_ICONS[cat] ?? ""} {cat}
          </button>
        ))}
      </div>

      {displayed.length === 0 && (
        <p className="text-[#2a2a2e] text-xs text-center py-4">
          Complete onboarding to see your personalized protocols.
        </p>
      )}

      <div className="space-y-1.5">
        {displayed.map((p) => {
          const ev = EVIDENCE_LABELS[p.evidence];
          return (
            <div key={p.id} className="border border-[rgba(255,255,255,0.04)] hover:border-[rgba(90,179,204,0.12)] transition-all">
              <button
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
              >
                <span className="text-[#5ab3cc] text-[10px] flex-shrink-0">
                  {expanded === p.id ? "▼" : "▶"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#e8e8e8] font-bold truncate">{p.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[9px] text-[#2a2a2e]">{p.category} · {p.timeframe}</p>
                    <span className="text-[8px] tracking-wide" style={{ color: ev.color }}>
                      {ev.label}
                    </span>
                  </div>
                </div>
              </button>

              {expanded === p.id && (
                <div className="px-3 pb-3 border-t border-[rgba(255,255,255,0.03)]">
                  <div className="space-y-2 mt-2">
                    {p.steps.map((step, i) => (
                      <div key={i} className="flex gap-2 text-xs">
                        <span className="text-[#5ab3cc] font-mono text-[9px] flex-shrink-0 mt-0.5 w-4 text-right">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-[#848484] leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
