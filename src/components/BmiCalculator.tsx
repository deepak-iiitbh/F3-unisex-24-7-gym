import React, { useState, useEffect } from "react";
import { Scale, Activity, ArrowRight, Sparkles, HelpCircle, RefreshCw } from "lucide-react";

interface BmiCategory {
  label: string;
  range: string;
  minVal: number;
  maxVal: number;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  recommendation: string;
  f3Classes: string[];
}

const BMI_CATEGORIES: BmiCategory[] = [
  {
    label: "Underweight",
    range: "< 18.5",
    minVal: 0,
    maxVal: 18.5,
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    description: "Your BMI indicates you are in the underweight category. Building lean muscle tissue and optimizing caloric intake may support optimal health.",
    recommendation: "Focus on caloric surplus with balanced macronutrients. Train with structural weightlifting to build structural strength and density.",
    f3Classes: ["Elite Strength Barbell", "Functional Power Cage"]
  },
  {
    label: "Normal Weight",
    range: "18.5 – 24.9",
    minVal: 18.5,
    maxVal: 24.9,
    color: "text-neon-lime",
    bgColor: "bg-neon-lime/10",
    borderColor: "border-neon-lime/30",
    description: "Congratulations! Your BMI is in the healthy and premium normal weight range. Maintaining this balance supports longevity and joint wellness.",
    recommendation: "Maintain functional endurance and physical conditioning. Incorporate varied recovery sessions and progressive overload.",
    f3Classes: ["HIIT Metcon Engine", "Vinyasa Flow Rest"]
  },
  {
    label: "Overweight",
    range: "25.0 – 29.9",
    minVal: 25.0,
    maxVal: 29.9,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    description: "Your BMI points to slightly elevated ranges. This is a common zone for individuals with elevated muscle mass or manageable body fat indices.",
    recommendation: "Focus on active caloric expenditure combined with progressive conditioning to enhance fat oxidation and improve metabolic flexibility.",
    f3Classes: ["HIIT Metcon Engine", "Cardio Boxing Club"]
  },
  {
    label: "Obese (Class I)",
    range: "30.0 – 34.9",
    minVal: 30.0,
    maxVal: 34.9,
    color: "text-orange-500",
    bgColor: "bg-orange-550/10",
    borderColor: "border-orange-500/30",
    description: "Your BMI falls within Class I Obesity. A combination of metabolic conditioning and dietary guidelines can successfully reduce joint compression.",
    recommendation: "Combine low-impact cardio work with active resistance training. Consistently log your daily steps and hydration goals safely.",
    f3Classes: ["Cardio Boxing Club", "Calisthenics Basic Rig"]
  },
  {
    label: "Severe Obesity",
    range: "≥ 35.0",
    minVal: 35.0,
    maxVal: 100,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    description: "Your BMI matches Class II/III Obesity indicators. Tailoring training routines for optimal metabolic acceleration and postural security is highly suggested.",
    recommendation: "Focus on non-impact metabolic sessions and clean whole food nutrition. Prioritize safety, continuous hydration, and physical recovery.",
    f3Classes: ["Calisthenics Basic Rig", "Vinyasa Flow Rest"]
  }
];

export default function BmiCalculator() {
  const [unitMode, setUnitMode] = useState<"metric" | "imperial">("metric");
  
  // Metric States
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(172);

  // Imperial States
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(8);

  const [bmi, setBmi] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<BmiCategory | null>(null);

  // Auto-calculate BMI on value changes
  useEffect(() => {
    let computedBmi = 0;
    if (unitMode === "metric") {
      if (weightKg > 0 && heightCm > 0) {
        const heightMeters = heightCm / 100;
        computedBmi = weightKg / (heightMeters * heightMeters);
      }
    } else {
      const totalInches = (heightFt * 12) + heightIn;
      if (weightLbs > 0 && totalInches > 0) {
        computedBmi = (weightLbs / (totalInches * totalInches)) * 703;
      }
    }

    if (computedBmi > 0 && computedBmi < 150) {
      const fixedBmi = parseFloat(computedBmi.toFixed(1));
      setBmi(fixedBmi);

      // Find Category
      const matchedCat = BMI_CATEGORIES.find(cat => {
        if (cat.range.startsWith("≥")) {
          return fixedBmi >= 35.0;
        } else if (cat.range.startsWith("<")) {
          return fixedBmi < 18.5;
        } else {
          return fixedBmi >= cat.minVal && fixedBmi <= cat.maxVal;
        }
      });
      setActiveCategory(matchedCat || null);
    } else {
      setBmi(null);
      setActiveCategory(null);
    }
  }, [unitMode, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  // Sync back and forth when unit changes
  const toggleUnit = (mode: "metric" | "imperial") => {
    if (mode === unitMode) return;

    if (mode === "imperial") {
      // Metric to imperial conversion
      const lbs = Math.round(weightKg * 2.20462);
      setWeightLbs(lbs);

      const totalInches = heightCm * 0.393701;
      const ft = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      setHeightFt(ft);
      setHeightIn(inches);
    } else {
      // Imperial to metric conversion
      const totalInches = (heightFt * 12) + heightIn;
      const cm = Math.round(totalInches * 2.54);
      setHeightCm(cm);

      const kg = Math.round(weightLbs / 2.20462);
      setWeightKg(kg);
    }

    setUnitMode(mode);
  };

  const handleReset = () => {
    if (unitMode === "metric") {
      setWeightKg(70);
      setHeightCm(172);
    } else {
      setWeightLbs(154);
      setHeightFt(5);
      setHeightIn(8);
    }
  };

  // Calculate pointer translation percentage on the horizontal chart
  const getPointerPercent = () => {
    if (!bmi) return 50;
    // Bound BMI between 15 and 40 for visualization scale
    const minBmi = 15;
    const maxBmi = 40;
    const pct = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
    return Math.min(Math.max(pct, 2), 98);
  };

  return (
    <section id="bmi" className="py-24 bg-zinc-950 border-t border-gym-border/40 relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-neon-lime/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-lime/10 border border-neon-lime/20">
            <Scale className="w-4 h-4 text-neon-lime" />
            <span className="text-[10px] font-bold tracking-widest text-neon-lime font-mono uppercase">
              Athletic Diagnostic Suite
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight uppercase text-white">
            BMI Calculator <span className="font-sans text-neon-lime italic font-light">&</span> Index Chart
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Instantly measure your structural Body Mass Index using modern standards. Discover your matching physiology profile and receive customized training plans.
          </p>
        </div>

        {/* Dynamic App Layout: Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* LEFT: Live Input Panel (4 columns) */}
          <div className="lg:col-span-4 bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-gym-border/80 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">Select Units</span>
                <div className="bg-zinc-950 p-1 rounded-full border border-zinc-800 flex gap-1">
                  <button
                    onClick={() => toggleUnit("metric")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                      unitMode === "metric" 
                        ? "bg-neon-lime text-gym-black shadow-md" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    METRIC
                  </button>
                  <button
                    onClick={() => toggleUnit("imperial")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                      unitMode === "imperial" 
                        ? "bg-neon-lime text-gym-black shadow-md" 
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    IMPERIAL
                  </button>
                </div>
              </div>

              {unitMode === "metric" ? (
                <div className="space-y-6">
                  {/* Weight Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-400">Weight</label>
                      <span className="text-sm font-bold text-white font-mono">
                        {weightKg} <span className="text-zinc-500 font-normal text-xs">kg</span>
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="35"
                      max="180"
                      step="1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-neon-lime"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-650 font-mono">
                      <span>35 kg</span>
                      <span>110 kg</span>
                      <span>180 kg</span>
                    </div>
                  </div>

                  {/* Height Slider */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-400">Height</label>
                      <span className="text-sm font-bold text-white font-mono">
                        {heightCm} <span className="text-zinc-500 font-normal text-xs">cm</span>
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="120"
                      max="220"
                      step="1"
                      value={heightCm}
                      onChange={(e) => setHeightCm(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-neon-lime"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-650 font-mono">
                      <span>120 cm</span>
                      <span>170 cm</span>
                      <span>220 cm</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Weight Slider (Lbs) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-400">Weight</label>
                      <span className="text-sm font-bold text-white font-mono">
                        {weightLbs} <span className="text-zinc-500 font-normal text-xs">lbs</span>
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="80"
                      max="400"
                      step="1"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-neon-lime"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-650 font-mono">
                      <span>80 lbs</span>
                      <span>240 lbs</span>
                      <span>400 lbs</span>
                    </div>
                  </div>

                  {/* Height Multi-Inputs */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-semibold text-zinc-400 block">Height</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block">Feet</span>
                        <select
                          value={heightFt}
                          onChange={(e) => setHeightFt(parseInt(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-bold text-white focus:border-neon-lime outline-none"
                        >
                          {[4, 5, 6, 7].map(ft => (
                            <option key={ft} value={ft}>{ft} ft</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-500 block">Inches</span>
                        <select
                          value={heightIn}
                          onChange={(e) => setHeightIn(parseInt(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-bold text-white focus:border-neon-lime outline-none"
                        >
                          {Array.from({ length: 12 }, (_, i) => i).map(inch => (
                            <option key={inch} value={inch}>{inch} in</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-zinc-850 mt-8 flex items-center justify-between gap-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Controls
              </button>
              
              <div className="text-[10px] font-mono text-zinc-500">
                Formula: Standard WTM
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Interactive Output & Chart Range (8 columns) */}
          <div className="lg:col-span-8 space-y-8 flex flex-col justify-between">
            
            {/* Upper output panel: Your Score */}
            <div className="bg-zinc-900/40 border border-gym-border/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-lime/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                {/* Score badge circle */}
                <div className="flex items-center gap-5">
                  <div className="w-24 h-24 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center relative shadow-inner">
                    <span className="text-[9px] font-bold text-zinc-500 tracking-wider font-mono absolute top-2 uppercase">Your BMI</span>
                    <span className="text-3xl font-black text-neon-lime font-display mt-2">{bmi || "—"}</span>
                  </div>
                  
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-zinc-500 font-mono block uppercase">Physiology Status</span>
                    <h3 className={`text-2xl font-extrabold uppercase mt-1 ${activeCategory ? activeCategory.color : "text-zinc-300"}`}>
                      {activeCategory ? activeCategory.label : "Enter accurate stats"}
                    </h3>
                    <p className="text-zinc-400 text-xs mt-1.5 max-w-sm font-light">
                      {activeCategory ? activeCategory.description : "Slide controls to instantly populate standard health ranges."}
                    </p>
                  </div>
                </div>

                {/* Micro badge indicator */}
                {activeCategory && (
                  <div className={`px-4 py-2.5 rounded-2xl border ${activeCategory.bgColor} ${activeCategory.borderColor} self-stretch sm:self-auto flex flex-col items-center sm:items-start justify-center`}>
                    <span className="text-[10px] font-mono font-extrabold text-zinc-400">Class Range Match</span>
                    <span className="text-white text-xs font-bold mt-1 uppercase tracking-wide">Standard Profile</span>
                  </div>
                )}

              </div>

              {/* HORIZONTAL FULL BODY CHART (Underweight to Overweight mapping) */}
              <div className="mt-8 pt-4 border-t border-zinc-850/80">
                <div className="flex justify-between items-center text-[10px] font-bold tracking-wider font-mono text-zinc-500 uppercase mb-3">
                  <span>Full Range Weight Chart</span>
                  <span className="text-zinc-450">Scale: 15 – 40+</span>
                </div>

                {/* The Segmented Health Bar container */}
                <div className="relative h-6 rounded-full bg-zinc-950 p-[3px] border border-zinc-800">
                  <div className="w-full h-full rounded-full flex overflow-hidden">
                    <div className="w-[14%] bg-sky-400 h-full relative group">
                      <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Border dividers */}
                    <div className="w-[26%] bg-neon-lime h-full relative group">
                      <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="w-[20%] bg-amber-400 h-full relative group">
                      <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="w-[20%] bg-orange-500 h-full relative group">
                      <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="w-[20%] bg-rose-500 h-full relative group">
                      <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Dynamic Pointer Marker representing BMI */}
                  {bmi && (
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-white border-2 border-zinc-950 shadow-2xl rounded-md transition-all duration-300 flex items-center justify-center cursor-pointer"
                      style={{ left: `calc(${getPointerPercent()}% - 8px)` }}
                    >
                      <div className="w-0.5 h-4 bg-zinc-950" />
                    </div>
                  )}
                </div>

                {/* Sub-label indicators */}
                <div className="grid grid-cols-5 text-[9px] font-mono font-bold tracking-tight text-zinc-500 mt-2.5 text-center">
                  <div className="text-sky-400 text-left pl-1">Under &lt;18.5</div>
                  <div className="text-neon-lime">Normal 18.5–25</div>
                  <div className="text-amber-400">Over 25–30</div>
                  <div className="text-orange-500">Obese 30–35</div>
                  <div className="text-rose-500 text-right pr-1">Severe &ge;35</div>
                </div>
              </div>

            </div>

            {/* Custom tailored recomendations block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Daily Plan Adjustments */}
              <div className="bg-zinc-900/60 border border-gym-border/80 rounded-3xl p-6 relative">
                <span className="text-[10px] font-bold text-neon-lime tracking-widest font-mono block uppercase">F3 Nutrition Focus</span>
                <h4 className="text-white text-base font-extrabold mt-1">Suggested Fuel Profile</h4>
                <p className="text-zinc-400 text-xs mt-2.5 leading-relaxed font-light">
                  {activeCategory 
                    ? activeCategory.recommendation 
                    : "Configure variables on the left panel. Nutrition suggestions adjust to promote optimal core muscle preservation."}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-neon-lime">
                  <span>Structured metabolic focus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2: Guided Training Classes */}
              <div className="bg-zinc-900/60 border border-gym-border/80 rounded-3xl p-6 relative">
                <span className="text-[10px] font-bold text-neon-lime tracking-widest font-mono block uppercase">Class Target Match</span>
                <h4 className="text-white text-base font-extrabold mt-1">Recommended Sessions</h4>
                
                {activeCategory ? (
                  <div className="mt-3.5 space-y-2.5">
                    {activeCategory.f3Classes.map((cls, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800">
                        <Activity className="w-3.5 h-3.5 text-neon-lime shrink-0" />
                        <span className="text-xs text-white font-bold">{cls}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-xs mt-2.5 leading-relaxed font-light">
                    Adjust high-precision weight coordinates to instantly match active fitness programs.
                  </p>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
