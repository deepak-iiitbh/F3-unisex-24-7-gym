import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dumbbell, Menu, X, User } from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";

interface HeaderProps {
  memberStatus: "Active" | "Pending" | "None" | string;
  memberName: string;
  user: FirebaseUser | null;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
}

export default function Header({
  memberStatus,
  memberName,
  user,
  onSignInWithGoogle,
  onSignOut,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", id: "home", label: "Home" },
    { path: "/why-us", id: "features", label: "Why Us" },
    { path: "/schedule", id: "schedule", label: "Class Schedule" },
    { path: "/trainers", id: "trainers", label: "Trainer Profiles" },
    { path: "/bmi-calculator", id: "bmi", label: "BMI Calculator" },
    { path: "/membership", id: "membership", label: "Membership" },
  ];

  const currentPath = location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-gym-black/95 backdrop-blur-md border-b border-gym-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo linked to main page */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="bg-neon-lime text-gym-black p-2 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(184,255,34,0.3)]">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="logo-text text-2xl font-black tracking-tight text-white uppercase">
              F3 Unisex <span className="text-neon-lime">24/7 Gym</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium tracking-wide transition-all duration-200 hover:text-neon-lime relative py-2 ${
                    isActive 
                      ? "text-neon-lime font-semibold" 
                      : "text-zinc-400"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neon-lime rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-zinc-900 border border-gym-border/80 text-sm text-zinc-200 hover:text-neon-lime transition-all"
                >
                  <div className="relative flex items-center justify-center">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="avatar" 
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover border border-neon-lime/30" 
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-neon-lime/20 flex items-center justify-center text-neon-lime text-xs font-bold">
                        {memberName ? memberName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                      </div>
                    )}
                    <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-zinc-900" />
                  </div>
                  <span className="truncate max-w-[100px] text-zinc-300 font-medium">
                    {memberName || user.displayName || "Member"}
                  </span>
                </Link>
                <button 
                  onClick={() => {
                    onSignOut();
                    navigate("/");
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 hover:text-rose-400 hover:border-rose-900/40 transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={onSignInWithGoogle}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-gym-border/80 text-zinc-300 text-sm font-medium hover:text-neon-lime transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>Google Connect</span>
                </button>
                <Link 
                  to="/membership"
                  className="px-6 py-2.5 rounded-full bg-neon-lime text-gym-black text-sm font-bold shadow-[0_0_20px_rgba(184,255,34,0.35)] hover:bg-neon-dim hover:shadow-[0_0_30px_rgba(184,255,34,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gym-black border-b border-gym-border px-4 pt-2 pb-6 space-y-3 transition-all duration-300">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-all ${
                  isActive 
                    ? "bg-zinc-900 text-neon-lime font-semibold" 
                    : "text-zinc-300 hover:bg-zinc-950 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          
          <div className="pt-4 border-t border-gym-border/50">
            {user ? (
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg bg-zinc-900 text-zinc-200 hover:text-neon-lime"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neon-lime text-gym-black font-bold flex items-center justify-center text-sm">
                      {memberName ? memberName.charAt(0).toUpperCase() : "M"}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{memberName || user.displayName || "Member"}</div>
                    <div className="text-xs text-zinc-500">View Passes & Active Sessions</div>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    onSignOut();
                    setMobileMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full py-2.5 text-center bg-zinc-950 border border-zinc-800 text-xs text-rose-400 rounded-xl"
                >
                  Disconnect Account
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onSignInWithGoogle();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-center text-sm font-medium border border-gym-border rounded-xl text-zinc-300 hover:text-white transition-all"
                >
                  Google Connect
                </button>
                <Link
                  to="/membership"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-center text-sm bg-neon-lime text-gym-black font-bold rounded-xl shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
