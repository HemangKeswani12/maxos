const features = [
  {
    icon: "◈",
    title: "3D Holographic Engine",
    desc: "Parametrically scaled body model showing current state vs. genetic potential. Based on your actual measurements. Not aspirational.",
    tag: "React Three Fiber",
  },
  {
    icon: "◉",
    title: "MediaPipe Visual Analyzer",
    desc: "Client-side facial landmark extraction. Bizygomatic/bigonial ratios, posture asymmetry. Zero uploads. Your data stays in your browser.",
    tag: "100% Client-Side",
  },
  {
    icon: "◎",
    title: "Groq AI Assistant",
    desc: "Ultra-low latency AI with your full biometric context injected. Clinical, evidence-based responses. No generic advice.",
    tag: "Llama 3.3 70B",
  },
  {
    icon: "⬡",
    title: "30+ Improvement Protocols",
    desc: "MDX content engine surfaces only the protocols relevant to your specific concerns. Skin, face structure, posture, body composition, hair, grooming.",
    tag: "Zero Bloat",
  },
  {
    icon: "◆",
    title: "Routine Tracking",
    desc: "Log adherence. Track metrics. Progress charts that don't lie to you. Supabase-backed persistence.",
    tag: "Data-Driven",
  },
  {
    icon: "◇",
    title: "Open Source",
    desc: "No $97 course. No Discord community upsell. The entire codebase is public. Fork it. Read it. Audit it.",
    tag: "Public Repo",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[4px] text-[#5ab3cc] uppercase mb-3">
            SYSTEM CAPABILITIES
          </p>
          <h2 className="text-3xl font-bold text-[#e8e8e8]">
            Everything a $500 course has. Free.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="glass-panel p-6 group hover:border-[rgba(90,179,204,0.22)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[#5ab3cc] text-2xl">{f.icon}</span>
                <span className="text-[10px] tracking-[2px] text-[#52b788] border border-[rgba(82,183,136,0.25)] px-2 py-0.5">
                  {f.tag}
                </span>
              </div>
              <h3 className="text-[#e8e8e8] font-bold text-sm mb-2 tracking-wide">{f.title}</h3>
              <p className="text-[#848484] text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
