import React from "react";

export default function WhyUs() {
  return (
    <div className="why-us-page-container">
      {/* SCREEN 2: WHY US / INSPIRED TO INSPIRE */}
      <section id="features" className="py-24 bg-gym-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row items-center gap-16 relative z-20">
            
            {/* Column Left: Features list */}
            <div className="lg:w-1/2 space-y-8">
              <div>
                <span className="text-xs font-bold text-neon-lime font-mono uppercase tracking-widest block mb-2">
                  CORE DIFFERENCES
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-white mb-4">
                  Inspired to<br />
                  <span className="text-neon-lime">Inspire Your Best Self</span>
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  We're your strategic partner in achieving a healthier, stronger, and more confident you. Unlock bespoke services designed with architectural care.
                </p>
              </div>

              {/* Lists (Precisely matches bullet points from Screen 2 left) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gym-dark/40 border border-gym-border/60 p-8 rounded-3xl backdrop-blur-sm">
                {[
                  { title: "Nutrition Guidance", desc: "Co-designed caloric fuel roadmaps." },
                  { title: "Expert Trainers", desc: "Top 1% elite certified supervisors." },
                  { title: "Progress Tracking", desc: "Real-time biometric workout counts." },
                  { title: "Premium Membership", desc: "State-of-the-art entry gate keys." },
                  { title: "Community Support", desc: "Highly motivated athlete circle." },
                  { title: "Next-Level Fitness Spaces", desc: "Immersive heavy platforms." }
                ].map((feat, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-neon-lime/10 text-neon-lime font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-bold tracking-tight">{feat.title}</h4>
                      <p className="text-zinc-500 text-[11px] mt-0.5">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column Right: Athlete Photo Grayscale */}
            <div className="lg:w-1/2 relative w-full h-[450px]">
              <div className="w-full h-full rounded-3xl overflow-hidden bg-zinc-900 border border-gym-border aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80" 
                  alt="Heavy training barbell squat grayscale"
                  className="w-full h-full object-cover filter brightness-[0.7] contrast-110 saturate-[0.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gym-black/70 to-transparent" />
              </div>

              {/* Small floating badge */}
              <div className="absolute bottom-6 right-6 bg-gym-black/95 border border-neon-lime/30 p-4 rounded-2xl shadow-xl max-w-xs backdrop-blur">
                <span className="text-xs font-mono font-bold text-neon-lime uppercase block mb-1">Weekly Target Peak</span>
                <p className="text-[10px] text-zinc-400">Achieve premium levels of cardiovascular flow using Kettlebell programs.</p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
