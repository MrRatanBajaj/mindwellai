import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PsychologyHero from "@/components/ui-custom/PsychologyHero";
import CallCommunicationHub from "@/components/ui-custom/CallCommunicationHub";
import TherapyMethodsSection from "@/components/ui-custom/TherapyMethodsSection";
import { RealtimeAnalytics } from "@/components/ui-custom/RealtimeAnalytics";
import { FeedbackForm } from "@/components/ui-custom/FeedbackForm";
import SmartNotification from "@/components/ui-custom/SmartNotification";
import { PushNotificationBanner } from "@/components/ui-custom/PushNotificationBanner";
import { LeadCapturePopup } from "@/components/ui-custom/LeadCapturePopup";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, Shield, Clock, Heart, Users, 
  MessageSquare, ArrowRight, CheckCircle, 
  Sparkles, Star, Quote
} from "lucide-react";

const Index = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Clinical Psychologist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
      quote: "The AI counselor uses evidence-based techniques that align with established therapeutic practices. Impressive technology.",
      rating: 5,
    },
    {
      name: "Michael Thompson",
      role: "Anxiety & Depression",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      quote: "After struggling for years, this platform gave me tools I actually use daily. The 24/7 availability changed everything.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Work Stress",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
      quote: "I was skeptical about AI therapy, but the conversations feel genuinely supportive. It's like having a therapist in my pocket.",
      rating: 5,
    },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Complete Privacy",
      description: "Your conversations are encrypted and never shared. We're fully HIPAA compliant.",
    },
    {
      icon: Clock,
      title: "Always Available",
      description: "Mental health doesn't follow a schedule. Get support any time, day or night.",
    },
    {
      icon: Brain,
      title: "Evidence-Based",
      description: "Our AI is trained on proven therapeutic techniques used by licensed professionals.",
    },
    {
      icon: Heart,
      title: "Judgment-Free",
      description: "Share anything without fear. Our AI provides unconditional positive regard.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Smart Zomato-style Notification */}
      <SmartNotification />
      
      {/* Lead Capture Popup - Auto collects visitor info */}
      <LeadCapturePopup />
      
      <Header />
      
      {/* Psychology-Driven Hero */}
      <PsychologyHero />

      {/* Call Communication Hub */}
      <CallCommunicationHub />

      {/* Therapy Methods Section */}
      <TherapyMethodsSection />

      {/* Why Choose Us - Psychology: Address objections */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-0 px-4 py-1.5">
              <Shield className="w-3 h-3 mr-1" />
              Why People Trust Us
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Built for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Your Peace of Mind</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                >
                  <item.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Analytics Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-0 px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-1" />
              Live Platform Activity
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Join Our Growing Community
            </h2>
            <p className="text-slate-600">
              See how our community is actively engaging with mental health support
            </p>
          </motion.div>
          <RealtimeAnalytics />
        </div>
      </section>

      {/* Testimonials - Psychology: Social proof with emotional connection */}
      <section className="py-24 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-0 px-4 py-1.5">
              <Heart className="w-3 h-3 mr-1" />
              Real Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Transforming Lives
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> Every Day</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <div className="h-full p-8 rounded-3xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-all">
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-purple-200 mb-4" />
                  
                  {/* Quote Text */}
                  <p className="text-slate-700 text-lg leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-100"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Psychology: Clear action, urgency, value */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Your Journey to Wellness
              <br />
              <span className="text-white/80">Starts Now</span>
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Take the first step today. Our AI counselors are ready to support you 
              with compassion, understanding, and proven techniques.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <NavLink to="/ai-voice-therapy">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-purple-700 hover:bg-white/90 shadow-xl px-8 py-6 text-lg font-semibold"
                >
                  Start Free Session
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </NavLink>
              <NavLink to="/plans">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  View Plans
                </Button>
              </NavLink>
            </div>

            <div className="flex items-center justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>100% confidential</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Share Your Feedback</h2>
            <p className="text-slate-600">Help us improve your experience</p>
          </motion.div>
          <FeedbackForm />
        </div>
      </section>

      <Footer />
      
      {/* Push Notification Banner */}
      <PushNotificationBanner />
    </div>
  );
};

export default Index;
