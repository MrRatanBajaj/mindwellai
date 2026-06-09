import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function BusinessJoin() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ready" | "joined" | "error">("loading");
  const [message, setMessage] = useState("");
  const [invite, setInvite] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (!token) { setStatus("error"); setMessage("Missing invite token."); return; }
    if (!user) { setStatus("ready"); return; }
    (async () => {
      const { data: inv } = await supabase.from("b2b_invites").select("*").eq("token", token).maybeSingle();
      if (!inv) { setStatus("error"); setMessage("Invite not found or expired."); return; }
      if (inv.status !== "pending") { setStatus("error"); setMessage(`This invite has been ${inv.status}.`); return; }
      if (inv.email.toLowerCase() !== user.email?.toLowerCase()) {
        setStatus("error");
        setMessage(`This invite is for ${inv.email}. Please sign in with that email.`);
        return;
      }
      const { data: comp } = await supabase.from("b2b_companies").select("*").eq("id", inv.company_id).maybeSingle();
      setInvite(inv); setCompany(comp); setStatus("ready");
    })();
  }, [token, user]);

  const accept = async () => {
    if (!user || !invite) return;
    const { error: memberErr } = await supabase.from("b2b_members").insert({
      company_id: invite.company_id, user_id: user.id, email: user.email,
    });
    if (memberErr && memberErr.code !== "23505") { toast.error(memberErr.message); return; }
    await supabase.from("b2b_invites").update({
      status: "accepted", accepted_by: user.id, accepted_at: new Date().toISOString(),
    }).eq("id", invite.id);
    setStatus("joined");
    toast.success(`Welcome to ${company?.company_name}!`);
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="font-serif">Join Your Company</CardTitle>
            <CardDescription>WellMind AI for Business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "loading" && <Loader2 className="w-6 h-6 animate-spin mx-auto" />}
            {status === "error" && (
              <div className="flex items-start gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 mt-0.5" /> {message}
              </div>
            )}
            {status === "joined" && (
              <div className="flex items-center gap-2 text-sm text-calm-sage">
                <Check className="w-4 h-4" /> Joined! Redirecting…
              </div>
            )}
            {status === "ready" && !user && (
              <>
                <p className="text-sm text-muted-foreground">Sign in with your work email to accept this invite.</p>
                <Button className="w-full" onClick={() => navigate(`/auth?redirect=/business/join?token=${token}`)}>
                  Sign In to Accept
                </Button>
              </>
            )}
            {status === "ready" && user && invite && company && (
              <>
                <p className="text-sm">You're invited to join <strong>{company.company_name}</strong> on WellMind AI.</p>
                <Button className="w-full" onClick={accept}>Accept & Join</Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
