import { Trainer, GymClass, MembershipPlan, Testimonial } from "./types";

export const PARTNERS = [
  { name: "Under Armour", logo: "UA" },
  { name: "Reebok", logo: "Reebok" },
  { name: "Adidas", logo: "adidas" },
  { name: "Puma", logo: "PUMA" },
  { name: "The North Face", logo: "TNF" },
  { name: "Nike", logo: "NIKE" }
];

export const TRAINERS: Trainer[] = [
  {
    id: "trainer-1",
    name: "Anmol",
    role: "Head Coach & Founder",
    specialty: ["Bodybuilding & Strength", "Tire & Functional Training", "Elite Fat Loss Programs"],
    bio: "Hard work, pure dedication, and consistency. No excuses, only results. I believe in sculpting strength not just in muscles, but in raw mindset.",
    rating: 5,
    imageUrl: "/anmol.jpg" ,
    instagram: "@anmol_fitness_official",
    experience: "12 Years",
    certifications: ["Certified Functional Strength Coach (CFSC)", "Elite Bodybuilding Nutrition Specialist", "VIP Master Personal Trainer"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  }
];

export const GYM_CLASSES: GymClass[] = [
  {
    id: "class-1",
    name: "Barbell Basics",
    category: "Strength",
    trainerId: "trainer-1",
    trainerName: "Anmol",
    day: "Monday",
    time: "07:00 AM - 08:00 AM",
    duration: "60 Mins",
    room: "Olympic Platform A",
    intensity: "Beginner",
    capacity: 15,
    bookedSlots: 9
  },
  {
    id: "class-2",
    name: "Kettlebell Masterclass",
    category: "HIIT",
    trainerId: "trainer-1",
    trainerName: "Anmol",
    day: "Monday",
    time: "09:30 AM - 10:30 AM",
    duration: "60 Mins",
    room: "Conditioning Lab B",
    intensity: "Intermediate",
    capacity: 20,
    bookedSlots: 14
  },
  {
    id: "class-3",
    name: "Cardio Power Boost",
    category: "Cardio",
    trainerId: "trainer-1",
    trainerName: "Anmol",
    day: "Tuesday",
    time: "08:00 AM - 09:00 AM",
    duration: "60 Mins",
    room: "Sprint Arena C",
    intensity: "Advanced",
    capacity: 25,
    bookedSlots: 18
  },
  {
    id: "class-zumba-1",
    name: "Zumba Premium Session",
    category: "Cardio",
    trainerId: "trainer-1",
    trainerName: "Anmol",
    day: "Tuesday",
    time: "06:30 PM - 07:30 PM",
    duration: "60 Mins",
    room: "Dance Studio FX",
    intensity: "Beginner",
    capacity: 30,
    bookedSlots: 12
  },
  {
    id: "class-4",
    name: "Hypertrophy Program",
    category: "Strength",
    trainerId: "trainer-1",
    trainerName: "Anmol",
    day: "Wednesday",
    time: "06:00 PM - 07:15 PM",
    duration: "75 Mins",
    room: "Olympic Platform A",
    intensity: "Advanced",
    capacity: 12,
    bookedSlots: 10
  },
  {
    id: "class-5",
    name: "TRX Suspension Dynamics",
    category: "Combat",
    trainerId: "trainer-1",
    trainerName: "Anmol",
    day: "Thursday",
    time: "10:00 AM - 11:00 AM",
    duration: "60 Mins",
    room: "Conditioning Lab B",
    intensity: "Intermediate",
    capacity: 15,
    bookedSlots: 8
  },
  {
    id: "class-zumba-2",
    name: "Zumba Rhythm Blast",
    category: "Cardio",
    trainerId: "trainer-1",
    trainerName: "Anmol",
    day: "Thursday",
    time: "07:30 PM - 08:30 PM",
    duration: "60 Mins",
    room: "Dance Studio FX",
    intensity: "Intermediate",
    capacity: 30,
    bookedSlots: 15
  },
  {
    id: "class-6",
    name: "Zen Endurance Yoga",
    category: "Yoga",
    trainerId: "trainer-1",
    trainerName: "Anmol",
    day: "Friday",
    time: "08:00 AM - 09:15 AM",
    duration: "75 Mins",
    room: "Mind-Body Sanctuary",
    intensity: "Beginner",
    capacity: 22,
    bookedSlots: 18
  },
  {
    id: "class-7",
    name: "Rope Climbing Elite",
    category: "HIIT",
    trainerId: "trainer-1",
    trainerName: "Anmol",
    day: "Saturday",
    time: "09:00 AM - 10:00 AM",
    duration: "60 Mins",
    room: "Main Rig Stage",
    intensity: "Advanced",
    capacity: 10,
    bookedSlots: 7
  },
  {
    id: "class-8",
    name: "Core Fusion Flow",
    category: "Yoga",
    trainerId: "trainer-1",
    trainerName: "Anmol",
    day: "Sunday",
    time: "10:30 AM - 11:30 AM",
    duration: "60 Mins",
    room: "Mind-Body Sanctuary",
    intensity: "Intermediate",
    capacity: 20,
    bookedSlots: 12
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "plan-1-month",
    name: "1 Month Pass",
    price: "₹1,000",
    period: "Month",
    features: []
  },
  {
    id: "plan-3-months",
    name: "3 Months Pass",
    price: "₹2,500",
    period: "3 Months",
    isPopular: true,
    badge: "Best Selling",
    features: []
  },
  {
    id: "plan-6-months",
    name: "6 Months Pass",
    price: "₹4,500",
    period: "6 Months",
    features: []
  },
  {
    id: "plan-yearly",
    name: "Yearly Pass",
    price: "₹7,500",
    period: "1 Year",
    features: []
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Amit Sharma",
    role: "Strength Coach & Tech Lead",
    location: "Delhi, India",
    quote: "F3 Unisex 24/7 Gym mein training karne ka ek alag hi maza hai! Barbell platform ho ya conditioning area, yahan sab top class hai. Schedule systems bhi ekdum seamless chalte hain.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5
  },
  {
    id: "t-2",
    name: "Priya Patel",
    role: "Fitness & Wellness Blogger",
    location: "Mumbai, India",
    quote: "Maine bohot saare gyms try kiye par yahan ka vibe aur discipline bilkul uniquely different hai. Zumba class join karke fat loss karna aur cardio strength badhana ab bohot easy ho gaya hai!",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5
  },
  {
    id: "t-3",
    name: "Rahul Verma",
    role: "Powerlifter & Advocate",
    location: "Chandigarh, India",
    quote: "Bhai, kettlebell masterclass aur expert trainers ke under custom workout rigs experience karke maza hi aa gaya. Physical transform achieve karne ke liye isse badhiya platform koi nahi hai.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5
  }
];
