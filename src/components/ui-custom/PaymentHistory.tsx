import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPayments(data || []);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return 'bg-emerald-100 text-emerald-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  const getPlanName = (planId: string) => {
    const plans: Record<string, string> = {
      'free-trial': 'Free Trial',
      'basic': 'Basic Plan',
      'premium': 'Premium Plan',
    };
    return plans[planId] || planId;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-slate-50 rounded-xl"
      >
        <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Payment History</h3>
        <p className="text-slate-600">Your payment records will appear here</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment, index) => (
        <motion.div
          key={payment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{getPlanName(payment.plan_id)}</h4>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(payment.created_at), 'MMM dd, yyyy • HH:mm')}</span>
                </div>
                {payment.payment_method && (
                  <p className="text-xs text-slate-400 mt-1">
                    via {payment.payment_method.toUpperCase()}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-slate-900">
                {payment.currency === 'INR' ? '₹' : payment.currency} {payment.amount}
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(payment.status)}`}>
                {getStatusIcon(payment.status)}
                <span className="capitalize">{payment.status}</span>
              </div>
            </div>
          </div>

          {payment.payment_id && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Transaction ID: {payment.payment_id}
              </p>
              <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">
                <Download className="w-4 h-4 mr-1" />
                Receipt
              </Button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default PaymentHistory;
