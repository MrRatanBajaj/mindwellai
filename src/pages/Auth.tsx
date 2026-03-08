import { useState, useEffect } from "react";
import wellmindLogo from "@/assets/wellmind-logo-2.png";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, User, Mail, ArrowRight, Brain, Heart, Shield, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSecurityMonitoring } from "@/hooks/useSecurityMonitoring";
import { motion, AnimatePresence } from "framer-motion";

const floatingIcons = [
  { icon: Brain, delay: 0, x: "10%", y: "20%" },
  { icon: Heart, delay: 1.2, x: "85%", y: "15%" },
  { icon: Shield, delay: 0.6, x: "75%", y: "75%" },
  { icon: Sparkles, delay: 1.8, x: "15%", y: "80%" },
  { icon: Brain, delay: 2.4, x: "50%", y: "10%" },
  { icon: Heart, delay: 0.3, x: "90%", y: "50%" },
];

const Auth = () => {
  const navigate = useNavigate();
  const { logLoginAttempt, logSignupAttempt } = useSecurityMonitoring();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/dashboard");
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) {
        logLoginAttempt(false, loginData.email);
        toast.error(error.message);
        return;
      }
      logLoginAttempt(true, loginData.email);
      toast.success("Welcome back! Redirecting...");
      navigate("/dashboard");
    } catch {
      logLoginAttempt(false, loginData.email);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { display_name: signupData.name },
        },
      });
      if (error) {
        logSignupAttempt(false, signupData.email);
        toast.error(error.message);
        return;
      }
      logSignupAttempt(true, signupData.email);
      toast.success("Account created! Check your email to confirm.");
    } catch {
      logSignupAttempt(false, signupData.email);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
      {/* Animated floating icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute opacity-[0.07] pointer-events-none"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -20, 0, 20, 0],
            rotate: [0, 10, -10, 5, 0],
            scale: [1, 1.1, 1, 0.95, 1],
          }}
          transition={{ duration: 8, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <item.icon className="w-16 h-16 text-primary" />
        </motion.div>
      ))}

      {/* Left decorative panel */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-lg text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm border border-primary/20"
          >
            <Brain className="w-12 h-12 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-foreground leading-tight"
          >
            Your Mental Health
            <span className="block text-primary mt-1">Matters Here</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            Connect with AI-powered counselors available 24/7. 
            Start your journey to better mental well-being today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-8 pt-4"
          >
            {[
              { label: "24/7 Available", icon: Sparkles },
              { label: "HIPAA Secure", icon: Shield },
              { label: "AI Powered", icon: Brain },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:hidden text-center mb-8"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">WellMindAI</h1>
          </motion.div>

          <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-border/50">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8 bg-muted/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold transition-all">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="login" key="login">
                  <motion.form
                    onSubmit={handleLogin}
                    className="space-y-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium text-foreground">Email</Label>
                      <div className="relative">
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData(p => ({ ...p, email: e.target.value }))}
                          required
                          className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="login-password" className="text-sm font-medium text-foreground">Password</Label>
                        <button type="button" className="text-xs text-primary hover:underline">Forgot?</button>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData(p => ({ ...p, password: e.target.value }))}
                          required
                          className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg shadow-primary/25"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                        ) : (
                          <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                </TabsContent>

                <TabsContent value="signup" key="signup">
                  <motion.form
                    onSubmit={handleSignup}
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm font-medium text-foreground">Full Name</Label>
                      <div className="relative">
                        <Input
                          id="signup-name"
                          placeholder="John Doe"
                          value={signupData.name}
                          onChange={(e) => setSignupData(p => ({ ...p, name: e.target.value }))}
                          required
                          className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20"
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">Email</Label>
                      <div className="relative">
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData(p => ({ ...p, email: e.target.value }))}
                          required
                          className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••"
                            value={signupData.password}
                            onChange={(e) => setSignupData(p => ({ ...p, password: e.target.value }))}
                            required
                            className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20"
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm" className="text-sm font-medium text-foreground">Confirm</Label>
                        <div className="relative">
                          <Input
                            id="signup-confirm"
                            type="password"
                            placeholder="••••••"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData(p => ({ ...p, confirmPassword: e.target.value }))}
                            required
                            className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary focus:ring-primary/20"
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg shadow-primary/25"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                        ) : (
                          <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                </TabsContent>
              </AnimatePresence>
            </Tabs>

            <div className="mt-6 pt-5 border-t border-border/30 text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <a href="/policy" className="text-primary hover:underline">Terms</a> &{" "}
                <a href="/policy" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
