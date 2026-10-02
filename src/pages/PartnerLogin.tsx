import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import BrandLogo from "@/components/layout/BrandLogo";
import { supabase } from "@/integrations/supabase/client";
import { getMyPartner } from "@/lib/partners";
import { useSEO } from "@/hooks/useSEO";

const schema = z.object({ email: z.string().trim().email().max(255), password: z.string().min(6).max(128) });

const PartnerLogin = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  useSEO({ title: "Partner login | WellMind AI", description: "Sign in to your WellMind AI clinic partner portal.", path: "/partner/login" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) return toast.error("Enter a valid email and password");
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data as { email: string; password: string });
    if (error || !data.user) { setBusy(false); return toast.error(error?.message ?? "Sign in failed"); }
    const partner = await getMyPartner(data.user.id);
    setBusy(false);
    if (!partner) return toast.error("This account is not linked to a partner clinic yet.");
    nav("/partner/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary via-background to-accent/20 px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-[2rem] border border-border bg-card p-8 shadow-elegant">
        <BrandLogo size={48} />
        <div>
          <h1 className="font-display text-3xl">Partner portal</h1>
          <p className="text-sm text-muted-foreground">For clinics and doctors on WellMind AI.</p>
        </div>
        <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        <Button type="submit" disabled={busy} className="w-full rounded-full">
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in
        </Button>
      </form>
    </div>
  );
};

export default PartnerLogin;
