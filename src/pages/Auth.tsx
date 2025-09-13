
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, User, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSecurityMonitoring } from "@/hooks/useSecurityMonitoring";

const Auth = () => {
  const navigate = useNavigate();
  const { logLoginAttempt, logSignupAttempt } = useSecurityMonitoring();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

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
      toast.success("Login successful! Redirecting...");
      navigate("/");
    } catch (error) {
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
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: signupData.name,
          }
        }
      });

      if (error) {
        logSignupAttempt(false, signupData.email);
        toast.error(error.message);
        return;
      }

      logSignupAttempt(true, signupData.email);
      toast.success("Check your email to confirm your account!");
    } catch (error) {
      logSignupAttempt(false, signupData.email);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <section className="py-32 px-6 flex-grow flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Welcome to MindwellAI</h1>
            <p className="text-slate-600">Your journey to better mental well-being starts here</p>
          </div>
          
          <div className="glass-panel rounded-xl p-6 shadow-lg animate-fade-in">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-mindwell-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-mindwell-500 hover:bg-mindwell-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={signupData.name}
                        onChange={handleSignupChange}
                        required
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        required
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        required
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        required
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-mindwell-500 hover:bg-mindwell-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
              <p>By continuing, you agree to MindwellAI's <a href="#" className="text-mindwell-600 hover:underline">Terms of Service</a> and <a href="#" className="text-mindwell-600 hover:underline">Privacy Policy</a>.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Auth;
