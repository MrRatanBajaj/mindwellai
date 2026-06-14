import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useSEO } from "@/hooks/useSEO";

const Policy = () => {
  useSEO({
    title: "Privacy Policy & Terms — WellMind AI",
    description: "Read WellMind AI's privacy policy and terms of service. Learn how we protect your mental health data with HIPAA-style safeguards and RLS.",
    path: "/policy",
  });


  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Privacy Policy & Terms
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your privacy and security are our top priorities. Learn how we protect your data and our terms of service.
          </p>
        </div>

        <div className="space-y-8">
          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold text-slate-900">Privacy Policy</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600 text-sm">
                WellMindAI ("we", "us") is operated by WellMindAI Technologies, India. This policy applies
                to users in India under the Digital Personal Data Protection Act, 2023 (DPDP Act) and to
                international users under GDPR (EU/UK), CCPA (California) and equivalent regulations.
              </p>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Information We Collect</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Account details — name, email, phone, password hash</li>
                  <li>Mental-health inputs — journal entries, mood, chat & call transcripts</li>
                  <li>Device & usage data — IP, browser, session timestamps</li>
                  <li>Payment metadata — handled by Razorpay (India) or Stripe (International). We never store full card numbers.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Legal Basis</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li><strong>India (DPDP Act):</strong> Processing on the basis of your free, specific, informed consent given at sign-up and cookie banner.</li>
                  <li><strong>EU/UK (GDPR):</strong> Consent (Art. 6(1)(a)) plus contract performance (Art. 6(1)(b)). Health data is processed under Art. 9(2)(a) explicit consent.</li>
                  <li><strong>California (CCPA/CPRA):</strong> We do not sell or share personal information. You may opt-out at privacy@wellmindai.in.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Data Security</h3>
                <p className="text-slate-600">
                  HIPAA-grade safeguards: TLS 1.3 in transit, AES-256 at rest, row-level security per user,
                  audit logging on every consultation, and per-user encryption keys for journal data. We do
                  not train AI models on your personal therapy content.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Your Rights</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Access, correct, port or erase your data (DPDP §11–14 / GDPR Art. 15–22)</li>
                  <li>Withdraw consent at any time — write to privacy@wellmindai.in</li>
                  <li>File a grievance with our Grievance Officer (India) within 30 days</li>
                  <li>Lodge a complaint with the Data Protection Board (India) or your local DPA (EU)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">International Data Transfer</h3>
                <p className="text-slate-600">
                  Data is stored on Supabase infrastructure (AWS Mumbai for Indian users, AWS Frankfurt for
                  EU users where applicable). Cross-border transfers use Standard Contractual Clauses.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Cancellation Policy */}
          <Card className="border-primary/40">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-slate-900">Subscription, Cancellation & Refund Policy</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600 text-sm">
                Applies to all paid plans (Student ₹99, Starter ₹299, Standard ₹499, Premium ₹999 — and USD
                equivalents for international users).
              </p>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">🇮🇳 For Users in India</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1.5 ml-4">
                  <li><strong>Auto-renewal:</strong> Subscriptions renew automatically per RBI e-mandate guidelines. You receive a 24-hour pre-debit SMS/email notification before every renewal.</li>
                  <li><strong>Cancellation:</strong> Cancel anytime from Dashboard → Subscription → "Cancel Plan". Cancellation is effective at the end of the current billing cycle; you keep access until then.</li>
                  <li><strong>Refund window:</strong> Full refund within <strong>7 days</strong> of first purchase if you have used less than 30 minutes of paid services. Processed to original Razorpay source in 5–7 business days.</li>
                  <li><strong>No refund:</strong> After 7 days, or once a Tavus video / counselor session is consumed beyond the trial cap, the current billing cycle is non-refundable.</li>
                  <li><strong>GST:</strong> 18% GST is included in the displayed INR price.</li>
                  <li><strong>Grievance Officer (India):</strong> Mr. Ratan Bajaj — grievance@wellmindai.in — response within 15 days as per IT Rules 2021.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">🌍 For International Users</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1.5 ml-4">
                  <li><strong>Auto-renewal:</strong> Subscriptions renew automatically via Stripe in USD. You receive an email receipt and renewal reminder 3 days before each cycle.</li>
                  <li><strong>Cancellation:</strong> Cancel anytime from Dashboard → Subscription, or via the Stripe customer portal link in your receipt. Access continues until the end of the paid period.</li>
                  <li><strong>EU / UK 14-day right of withdrawal:</strong> Per Consumer Rights Directive 2011/83/EU, EU/UK users may withdraw within 14 days of purchase for a full refund — provided digital services have not been substantially consumed. By starting a session within those 14 days you expressly waive the withdrawal right for that session's value.</li>
                  <li><strong>Refund window (rest of world):</strong> Full refund within <strong>14 days</strong> if usage is under 30 minutes of paid services. Processed to original card in 5–10 business days.</li>
                  <li><strong>Chargebacks:</strong> Please contact billing@wellmindai.in before raising a chargeback — we resolve 98% of issues within 48 hours.</li>
                  <li><strong>Local taxes (VAT/GST/Sales Tax):</strong> Where applicable, taxes are added at checkout based on your billing country.</li>
                </ul>
              </div>

              <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2 text-sm">How to cancel — both regions</h4>
                <ol className="list-decimal list-inside text-slate-600 text-sm space-y-1 ml-2">
                  <li>Sign in → open Dashboard</li>
                  <li>Click "Subscription" in the sidebar</li>
                  <li>Press "Cancel Plan" and confirm</li>
                  <li>You'll receive a confirmation email within 5 minutes</li>
                </ol>
                <p className="text-xs text-slate-500 mt-3">
                  Need help cancelling? Email <strong>billing@wellmindai.in</strong> — we'll process within 24 hours.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Terms of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Service Description</h3>
                <p className="text-slate-600">
                  WellMindAI provides AI-powered mental health support. It supplements — not replaces —
                  licensed clinical care. We are not a crisis service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">User Responsibilities</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Provide accurate information at sign-up</li>
                  <li>Use the platform for personal, non-commercial wellness</li>
                  <li>Do not share your login credentials</li>
                  <li>In an emergency, call iCall (India) 9152987821 or your local helpline immediately</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Limitations</h3>
                <p className="text-slate-600 mb-3">WellMindAI is not suitable for:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Crisis intervention or emergency situations</li>
                  <li>Clinical diagnosis or medication prescription</li>
                  <li>Treatment of severe psychiatric disorders</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                We use essential cookies for sign-in & security, and analytics cookies (only with your
                consent) to improve the product. Manage preferences via the cookie banner or your browser.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                If you have any questions about this Privacy Policy, Terms of Service, or Cookie Policy, 
                please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-slate-600"><strong>Privacy:</strong> privacy@wellmindai.in</p>
                <p className="text-slate-600"><strong>Billing & Cancellation:</strong> billing@wellmindai.in</p>
                <p className="text-slate-600"><strong>Grievance Officer (India):</strong> grievance@wellmindai.in</p>
                <p className="text-slate-600"><strong>Registered Office:</strong> WellMindAI Technologies, Purnia, Bihar, India</p>
              </div>
              <p className="text-slate-500 text-sm mt-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Policy;