import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);

function tempPassword() {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  return "Wm" + btoa(String.fromCharCode(...bytes)).replace(/[^a-zA-Z0-9]/g, "x") + "!7";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return json({ error: "Not signed in" }, 401);

    const asUser = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: userData } = await asUser.auth.getUser();
    const caller = userData?.user;
    if (!caller) return json({ error: "Not signed in" }, 401);

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Admins only" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action ?? "");

    if (action === "list_partners") {
      const { data, error } = await admin
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const { data: sessions } = await admin
        .from("partner_sessions")
        .select("partner_id, session_duration_minutes, revenue_amount");
      return json({ partners: data ?? [], sessions: sessions ?? [] });
    }

    if (action === "create_partner") {
      const name = String(body?.name ?? "").trim();
      const email = String(body?.email ?? "").trim().toLowerCase();
      const slug = slugify(String(body?.slug ?? name));
      const logo_url = body?.logo_url ? String(body.logo_url) : null;
      const tagline = body?.tagline ? String(body.tagline).slice(0, 180) : null;
      const primary_color = /^#[0-9a-fA-F]{6}$/.test(String(body?.primary_color ?? ""))
        ? String(body.primary_color)
        : "#10B981";
      const commission_percentage = Math.min(95, Math.max(0, Number(body?.commission_percentage ?? 20)));

      if (!name || name.length > 120) return json({ error: "Clinic or doctor name is required" }, 400);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "A valid email is required" }, 400);
      if (!slug) return json({ error: "A valid link name is required" }, 400);

      const RESERVED = [
        "about","admin","auth","blog","careers","chat","clinical-validation","compare","consultation",
        "dashboard","expired","journal","partner","payment","plans","policy","privacy","research",
        "subscription","terms","business","memorial-chat","c","alternatives",
      ];
      if (RESERVED.includes(slug)) return json({ error: `"${slug}" is reserved — pick another link name` }, 400);

      const { data: existing } = await admin
        .from("partners")
        .select("id")
        .or(`slug.eq.${slug},contact_email.eq.${email}`)
        .maybeSingle();
      if (existing) return json({ error: "That link name or email is already used by another partner" }, 400);

      // Reuse an existing auth account when the email is already registered.
      let partnerUserId: string | null = null;
      let password: string | null = tempPassword();
      const created = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: name, is_partner: true },
      });
      if (created.data?.user) {
        partnerUserId = created.data.user.id;
      } else {
        password = null;
        const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
        partnerUserId = list?.users?.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
      }

      const { data: partner, error } = await admin
        .from("partners")
        .insert({
          name, slug, logo_url, tagline, primary_color, contact_email: email,
          user_id: partnerUserId, commission_percentage,
        })
        .select()
        .single();
      if (error) throw error;

      if (partnerUserId) {
        await admin.from("user_roles").upsert(
          { user_id: partnerUserId, role: "partner" },
          { onConflict: "user_id,role" },
        );
      }

      return json({ partner, credentials: { email, password } });
    }

    if (action === "update_partner") {
      const id = String(body?.id ?? "");
      if (!id) return json({ error: "Missing partner" }, 400);
      const patch: Record<string, unknown> = {};
      if (body?.name) patch.name = String(body.name).slice(0, 120);
      if (body?.tagline !== undefined) patch.tagline = body.tagline ? String(body.tagline).slice(0, 180) : null;
      if (body?.logo_url !== undefined) patch.logo_url = body.logo_url ? String(body.logo_url) : null;
      if (/^#[0-9a-fA-F]{6}$/.test(String(body?.primary_color ?? ""))) patch.primary_color = String(body.primary_color);
      if (body?.commission_percentage !== undefined)
        patch.commission_percentage = Math.min(95, Math.max(0, Number(body.commission_percentage)));
      if (body?.is_active !== undefined) patch.is_active = !!body.is_active;

      const { data, error } = await admin.from("partners").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return json({ partner: data });
    }

    if (action === "reset_partner_password") {
      const id = String(body?.id ?? "");
      const { data: partner } = await admin.from("partners").select("user_id, contact_email").eq("id", id).maybeSingle();
      if (!partner?.user_id) return json({ error: "This partner has no login account yet" }, 400);
      const password = tempPassword();
      const { error } = await admin.auth.admin.updateUserById(partner.user_id, { password });
      if (error) throw error;
      return json({ credentials: { email: partner.contact_email, password } });
    }

    if (action === "settle_payout") {
      const requestId = String(body?.request_id ?? "");
      const { data: reqRow, error: reqErr } = await admin
        .from("partner_payout_requests")
        .update({ status: "paid" })
        .eq("id", requestId)
        .select("partner_id, amount")
        .single();
      if (reqErr) throw reqErr;
      const { data: p } = await admin.from("partners").select("total_paid_out").eq("id", reqRow.partner_id).single();
      await admin
        .from("partners")
        .update({ total_paid_out: Number(p?.total_paid_out ?? 0) + Number(reqRow.amount) })
        .eq("id", reqRow.partner_id);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("partner-admin error", e);
    return json({ error: e instanceof Error ? e.message : "Something went wrong" }, 500);
  }
});
