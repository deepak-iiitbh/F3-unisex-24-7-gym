import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Zap, Flame, Dumbbell, Heart } from "lucide-react";
import SuccessStories from "../components/SuccessStories";
import { TESTIMONIALS, PARTNERS } from "../data";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  return (
    <div className="home-page-container">
      {/* SCREEN 1: HERO SECTION */}
      <section
        id="home"
        className="relative min-h-[92vh] flex items-center justify-center pt-10 pb-20 overflow-hidden bg-gym-black"
      >
        {/* Ambient colorful light circles inside background exactly as in design */}
        <div className="absolute top-[10%] left-[-15%] w-96 h-96 rounded-full bg-neon-lime/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-zinc-900/40 blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full h-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-4 relative z-20">
            {/* Visual Title Left (Under and absolute spacing coordinates) */}
            <div className="lg:w-1/2 text-left space-y-6">
              {/* Subtle decorative introductory line */}
              <div className="flex items-center gap-2">
                <span className="w-10 h-0.5 bg-neon-lime" />
                <span className="text-xs font-bold tracking-widest text-neon-lime font-mono uppercase bg-neon-lime/10 px-3 py-1 rounded-md">
                  AWARD-WINNING FITNESS HUB
                </span>
              </div>

              {/* Super big Title mimicking precisely Screenshot 1 */}
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold font-display tracking-tighter text-white leading-[1.05] relative">
                Sculpt{" "}
                <span className="font-sans text-neon-lime italic font-medium">
                  Your
                </span>{" "}
                Body,
                <br />
                Elevate{" "}
                <span className="text-zinc-500 font-sans italic font-normal">
                  Your
                </span>{" "}
                Spirit
              </h1>

              {/* Hero descriptive text */}
              <p className="text-zinc-400 text-sm sm:text-base max-w-lg leading-relaxed font-light">
                Establish ultimate athletic performance. Access our premium
                six-program rigs, custom tailored nutrition charts, and
                world-class expert coaching to accelerate your potential.
              </p>

              {/* Outstanding direct support inquiry phone number overlay - styled elegantly */}
              <div className="p-4 bg-zinc-950/90 border border-neon-lime/30 rounded-2xl flex items-center gap-4 max-w-md shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-neon-lime/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-all" />
                <div className="w-10 h-10 rounded-xl bg-neon-lime/10 flex items-center justify-center text-neon-lime grow-0 shrink-0">
                  <span className="text-lg font-bold select-none">💬</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-widest">
                    FOR MORE INFO / QUESTIONS CONTACT
                  </h4>
                  <p className="text-sm font-black text-white font-mono mt-0.5">
                    Call:{" "}
                    <a
                      href="tel:8077237136"
                      className="text-neon-lime hover:underline transition-all underline-offset-2"
                    >
                      8077237136
                    </a>
                  </p>
                </div>
              </div>

              {/* Social validation counter avatars & Let's Start CTA Button */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
                {/* Avatars metric left */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <img
                      className="w-10 h-10 rounded-full border-2 border-gym-black object-cover filter saturate-50"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop"
                      alt="avatar"
                    />
                    <img
                      className="w-10 h-10 rounded-full border-2 border-gym-black object-cover filter saturate-50"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop"
                      alt="avatar"
                    />
                    <img
                      className="w-10 h-10 rounded-full border-2 border-gym-black object-cover filter saturate-50"
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop"
                      alt="avatar"
                    />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-lg font-display tracking-tight">
                      12k+
                    </div>
                    <div className="text-xs text-zinc-500 font-medium">
                      Happy Gym Members
                    </div>
                  </div>
                </div>

                {/* Let's Start Arrow Badge Button right */}
                <button
                  id="hero-start-btn"
                  onClick={() => navigate("/membership")}
                  className="inline-flex items-center justify-between gap-5 px-6 py-4 rounded-full bg-neon-lime text-gym-black font-extrabold font-display text-sm tracking-wide shadow-[0_5px_25px_rgba(184,255,34,0.35)] hover:bg-neutral-100 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] transition-all duration-300 group cursor-pointer"
                >
                  <span>Let's Start Now</span>
                  <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Spectacular Center/Right Image with interactive Floating Badges overlaying precisely matches Screen1 */}
            <div className="lg:w-1/2 flex justify-center relative w-full h-[540px]">
              {/* Central athlete Model Graphic in Grayscale */}
              <div className="relative w-full max-w-[420px] h-full rounded-full bg-gradient-to-b from-zinc-900 to-gym-black/20 overflow-hidden border border-zinc-800">
                <img
                  src="/anmol.jpg"
                  alt="Anmol"
                  className="w-full h-full object-cover object-[center_30%] filter brightness-[0.90] contrast-[1.12] grayscale scale-[1.02] transition-all duration-350 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gym-black via-transparent to-transparent pointer-events-none" />
              </div>

              {/* FLOATING STATUS BADGES OVERLAY */}

              {/* Badge 1: Top-Left "Hours 1.5" */}
              <div className="absolute top-[16%] left-[10%] sm:left-[2%] bg-zinc-900/90 backdrop-blur-md border border-gym-border hover:border-zinc-500 p-3 rounded-2xl flex items-center gap-3 shadow-2xl transition-all hover:scale-105 group">
                <div className="w-9 h-9 rounded-xl bg-neon-lime/10 flex items-center justify-center text-neon-lime">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                    Hours
                  </span>
                  <span className="text-sm font-bold text-white font-display">
                    1.5 Daily
                  </span>
                </div>
              </div>

              {/* Badge 2: Top-Right "Poses 20" */}
              <div className="absolute top-[16%] right-[10%] sm:right-[2%] bg-zinc-900/90 backdrop-blur-md border border-gym-border hover:border-zinc-500 p-3 rounded-2xl flex items-center gap-3 shadow-2xl transition-all hover:scale-105">
                <div className="w-9 h-9 rounded-xl bg-neon-lime/10 flex items-center justify-center text-neon-lime">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                    Poses
                  </span>
                  <span className="text-sm font-bold text-white font-display">
                    20 Sculpt
                  </span>
                </div>
              </div>

              {/* Badge 3: Bottom-Left "Kcal 550" */}
              <div className="absolute bottom-[20%] left-[8%] sm:left-[-2%] bg-zinc-900/90 backdrop-blur-md border border-gym-border hover:border-zinc-500 p-3 rounded-2xl flex items-center gap-3 shadow-2xl transition-all hover:scale-105">
                <div className="w-9 h-9 rounded-xl bg-neon-lime/10 flex items-center justify-center text-neon-lime">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                    Burned
                  </span>
                  <span className="text-sm font-bold text-white font-display">
                    550 Kcal
                  </span>
                </div>
              </div>

              {/* Badge 4: Bottom-Right "Sets 5" */}
              <div className="absolute bottom-[20%] right-[8%] sm:right-[-2%] bg-zinc-900/90 backdrop-blur-md border border-gym-border hover:border-zinc-500 p-3 rounded-2xl flex items-center gap-3 shadow-2xl transition-all hover:scale-105">
                <div className="w-9 h-9 rounded-xl bg-neon-lime/10 flex items-center justify-center text-neon-lime">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                    Lifts
                  </span>
                  <span className="text-sm font-bold text-white font-display">
                    5 Extreme
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS LOGO SCROLL BANNER */}
      <section className="py-12 bg-zinc-950 border-y border-gym-border/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] tracking-widest text-zinc-600 font-mono uppercase mb-8">
            TRUSTED PARTNERS IN ELITE PHYSICAL ATHLETICS
          </p>
          <div className="flex flex-wrap items-center justify-around gap-8 opacity-75">
            {PARTNERS.map((p, i) => (
              <span
                key={i}
                className="text-white text-lg sm:text-2xl font-black tracking-tighter uppercase font-display select-none hover:text-neon-lime transition-colors"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SCREEN 3: WORKOUT PROGRAMS (6 columns with corner diagonal tags) */}
      <section className="py-24 bg-gym-black/80 border-t border-gym-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Head */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-neon-lime font-mono uppercase tracking-widest block mb-2">
              EXPLORE TRACKS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-white mb-4">
              Discover What Sets Us Apart
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
              We deliver a fitness experience that is truly one-of-a-kind. Check
              out six heavy-weight systems designed for extreme daily sculpting.
            </p>
          </div>

          {/* Grid 3x2 with diagonal trim */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Barbell Basics",
                img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500",
              },
              {
                name: "Kettlebell Masterclass",
                img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500",
              },
              {
                name: "Cardio Power Boost",
                img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500",
              },
              {
                name: "Hypertrophy Program",
                img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500",
              },
              {
                name: "Rope Climbing Elite",
                img: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=500",
              },
              {
                name: "TRX Suspension Dynamics",
                img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500",
              },
            ].map((track, i) => (
              <div
                key={i}
                onClick={() => navigate("/schedule")}
                className="bg-gym-dark/80 rounded-3xl border border-gym-border/80 overflow-hidden relative group hover:border-neon-lime hover:shadow-[0_0_20px_rgba(184,255,34,0.15)] transition-all duration-300 cursor-pointer"
              >
                {/* Top Right diagonal Lime corner strip precisely matching visual tag */}
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                  <div className="bg-neon-lime text-gym-black font-bold uppercase font-mono py-1 text-[8px] tracking-widest text-center rotate-45 w-20 absolute top-1 right-[-24px] shadow-sm">
                    NEW
                  </div>
                </div>

                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={track.img}
                    alt={track.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter grayscale contrast-110 saturate-[0.1] brightness-[0.7] group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gym-dark/95 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold font-display text-zinc-100 group-hover:text-neon-lime transition-all">
                    {track.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 uppercase font-mono">
                    Group Workouts / Available Weekly
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCREEN 4: EXPERIENCE FITNESS FOR WORKOUT (2 columns card details) */}
      <section className="py-24 bg-gym-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-neon-lime font-mono uppercase tracking-widest block mb-2">
              DIAGNOSTIC METRICS
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-white mb-4">
              Experience Fitness Like Never Before
            </h2>
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
              Transform the way you coach using real-time heart metrics and
              activity trackers. Build absolute safety while maximizing output.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Dynamic Card 1: Endurance Evolution */}
            <div className="bg-gym-dark/50 border border-gym-border/80 hover:border-zinc-700/80 p-8 rounded-3xl flex flex-col justify-between hover:shadow-xl transition-all relative group overflow-hidden">
              <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-rose-500/[0.02] rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono uppercase">
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span>Cardio System Core</span>
                </div>

                <h3 className="text-2xl font-bold font-display text-white group-hover:text-neon-lime transition-colors">
                  Endurance Evolution
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed pr-8">
                  Boost your stamina and resilience with tailored cardio and
                  endurance workouts designed to keep you moving stronger, for
                  longer phases.
                </p>

                {/* Integrated mini Heart rate widget component */}
                <div className="bg-zinc-950/80 border border-gym-border rounded-2xl p-4 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                      HEART BIO RATE
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-white font-mono">
                        95
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        BPM
                      </span>
                    </div>
                  </div>
                  {/* Interactive CSS simulated ECG line path */}
                  <div className="w-24 h-8 flex items-center shrink-0">
                    <svg
                      className="w-full h-full text-rose-500/80"
                      viewBox="0 0 100 30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M0,15 L20,15 L28,5 L34,25 L40,15 L50,15 L56,15 L62,5 L68,25 L74,15 L100,15" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/schedule")}
                className="mt-8 self-start px-5 py-2.5 bg-neon-lime text-gym-black text-xs font-bold rounded-xl shadow hover:bg-neutral-100 transition-all cursor-pointer"
              >
                Read More
              </button>
            </div>

            {/* Dynamic Card 2: Speed Surge */}
            <div className="bg-gym-dark/50 border border-gym-border/80 hover:border-zinc-700/80 p-8 rounded-3xl flex flex-col justify-between hover:shadow-xl transition-all relative group overflow-hidden">
              <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-neon-lime/[0.02] rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neon-lime/10 border border-neon-lime/20 text-neon-lime text-[10px] font-mono uppercase">
                  <Zap className="w-3 h-3" />
                  <span>Agility Sprint Boost</span>
                </div>

                <h3 className="text-2xl font-bold font-display text-white group-hover:text-neon-lime transition-colors">
                  Speed Surge
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed pr-8">
                  Boost your agility and explosiveness with high-intensity
                  sprint and movement drills. Speed Surge is designed to take
                  your performance to the next level.
                </p>

                {/* Integrated mini workout steps widget */}
                <div className="bg-zinc-950/80 border border-gym-border rounded-2xl p-4 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                      CADENCE PACE
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold text-white font-mono">
                        1024
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        STEPS
                      </span>
                    </div>
                  </div>
                  {/* Cadence progress circles */}
                  <span className="text-xs text-neon-lime bg-neon-lime/10 border border-neon-lime/30 font-mono px-3 py-1.5 rounded-xl font-bold">
                    Pace: Extreme
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/schedule")}
                className="mt-8 self-start px-5 py-2.5 bg-neon-lime text-gym-black text-xs font-bold rounded-xl shadow hover:bg-neutral-100 transition-all cursor-pointer"
              >
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Success stories carousel component */}
      <SuccessStories testimonials={TESTIMONIALS} />

      {/* SCREEN 6: GREEN NEWSLETTER Banner exactly matches Screen 6 center block! */}
      <section className="py-16 bg-gym-black relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-neon-lime rounded-[40px] p-8 sm:p-14 text-center text-gym-black relative overflow-hidden shadow-2xl">
            {/* Graphic backdrop textures */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.06),transparent_80%)] pointer-events-none" />

            <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight uppercase leading-none mb-4">
              Connect Engage Transform
            </h2>
            <p className="text-gym-black/80 max-w-xl mx-auto text-xs sm:text-sm mb-8 font-medium">
              Join a vibrant community for fuel motivation. Engagement drives
              progress, outcomes, and lasting transformation.
            </p>

            {newsletterSubscribed ? (
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-gym-black text-neon-lime text-xs sm:text-sm font-bold shadow-lg">
                🎉 Success! You have subscribed with email. Welcome to the F3
                GYM loop!
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (newsletterEmail) {
                    try {
                      const cleanedEmail = newsletterEmail
                        .trim()
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9]/g, "_");
                      const newsletterDocRef = doc(
                        db,
                        "newsletters",
                        cleanedEmail,
                      );
                      await setDoc(newsletterDocRef, {
                        email: newsletterEmail,
                        subscribedAt: new Date().toISOString(),
                      });
                      setNewsletterSubscribed(true);
                    } catch (error) {
                      handleFirestoreError(
                        error,
                        OperationType.CREATE,
                        `newsletters/${newsletterEmail}`,
                      );
                    }
                  }
                }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
              >
                <input
                  required
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="w-full sm:flex-1 px-5 py-4 rounded-2xl bg-white border-0 text-gym-black font-medium text-sm placeholder:text-zinc-500 outline-none focus:ring-4 focus:ring-gym-black/20"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-gym-black text-neon-lime rounded-2xl text-sm font-extrabold tracking-wide hover:bg-zinc-900 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Join Now
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
