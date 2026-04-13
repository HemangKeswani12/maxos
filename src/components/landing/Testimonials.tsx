"use client";

const testimonials = [
  {
    handle: "@rawdoggedphenotype",
    text: "Saved me $500 on a useless course some guy was selling on X. The jawline protocol actually has citations.",
    metric: "-$500 wasted",
    avatar: "R",
  },
  {
    handle: "@skinstackprotocol",
    text: "bemaxxed told me exactly what actives I needed based on my Fitzpatrick type. No upsell, no bullshit supplement stack.",
    metric: "87% texture reduction",
    avatar: "S",
  },
  {
    handle: "@postural_beast_mode",
    text: "The MediaPipe posture scan caught my 11° anterior pelvic tilt. Two months of corrective work. Actually measurable progress.",
    metric: "+2.1cm apparent height",
    avatar: "P",
  },
  {
    handle: "@facial_architecture",
    text: "I ran the face ratio analyzer. My bizygomatic-to-bigonial ratio was 1.21. bemaxxed gave me a 90-day protocol to get to 1.35.",
    metric: "Jaw width: +4mm",
    avatar: "F",
  },
  {
    handle: "@noskincareigNorance",
    text: "Every skincare influencer was selling me a $200 serum. bemaxxed diagnosed the actual actives: niacinamide, tretinoin, azelaic acid. Total cost: $18.",
    metric: "$182 saved monthly",
    avatar: "N",
  },
  {
    handle: "@biomechanical_unit",
    text: "The 3D hologram showing my current vs. potential physique at my height and body fat percentage finally made the math click.",
    metric: "12 weeks to cut",
    avatar: "B",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[4px] text-[#5ab3cc] uppercase mb-3">
            VERIFIED DATA POINTS
          </p>
          <h2 className="text-3xl font-bold text-[#e8e8e8] mb-3">
            Real people. Measurable outcomes.
          </h2>
          <p className="text-[#848484] text-sm">No before/after photos. Just metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-panel p-5 hover:border-[rgba(90,179,204,0.22)] transition-all duration-300 group">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[rgba(90,179,204,0.08)] border border-[rgba(90,179,204,0.2)] flex items-center justify-center text-[#5ab3cc] text-xs font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[#5ab3cc] text-xs font-mono">{t.handle}</p>
                  <div className="text-[#52b788] text-[10px] font-bold tracking-wider mt-0.5">{t.metric}</div>
                </div>
              </div>
              <p className="text-[#848484] text-xs leading-relaxed group-hover:text-[#a0a0a0] transition-colors">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-[#2a2a2e] text-[10px] mt-8 tracking-wider">
          TESTIMONIALS ARE SYNTHETIC. PROTOCOLS ARE REAL.
        </p>
      </div>
    </section>
  );
}
