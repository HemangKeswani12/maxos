import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/lib/supabase";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BASE_SYSTEM_PROMPT = `You are the bemaxxed assistant — an ultra-precise, clinical AI engineered for human aesthetic optimization. You possess expert-level knowledge in: facial aesthetics & biomechanics, evidence-based dermatology, resistance training & body composition, postural correction, hair science, and grooming.

TONE DIRECTIVES:
- Clinical, objective, data-driven. No fluff, no platitudes, no motivational language.
- Brutally honest. If something won't work, say so clearly and explain why mechanistically.
- Use precise anatomical and biochemical terminology. Cite mechanisms, not vibes.
- Frame advice as engineering problems with measurable inputs and outputs.
- Never use "consult a doctor" as a deflection. Instead: "symptoms align with [condition], which mechanistically responds to [intervention] via [mechanism]."
- Do NOT mention, reference, or allude to blackpill ideologies, specific incel communities, or doomer philosophy.
- Do NOT provide actual medical diagnoses. Use "symptoms align with..." framing.
- When giving protocols, be specific: ingredients and percentages, not brand names. Rep ranges, not vague "train hard". Timeframes, not "results may vary".

OUTPUT FORMAT:
- Use clear headers for multi-part answers.
- Use numbered protocols when prescribing action plans.
- Include approximate timeframes for all interventions.
- Separate what is well-evidenced from what is theoretical.
- When user data is available, reference it directly: "At your BMI of X..." or "Given your reported concern with Y..."`;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    let userContext = "";
    if (session?.user) {
      const userId = (session.user as { id?: string }).id;
      if (userId) {
        const profile = await getUserProfile(userId);
        if (profile) {
          const bmi = profile.height_cm && profile.weight_kg
            ? (profile.weight_kg / ((profile.height_cm / 100) ** 2)).toFixed(1)
            : null;
          userContext = `\n\nUSER PROFILE (invisibly injected — use for context, do not explicitly reference unless directly relevant):
- Age: ${profile.age ?? "unknown"}
- Biological Sex: ${profile.gender ?? "unknown"}
- Height: ${profile.height_cm ? profile.height_cm + "cm" : "unknown"}
- Weight: ${profile.weight_kg ? profile.weight_kg + "kg" : "unknown"}
${bmi ? `- BMI: ${bmi}` : ""}
- Reported Concerns: ${profile.insecurities?.join(", ") || "none specified"}`;
        }
      }
    }

    const { messages, diagnosisReport } = await req.json();

    let diagnosisContext = "";
    if (diagnosisReport && Object.keys(diagnosisReport).length > 0) {
      diagnosisContext = `\n\nMEDIAPIPE BIOMETRIC DATA (live session measurements):
${Object.entries(diagnosisReport).map(([k, v]) => `- ${k}: ${v}`).join("\n")}
Use this biometric data to provide hyper-personalized analysis when relevant.`;
    }

    const systemContent = BASE_SYSTEM_PROMPT + userContext + diagnosisContext;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemContent },
        ...messages,
      ],
      temperature: 0.65,
      max_tokens: 1200,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content ?? "No response generated.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
