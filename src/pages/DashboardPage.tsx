import React from "react";
import { useNavigate } from "react-router-dom";
import MemberDashboard from "../components/MemberDashboard";
import { UserProfile } from "../types";

interface DashboardPageProps {
  userProfile: UserProfile;
  onSubmitMockGateEntry: () => void;
  onCancelBooking: (bookingId: string) => void;
  onClearProfile: () => void;
}

export default function DashboardPage({
  userProfile,
  onSubmitMockGateEntry,
  onCancelBooking,
  onClearProfile
}: DashboardPageProps) {
  const navigate = useNavigate();

  // Redirect to membership billing if access is requested without active subscription
  if (userProfile.membershipStatus !== "Active") {
    return (
      <div className="py-24 bg-gym-black min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md bg-zinc-900 border border-gym-border p-8 rounded-3xl space-y-6">
          <span className="text-4xl">🔒</span>
          <h2 className="text-2xl font-bold font-display text-white">Access Denied</h2>
          <p className="text-zinc-400 text-sm">
            Only members with an <strong>Active Pass</strong> can view dynamic biometric schedules, entry cards, and personal gym training rosters.
          </p>
          <button
            onClick={() => navigate("/membership")}
            className="w-full py-3 bg-neon-lime text-gym-black font-bold text-sm rounded-xl shadow-lg hover:bg-neon-dim transition-all cursor-pointer"
          >
            Choose Membership Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <MemberDashboard
      userProfile={userProfile}
      onSubmitMockGateEntry={onSubmitMockGateEntry}
      onCancelBooking={onCancelBooking}
      onClearProfile={onClearProfile}
      onNavClick={(sect) => {
        if (sect === "schedule") {
          navigate("/schedule");
        } else {
          navigate("/");
        }
      }}
    />
  );
}
