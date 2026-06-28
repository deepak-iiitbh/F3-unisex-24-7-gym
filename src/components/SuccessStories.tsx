import React, { useState } from "react";
import { Testimonial } from "../types";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface SuccessStoriesProps {
  testimonials: Testimonial[];
}

export default function SuccessStories({ testimonials }: SuccessStoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = testimonials[currentIndex];

  return (
    <div className="py-24 bg-gym-black relative overflow-hidden border-t border-gym-border/40">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-neon-lime/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-neon-lime font-mono uppercase bg-neon-lime/10 px-4 py-1.5 rounded-full border border-neon-lime/20 inline-block mb-3">
            ATHLETE OUTCOMES
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-white mb-4">
            Your Success Stories, <span className="text-neon-lime">Our Inspiration</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm">
            See how our global active community members have shattered thresholds, reshuffled their daily routines, and unlocked life-changing physical strength.
          </p>
        </div>

        {/* Carousel Grid layout exactly matching Screen5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Grayscale Fitness athlete model with Speech Bubble overlay */}
          <div className="lg:col-span-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-gym-black via-transparent to-transparent z-15" />
            <div className="rounded-3xl overflow-hidden border border-gym-border/80 bg-zinc-950 aspect-[4/5] relative">
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80" 
                alt="Gym Success Model"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-75 contrast-110 saturate-[0.1] group-hover:scale-105 transition-all duration-700"
              />

              {/* Floating speech bubble feedback directly overlayed like Screen5 */}
              <div className="absolute bottom-6 left-6 right-6 z-20 bg-gym-dark/95 border border-gym-border/90 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
                <Quote className="w-8 h-8 text-neon-lime/30 absolute top-4 right-4" />
                
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4 pr-6">
                  "{activeTestimonial.quote}"
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold font-display text-white text-sm">{activeTestimonial.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{activeTestimonial.role} - {activeTestimonial.location}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: activeTestimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-neon-lime text-neon-lime" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Navigation carousel cards & references */}
          <div className="lg:col-span-6 space-y-8">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">CAROUSEL CONTROLS</span>
                <h3 className="text-xl font-bold font-display text-white mt-1">Review More Athlete Diaries</h3>
              </div>
              
              {/* Carousel arrows */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full border border-gym-border bg-gym-dark/60 text-zinc-300 hover:text-white hover:border-zinc-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border border-gym-border bg-gym-dark/60 text-zinc-300 hover:text-white hover:border-zinc-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Inactive Previews / Profiles aligned as beautiful items */}
            <div className="space-y-4">
              {testimonials.map((test, index) => {
                const isActive = index === currentIndex;
                return (
                  <div
                    key={test.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                      isActive
                        ? "bg-gym-dark border-neon-lime shadow-[0_0_15px_rgba(184,255,34,0.1)]"
                        : "bg-gym-dark/20 border-gym-border/40 hover:border-zinc-800"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gym-border">
                      <img 
                        src={test.avatarUrl} 
                        alt={test.name}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover filter ${isActive ? "saturate-50" : "saturate-0"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${isActive ? "text-neon-lime" : "text-zinc-200"}`}>
                          {test.name}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-mono">{test.location}</span>
                      </div>
                      <p className="text-xs text-zinc-450 truncate mt-1">
                        "{test.quote}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
