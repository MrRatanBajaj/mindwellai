import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Play, AlertTriangle, Sparkles, Zap, Mail, MessageSquare, FileText, Users, Bot } from "lucide-react";
import { toast } from "sonner";

const ADMIN_EMAILS = ["ratankumar4937@gmail.com"];
const isAdmin = (email?: string | null) =>
  !!email && (ADMIN_EMAILS.includes(email.toLowerCase()) || email.toLowerCase().endsWith("@wellmindai.in") || email.toLowerCase().endsWith("@mindwellai.com"));

const MarketingAgentAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    const [s, sc, d, c, r, ch] = await Promise.all([
      supabase.from("agent_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("lead_scores").select("*").order("score", { ascending: false }).limit(50),
      supabase.from("marketing_drafts").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("content_drafts").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("agent_runs").select("*").order("started_at", { ascending: false }).limit(20),
      supabase.from("inbound_chat_sessions").select("*").order("updated_at", { ascending: false }).limit(20),
    ]);
    setSettings(s.data);
    setScores(sc.data ?? []);
    setDrafts(d.data ?? []);
    setContent(c.data ?? []);
    setRuns(r.data ?? []);
    setChats(ch.data ?? []);
  };

  useEffect(() => { if (user) load(); }, [user]);

  if (authLoading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin(user.email)) return <Navigate to="/dashboard" replace />;

  const run = async (action: string, label: string) => {
    setBusy(action);
    try {
      const { data, error } = await supabase.functions.invoke("marketing-agent", { body: { action } });
      if (error) throw error;
      toast.success(`${label}: ${JSON.stringify(data)}`);
      await load();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setBusy(null);
    }
  };

  const updateSettings = async (patch: any) => {
    const next = { ...settings, ...patch, updated_at: new Date().toISOString() };
    setSettings(next);
    await supabase.from("agent_settings").update(patch).eq("id", 1);
    toast.success("Settings updated");
  };

  const approveDraft = async (id: string) => {
    await supabase.from("marketing_drafts").update({ status: "queued" }).eq("id", id);
    load();
  };
  const rejectDraft = async (id: string) => {
    await supabase.from("marketing_drafts").update({ status: "skipped" }).eq("id", id);
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              AI Marketing & Sales Agent
            </h1>
            <p className="text-muted-foreground mt-1">Autonomous scoring, outbound, content & inbound chat — one hub.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => run("tick", "Autonomous tick")} disabled={!!busy}>
              {busy === "tick" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              Run autonomous cycle
            </Button>
          </div>
        </div>

        {/* Kill switch banner */}
        {settings && (
          <Card className="mb-6 border-2 border-primary/20">
            <CardContent className="pt-6 flex flex-wrap items-center gap-6 justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-5 h-5 ${settings.kill_switch ? "text-destructive" : "text-amber-500"}`} />
                <div>
                  <p className="font-semibold text-sm">Master kill-switch</p>
                  <p className="text-xs text-muted-foreground">When ON, all autonomous runs stop. Drafts stay editable.</p>
                </div>
                <Switch
                  checked={settings.kill_switch}
                  onCheckedChange={(v) => updateSettings({ kill_switch: v })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs">Autonomy</Label>
                <Badge variant={settings.autonomy_level === "autonomous" ? "destructive" : "secondary"}>
                  {settings.autonomy_level}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Outbound cap: {settings.daily_outbound_cap}/day</span>
                <span>Content cap: {settings.daily_content_cap}/day</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Users} label="Scored leads" value={scores.length} />
          <StatCard icon={Mail} label="Outbound drafts" value={drafts.filter(d => d.status === 'draft').length} />
          <StatCard icon={FileText} label="Content drafts" value={content.filter(c => c.status === 'draft').length} />
          <StatCard icon={MessageSquare} label="Inbound chats" value={chats.length} />
        </div>

        <Tabs defaultValue="outbound" className="space-y-4">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="outbound"><Mail className="w-4 h-4 mr-1" />Outbound</TabsTrigger>
            <TabsTrigger value="inbound"><MessageSquare className="w-4 h-4 mr-1" />Inbound</TabsTrigger>
            <TabsTrigger value="scoring"><Zap className="w-4 h-4 mr-1" />Lead scoring</TabsTrigger>
            <TabsTrigger value="content"><FileText className="w-4 h-4 mr-1" />Content engine</TabsTrigger>
            <TabsTrigger value="runs"><Sparkles className="w-4 h-4 mr-1" />Activity log</TabsTrigger>
          </TabsList>

          <TabsContent value="outbound">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Outbound drafts (WhatsApp / Email)</CardTitle>
                <Button size="sm" variant="outline" onClick={() => run("draft_outbound", "Generated drafts")} disabled={!!busy}>
                  {busy === "draft_outbound" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate now"}
                </Button>
              </CardHeader>
              <CardContent>
                {drafts.length === 0 && <p className="text-sm text-muted-foreground">No drafts yet. Run "Generate now" or "Run autonomous cycle".</p>}
                <div className="space-y-3">
                  {drafts.map((d) => (
                    <div key={d.id} className="border border-border rounded-lg p-4 bg-card">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Badge>{d.channel}</Badge>
                          <Badge variant="outline">{d.status}</Badge>
                          <span className="text-xs text-muted-foreground">→ {d.recipient}</span>
                        </div>
                        <div className="flex gap-2">
                          {d.status === "draft" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => rejectDraft(d.id)}>Skip</Button>
                              <Button size="sm" onClick={() => approveDraft(d.id)}>Approve & queue</Button>
                            </>
                          )}
                        </div>
                      </div>
                      {d.subject && <p className="text-sm font-semibold">{d.subject}</p>}
                      <p className="text-sm text-foreground/80 whitespace-pre-wrap">{d.body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inbound">
            <Card>
              <CardHeader><CardTitle>Inbound visitor chats (Mira)</CardTitle></CardHeader>
              <CardContent>
                {chats.length === 0 && <p className="text-sm text-muted-foreground">No conversations yet.</p>}
                <div className="space-y-3">
                  {chats.map((c) => (
                    <div key={c.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                        <span>{c.visitor_email ?? c.visitor_phone ?? "Anonymous"} — {(c.messages || []).length} msgs</span>
                        <span>{new Date(c.updated_at).toLocaleString()}</span>
                      </div>
                      <details>
                        <summary className="cursor-pointer text-sm font-medium">View transcript</summary>
                        <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
                          {(c.messages || []).map((m: any, i: number) => (
                            <p key={i} className="text-xs"><strong>{m.role}:</strong> {m.content}</p>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scoring">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lead scoring & next-best-action</CardTitle>
                <Button size="sm" variant="outline" onClick={() => run("score_leads", "Scored leads")} disabled={!!busy}>
                  {busy === "score_leads" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Score now"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {scores.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={s.temperature === "hot" ? "destructive" : s.temperature === "warm" ? "default" : "secondary"}>
                          {s.temperature} · {s.score}
                        </Badge>
                        <div>
                          <p className="text-sm font-mono">{s.lead_id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{s.reasoning}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{s.next_action}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>AI-drafted blog & social posts</CardTitle>
                <Button size="sm" variant="outline" onClick={() => run("generate_content", "Generated post")} disabled={!!busy}>
                  {busy === "generate_content" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Draft new post"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {content.map((c) => (
                    <div key={c.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <Badge>{c.kind}</Badge>
                        <Badge variant="outline">{c.status}</Badge>
                      </div>
                      <p className="font-semibold text-sm mb-1">{c.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-wrap">{c.body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="runs">
            <Card>
              <CardHeader><CardTitle>Autonomous run log</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {runs.map((r) => (
                    <div key={r.id} className="text-sm border border-border rounded-lg p-3 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <Badge variant={r.status === "completed" ? "default" : r.status === "failed" ? "destructive" : "secondary"}>
                          {r.status}
                        </Badge>
                        <span className="ml-2 font-mono text-xs">{r.run_kind}</span>
                        <p className="text-xs text-muted-foreground mt-1">{r.summary ?? r.error}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(r.started_at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: any) => (
  <Card>
    <CardContent className="pt-5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

export default MarketingAgentAdmin;
