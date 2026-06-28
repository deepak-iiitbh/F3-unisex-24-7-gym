import React from "react";
import ClassScheduler from "../components/ClassScheduler";
import { GymClass, UserBooking } from "../types";

interface ScheduleProps {
  gymClasses: GymClass[];
  userBookings: UserBooking[];
  onBookClass: (cls: GymClass) => void;
  onCancelBooking: (bookingId: string) => void;
  memberStatus: "Active" | "Pending" | "None";
}

export default function Schedule({
  gymClasses,
  userBookings,
  onBookClass,
  onCancelBooking,
  memberStatus
}: ScheduleProps) {
  return (
    <div className="schedule-page-container pt-4 pb-12">
      <ClassScheduler 
        gymClasses={gymClasses}
        userBookings={userBookings}
        onBookClass={onBookClass}
        onCancelBooking={onCancelBooking}
        memberStatus={memberStatus}
      />
    </div>
  );
}
