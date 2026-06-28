import React from "react";
import TrainerCard from "../components/TrainerCard";
import { TRAINERS } from "../data";

interface TrainersProps {
  memberStatus: "Active" | "Pending" | "None";
  onBookCoaching: (trainerName: string, date: string, time: string) => void;
}

export default function Trainers({ memberStatus, onBookCoaching }: TrainersProps) {
  return (
    <div className="trainers-page-container pt-4 pb-12">
      <TrainerCard 
        trainers={TRAINERS}
        memberStatus={memberStatus}
        onBookCoaching={onBookCoaching}
      />
    </div>
  );
}
