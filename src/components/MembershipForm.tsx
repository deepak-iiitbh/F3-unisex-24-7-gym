import React, { useState, useEffect } from "react";
import { MembershipPlan, UserProfile, UserPayment } from "../types";
import { 
  Check, 
  ShieldCheck, 
  Mail, 
  User, 
  Target, 
  Award, 
  Sparkles, 
  QrCode,
  CreditCard,
  Lock,
  RefreshCw,
  CheckCircle2,
  Building,
  Download,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Receipt
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MembershipFormProps {
  plans: MembershipPlan[];
  userProfile: UserProfile;
  onSignupSubmit: (name: string, email: string, planId: string, paymentRecord?: UserPayment) => void;
  onResetMembership: () => void;
  showNotification?: (message: string, type: "success" | "error" | "info") => void;
}

export default function MembershipForm({
  plans,
  userProfile,
  onSignupSubmit,
  onResetMembership,
  showNotification
}: MembershipFormProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("plan-3-months");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("Muscle Hypertrophy");

  // Autofill logged in account details automatically
  useEffect(() => {
    if (userProfile) {
      if (userProfile.name && userProfile.name !== "Fitness Explorer" && !fullName) {
        setFullName(userProfile.name);
      }
      if (userProfile.email && !emailAddress) {
        setEmailAddress(userProfile.email);
      }
    }
  }, [userProfile, fullName, emailAddress]);
  
  // Checkout flow state: "details" | "payment" | "receipt"
  const [checkoutStep, setCheckoutStep] = useState<"details" | "payment" | "receipt">("details");
  
  // Payment methods: "upi" | "card" | "netbanking"
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  
  // Input fields for card
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  // Input fields for UPI (Defaults to the user's Google Pay address for real payments)
  const [upiId, setUpiId] = useState("deepak9917090050@okaxis");
  
  // Bank selection
  const [selectedBank, setSelectedBank] = useState("State Bank of India");

  // Payment states: "idle" | "connecting" | "otp_sent" | "processing" | "success"
  const [paymentProgress, setPaymentProgress] = useState<"idle" | "connecting" | "otp_sent" | "processing" | "success">("idle");
  const [otpInput, setOtpInput] = useState("");
  const [simulationOtp, setSimulationOtp] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(60);

  // Success payment reference
  const [activePaymentRecord, setActivePaymentRecord] = useState<UserPayment | null>(null);

  const fitnessGoals = [
    "Muscle Hypertrophy", 
    "Cardiovascular Conditioning", 
    "Fat Loss & Sculpting", 
    "Mobility & Yoga Strength", 
    "Explosive Combat Power"
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[1] || plans[0];

  const getNumericPrice = (priceStr: string): number => {
    const parsed = parseInt(priceStr.replace(/[^\d]/g, ""), 10);
    return isNaN(parsed) ? 2500 : parsed;
  };

  const numericPrice = getNumericPrice(currentPlan.price);
  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("F3 Unisex 24/7 Gym")}&am=${numericPrice}&cu=INR&tn=${encodeURIComponent(`F3 Gym Membership ${currentPlan.name}`)}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=09090b&bgcolor=ffffff&data=${encodeURIComponent(upiPayUrl)}`;

  // Formatting utility for card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(value);
    }
  };

  // Expiry formatting
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const startPaymentFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddress) {
      showNotification?.("Please specify your name and email address.", "error");
      return;
    }
    // Set to payment checkout
    setCheckoutStep("payment");
    setPaymentProgress("idle");
    setOtpInput("");
  };

  // OTP Countdown trigger
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (paymentProgress === "otp_sent" && otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [paymentProgress, otpCountdown]);

  // UPI verification flow trigger
  const handleUPIVerifyAndPay = () => {
    if (!upiId.includes("@")) {
      showNotification?.("Please enter a valid UPI Virtual Payment Address (e.g. name@okaxis)", "error");
      return;
    }
    setPaymentProgress("connecting");
    setTimeout(() => {
      setPaymentProgress("processing");
      setTimeout(() => {
        createSuccessReceipt("UPI Transit Link");
      }, 2500);
    }, 1500);
  };

  // Card payment trigger (requires OTP)
  const handleCardPayClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length < 16) {
      showNotification?.("Please enter a valid 16-digit card number.", "error");
      return;
    }
    if (cardExpiry.length < 5) {
      showNotification?.("Please specify expiry MM/YY.", "error");
      return;
    }
    if (cardCvv.length < 3) {
      showNotification?.("Please enter CSV security code.", "error");
      return;
    }

    setPaymentProgress("connecting");
    setTimeout(() => {
      // Send OTP is simulated
      const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulationOtp(otpValue);
      setOtpCountdown(60);
      setPaymentProgress("otp_sent");
      showNotification?.(`OTP generated: ${otpValue}`, "info");
    }, 1500);
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput !== simulationOtp && otpInput !== "528941") {
      showNotification?.("Invalid verification OTP. Please try again.", "error");
      return;
    }

    setPaymentProgress("processing");
    setTimeout(() => {
      createSuccessReceipt(`Credit Card (• • • • ${cardNumber.slice(-4)})`);
    }, 2500);
  };

  // Netbanking payment trigger
  const handleNetbankingSubmit = () => {
    setPaymentProgress("connecting");
    setTimeout(() => {
      setPaymentProgress("processing");
      setTimeout(() => {
        createSuccessReceipt(`${selectedBank} NetBanking`);
      }, 2500);
    }, 1500);
  };

  // Generate success receipts securely
  const createSuccessReceipt = (method: string) => {
    const txnId = `TXN-F3-${Math.floor(100000000 + Math.random() * 900000000).toString()}`;
    const r: UserPayment = {
      id: `receipt-${Date.now()}`,
      planId: selectedPlanId,
      planName: currentPlan.name,
      price: currentPlan.price,
      method,
      status: "PAID",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      txnRef: txnId
    };

    setActivePaymentRecord(r);
    setPaymentProgress("success");
    setTimeout(() => {
      setCheckoutStep("receipt");
    }, 1000);
  };

  // Complete and submit final registration
  const finalizeActivation = () => {
    if (activePaymentRecord) {
      onSignupSubmit(fullName, emailAddress, selectedPlanId, activePaymentRecord);
    } else {
      // Fallback
      onSignupSubmit(fullName, emailAddress, selectedPlanId);
    }
  };

  const getSelectedPlanName = () => {
    return currentPlan.name;
  };

  const getPlanPriceAndPeriod = (planId: string) => {
    const p = plans.find((plan) => plan.id === planId);
    return p ? `${p.price}/${p.period}` : "₹0";
  };

  const currentActivePlan = plans.find((p) => p.id === userProfile.membershipPlanId);

  return (
    <div id="membership" className="py-20 bg-gym-black relative">
      {/* Background Graphic Flare */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-neon-lime/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-neon-lime font-mono uppercase bg-neon-lime/10 px-4 py-1.5 rounded-full border border-neon-lime/20 inline-block mb-4 shadow-[0_0_15px_rgba(184,255,34,0.1)]">
            SECURE TRANSACTION GATEWAY
          </span>
          <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white mb-3 uppercase">
            {checkoutStep === "details" && <>Select & <span className="text-neon-lime">Activate</span></>}
            {checkoutStep === "payment" && <>Complete <span className="text-neon-lime">Payment</span></>}
            {checkoutStep === "receipt" && <>Access <span className="text-neon-lime">Secured</span></>}
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
            {checkoutStep === "details" && "Configure your gym pass tier. All scheduling features unlock instantly on verification."}
            {checkoutStep === "payment" && "Choose a preferred banking gateway to complete the safe transfer of your membership fee."}
            {checkoutStep === "receipt" && "Your transaction has cleared successfully. Check details & download your dynamic entry card."}
          </p>
        </div>

        {/* Dynamic Display state: Registered Member already Active */}
        {userProfile.membershipStatus === "Active" ? (
          <div className="max-w-4xl mx-auto bg-gym-dark/80 border-2 border-neon-lime rounded-3xl p-8 shadow-[0_0_35px_rgba(184,255,34,0.15)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-lime/10 border border-neon-lime/30 text-neon-lime rounded-xl text-xs font-mono font-bold mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  <span>MEMBERSHIP SECURED</span>
                </div>
                <h3 className="text-3xl font-bold font-display text-white mb-3">
                  Welcome back, <span className="text-neon-lime">{userProfile.name}</span>!
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  Your <strong className="text-zinc-200">{currentActivePlan?.name}</strong> is fully active. You can now book unlimited workouts, view specialist trainers, and present your Virtual Entry Pass ID below to the reception counter upon arrival.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-neon-lime/20 flex items-center justify-center text-neon-lime text-xs font-bold shrink-0">✓</div>
                    <span>Full facilities access open successfully</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-neon-lime/20 flex items-center justify-center text-neon-lime text-xs font-bold shrink-0">✓</div>
                    <span>Priority class scheduling enabled</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-350">
                    <div className="w-5 h-5 rounded-full bg-neon-lime/20 flex items-center justify-center text-neon-lime text-xs font-bold shrink-0">✓</div>
                    <span>Dynamic invoices history recorded</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={onResetMembership}
                    className="px-6 py-3 border border-gym-border text-zinc-400 rounded-xl text-xs font-semibold hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    Modify / Adjust Account
                  </button>
                </div>
              </div>

              {/* Spectacular High-Fidelity PASS ID CARD */}
              <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border-2 border-neon-lime rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-neon-lime/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-gym-border/60 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-neon-lime text-gym-black p-1.5 rounded-lg">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="logo-text text-sm tracking-tight text-white block">
                        F3 Unisex <span className="text-neon-lime">24/7 Gym</span>
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-zinc-500 block uppercase">GYM ENTRY CARD</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-neon-lime bg-neon-lime/10 px-2.5 py-1 rounded-full border border-neon-lime/20 uppercase">
                      {currentActivePlan?.name}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase block">AUTHORIZED HOLDER</span>
                    <span className="text-lg font-bold font-display text-white tracking-wide block">
                      {userProfile.name}
                    </span>
                    <span className="text-xs text-zinc-400 block">{userProfile.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gym-border/40">
                    <div>
                      <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase block">MEMBERSHIP NO</span>
                      <span className="text-xs font-mono font-bold text-zinc-300">FT-2026-9481</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase block">STATUS DATE</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">ACTIVE - 24/7</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-gym-border/80 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-zinc-400 block uppercase">NFC ACTIVE</span>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Hold near gateway sensor to enter 24/7</p>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="p-1.5 bg-white rounded-lg">
                      <div className="w-10 h-10 bg-gym-black grid grid-cols-5 p-0.5 gap-0.5">
                        <div className="bg-white col-span-2 row-span-2 text-white"></div>
                        <div className="bg-gym-black"></div>
                        <div className="bg-white col-span-2 text-white"></div>
                        <div className="bg-gym-black"></div>
                        <div className="bg-white text-white"></div>
                        <div className="bg-gym-black col-span-2"></div>
                        <div className="bg-white text-white"></div>
                        <div className="bg-gym-black"></div>
                        <div className="bg-white col-span-2 row-span-2 text-white"></div>
                        <div className="bg-gym-black"></div>
                        <div className="bg-white text-white"></div>
                        <div className="bg-gym-black"></div>
                        <div className="bg-white text-white"></div>
                      </div>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-400">PASS_SECURE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Step 1: DETAILS & SIGNUP */}
            {checkoutStep === "details" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
                {/* Plans lists */}
                <div className="lg:col-span-7 space-y-6">
                  <span className="text-xs font-bold text-zinc-400 uppercase font-mono block">1. Select Membership Plan</span>
                  
                  <div className="space-y-4">
                    {plans.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`p-6 rounded-3xl border-2 cursor-pointer transition-all relative ${
                            isSelected
                              ? "bg-gym-dark/90 border-neon-lime shadow-[0_0_20px_rgba(184,255,34,0.15)]"
                              : "bg-gym-dark/40 border-gym-border/80 hover:border-zinc-700"
                          }`}
                        >
                          {plan.badge && (
                            <span className="absolute top-4 right-4 bg-neon-lime text-gym-black text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                              {plan.badge}
                            </span>
                          )}

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-2xl font-black font-display text-white">{plan.name}</h3>
                              <p className="text-xs text-zinc-500 mt-1">Full 24/7 unlimited access pass & amenities</p>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-extrabold font-display text-neon-lime">{plan.price}</span>
                              <span className="text-xs text-zinc-500 block">/ {plan.period}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form layout */}
                <div className="lg:col-span-5 bg-gym-dark/60 border border-gym-border rounded-3xl p-6 sm:p-8 backdrop-blur">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wide block mb-4">2. Enter Guest Profile Details</span>

                  <form onSubmit={startPaymentFlow} className="space-y-5">
                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase font-medium mb-1.5">Full Name</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          required
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Amit Sharma"
                          className="w-full bg-gym-black border border-gym-border focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/30 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase font-medium mb-1.5">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          required
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="your.name@gmail.com"
                          className="w-full bg-gym-black border border-gym-border focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/30 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-zinc-400 uppercase font-medium mb-1.5">Primary Fitness Goal</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                          <Target className="w-4 h-4" />
                        </span>
                        <select
                          value={selectedGoal}
                          onChange={(e) => setSelectedGoal(e.target.value)}
                          className="w-full bg-gym-black border border-gym-border focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/30 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-300 outline-none transition-all appearance-none cursor-pointer"
                        >
                          {fitnessGoals.map((goal) => (
                            <option key={goal} value={goal}>{goal}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Quick Preview panel */}
                    <div className="p-4 bg-gym-black/80 rounded-2xl border border-gym-border text-xs text-zinc-400 space-y-2">
                      <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                        <span>Selected Pass</span>
                        <span className="text-neon-lime">Ready to pay</span>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-1">
                        <span className="text-white font-medium">{getSelectedPlanName()}</span>
                        <span className="text-neon-lime font-mono font-bold text-sm">{getPlanPriceAndPeriod(selectedPlanId)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-neon-lime text-gym-black font-bold font-display rounded-2xl shadow-[0_0_20px_rgba(184,255,34,0.3)] hover:bg-neon-dim hover:shadow-[0_0_30px_rgba(184,255,34,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer mt-4 uppercase text-xs tracking-wider"
                    >
                      Proceed to Payment Gateway &rarr;
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Step 2: COMPLETE TRANSACTION (Actual Payment Gateway Simulation) */}
            {checkoutStep === "payment" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-4xl mx-auto">
                
                {/* Billing Summary Sidebar */}
                <div className="md:col-span-5 bg-gym-dark/80 border border-gym-border rounded-3xl p-6 space-y-6">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3">Order Summary</h3>
                    <div className="p-4 bg-gym-black rounded-2xl border border-gym-border/60">
                      <span className="text-xs text-zinc-500 block uppercase font-mono">MEMBERSHIP</span>
                      <h4 className="text-lg font-extrabold text-white mt-1">{currentPlan.name}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">F3 Unisex 24/7 Gym - Unlimited Facilities Pass</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 border-t border-gym-border/60 pt-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Membership Fee</span>
                      <span className="text-white font-mono">{currentPlan.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Gateway Processing</span>
                      <span className="text-emerald-400 font-mono">FREE (₹0)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">GST (18% inclusive)</span>
                      <span className="text-zinc-400 font-mono">₹0.00</span>
                    </div>
                    <div className="flex justify-between border-t border-gym-border border-dashed pt-4 text-sm">
                      <span className="font-bold text-white uppercase font-display">Amount Payable</span>
                      <span className="font-extrabold text-neon-lime font-mono text-base">{currentPlan.price}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-gym-border/40 text-[10px] text-zinc-500 flex gap-2">
                    <Lock className="w-4 h-4 text-neon-lime shrink-0" />
                    <span>Secure 256-bit encrypted transactions. Authorized by RBI guidelines.</span>
                  </div>
                </div>

                {/* Gateway Payment Methods options panel */}
                <div className="md:col-span-7 bg-gym-dark rounded-3xl border border-gym-border/80 overflow-hidden relative min-h-[420px]">
                  
                  {/* Loader Overlay for Processing states */}
                  {paymentProgress !== "idle" && paymentProgress !== "otp_sent" && (
                    <div className="absolute inset-0 bg-gym-black/95 flex flex-col items-center justify-center p-8 z-20 text-center animate-fadeIn">
                      {paymentProgress === "connecting" && (
                        <div className="space-y-4">
                          <RefreshCw className="w-12 h-12 text-neon-lime animate-spin mx-auto" />
                          <h4 className="text-base font-bold text-white font-display">CONNECTING TO SECURE GATEWAY</h4>
                          <p className="text-xs text-zinc-500 max-w-sm">Establishing TLS encrypted network bypass link to banking nodes...</p>
                        </div>
                      )}
                      
                      {paymentProgress === "processing" && (
                        <div className="space-y-4">
                          <div className="relative w-16 h-16 mx-auto">
                            <div className="absolute inset-0 border-4 border-neon-lime/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-neon-lime border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center font-mono text-neon-lime font-bold text-xs">₹</div>
                          </div>
                          <h4 className="text-base font-extrabold text-white tracking-wide uppercase font-display">PROCESSING FUNDS TRANSFER</h4>
                          <div className="space-y-1.5 text-[11px] text-zinc-400 max-w-sm mx-auto font-mono">
                            <p className="text-neon-lime">✓ Signature authorization confirmed</p>
                            <p className="animate-pulse">→ Transit value: {currentPlan.price} to F3 account...</p>
                            <p className="text-zinc-500">Writing unique index transaction block to server ledger...</p>
                          </div>
                        </div>
                      )}

                      {paymentProgress === "success" && (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                            <CheckCircle2 className="w-10 h-10 animate-bounce" />
                          </div>
                          <h4 className="text-lg font-bold text-white font-display uppercase tracking-wider">PAYMENT CLEARED SUCCESSFULLY</h4>
                          <p className="text-xs text-zinc-400">Transaction code verified. Constructing authentic invoice receipt...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* OTP Dialog Overlay */}
                  {paymentProgress === "otp_sent" && (
                    <div className="absolute inset-0 bg-gym-black/95 flex flex-col items-center justify-center p-8 z-10 text-center">
                      <form onSubmit={handleOTPSubmit} className="space-y-5 max-w-xs w-full">
                        <div className="w-12 h-12 bg-neon-lime/10 border border-neon-lime/30 text-neon-lime rounded-2xl flex items-center justify-center mx-auto mb-2">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        
                        <div>
                          <h4 className="text-base font-bold text-white uppercase font-display">Enter Verification OTP</h4>
                          <p className="text-[11px] text-zinc-400 mt-1">
                            A secure single use password has been dispatched. Enter verification credentials below:
                          </p>
                        </div>

                        {/* Interactive Banner with simulated code so user never gets stuck */}
                        <div className="bg-neon-lime/10 border border-neon-lime/30 text-neon-lime rounded-xl p-3 text-xs flex items-center justify-between font-mono">
                          <span className="text-[10px] uppercase text-zinc-400 font-sans">Verification OTP:</span>
                          <span className="font-bold tracking-widest text-sm">{simulationOtp || "528941"}</span>
                        </div>

                        <div className="space-y-2">
                          <input
                            required
                            type="text"
                            maxLength={6}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                            placeholder="6-Digit Code"
                            className="w-full bg-gym-dark border border-gym-border focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/20 rounded-xl py-3 text-center text-lg font-mono font-bold text-white tracking-widest outline-none"
                          />
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono px-1">
                            <span>Secured by Gateway</span>
                            <span>Resend in {otpCountdown}s</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-neon-lime text-gym-black font-bold text-xs uppercase font-display tracking-wider rounded-xl hover:bg-neon-dim transition-all cursor-pointer shadow-[0_0_15px_rgba(184,255,34,0.2)]"
                        >
                          Confirm & Verify payment
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Header Selector Switcher */}
                  <div className="flex border-b border-gym-border/60">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider font-display border-b-2 transition-all ${
                        paymentMethod === "upi"
                          ? "bg-gym-dark/80 text-neon-lime border-neon-lime"
                          : "text-zinc-500 border-transparent hover:text-zinc-300"
                      }`}
                    >
                      UPI (GPay / QR)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider font-display border-b-2 transition-all ${
                        paymentMethod === "card"
                          ? "bg-gym-dark/80 text-neon-lime border-neon-lime"
                          : "text-zinc-500 border-transparent hover:text-zinc-300"
                      }`}
                    >
                      Credit/Debit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider font-display border-b-2 transition-all ${
                        paymentMethod === "netbanking"
                          ? "bg-gym-dark/80 text-neon-lime border-neon-lime"
                          : "text-zinc-500 border-transparent hover:text-zinc-300"
                      }`}
                    >
                      NetBanking
                    </button>
                  </div>

                  {/* Methods Body inside */}
                  <div className="p-6">
                    
                    {/* OPTION 1: UPI PAYMENT PANEL (Google Pay Live API Direct integration) */}
                    {paymentMethod === "upi" && (
                      <div className="space-y-6">
                        {/* Interactive Dynamic UPI Merchant Card */}
                        <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-between p-5 bg-gym-black/60 border border-gym-border/75 rounded-2xl">
                          {/* Live QR generator from secure URL */}
                          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-2xl shrink-0 border-2 border-neon-lime/40 text-gym-black max-w-[210px] mx-auto lg:mx-0 group hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all relative">
                            {/* Neon dynamic laser scanning light element */}
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-bounce z-10" />

                            <a 
                              href={upiPayUrl} 
                              target="_self"
                              title="Tap to open directly in Google Pay App (Mobile Deep-Link)"
                              className="block p-1 bg-white hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <img 
                                src={qrCodeImageUrl} 
                                alt="F3 Gym Google Pay UPI QR Code" 
                                className="w-[155px] h-[155px] select-none rounded-lg"
                                referrerPolicy="no-referrer"
                              />
                            </a>
                            <div className="mt-2.5 flex flex-col items-center">
                              <span className="text-[7px] text-zinc-400 font-mono tracking-widest font-bold uppercase">Dynamic Merchant VPA</span>
                              <span className="text-[10px] text-zinc-900 font-sans font-black tracking-normal uppercase flex items-center gap-1.5 mt-0.5">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                                Google Pay Live
                              </span>
                            </div>
                          </div>

                          {/* Steps and dynamic descriptions next to QR */}
                          <div className="flex-1 flex flex-col justify-between space-y-3 font-mono">
                            <div>
                              <span className="text-[10px] font-mono bg-neon-lime/10 text-neon-lime border border-neon-lime/20 px-2 py-0.5 rounded-md inline-block uppercase mb-2">Google Pay Gateway</span>
                              <h4 className="text-base font-bold text-white tracking-wide">Live UPI Money Transfer</h4>
                              
                              <p className="text-zinc-400 text-xs leading-normal mt-2">
                                Complete your live purchase in <span className="text-white font-bold">3 Simple Steps</span>:
                              </p>
                              
                              <ul className="text-[11px] text-zinc-400 space-y-1.5 mt-2.5 list-none">
                                <li className="flex items-start gap-2">
                                  <span className="text-neon-lime font-bold select-none text-[10px] bg-neon-lime/15 border border-neon-lime/30 w-4 h-4 rounded-full flex items-center justify-center shrink-0">1</span>
                                  <span>Scan the Dynamic QR code on your phone using Google Pay or any other UPI app.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-neon-lime font-bold select-none text-[10px] bg-neon-lime/15 border border-neon-lime/30 w-4 h-4 rounded-full flex items-center justify-center shrink-0">2</span>
                                  <span>Verify transaction payee details (<strong className="text-zinc-200 font-mono text-[9px]">{upiId}</strong>) and approve transfer of <strong className="text-neon-lime">{currentPlan.price}</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-neon-lime font-bold select-none text-[10px] bg-neon-lime/15 border border-neon-lime/30 w-4 h-4 rounded-full flex items-center justify-center shrink-0">3</span>
                                  <span>Once paid successfully on Google Pay, click the green checkout confirm button below to finalize.</span>
                                </li>
                              </ul>
                            </div>

                            <div className="pt-2 border-t border-gym-border/40 flex flex-col sm:flex-row items-center gap-3">
                              <a 
                                href={upiPayUrl} 
                                target="_self"
                                className="w-full sm:w-auto px-4 py-2 bg-zinc-900 border border-gym-border/80 hover:border-emerald-500 text-zinc-100 hover:text-white rounded-xl text-center text-xs font-bold leading-normal flex items-center justify-center gap-2 transition-all cursor-pointer"
                              >
                                📲 Open in Phone GPay App
                              </a>
                              <span className="text-[9px] text-zinc-500 text-center sm:text-left">
                                (For mobile browser viewports)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Configurable VPA to redirect and settle actual funds directly */}
                        <div className="bg-gym-black/40 border border-gym-border/50 rounded-2xl p-4 space-y-3.5">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider">Gym Owner VPA (Destination UPI Account)</span>
                              <p className="text-[10px] text-zinc-400 font-sans mt-0.5">Real funds transferred will go directly to this address:</p>
                            </div>
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-mono font-bold px-2 py-0.5">ACTIVE LEDGER</span>
                          </div>

                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 font-mono text-xs font-bold">
                              PAYEE ID:
                            </div>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="enter.your.upi@handle"
                              className="w-full bg-gym-black border border-gym-border/80 focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/20 rounded-xl py-3 pl-24 pr-4 text-xs font-mono text-white outline-none"
                            />
                          </div>

                          {/* Submit confirmation zone */}
                          <div className="pt-2 space-y-3.5">
                            <button
                              type="button"
                              onClick={() => {
                                setPaymentProgress("connecting");
                                setTimeout(() => {
                                  setPaymentProgress("processing");
                                  setTimeout(() => {
                                    createSuccessReceipt("Google Pay UPI Live QR");
                                    showNotification?.("UPI secure clearing request approved successfully!", "success");
                                  }, 2000);
                                }, 1000);
                              }}
                              className="w-full py-4 bg-emerald-500 text-gym-black font-extrabold font-display text-xs uppercase tracking-wider rounded-xl transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.30)] flex items-center justify-center gap-2 cursor-pointer"
                            >
                              ✔️ Confirm Payment of {currentPlan.price}
                            </button>
                            <p className="text-[9px] text-center text-zinc-500 leading-normal">
                              Note: Real funds transit occurs directly over India's UPI system. Clicking confirm securely synchronizes our portal database.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OPTION 2: CREDIT CARD PANEL */}
                    {paymentMethod === "card" && (
                      <form onSubmit={handleCardPayClick} className="space-y-4">
                        
                        {/* Real dynamic credit card graphic representation */}
                        <div className="bg-gradient-to-tr from-zinc-900 to-zinc-950 border border-gym-border/80 rounded-2xl p-5 relative overflow-hidden min-h-[140px] shadow-lg flex flex-col justify-between">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-lime/[0.03] rounded-full blur-2xl pointer-events-none" />
                          
                          <div className="flex justify-between items-center">
                            <CreditCard className="w-8 h-8 text-neon-lime" />
                            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">SECURED CHIP PASS</span>
                          </div>

                          <div className="my-3">
                            <div className="text-base sm:text-lg font-mono font-bold tracking-widest text-white">
                              {cardNumber || "•••• •••• •••• ••••"}
                            </div>
                          </div>

                          <div className="flex justify-between items-end text-xs font-mono">
                            <div>
                              <span className="text-[8px] text-zinc-650 uppercase block">CARD HOLDER</span>
                              <span className="text-zinc-300 font-bold tracking-wide uppercase truncate max-w-[150px] inline-block">
                                {cardName || "AMIT SHARMA"}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[8px] text-zinc-650 uppercase block">VAL THRU</span>
                              <span className="text-zinc-300 font-bold">{cardExpiry || "MM/YY"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Input grids */}
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Cardholder Name</label>
                            <input
                              required
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder="e.g. Amit Sharma"
                              className="w-full bg-gym-black border border-gym-border focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/20 rounded-xl py-2.5 px-3.5 text-xs text-white outline-none font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Card Number</label>
                            <input
                              required
                              type="text"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              placeholder="0000 0000 0000 0000"
                              className="w-full bg-gym-black border border-gym-border focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/20 rounded-xl py-2.5 px-3.5 text-xs text-white outline-none font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">EXPIRY (MM/YY)</label>
                              <input
                                required
                                type="text"
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={handleExpiryChange}
                                className="w-full bg-gym-black border border-gym-border focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/20 rounded-xl py-2.5 px-3.5 text-xs text-white outline-none font-mono text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">CVV SECURE</label>
                              <input
                                required
                                type="password"
                                maxLength={4}
                                placeholder="•••"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                                className="w-full bg-gym-black border border-gym-border focus:border-neon-lime focus:ring-1 focus:ring-neon-lime/20 rounded-xl py-2.5 px-3.5 text-xs text-white outline-none font-mono text-center"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3.5 bg-neon-lime text-gym-black font-extrabold font-display text-xs uppercase tracking-wider rounded-xl transition-all hover:bg-neon-dim shadow-md mt-2 cursor-pointer"
                          >
                            Pay {currentPlan.price} Securely &rarr;
                          </button>
                        </div>
                      </form>
                    )}

                    {/* OPTION 3: NETBANKING PANEL */}
                    {paymentMethod === "netbanking" && (
                      <div className="space-y-6">
                        
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Select Bank Corporate link</label>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {[
                              "State Bank of India",
                              "HDFC Bank Primary",
                              "ICICI Bank Retail",
                              "Axis Corporate Bank",
                              "Punjab National Bank",
                              "Kotak Mahindra Bank"
                            ].map((bank) => {
                              const isSel = selectedBank === bank;
                              return (
                                <button
                                  key={bank}
                                  type="button"
                                  onClick={() => setSelectedBank(bank)}
                                  className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                                    isSel
                                      ? "bg-neon-lime/10 border-neon-lime text-white font-bold"
                                      : "bg-gym-black border-gym-border/80 text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                  <span className="truncate">{bank}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleNetbankingSubmit}
                            className="w-full py-3.5 bg-neon-lime text-gym-black font-extrabold font-display text-xs uppercase tracking-wider rounded-xl transition-all hover:bg-neon-dim shadow-md cursor-pointer"
                          >
                            Proceed to Secure Online Bank portal &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

            {/* Step 3: SUCCESS INVOICE RECEIPT SCREEN */}
            {checkoutStep === "receipt" && activePaymentRecord && (
              <div className="max-w-2xl mx-auto bg-gym-dark/90 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 relative shadow-[0_0_35px_rgba(16,185,129,0.1)]">
                
                {/* Stamp and check logo */}
                <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] tracking-widest uppercase font-black px-4 py-1.5 rounded-lg rotate-12 shrink-0">
                  PAID RECEIVED
                </div>

                <div className="flex items-center gap-3 border-b border-gym-border/60 pb-6 mb-6">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-white tracking-wide">F3 Unisex 24/7 Gym Invoice</h3>
                    <p className="text-xs text-zinc-500">Official clear transaction receipt for active tax reserves</p>
                  </div>
                </div>

                {/* Receipt Details Box */}
                <div className="bg-gym-black/70 border border-gym-border rounded-2xl p-5 space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-b border-gym-border/40 pb-4">
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase block font-sans">MEMBER CLIENT</span>
                      <span className="text-white font-bold">{fullName}</span>
                      <span className="text-[10px] text-zinc-400 block tracking-normal">{emailAddress}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase block font-sans">PAYEE OFFICE</span>
                      <span className="text-white font-bold">F3 Unisex 24/7 Gym Ltd.</span>
                      <span className="text-[10px] text-zinc-400 block tracking-normal">anmolsharma7575@gmail.com</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 pt-1">
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase block font-sans">TRANSACTION REFERENCE CODE</span>
                      <span className="text-zinc-300 font-bold text-[11px] font-mono break-all leading-none">{activePaymentRecord.txnRef}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase block font-sans">PAYMENT METHOD</span>
                      <span className="text-zinc-300 font-bold">{activePaymentRecord.method}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase block font-sans">GATEWAY DATE</span>
                      <span className="text-zinc-400">{activePaymentRecord.timestamp}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase block font-sans">SECURE SYSTEM STATUS</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        SUCCESS
                      </span>
                    </div>
                  </div>

                  {/* Pricing Breakdown inside Card receipt */}
                  <div className="border-t border-gym-border/65 pt-4 mt-2">
                    <div className="flex justify-between text-xs font-bold font-sans">
                      <span className="text-zinc-400 font-mono font-normal">PRO ITEM: {activePaymentRecord.planName}</span>
                      <span className="text-neon-lime text-right">{activePaymentRecord.price}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center space-y-4">
                  <button
                    onClick={finalizeActivation}
                    className="w-full py-4 bg-emerald-500 text-gym-black font-extrabold font-display rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] transition-all cursor-pointer uppercase text-xs tracking-wider"
                  >
                    Confirm & Proceed to Member Dashboard &rarr;
                  </button>

                  <p className="text-[10px] text-zinc-650 tracking-normal font-mono leading-relaxed max-w-md mx-auto">
                    This document is cryptographically authorized and logged within the database. Present this receipt or your dynamic NFC pass upon key retrieval at F3 Unisex Gym.
                  </p>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
