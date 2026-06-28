import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { GYM_CLASSES } from "./data";
import { GymClass, UserBooking, UserProfile, UserPayment } from "./types";
import { Dumbbell } from "lucide-react";

// Firebase imports
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "./firebase";
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

// Page imports
import Home from "./pages/Home";
import WhyUs from "./pages/WhyUs";
import Schedule from "./pages/Schedule";
import Trainers from "./pages/Trainers";
import BMICalculator from "./pages/BMICalculator";
import Membership from "./pages/Membership";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const navigate = useNavigate();
  const [gymClasses, setGymClasses] = useState<GymClass[]>(GYM_CLASSES);
  
  // Custom Toast/Notification state
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Auth states
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Synced profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("f3_gym_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      name: "",
      email: "",
      membershipPlanId: undefined,
      membershipStatus: "None",
      bookings: [],
      payments: []
    };
  });

  // Helper to sanitize profile objects for Firestore, ensuring no undefined fields are passed
  const sanitizeProfileForFirestore = (profile: UserProfile): any => {
    const cleaned: any = {
      name: profile.name || "Fitness Explorer",
      email: profile.email || "",
      bookings: profile.bookings || [],
      payments: profile.payments || []
    };
    if (profile.membershipPlanId !== undefined && profile.membershipPlanId !== null) {
      cleaned.membershipPlanId = profile.membershipPlanId;
    }
    if (profile.membershipStatus !== undefined && profile.membershipStatus !== null) {
      cleaned.membershipStatus = profile.membershipStatus;
    } else {
      cleaned.membershipStatus = "None";
    }
    if (profile.memberSince !== undefined && profile.memberSince !== null) {
      cleaned.memberSince = profile.memberSince;
    }
    if (profile.qrCodeValue !== undefined && profile.qrCodeValue !== null) {
      cleaned.qrCodeValue = profile.qrCodeValue;
    }
    return cleaned;
  };

  // Firebase auth & snapshot sync loop
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        // Logged-in: Setup Firestore reference
        const userDocRef = doc(db, "users", user.uid);
        
        let profileExists = false;
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
            profileExists = true;
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }

        if (!profileExists) {
          try {
            // Create profile inside Firestore
            const initialProfile: UserProfile = {
              name: userProfile.name || user.displayName || "Fitness Explorer",
              email: user.email || userProfile.email || "",
              membershipPlanId: userProfile.membershipPlanId || undefined,
              membershipStatus: userProfile.membershipStatus || "None",
              bookings: userProfile.bookings || [],
              payments: userProfile.payments || []
            };
            const cleaned = sanitizeProfileForFirestore(initialProfile);
            await setDoc(userDocRef, cleaned);
            setUserProfile(cleaned as UserProfile);
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
          }
        }

        // Real-time listener for multi-device sync
        const unsubDoc = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        });

        setLoadingAuth(false);
        return () => {
          unsubDoc();
        };
      } else {
        // Logged out: Fallback to local storage
        const saved = localStorage.getItem("f3_gym_profile");
        if (saved) {
          try {
            setUserProfile(JSON.parse(saved));
          } catch (e) {}
        } else {
          setUserProfile({
            name: "",
            email: "",
            membershipPlanId: undefined,
            membershipStatus: "None",
            bookings: [],
            payments: []
          });
        }
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Update profile wrapper with sync logic
  const updateProfile = async (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      try {
        const cleaned = sanitizeProfileForFirestore(newProfile);
        await setDoc(userDocRef, cleaned);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      }
    } else {
      localStorage.setItem("f3_gym_profile", JSON.stringify(newProfile));
    }
  };

  // Google Login Trigger
  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showNotification("Connected with Google successfully!", "success");
      // Auto redirect to dashboard upon successful login/active state check
      navigate("/dashboard");
    } catch (error: any) {
      if (
        error?.code === "auth/popup-closed-by-user" ||
        error?.code === "auth/cancelled-popup-request"
      ) {
        console.log("Google authentication cancelled by user gracefully.");
        return;
      }
      console.error("Google authentication failed:", error);
      showNotification("Failed to connect via Google authentication. Please try again.", "error");
    }
  };

  // Sign out Trigger
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("f3_gym_profile");
      showNotification("Disconnected from Google successfully.", "info");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      showNotification("Sign out failed. Please try again.", "error");
    }
  };

  const handleBookClass = (cls: GymClass) => {
    const newBooking: UserBooking = {
      id: `booking-${Date.now()}`,
      classId: cls.id,
      className: cls.name,
      time: cls.time,
      day: cls.day,
      trainerName: cls.trainerName,
      bookedAt: new Date().toLocaleDateString()
    };

    // Increment booked slots count in live state
    setGymClasses((prev) => 
      prev.map((c) => c.id === cls.id ? { ...c, bookedSlots: c.bookedSlots + 1 } : c)
    );

    // Save booking using abstraction
    const updated = {
      ...userProfile,
      bookings: [...userProfile.bookings, newBooking]
    };
    updateProfile(updated);
    showNotification(`Successfully reserved spot in ${cls.name}! View your Dashboard to manage scheduling.`, "success");
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = userProfile.bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // Decrement slots count from live status
    setGymClasses((prev) => 
      prev.map((c) => c.id === booking.classId ? { ...c, bookedSlots: Math.max(0, c.bookedSlots - 1) } : c)
    );

    // Filter bookings list
    const updated = {
      ...userProfile,
      bookings: userProfile.bookings.filter((b) => b.id !== bookingId)
    };
    updateProfile(updated);
    showNotification("Spot booking removed successfully.", "info");
  };

  const handleSignupSubmit = (name: string, email: string, planId: string, paymentRecord?: UserPayment) => {
    const updated = {
      ...userProfile,
      name,
      email,
      membershipPlanId: planId,
      membershipStatus: "Active" as const,
      memberSince: new Date().toLocaleDateString(),
      payments: paymentRecord ? [paymentRecord, ...(userProfile.payments || [])] : (userProfile.payments || [])
    };
    updateProfile(updated);
    showNotification("Congratulations! Your Premium Pass registration has completed successfully.", "success");
    navigate("/dashboard");
  };

  const handleResetMembership = () => {
    if (confirm("Are you sure you want to cancel or adjust your membership pass? Your active gym schedules will be preserved.")) {
      const updated = {
        ...userProfile,
        membershipPlanId: undefined,
        membershipStatus: "None" as const
      };
      updateProfile(updated);
      showNotification("Active membership pass reset successfully.", "info");
      navigate("/membership");
    }
  };

  const handleBookCoaching = (trainerName: string, date: string, time: string) => {
    const newBooking: UserBooking = {
      id: `booking-${Date.now()}`,
      classId: "coaching-1-on-1",
      className: `Private 1-on-1 Coaching Session`,
      time: time,
      day: date,
      trainerName: trainerName,
      bookedAt: new Date().toLocaleDateString()
    };

    const updated = {
      ...userProfile,
      bookings: [...userProfile.bookings, newBooking]
    };
    updateProfile(updated);
    showNotification(`1-on-1 private coaching requested with Coach ${trainerName}!`, "success");
    navigate("/dashboard");
  };

  const handleGateScanEntryLog = () => {
    console.log("Mock gate scan logged at 2026.");
  };

  const handleClearProfile = () => {
    if (confirm("Would you like to log out? This clears your virtual registration pass session locally.")) {
      if (authUser) {
        handleSignOut();
      } else {
        localStorage.removeItem("f3_gym_profile");
        setUserProfile({
          name: "",
          email: "",
          membershipPlanId: undefined,
          membershipStatus: "None",
          bookings: []
        });
        showNotification("Local member session cleared.", "info");
        navigate("/");
      }
    }
  };

  return (
    <div className="bg-gym-black min-h-screen text-zinc-100 flex flex-col justify-between selection:bg-neon-lime selection:text-gym-black">
      
      {/* Top Info Banner for urgent inquiry contact - Visible clearly on the first page across all breakpoints */}
      <div className="bg-gradient-to-r from-neon-lime via-emerald-400 to-neon-lime text-gym-black py-2.5 px-4 text-center text-xs font-black tracking-wide flex items-center justify-center gap-2 relative z-50">
        <span className="inline-block px-1.5 py-0.5 bg-gym-black text-neon-lime text-[9px] font-mono font-black rounded uppercase select-none animate-pulse shrink-0">Hotline</span>
        <span className="text-[11px] sm:text-xs">For More Info & Training Queries, Contact us:</span>
        <a href="tel:8077237136" className="underline hover:text-white transition-colors ml-1 font-mono hover:scale-105 inline-block shrink-0">
          📞 8077237136
        </a>
      </div>

      {/* Sticky Header Nav */}
      <Header 
        memberStatus={userProfile.membershipStatus || "None"}
        memberName={userProfile.name}
        user={authUser}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
      />

      {/* Primary Routes Module Routing */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/schedule" element={
            <Schedule 
              gymClasses={gymClasses}
              userBookings={userProfile.bookings}
              onBookClass={handleBookClass}
              onCancelBooking={handleCancelBooking}
              memberStatus={userProfile.membershipStatus || "None"}
            />
          } />
          <Route path="/trainers" element={
            <Trainers 
              memberStatus={userProfile.membershipStatus || "None"}
              onBookCoaching={handleBookCoaching}
            />
          } />
          <Route path="/bmi-calculator" element={<BMICalculator />} />
          <Route path="/membership" element={
            <Membership 
              userProfile={userProfile}
              onSignupSubmit={handleSignupSubmit}
              onResetMembership={handleResetMembership}
              showNotification={showNotification}
            />
          } />
          <Route path="/dashboard" element={
            <DashboardPage 
              userProfile={userProfile}
              onSubmitMockGateEntry={handleGateScanEntryLog}
              onCancelBooking={handleCancelBooking}
              onClearProfile={handleClearProfile}
            />
          } />
        </Routes>
      </main>

      {/* FOOTER SECTION: Exactly matches visual design with dynamic routing Links */}
      <footer className="bg-zinc-950 border-t border-gym-border/60 py-16 text-zinc-400 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-gym-border/40 pb-12 mb-10">
            
            {/* Logo description */}
            <div className="md:col-span-4 space-y-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 group"
              >
                <div className="bg-neon-lime text-gym-black p-1.5 rounded-lg">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <span className="logo-text text-xl tracking-tight text-white uppercase">
                  F3 Unisex <span className="text-neon-lime">24/7 Gym</span>
                </span>
              </Link>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                Your Go-To For Personalized Workouts, Meal Plans, And Expert Fitness Advice. Shape your athletic future safely on our high-quality platforms.
              </p>
            </div>

            {/* Quick Map links */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-white text-xs font-mono uppercase tracking-widest block font-bold text-center md:text-left">
                Follow Us On Social Portal
              </h4>
              <div className="flex items-center justify-center md:justify-start gap-4 text-white">
                {["Facebook", "LinkedIn", "Instagram", "X"].map((social, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    onClick={(e) => e.preventDefault()}
                    className="p-2.5 rounded-xl bg-gym-dark hover:bg-neon-lime hover:text-gym-black transition-colors border border-gym-border"
                  >
                    <span className="text-xs font-semibold">{social.charAt(0)}</span>
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-zinc-500 pt-2">
                <Link to="/" className="hover:text-neon-lime">Home</Link>
                <span>&bull;</span>
                <Link to="/why-us" className="hover:text-neon-lime">About</Link>
                <span>&bull;</span>
                <Link to="/schedule" className="hover:text-neon-lime">Features</Link>
                <span>&bull;</span>
                <Link to="/trainers" className="hover:text-neon-lime">Service</Link>
                <span>&bull;</span>
                <Link to="/membership" className="hover:text-neon-lime">Exercise</Link>
              </div>
            </div>

            {/* Contact details */}
            <div className="md:col-span-4 space-y-2 text-center md:text-right">
              <h4 className="text-white text-xs font-mono tracking-wider block font-bold uppercase mb-2">
                Contact Office
              </h4>
              <p className="text-xs text-zinc-400">Monday-Sunday &bull; Open 24/7</p>
              <div className="pt-1.5 pb-2">
                <span className="text-[10px] text-zinc-500 block">General Hotline:</span>
                <a href="tel:8077237136" className="text-sm font-black text-neon-lime font-mono hover:underline">
                  +91 8077237136
                </a>
              </div>
              <p className="text-xs text-zinc-550">E-mail inquiries:</p>
              <a href="mailto:anmolsharma7575@gmail.com" className="text-xs text-neon-lime font-mono hover:underline">
                anmolsharma7575@gmail.com
              </a>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-650">
            <p>&copy; 2026 F3 UNISEX 24/7 GYM Systems Inc. All product models with active scheduling reserves.</p>
            <div className="flex gap-4">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Privacy Terms</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Regulatory Liability</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className={`px-5 py-3.5 rounded-2xl border flex items-center gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-md max-w-sm ${
            notification.type === "error" 
              ? "bg-rose-950/90 border-rose-800/80 text-rose-200"
              : notification.type === "success"
                ? "bg-emerald-950/90 border-emerald-800/80 text-emerald-200"
                : "bg-zinc-900/90 border-zinc-800/80 text-zinc-200"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              notification.type === "error" 
                ? "bg-rose-500 animate-pulse" 
                : notification.type === "success" 
                  ? "bg-emerald-500" 
                  : "bg-neon-lime"
            }`} />
            <div className="text-xs font-semibold">{notification.message}</div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto text-zinc-400 hover:text-white text-xs font-mono px-1.5 py-0.5 rounded hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
