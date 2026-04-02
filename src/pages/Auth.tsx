import { useState, useEffect } from "react";
import wellmindLogo from "@/assets/wellmind-logo-2.png";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, User, Mail, ArrowRight, Brain, Heart, Shield, Sparkles, Phone, KeyRound, Eye, EyeOff, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSecurityMonitoring } from "@/hooks/useSecurityMonitoring";
import { motion, AnimatePresence } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";

const authMessages = {
  emailOtp: "A secure WellMindAI verification code is on its way to your inbox.",
  phoneOtp: "A secure WellMindAI verification code is on its way via SMS.",
};

type AuthMode = "login" | "signup" | "otp-verify";
type OtpChannel = "email" | "phone";

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 6) score += 20;
  if (password.length >= 8) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  return score;
};

const strengthLabel = (score: number) => {
  if (score <= 20) return { text: "Weak", color: "text-destructive" };
  if (score <= 40) return { text: "Fair", color: "text-amber-500" };
  if (score <= 60) return { text: "Good", color: "text-amber-400" };
  if (score <= 80) return { text: "Strong", color: "text-calm-sage" };
  return { text: "Very Strong", color: "text-calm-sage" };
};

const Auth = () => {
  const navigate = useNavigate();
  const { logLoginAttempt, logSignupAttempt } = useSecurityMonitoring();
  const [mode, setMode] = useState<AuthMode>("login");
  const [otpChannel, setOtpChannel] = useState<OtpChannel>("email");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [otpTarget, setOtpTarget] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });
  }, [navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email, password: loginData.password,
      });
      if (error) { logLoginAttempt(false, loginData.email); toast.error(error.message); return; }
      logLoginAttempt(true, loginData.email);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch { logLoginAttempt(false, loginData.email); toast.error("An unexpected error occurred"); }
    finally { setIsLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (signupData.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signupData.email, password: signupData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { display_name: signupData.name, phone: signupData.phone },
        },
      });
      if (error) { logSignupAttempt(false, signupData.email); toast.error(error.message); return; }
      logSignupAttempt(true, signupData.email);
      toast.success("Account created! Check your email to verify your account.");
    } catch { logSignupAttempt(false, signupData.email); toast.error("An unexpected error occurred"); }
    finally { setIsLoading(false); }
  };

  const handleSendOtp = async () => {
    if (!otpTarget) { toast.error("Please enter your email or phone"); return; }
    setIsLoading(true);
    try {
      if (otpChannel === "email") {
        const { error } = await supabase.auth.signInWithOtp({ email: otpTarget });
        if (error) { toast.error(error.message); return; }
      } else {
        const { error } = await supabase.auth.signInWithOtp({ phone: otpTarget });
        if (error) { toast.error(error.message); return; }
      }
      toast.success(otpChannel === "email" ? authMessages.emailOtp : authMessages.phoneOtp);
      setMode("otp-verify");
      setResendCooldown(60);
    } catch { toast.error("Failed to send OTP"); }
    finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    await handleSendOtp();
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length < 6) { toast.error("Please enter the 6-digit code"); return; }
    setIsLoading(true);
    try {
      const verifyPayload = otpChannel === "email"
        ? { email: otpTarget, token: otpCode, type: 'email' as const }
        : { phone: otpTarget, token: otpCode, type: 'sms' as const };
      const { error } = await supabase.auth.verifyOtp(verifyPayload);
      if (error) { toast.error(error.message); return; }
      toast.success("Verified successfully! Welcome!");
      navigate("/dashboard");
    } catch { toast.error("Verification failed"); }
    finally { setIsLoading(false); }
  };

  const pwStrength = getPasswordStrength(mode === "signup" ? signupData.password : "");
  const pwLabel = strengthLabel(pwStrength);

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {/* Left decorative panel */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gradient-to-br from-calm-sage-light/30 to-calm-sky-light/30"
        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
      >
        <div className="max-w-md text-center space-y-6">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
            <div className="w-40 h-40 rounded-3xl bg-card/90 backdrop-blur-md border border-border/50 shadow-glass flex items-center justify-center mx-auto overflow-hidden">
              <img src={wellmindLogo} alt="WellMindAI" className="w-36 h-36 object-contain" />
            </div>
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Your Mental Health<br /><span className="text-calm-sage">Matters Here</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Join thousands on a journey to better mental well-being. Safe, private, and always here for you.
          </p>
          <div className="flex items-center justify-center gap-6 pt-2">
            {[
              { label: "Private & Secure", icon: Shield },
              { label: "24/7 Support", icon: Sparkles },
              { label: "Evidence-Based", icon: Brain },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-xl bg-calm-sage-light/60 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-calm-sage" />
                </div>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-card/50 border border-border/30">
            <Heart className="w-5 h-5 text-calm-sage mx-auto mb-2" />
            <p className="text-xs text-muted-foreground italic">
              "Taking care of your mental health is an act of courage. Every step brings you closer to a healthier, happier you."
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-card border border-border/50 shadow-soft flex items-center justify-center mx-auto mb-3 overflow-hidden">
              <img src={wellmindLogo} alt="WellMindAI" className="w-18 h-18 object-contain" />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">WellMindAI</h1>
          </div>

          <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-7 shadow-glass border border-border/50">
            <AnimatePresence mode="wait">
              {/* OTP Verify Screen */}
              {mode === "otp-verify" ? (
                <motion.div key="otp-verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-calm-sage-light/60 flex items-center justify-center mx-auto mb-3">
                      <KeyRound className="w-6 h-6 text-calm-sage" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-foreground mb-1">Verify OTP</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to<br />
                      <span className="font-medium text-foreground">{otpTarget}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-3 rounded-xl bg-muted/40 px-3 py-2 border border-border/40">
                      Sent securely by the <span className="text-foreground font-medium">WellMindAI team</span>.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                      <InputOTPGroup>
                        {[0, 1, 2, 3, 4, 5].map(i => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button onClick={handleVerifyOtp} disabled={isLoading} className="w-full h-11 bg-calm-sage hover:bg-calm-sage/90 text-white font-semibold rounded-xl">
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                  </Button>

                  {/* Resend OTP */}
                  <div className="text-center">
                    <button
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isLoading}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                    </button>
                  </div>

                  <button onClick={() => { setMode("login"); setOtpCode(""); }} className="w-full text-sm text-muted-foreground hover:text-foreground text-center">
                    ← Back to login
                  </button>
                </motion.div>
              ) : (
                <motion.div key="auth-forms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Tab switcher */}
                  <div className="flex gap-1 bg-muted/50 rounded-xl p-1 mb-6">
                    {(["login", "signup"] as const).map(tab => (
                      <button key={tab} onClick={() => setMode(tab)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === tab ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                        {tab === "login" ? "Sign In" : "Sign Up"}
                      </button>
                    ))}
                  </div>

                  {mode === "login" && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                      {/* OTP toggle */}
                      <div className="flex items-center justify-center gap-2 mb-5">
                        <button onClick={() => setUseOtp(false)}
                          className={`text-xs px-3 py-1.5 rounded-full transition ${!useOtp ? 'bg-calm-sage text-white' : 'bg-muted text-muted-foreground'}`}>
                          Password
                        </button>
                        <button onClick={() => setUseOtp(true)}
                          className={`text-xs px-3 py-1.5 rounded-full transition ${useOtp ? 'bg-calm-sage text-white' : 'bg-muted text-muted-foreground'}`}>
                          OTP Login
                        </button>
                      </div>

                      {useOtp ? (
                        <div className="space-y-4">
                          {/* OTP Channel */}
                          <div className="flex gap-2 mb-3">
                            <button onClick={() => setOtpChannel("email")}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm border transition ${otpChannel === 'email' ? 'border-calm-sage bg-calm-sage-light/30 text-foreground' : 'border-border text-muted-foreground'}`}>
                              <Mail className="w-3.5 h-3.5" /> Email
                            </button>
                            <button onClick={() => setOtpChannel("phone")}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm border transition ${otpChannel === 'phone' ? 'border-calm-sage bg-calm-sage-light/30 text-foreground' : 'border-border text-muted-foreground'}`}>
                              <Phone className="w-3.5 h-3.5" /> Phone
                            </button>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">{otpChannel === "email" ? "Email Address" : "Phone Number"}</Label>
                            <div className="relative">
                              <Input
                                type={otpChannel === "email" ? "email" : "tel"}
                                placeholder={otpChannel === "email" ? "you@example.com" : "+91 98765 43210"}
                                value={otpTarget}
                                onChange={e => setOtpTarget(e.target.value)}
                                className="pl-10 h-11 bg-muted/30 border-border/50 rounded-xl"
                              />
                              {otpChannel === "email"
                                ? <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                : <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
                            </div>
                          </div>
                          {otpChannel === "phone" ? (
                            <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-800 space-y-1">
                              <p className="font-medium">⚠️ Phone OTP Setup Required</p>
                              <p>Enable the <span className="font-semibold">Phone provider</span> in Supabase Auth and connect Twilio. Use{" "}
                                <button type="button" onClick={() => setOtpChannel("email")} className="underline font-medium text-calm-sage">Email OTP</button> instead.
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground text-center rounded-xl bg-muted/40 border border-border/40 px-3 py-2">
                              A 6-digit code will be sent to your email by <span className="text-foreground font-medium">WellMindAI</span>.
                            </p>
                          )}
                          <Button onClick={handleSendOtp} disabled={isLoading} className="w-full h-11 bg-calm-sage hover:bg-calm-sage/90 text-white font-semibold rounded-xl">
                            {isLoading ? "Sending..." : <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>}
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Email</Label>
                            <div className="relative">
                              <Input type="email" placeholder="you@example.com" value={loginData.email}
                                onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))} required
                                className="pl-10 h-11 bg-muted/30 border-border/50 rounded-xl" />
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label className="text-sm">Password</Label>
                              <button type="button" className="text-xs text-calm-sage hover:underline">Forgot?</button>
                            </div>
                            <div className="relative">
                              <Input type={showPassword ? "text" : "password"} placeholder="••••••••" value={loginData.password}
                                onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))} required
                                className="pl-10 pr-10 h-11 bg-muted/30 border-border/50 rounded-xl" />
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <Button type="submit" disabled={isLoading} className="w-full h-11 bg-calm-sage hover:bg-calm-sage/90 text-white font-semibold rounded-xl">
                            {isLoading ? "Signing in..." : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
                          </Button>
                        </form>
                      )}
                    </motion.div>
                  )}

                  {mode === "signup" && (
                    <motion.form onSubmit={handleSignup} className="space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <div className="space-y-2">
                        <Label className="text-sm">Full Name</Label>
                        <div className="relative">
                          <Input placeholder="Your name" value={signupData.name}
                            onChange={e => setSignupData(p => ({ ...p, name: e.target.value }))} required
                            className="pl-10 h-11 bg-muted/30 border-border/50 rounded-xl" />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Email</Label>
                        <div className="relative">
                          <Input type="email" placeholder="you@example.com" value={signupData.email}
                            onChange={e => setSignupData(p => ({ ...p, email: e.target.value }))} required
                            className="pl-10 h-11 bg-muted/30 border-border/50 rounded-xl" />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Phone (optional)</Label>
                        <div className="relative">
                          <Input type="tel" placeholder="+91 98765 43210" value={signupData.phone}
                            onChange={e => setSignupData(p => ({ ...p, phone: e.target.value }))}
                            className="pl-10 h-11 bg-muted/30 border-border/50 rounded-xl" />
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Password</Label>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={signupData.password}
                            onChange={e => setSignupData(p => ({ ...p, password: e.target.value }))} required
                            className="pl-10 pr-10 h-11 bg-muted/30 border-border/50 rounded-xl" />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {signupData.password && (
                          <div className="space-y-1">
                            <Progress value={pwStrength} className="h-1.5" />
                            <p className={`text-[10px] font-medium ${pwLabel.color}`}>{pwLabel.text}</p>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Confirm Password</Label>
                        <div className="relative">
                          <Input type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter password" value={signupData.confirmPassword}
                            onChange={e => setSignupData(p => ({ ...p, confirmPassword: e.target.value }))} required
                            className="pl-10 pr-10 h-11 bg-muted/30 border-border/50 rounded-xl" />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {signupData.confirmPassword && signupData.confirmPassword !== signupData.password && (
                          <p className="text-[10px] text-destructive">Passwords do not match</p>
                        )}
                      </div>
                      <div className="rounded-xl bg-muted/40 border border-border/40 px-3 py-2 text-xs text-muted-foreground">
                        Your private wellness space — your dashboard stays separate from every other user.
                      </div>
                      <Button type="submit" disabled={isLoading} className="w-full h-11 bg-calm-sage hover:bg-calm-sage/90 text-white font-semibold rounded-xl">
                        {isLoading ? "Creating account..." : <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>}
                      </Button>
                    </motion.form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 pt-4 border-t border-border/30 text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <a href="/policy" className="text-calm-sage hover:underline">Terms</a> &{" "}
                <a href="/policy" className="text-calm-sage hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Awareness message on mobile */}
          <div className="lg:hidden mt-4 p-3 rounded-xl bg-calm-sage-light/20 border border-border/20 text-center">
            <p className="text-xs text-muted-foreground">
              🌿 "Mental health is not a destination, but a process."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
