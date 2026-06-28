export interface GymClass {
  id: string;
  name: string;
  category: "Strength" | "Cardio" | "HIIT" | "Yoga" | "Combat";
  trainerId: string;
  trainerName: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  time: string; // e.g., "08:00 AM - 09:00 AM"
  duration: string; // e.g., "60 Mins"
  room: string;
  intensity: "Beginner" | "Intermediate" | "Advanced";
  capacity: number;
  bookedSlots: number;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialty: string[];
  bio: string;
  rating: number;
  imageUrl: string;
  instagram: string;
  experience: string; // e.g. "8+ Years"
  certifications: string[];
  availability: string[]; // days
  
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  originalPrice?: string;
  badge?: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  avatarUrl: string;
  rating: number;
}

export interface UserBooking {
  id: string;
  classId: string;
  className: string;
  time: string;
  day: string;
  trainerName: string;
  bookedAt: string;
}

export interface UserPayment {
  id: string;
  planId: string;
  planName: string;
  price: string;
  method: string;
  status: "PAID" | "PENDING" | "FAILED";
  timestamp: string;
  txnRef: string;
}

export interface UserProfile {
  name: string;
  email: string;
  membershipPlanId?: string;
  membershipStatus?: "Active" | "Pending" | "None";
  memberSince?: string;
  qrCodeValue?: string;
  bookings: UserBooking[];
  payments?: UserPayment[];
}
