import React from "react";
import MembershipForm from "../components/MembershipForm";
import { MEMBERSHIP_PLANS } from "../data";
import { UserProfile } from "../types";

interface MembershipProps {
  userProfile: UserProfile;
  onSignupSubmit: (name: string, email: string, planId: string) => void;
  onResetMembership: () => void;
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
}

export default function Membership({
  userProfile,
  onSignupSubmit,
  onResetMembership,
  showNotification
}: MembershipProps) {
  return (
    <div className="membership-page-container pt-4 pb-12">
      <MembershipForm
        plans={MEMBERSHIP_PLANS}
        userProfile={userProfile}
        onSignupSubmit={onSignupSubmit}
        onResetMembership={onResetMembership}
        showNotification={showNotification}
      />
    </div>
  );
}
