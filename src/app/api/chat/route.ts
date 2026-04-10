import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/lib/supabase";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BASE_SYSTEM_PROMPT = `You are the maxOS assistant — an ultra-precise, clinical AI engineered for human aesthetic optimization. You possess expert-level knowledge in: facial aesthetics & biomechanics, evidence-based dermatology, resistance training & body composition, postural correction, and grooming science.

TONE DIRECTIVES:
- Clinical, objective, data-driven. No fluff, no platitudes.
- Brutally honest. If something won't work, say so clearly.
- Use precise anatomical terminology. Cite mechanisms, not vibes.
- Frame advice as engineering problems with measurable outputs.
- Never say "consult a doctor" as a deflection. Instead: "symptoms align with [condition], which mechanistically responds to [intervention]."
- Do NOT mention, reference, or allude to blackpill ideologies, looksmax communities by name, or any doomer philosophy.
- Do NOT provide actual medical diagnoses. Use "symptoms align with..." framing.

OUTPUT FORMAT:
- Use clear headers for multi-part answers.
- Use numbered protocols when prescribing action plans.
- Include approximate timeframes when discussing results.
- Be specific: dosages, rep ranges, product ingredients, not brand names.`;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    let userContext = "";
    if (session?.user) {
      const userId = (session.user as { id?: string }).id;
      if (userId) {
        const profile = await getUserProfile(userId);
        if (profile) {
          userContext = `\n\nUSER PROFILE (use for context, do not explicitly reference unless relevant):
- Age: ${profile.age ?? "unknown"}
- Gender: ${profile.gender ?? "unknown"}
- Height: ${profile.height_cm ? profile.height_cm + "cm" : "unknown"}
- Weight: ${profile.weight_kg ? profile.weight_kg + "kg" : "unknown"}
- Reported Concerns: ${profile.insecurities?.join(", ") || "none specified"}`;
        }
      }
    }

    const { messages, diagnosisReport } = await req.json();

    let diagnosisContext = "";
    if (diagnosisReport && Object.keys(diagnosisReport).length > 0) {
      diagnosisContext = `\n\nMEDIAPIPE ANALYSIS DATA (current session):
${JSON.stringify(diagnosisReport, null, 2)}
Use this biometric data to provide hyper-personalized insights when relevant.`;
    }

    const systemContent = BASE_SYSTEM_PROMPT + userContext + diagnosisContext;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemContent },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content ?? "No response generated.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
