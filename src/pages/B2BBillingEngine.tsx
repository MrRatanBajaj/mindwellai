import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSEO } from "@/hooks/useSEO";

type OrgType = "corporate" | "college" | "coaching";
type AuthStrategy = "domain_match" | "secure_passcode";

const PRICE: Record<OrgType, number> = { corporate: 149, college: 49, coaching: 79 };
const RZP_KEY = (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) ?? "";

// Razorpay is loaded via the checkout.js script; typed as any to avoid global collisions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RZP: any = (typeof window !== "undefined" ? (window as any).Razorpay : undefined);

const B2BBillingEngine = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState<OrgType>("corporate");
  const [authStrategy, setAuthStrategy] = useState<AuthStrategy>("domain_match");
  const [identifier, setIdentifier] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [seats, setSeats] = useState(50);
  const [busy, setBusy] = useState(false);

  useSEO({ title: "WellMind AI for Business — buy seats", description: "Activate WellMind AI for your company, college or coaching institute.", path: "/business/buy" });

  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/business/buy");
    if (user?.email) setAdminEmail(user.email);
  }, [user, loading, navigate]);

  useEffect(() => {
    if (document.getElementById("rzp-checkout")) return;
    const s = document.createElement("script");
    s.id = "rzp-checkout";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const total = useMemo(() => seats * PRICE[orgType], [seats, orgType]);

  const startCheckout = async () => {
    if (!orgName || !identifier || !adminEmail) return toast.error("Fill all fields.");
    if (!RZP_KEY) return toast.error("Razorpay key missing. Set VITE_RAZORPAY_KEY_ID.");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Rzp = (window as any).Razorpay ?? RZP;
    if (!Rzp) return toast.error("Payment script still loading. Try again in a second.");
    setBusy(true);
    const rzp = new Rzp({
      key: RZP_KEY,
      amount: total * 100,
      currency: "INR",
      name: "WellMind AI for Business",
      description: `${seats} premium seats — 1 year`,
      prefill: { email: adminEmail, name: orgName },
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }) => {
        const { data, error } = await supabase.functions.invoke("b2b-activate", {
          body: {
            organization_name: orgName,
            organization_type: orgType,
            admin_email: adminEmail,
            max_seats: seats,
            auth_strategy: authStrategy,
            identifier,
            ...response,
          },
        });
        setBusy(false);
        if (error || data?.error) return toast.error(data?.error ?? error?.message ?? "Activation failed");
        toast.success("Activated! Your team can now sign up.");
        navigate("/business/dashboard");
      },
      modal: { ondismiss: () => setBusy(false) },
    });
    rzp.open();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <section className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="font-hand text-3xl text-primary mb-2">for business.</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold">Activate WellMind AI for your team.</h1>
          </div>

          <div className="pastel-card bg-pastel-peach">
            <div className="grid gap-5">
              <div>
                <Label>Organization name</Label>
                <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Swiggy / Delhi University / FIITJEE" />
              </div>

              <div>
                <Label>Organization type</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["corporate", "college", "coaching"] as OrgType[]).map((t) => (
                    <button key={t} type="button" onClick={() => setOrgType(t)} className={`rounded-full border-2 border-foreground/70 py-2 text-sm capitalize ${orgType === t ? "bg-foreground text-background" : "bg-card"}`}>
                      {t} · ₹{PRICE[t]}/seat
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Admin email</Label>
                <Input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} type="email" />
              </div>

              <div>
                <Label>How will members verify?</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button type="button" onClick={() => setAuthStrategy("domain_match")} className={`rounded-full border-2 border-foreground/70 py-2 text-sm ${authStrategy === "domain_match" ? "bg-foreground text-background" : "bg-card"}`}>Work email domain</button>
                  <button type="button" onClick={() => setAuthStrategy("secure_passcode")} className={`rounded-full border-2 border-foreground/70 py-2 text-sm ${authStrategy === "secure_passcode" ? "bg-foreground text-background" : "bg-card"}`}>Secure passcode</button>
                </div>
                <Input className="mt-2" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder={authStrategy === "domain_match" ? "yourcompany.com" : "WM-FIITJEE-2026"} />
              </div>

              <div>
                <Label>Seats: <span className="font-display text-2xl">{seats}</span></Label>
                <input type="range" min={10} max={2000} step={10} value={seats} onChange={(e) => setSeats(parseInt(e.target.value))} className="w-full" />
              </div>

              <div className="rounded-2xl bg-card border-2 border-foreground/70 p-4 flex items-center justify-between">
                <span className="font-display text-lg">Total · 1 year</span>
                <span className="font-display text-3xl">₹{total.toLocaleString("en-IN")}</span>
              </div>

              <Button disabled={busy} onClick={startCheckout} className="h-12 rounded-full bg-foreground text-background border-2 border-foreground hover:bg-foreground/90 font-semibold">
                {busy ? "Processing…" : "Pay & activate"}
              </Button>
              <p className="text-xs text-foreground/60 text-center">Razorpay test mode supported. Server verifies the signature before activating.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default B2BBillingEngine;
