import React, { useState } from "react";
import { GymClass, UserBooking } from "../types";
import { Search, MapPin, Clock, Calendar, Check, ShieldAlert, Award } from "lucide-react";

interface ClassSchedulerProps {
  gymClasses: GymClass[];
  userBookings: UserBooking[];
  onBookClass: (cls: GymClass) => void;
  onCancelBooking: (bookingId: string) => void;
  memberStatus: "Active" | "Pending" | "None";
}

export default function ClassScheduler({
  gymClasses,
  userBookings,
  onBookClass,
  onCancelBooking,
  memberStatus
}: ClassSchedulerProps) {
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const categories = ["All", "Strength", "HIIT", "Cardio", "Yoga", "Combat"];

  // Filters classes
  const filteredClasses = gymClasses.filter((cls) => {
    const matchesDay = cls.day === selectedDay;
    const matchesCategory = selectedCategory === "All" ? true : cls.category === selectedCategory;
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cls.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cls.room.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDay && matchesCategory && matchesSearch;
  });

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "Beginner": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Intermediate": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Advanced": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getCategoryThemeIcon = (category: string) => {
    switch (category) {
      case "Strength": return "💪";
      case "Cardio": return "⚡";
      case "HIIT": return "🔥";
      case "Yoga": return "🧘";
      default: return "🏋️";
    }
  };

  const isClassBooked = (classId: string) => {
    return userBookings.some((b) => b.classId === classId);
  };

  const handleBookingClick = (cls: GymClass) => {
    if (memberStatus === "None") {
      setBookingSuccessMsg("⚠️ Please register for a membership tier first to book a class spot!");
      setTimeout(() => setBookingSuccessMsg(null), 5000);
      return;
    }

    const alreadyBooked = isClassBooked(cls.id);
    if (alreadyBooked) {
      const bObj = userBookings.find((b) => b.classId === cls.id);
      if (bObj) {
        onCancelBooking(bObj.id);
        setBookingSuccessMsg(`Cancelled booking for ${cls.name}.`);
        setTimeout(() => setBookingSuccessMsg(null), 3000);
      }
    } else {
      if (cls.bookedSlots >= cls.capacity) {
        setBookingSuccessMsg("⚠️ This class is currently full. Try another session!");
        setTimeout(() => setBookingSuccessMsg(null), 4000);
        return;
      }
      onBookClass(cls);
      setBookingSuccessMsg(`🎉 Success! You booked a slot in ${cls.name}!`);
      setTimeout(() => setBookingSuccessMsg(null), 4200);
    }
  };

  return (
    <div id="schedule" className="py-24 bg-gym-black relative">
      {/* Background graphic flare */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-neon-lime/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-neon-lime font-mono uppercase bg-neon-lime/10 px-4 py-1.5 rounded-full border border-neon-lime/20 inline-block mb-4 shadow-[0_0_15px_rgba(184,255,34,0.1)]">
            WEEKLY SCHEDULE
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-white mb-4">
            Train Smarter, <span className="text-neon-lime">Unleash Potential</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
            Find the perfect high-energy workout class tailored for your speed, strength levels, or yoga recovery times. Dynamic booking updates instantly.
          </p>
        </div>

        {/* Global Action Banner Notification */}
        {bookingSuccessMsg && (
          <div className="mb-8 p-4 rounded-xl border border-neon-lime/30 bg-gym-dark/90 text-zinc-100 flex items-center justify-between shadow-[0_4px_25px_rgba(184,255,34,0.15)] max-w-xl mx-auto animate-bounce">
            <span className="text-sm font-medium flex items-center gap-2">
              <Award className="w-5 h-5 text-neon-lime shrink-0" />
              {bookingSuccessMsg}
            </span>
            <button 
              onClick={() => setBookingSuccessMsg(null)}
              className="text-xs text-zinc-500 hover:text-white px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filters Panel */}
        <div className="bg-gym-dark/60 border border-gym-border/80 backdrop-blur rounded-3xl p-6 mb-10 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search classes, trainers, or rigs..."
                className="w-full bg-gym-black border border-gym-border focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/30 text-white rounded-2xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs sm:text-sm px-4 py-2 rounded-xl border cursor-pointer font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-neon-lime text-gym-black border-neon-lime font-bold shadow-[0_0_15px_rgba(184,255,34,0.25)]"
                      : "bg-gym-black/40 text-zinc-400 border-gym-border hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  <span className="mr-1">{getCategoryThemeIcon(cat)}</span>
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Selector Week Days */}
          <div className="mt-8 border-t border-gym-border/60 pt-6">
            <p className="text-zinc-500 text-xs uppercase font-mono font-bold tracking-wider mb-3">Select Training Day</p>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 overflow-x-auto pb-2">
              {daysOfWeek.map((day) => {
                const countClassOnDay = gymClasses.filter((c) => c.day === day).length;
                const isSelected = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl border transition-all cursor-pointer min-w-[70px] ${
                      isSelected
                        ? "bg-zinc-900 border-neon-lime text-white shadow-[0_0_20px_rgba(184,255,34,0.15)]"
                        : "bg-gym-black/20 border-gym-border text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    <span className="text-xs font-semibold">{day.substring(0, 3)}</span>
                    <span className={`text-[10px] mt-1.5 px-1.5 py-0.5 rounded-full font-mono ${
                      isSelected ? "bg-neon-lime text-gym-black font-bold" : "bg-zinc-800/80 text-zinc-500"
                    }`}>
                      {countClassOnDay}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Classes Catalog Grid */}
        {filteredClasses.length === 0 ? (
          <div className="text-center py-20 bg-gym-dark/20 border border-gym-border/50 rounded-3xl">
            <p className="text-zinc-400 text-lg mb-2 font-medium">No training sessions scheduled</p>
            <p className="text-zinc-600 text-sm max-w-md mx-auto">
              There are no {selectedCategory !== "All" ? `${selectedCategory} ` : ""}classes scheduled on {selectedDay} matching "{searchQuery || 'your criteria'}". Try switching the day or search filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => {
              const booked = isClassBooked(cls.id);
              const spotsLeft = cls.capacity - cls.bookedSlots;
              const isFull = spotsLeft <= 0;

              return (
                <div 
                  key={cls.id} 
                  className={`bg-gym-dark border-2 rounded-3xl overflow-hidden transition-all duration-300 relative group flex flex-col justify-between ${
                    booked 
                      ? "border-neon-lime shadow-[0_0_25px_rgba(184,255,34,0.15)]" 
                      : "border-gym-border hover:border-zinc-700 hover:shadow-xl"
                  }`}
                >
                  {/* Decorative diagonal corner stripe tag like in the screenshot! */}
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                    <div className="bg-neon-lime text-[10px] text-gym-black uppercase font-bold tracking-widest text-center py-1 absolute top-2 right-[-24px] rotate-45 w-20 shadow">
                      {cls.category}
                    </div>
                  </div>

                  <div>
                    {/* Header Details */}
                    <div className="p-6 pb-2">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] font-mono tracking-wider font-bold uppercase px-2.5 py-1 rounded-full border ${getIntensityColor(cls.intensity)}`}>
                          {cls.intensity}
                        </span>
                        <span className="text-xs font-mono text-zinc-500 mr-8">
                          {cls.duration}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-display text-white tracking-tight group-hover:text-neon-lime transition-all duration-200">
                        {cls.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        with <span className="text-zinc-300 font-medium">{cls.trainerName}</span>
                      </p>
                    </div>

                    {/* Metadata items list */}
                    <div className="p-6 py-2 border-y border-gym-border/40 my-3 space-y-3 bg-zinc-950/40">
                      <div className="flex items-center text-xs text-zinc-400 gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-neon-lime shrink-0" />
                        <span>{cls.time}</span>
                      </div>
                      <div className="flex items-center text-xs text-zinc-400 gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{cls.room}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Capacity count footer */}
                  <div className="p-6 pt-3 flex items-center justify-between mt-auto">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-base font-bold font-mono ${spotsLeft <= 3 ? "text-rose-400" : "text-white"}`}>
                          {spotsLeft}
                        </span>
                        <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-wider">Spots left</span>
                      </div>
                      <p className="text-[10px] text-zinc-600 font-mono mt-0.5">Max cap: {cls.capacity}</p>
                    </div>

                    <button
                      onClick={() => handleBookingClick(cls)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        booked
                          ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
                          : isFull
                          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                          : "bg-neon-lime text-gym-black shadow-md hover:bg-white hover:scale-105"
                      }`}
                    >
                      {booked ? (
                        <>
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>Cancel Spot</span>
                        </>
                      ) : isFull ? (
                        <span>Class Full</span>
                      ) : (
                        <span>Book Slot</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
