import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CreditCard, Calendar, CheckCircle, XCircle, Clock, Download, Receipt, Smartphone, Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlan } from "@/lib/pricing";

interface Payment {
  id: string;
  order_id: string;
  payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  plan_id: string;
  payment_method: string | null;
  created_at: string;
}

const methodIcon = (m: string | null) => {
  switch ((m || "").toLowerCase()) {
    case "upi": return <Smartphone className="w-4 h-4" />;
    case "wallet": return <Wallet className="w-4 h-4" />;
    default: return <CreditCard className="w-4 h-4" />;
  }
};

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from("payments").select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        setPayments(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const statusUI = (status: string) => {
    const ok = status === "completed" || status === "success";
    const fail = status === "failed";
    if (ok) return { Icon: CheckCircle, cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Paid" };
    if (fail) return { Icon: XCircle, cls: "bg-red-50 text-red-700 border-red-200", label: "Failed" };
    return { Icon: Clock, cls: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending" };
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
      </div>
    );
  }

  if (!payments.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 rounded-3xl bg-card border border-border"
      >
        <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-xl mb-2">No payments yet</h3>
        <p className="text-sm text-muted-foreground">Your invoices will appear here once you subscribe.</p>
      </motion.div>
    );
  }

  const total = payments
    .filter((p) => p.status === "completed" || p.status === "success")
    .reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Total spent</p>
          <p className="font-display text-2xl">₹{total.toLocaleString("en-IN")}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Transactions</p>
          <p className="font-display text-2xl">{payments.length}</p>
        </div>
      </div>

      {payments.map((p, i) => {
        const { Icon, cls, label } = statusUI(p.status);
        const plan = getPlan(p.plan_id);
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {methodIcon(p.payment_method)}
                </div>
                <div>
                  <h4 className="font-semibold">{plan?.name || p.plan_id}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(p.created_at), "MMM dd, yyyy · HH:mm")}
                  </div>
                  {p.payment_method && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 uppercase tracking-wide">
                      via {p.payment_method}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-xl">₹{p.amount}</div>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border mt-1 ${cls}`}>
                  <Icon className="w-3 h-3" /> {label}
                </div>
              </div>
            </div>
            {p.payment_id && (
              <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                <p className="text-[11px] text-muted-foreground truncate">
                  Txn: <span className="font-mono">{p.payment_id}</span>
                </p>
                <Button variant="ghost" size="sm" className="text-primary text-xs h-7">
                  <Download className="w-3 h-3 mr-1" /> Receipt
                </Button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default PaymentHistory;
