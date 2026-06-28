import React, { useState } from "react";
import { Trainer, UserBooking } from "../types";
import {
  Star,
  Instagram,
  BookOpen,
  Clock,
  Calendar,
  Check,
  Award,
  X,
  Sparkles,
} from "lucide-react";

interface TrainerCardProps {
  trainers: Trainer[];
  memberStatus: "Active" | "Pending" | "None";
  onBookCoaching: (trainerName: string, date: string, time: string) => void;
}

export default function TrainerCard({
  trainers,
  memberStatus,
  onBookCoaching,
}: TrainerCardProps) {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");
  const [coachingAlert, setCoachingAlert] = useState<string | null>(null);

  const timeslots = [
    "08:00 AM",
    "10:00 AM",
    "01:00 PM",
    "03:00 PM",
    "05:30 PM",
  ];

  const handleOpenBooking = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    // Auto-select first available day
    if (trainer.availability.length > 0) {
      setSelectedDate(trainer.availability[0]);
    }
    setCoachingAlert(null);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;

    if (memberStatus === "None") {
      setCoachingAlert(
        "⚠️ You must register for a membership plan first to request 1-on-1 coaching!",
      );
      return;
    }

    if (!selectedDate) {
      setCoachingAlert("⚠️ Please choose a valid coaching date.");
      return;
    }

    onBookCoaching(selectedTrainer.name, selectedDate, selectedTime);
    setCoachingAlert(
      `🎉 Success! 1-on-1 scheduled with ${selectedTrainer.name} on ${selectedDate} at ${selectedTime}! Check your Member Dashboard for info.`,
    );

    setTimeout(() => {
      setSelectedTrainer(null);
      setCoachingAlert(null);
    }, 3800);
  };

  return (
    <div id="trainers" className="py-24 bg-gym-black relative">
      {/* Background decoration elements */}
      <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-neon-lime/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-neon-lime font-mono uppercase bg-neon-lime/10 px-4 py-1.5 rounded-full border border-neon-lime/20 inline-block mb-4 shadow-[0_0_15px_rgba(184,255,34,0.1)]">
            ELITE COACHING TEAM
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-white mb-4">
            Inspired to Inspire{" "}
            <span className="text-neon-lime">Your Best Self</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
            Meet our certified world-class coaches. They've trained champions,
            written best-selling nutrition models, and are ready to guide you to
            your goals.
          </p>
        </div>

        {/* Centered Solo Trainer Core Showcase */}
        <div className="max-w-2xl mx-auto">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-zinc-950/80 border-2 border-neon-lime/30 rounded-3xl overflow-hidden group hover:border-neon-lime/60 transition-all duration-300 flex flex-col justify-between shadow-[0_0_50px_rgba(184,255,34,0.05)]"
            >
              <div>
                {/* Image Profile with dynamic overlay */}
                <div className="relative h-[480px] w-full overflow-hidden bg-zinc-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
                  <img
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-[center_10%] filter brightness-90 contrast-105 hover:scale-[1.02] transition-all duration-700"
                  />
                  {/* Elite Founder Badge */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-gym-black/85 backdrop-blur-md border border-neon-lime/40 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-neon-lime shadow-md">
                    <Sparkles className="w-4 h-4 text-neon-lime" />
                    <span>FOUNDER & HEAD TRAINER</span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-gym-black/85 backdrop-blur-md border border-gym-border/60 px-3 py-1.5 rounded-xl text-xs font-semibold text-white">
                    <Star className="w-3.5 h-3.5 fill-neon-lime text-neon-lime" />
                    <span>5.0 Rating</span>
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <span className="text-[10px] bg-neon-lime text-gym-black font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      CHAMPION CALIBER
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white mt-1">
                      {trainer.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5 uppercase tracking-wide">
                      {trainer.role} &bull; 12+ Years Experience
                    </p>
                  </div>
                </div>

                {/* Motivational Quote line right under the image */}
                <div className="px-6 py-5 bg-gradient-to-r from-zinc-950 to-zinc-900 border-b border-gym-border/50 text-center">
                  <p className="font-mono text-xs sm:text-sm text-neon-lime tracking-normal font-black uppercase leading-relaxed text-shadow animate-pulse">
                    "BE THE BEAST. EMBRACE THE GRIND, CONQUER YOUR WEAKNESS &
                    RULE YOUR ZONE!"
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1 text-center font-bold">
                    - COACH ANMOL SHARMA
                  </p>
                </div>

                {/* Info Area */}
                <div className="p-8 space-y-6">
                  <p className="text-zinc-300 text-sm leading-relaxed text-center font-sans">
                    {trainer.bio}
                  </p>

                  {/* Highlighted Phone Inquiry contact container */}
                  <div className="p-5 bg-gym-black border border-gym-border rounded-2xl flex flex-col items-center justify-center text-center shadow-inner relative group/phone">
                    <div className="absolute inset-0 bg-neon-lime/[0.02] pointer-events-none rounded-2xl" />
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                      FOR VIP DIRECT TRAINING / ADMISSION INQUIRIES
                    </span>
                    <a
                      href="tel:8077237136"
                      className="text-2xl sm:text-3xl font-black text-neon-lime font-mono tracking-tight hover:scale-105 active:scale-95 transition-all mt-1.5 flex items-center gap-2 filter drop-shadow-[0_0_15px_rgba(184,255,34,0.15)]"
                    >
                      📞 8077237136
                    </a>
                    <span className="text-[10px] font-mono text-zinc-400 mt-1 uppercase">
                      Click to Call Now &bull; Open 24/7 Support
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Specialty tags */}
                    <div className="bg-gym-black/40 border border-gym-border/60 p-4 rounded-xl">
                      <span className="text-zinc-500 text-[9px] uppercase font-mono font-bold tracking-wider block mb-2.5">
                        CORE SPECIALITIES
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {trainer.specialty.map((spec, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold bg-zinc-900 border border-gym-border/80 text-zinc-300 px-2.5 py-1 rounded-lg font-mono"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certifications Bullet list */}
                    <div className="bg-gym-black/40 border border-gym-border/60 p-4 rounded-xl">
                      <span className="text-zinc-500 text-[9px] uppercase font-mono font-bold tracking-wider block mb-2.5">
                        CERTIFICATIONS
                      </span>
                      <ul className="space-y-1.5">
                        {trainer.certifications.slice(0, 2).map((cert, i) => (
                          <li
                            key={i}
                            className="text-xs text-zinc-400 flex items-start gap-2"
                          >
                            <Award className="w-3.5 h-3.5 text-neon-lime mt-0.5 shrink-0" />
                            <span className="truncate font-sans">{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaction footer */}
              <div className="p-8 pt-0 mt-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gym-border/40">
                  <span className="text-xs font-mono text-zinc-500">
                    Direct Booking Available:{" "}
                    <strong className="text-zinc-300">Mon - Sun</strong>
                  </span>

                  <button
                    onClick={() => handleOpenBooking(trainer)}
                    className="w-full sm:w-auto px-6 py-3 bg-neon-lime text-gym-black text-xs font-black uppercase tracking-wider rounded-xl hover:bg-neon-dim transition-all duration-300 cursor-pointer shadow-lg shadow-neon-lime/10 flex items-center justify-center gap-1.5"
                  >
                    🚀 Book Direct 1-on-1 Session
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 1-on-1 Coaching Request Modal overlay */}
        {selectedTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gym-black/85 backdrop-blur-sm animate-fadeIn">
            <div className="bg-gym-dark/95 border-2 border-gym-border rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl">
              <button
                onClick={() => setSelectedTrainer(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-900 border border-gym-border shrink-0">
                  <img
                    src={selectedTrainer.imageUrl}
                    alt={selectedTrainer.name}
                    className="w-full h-full object-cover filter saturate-[0.2]"
                  />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Book 1-on-1 Session
                  </h3>
                  <p className="text-xs text-neon-lime uppercase font-mono font-bold">
                    Trainer: {selectedTrainer.name}
                  </p>
                </div>
              </div>

              {coachingAlert && (
                <div
                  className={`mb-6 p-4 rounded-xl text-xs sm:text-sm font-medium border ${
                    coachingAlert.includes("Success")
                      ? "bg-neon-lime/10 border-neon-lime/20 text-neon-lime"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-300"
                  }`}
                >
                  {coachingAlert}
                </div>
              )}

              <form onSubmit={handleBookSubmit}>
                <div className="space-y-4 mb-8">
                  {/* Select Day */}
                  <div>
                    <label className="block text-zinc-400 text-xs font-medium uppercase font-mono mb-2">
                      Select Available Day
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTrainer.availability.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDate(day)}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer text-center transition-all ${
                            selectedDate === day
                              ? "bg-neon-lime text-gym-black border-neon-lime font-bold shadow-md"
                              : "bg-gym-black border-gym-border text-zinc-300 hover:border-zinc-700"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Time */}
                  <div>
                    <label className="block text-zinc-400 text-xs font-medium uppercase font-mono mb-2">
                      Available Private Slots
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeslots.map((time) => (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-1 rounded-xl border text-xs font-mono cursor-pointer text-center transition-all ${
                            selectedTime === time
                              ? "border-neon-lime text-neon-lime bg-neon-lime/5 font-bold"
                              : "bg-gym-black border-gym-border text-zinc-400 hover:border-zinc-800"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer / Notes */}
                  <div className="p-3 bg-gym-black rounded-xl border border-gym-border/60">
                    <p className="text-[10px] text-zinc-500 leading-relaxed flex items-start gap-1.5">
                      <Sparkles className="w-3 h-3 text-neon-lime shrink-0 mt-0.5" />
                      <span>
                        Coaching slots represent direct 45-minute premium
                        assessments. Fully customizable based on your targeted
                        fitness programs. Minimum cancel notice is 12 hours.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTrainer(null)}
                    className="flex-1 py-3 border border-gym-border rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-neon-lime text-gym-black rounded-xl text-xs font-bold shadow-lg hover:bg-neon-dim transition-all cursor-pointer"
                  >
                    Confirm Private Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
