import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type B2BAccess = "premium" | "expired" | "b2c" | "none";

export interface B2BCompanyInfo {
  id: string;
  name: string;
  client_type: "university" | "insurance" | "corporate" | "startup" | "trial";
  expires_at: string | null;
}

/** Calls the b2b-gatekeeper edge function to determine the user's B2B status. */
export function useB2BAccess() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState<B2BAccess>("none");
  const [company, setCompany] = useState<B2BCompanyInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setAccess("none");
      setCompany(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("b2b-gatekeeper", { body: {} });
        if (cancelled) return;
        setAccess((data?.access as B2BAccess) ?? "none");
        setCompany((data?.company as B2BCompanyInfo) ?? null);
      } catch {
        if (!cancelled) setAccess("none");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { loading, access, company };
}
