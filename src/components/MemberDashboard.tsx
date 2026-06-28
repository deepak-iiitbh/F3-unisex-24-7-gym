import React, { useState } from "react";
import { UserProfile, GymClass, Trainer } from "../types";
import { Calendar, Clock, User, LogOut, CheckCircle2, ShieldCheck, MapPin, Zap, Info, Receipt, Download, CreditCard } from "lucide-react";

interface MemberDashboardProps {
  userProfile: UserProfile;
  onSubmitMockGateEntry: () => void;
  onCancelBooking: (bookingId: string) => void;
  onClearProfile: () => void;
  onNavClick: (sect: string) => void;
}

export default function MemberDashboard({
  userProfile,
  onSubmitMockGateEntry,
  onCancelBooking,
  onClearProfile,
  onNavClick
}: MemberDashboardProps) {
  const [gateScanMsg, setGateScanMsg] = useState<string | null>(null);

  const handleGateScan = () => {
    onSubmitMockGateEntry();
    setGateScanMsg("🟢 Gate Authorized! Welcome to F3 GYM. Enjoy your workout!");
    setTimeout(() => setGateScanMsg(null), 4000);
  };

  return (
    <div className="py-12 bg-gym-black min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gym-border/60 pb-8 mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-neon-lime">
              <ShieldCheck className="w-4 h-4" />
              <span>LOGGED IN MEMBER PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Member <span className="text-neon-lime">Dashboard</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Welcome back, <strong className="text-zinc-200">{userProfile.name}</strong>. Manage active passes and daily workouts securely.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onNavClick("home")}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-gym-border/80 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
            >
              Back to Home
            </button>
            <button
              onClick={onClearProfile}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-950/40 text-rose-300 border border-rose-900/30 hover:bg-rose-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Slots & Stats Block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-gym-dark/50 border border-gym-border rounded-2xl p-6 flex flex-col justify-between">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">ACTIVE TIER</span>
            <div className="my-3">
              <span className="text-2xl font-black font-display text-neon-lime uppercase tracking-wide block">
                {userProfile.membershipPlanId === "plan-1-month" && "1 Month Pass"}
                {userProfile.membershipPlanId === "plan-3-months" && "3 Months Pass"}
                {userProfile.membershipPlanId === "plan-6-months" && "6 Months Pass"}
                {userProfile.membershipPlanId === "plan-yearly" && "Yearly Pass"}
                {!userProfile.membershipPlanId && "Guest Account"}
              </span>
              <span className="text-xs text-zinc-400">Monthly renewal: Active</span>
            </div>
            <button
              onClick={() => onNavClick("membership")}
              className="text-xs text-zinc-400 hover:text-white underline text-left mt-2"
            >
              Modify Plan benefits
            </button>
          </div>

          <div className="bg-gym-dark/50 border border-gym-border rounded-2xl p-6 flex flex-col justify-between">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">SESSIONS SECURED</span>
            <div className="my-3">
              <span className="text-4xl font-extrabold font-display text-white">
                {userProfile.bookings.length}
              </span>
              <span className="text-xs text-zinc-400 block mt-1">Gym classes booked this week</span>
            </div>
            <button
              onClick={() => onNavClick("schedule")}
              className="text-xs text-neon-lime hover:underline text-left font-bold"
            >
              Schedule new class &rarr;
            </button>
          </div>

          <div className="bg-gym-dark/50 border border-gym-border rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-neon-lime/[0.02] pointer-events-none" />
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">ENTRY CARD GATEWAY</span>
            <div className="my-3">
              <button
                onClick={handleGateScan}
                className="w-full py-2.5 bg-neon-lime text-gym-black font-bold text-xs rounded-xl shadow-md hover:bg-neon-dim transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Gate Entry</span>
              </button>
              <p className="text-[9px] text-zinc-500 text-center mt-2 font-mono">Present card at gateway counter</p>
            </div>
          </div>

        </div>

        {gateScanMsg && (
          <div className="mb-8 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-medium text-xs sm:text-sm animate-bounce flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            {gateScanMsg}
          </div>
        )}

        {/* Bookings Section */}
        <div className="bg-gym-dark/70 border border-gym-border/80 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-gym-border/50 pb-5 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Your Scheduled Workouts</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Below are your upcoming classes and private training appointments.</p>
            </div>
            <span className="text-[10px] bg-zinc-900 border border-gym-border px-3 py-1 rounded-full text-zinc-400 font-mono">
              TOTAL: {userProfile.bookings.length}
            </span>
          </div>

          {userProfile.bookings.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-450 text-sm mb-4">You don't have any training sessions scheduled yet.</p>
              <button
                onClick={() => onNavClick("schedule")}
                className="px-5 py-2.5 bg-neon-lime text-gym-black font-bold rounded-xl text-xs hover:bg-neon-dim transition-all cursor-pointer"
              >
                View Live Schedule Table
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userProfile.bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="p-5 rounded-2xl bg-gym-black border border-gym-border/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-zinc-700 transition-all"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase bg-neon-lime/10 border border-neon-lime/20 font-bold tracking-wider text-neon-lime px-2 py-0.5 rounded-md">
                      RESERVED SPOT
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-display text-white tracking-wide mt-1">
                      {booking.className}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        {booking.time} ({booking.day})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        Coach: {booking.trainerName}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onCancelBooking(booking.id)}
                    className="self-start sm:self-center px-4 py-2 text-xs font-bold border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/10 transition-all cursor-pointer"
                  >
                    Cancel Spot
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Informational Tip */}
          <div className="mt-8 p-4 rounded-2xl bg-zinc-950/80 border border-gym-border/40 flex gap-3">
            <Info className="w-5 h-5 text-neon-lime shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-zinc-300 block">Attendance Guarantee</span>
              <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">
                Class cancellations are required at least 2 hours prior to the session start. Unused class counts may count towards threshold metrics. For assistance, contact our helpdesk at 1-800-F3-GYM.
              </p>
            </div>
          </div>

        </div>

        {/* Real Invoices & Receipts History section */}
        <div className="mt-8 bg-gym-dark/70 border border-gym-border/80 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-gym-border/50 pb-5 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Payment Invoices & Receipts</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Your official cryptographically secured funds transit ledger.</p>
            </div>
            <span className="text-[10px] bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 font-mono font-bold uppercase tracking-wider">
              Ledger Synchronized
            </span>
          </div>

          {!userProfile.payments || userProfile.payments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-zinc-500 text-sm mb-2">No official invoice receipts have been registered for your account yet.</p>
              <button
                onClick={() => onNavClick("membership")}
                className="text-xs font-bold text-neon-lime hover:underline"
              >
                Go configure and purchase a subscription pass &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userProfile.payments.map((payment) => (
                <div 
                  key={payment.id} 
                  className="p-5 rounded-2xl bg-gym-black border border-gym-border/80 flex flex-col md:flex-row md:items-center md:justify-between gap-5 hover:border-zinc-700 transition-all font-mono text-xs text-zinc-400"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold px-2 py-0.5 rounded-md">
                        PAID RECEIPT
                      </span>
                      <span className="font-sans text-white text-base font-bold">
                        {payment.planName}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
                      <div>
                        <span className="text-zinc-505 block font-sans text-[9px] uppercase tracking-wider">TRANSACTION REF</span>
                        <span className="text-zinc-300 font-semibold">{payment.txnRef}</span>
                      </div>
                      <div>
                        <span className="text-zinc-550 block font-sans text-[9px] uppercase tracking-wider">GATEWAY DATE</span>
                        <span className="text-zinc-300 font-semibold">{payment.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-gym-border/40 pt-3 md:pt-0 shrink-0">
                    <div>
                      <span className="text-zinc-500 text-[10px] block font-sans text-right">Paid amount</span>
                      <span className="text-neon-lime text-lg font-extrabold font-display leading-none block text-right mt-0.5">
                        {payment.price}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-sans block text-right">{payment.method}</span>
                    </div>

                    <button
                      onClick={() => alert(`Download Invoice Receipt Details:\n\nReference: ${payment.txnRef}\nPlan Name: ${payment.planName}\nAmount Paid: ${payment.price}\nMethod: ${payment.method}\nStatus: ${payment.status}\nCleared Date: ${payment.timestamp}\n\nInvoice is dynamically generated is signed offline.`)}
                      className="p-3 bg-zinc-900 border border-gym-border hover:border-neon-lime text-zinc-300 hover:text-white rounded-xl transition-all cursor-pointer"
                      title="Download Invoice PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
