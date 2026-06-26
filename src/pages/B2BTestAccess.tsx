import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSEO } from "@/hooks/useSEO";

const CODES = Array.from({ length: 20 }, (_, i) => `EMP${String(i + 1).padStart(3, "0")}`);

const B2BTestAccess = () => {
  useSEO({ title: "B2B test access — TestCorp", description: "20 employee passcodes for testing the B2B flow.", path: "/business/test-access" });
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    toast.success(`Copied ${text}`);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-pastel-cream">
      <Header />
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="font-hand text-3xl text-primary mb-2">b2b test access.</p>
          <h1 className="font-display text-4xl font-semibold mb-2">TestCorp Pvt Ltd</h1>
          <p className="text-foreground/70 mb-8">20 employee seats · 90 days · premium tier</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="pastel-card">
              <h2 className="font-display text-xl mb-2">Method 1 · Work email domain</h2>
              <p className="text-sm text-foreground/70 mb-3">Sign up with any email ending in:</p>
              <code className="block bg-card border-2 border-foreground/70 rounded-xl px-4 py-3 font-mono text-lg">
                @testcorp.com
              </code>
              <p className="text-xs text-foreground/60 mt-3">
                e.g. <code>employee1@testcorp.com</code> → auto-onboards on first login (consumes one of 20 seats).
              </p>
            </div>

            <div className="pastel-card bg-pastel-peach">
              <h2 className="font-display text-xl mb-2">Method 2 · Secure passcodes</h2>
              <p className="text-sm text-foreground/70 mb-3">
                Sign up with any email, then redeem one of these codes via{" "}
                <code className="bg-card px-1.5 py-0.5 rounded">b2b-verify-member</code>.
              </p>
              <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto">
                {CODES.map((c) => (
                  <button
                    key={c}
                    onClick={() => copy(c)}
                    className="bg-card border border-foreground/40 rounded-lg px-2 py-1.5 text-xs font-mono hover:bg-foreground/10 flex items-center justify-between"
                  >
                    {c}
                    {copied === c ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 opacity-50" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pastel-card bg-pastel-sage">
            <h3 className="font-display text-lg mb-2">How to test</h3>
            <ol className="text-sm text-foreground/80 space-y-2 list-decimal pl-5">
              <li>Open incognito window and sign up with <code>employee1@testcorp.com</code> (any password).</li>
              <li>Once logged in, premium features auto-unlock — no payment screen.</li>
              <li>Or sign up with any email and call the <code>b2b-verify-member</code> edge function with one of the EMP codes above.</li>
              <li>Each successful signup consumes one seat. After 20 → 21st user sees "seat_limit_exceeded".</li>
            </ol>
            <Button asChild className="mt-4 rounded-full bg-foreground text-background hover:bg-foreground/90">
              <a href="/auth" target="_blank" rel="noreferrer">Open signup →</a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default B2BTestAccess;
