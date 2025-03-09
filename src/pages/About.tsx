
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Avatar from "@/components/ui-custom/Avatar";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Shield, Heart, Zap, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mt-10 lg:mt-0">
              <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6 animate-fade-in">
                About MindwellAI
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-balance animate-fade-in">
                Redefining Mental Health Support
              </h1>
              <p className="text-slate-600 text-lg mb-6 max-w-lg text-balance animate-fade-in">
                MindwellAI was created with one mission: to make quality mental health support accessible to everyone, everywhere, at any time.
              </p>
              <p className="text-slate-600 mb-8 max-w-lg text-balance animate-fade-in">
                Our platform combines advanced AI technology with evidence-based therapeutic approaches to provide personalized support for a wide range of mental health concerns.
              </p>
              <div className="animate-fade-in">
                <NavLink to="/consultation">
                  <Button className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
                    Book a Consultation
                  </Button>
                </NavLink>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative animate-fade-in">
                <div className="aspect-square max-w-lg mx-auto overflow-hidden rounded-3xl">
                  <img 
                    src="https://images.unsplash.com/photo-1552308995-2baac1ad5490?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                    alt="Team collaboration" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-mindwell-50 rounded-3xl -z-10"></div>
                <div className="absolute -top-6 -left-6 w-40 h-40 bg-slate-100 rounded-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              Our Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              What Drives Our Innovation
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-balance">
              At MindwellAI, our values guide everything we create and every interaction we design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Privacy & Security",
                description: "We prioritize your confidentiality with end-to-end encryption and strict data protection policies."
              },
              {
                icon: Heart,
                title: "Empathy",
                description: "Our AI counselors are designed to understand and respond to emotional needs with genuine care."
              },
              {
                icon: Zap,
                title: "Innovation",
                description: "We continuously refine our technology to provide the most effective therapeutic experience."
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We maintain high standards in our AI training, therapeutic approaches, and user experience."
              }
            ].map((value, index) => (
              <div key={index} className="glass-panel rounded-xl p-6 hover-lift animate-fade-in">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-mindwell-50 text-mindwell-600 mb-5">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Approach Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6 animate-fade-in">
                Our Therapeutic Approach
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance animate-fade-in">
                Science-Backed Methodology
              </h2>
              <p className="text-slate-600 mb-6 animate-fade-in">
                Our AI counselors utilize established therapeutic frameworks, including:
              </p>
              
              <div className="space-y-4 animate-fade-in">
                {[
                  {
                    title: "Cognitive Behavioral Therapy (CBT)",
                    description: "Helps identify and change negative thought patterns to improve emotional response and behavior."
                  },
                  {
                    title: "Mindfulness-Based Techniques",
                    description: "Incorporates present-moment awareness to reduce stress and anxiety."
                  },
                  {
                    title: "Solution-Focused Brief Therapy",
                    description: "Concentrates on finding solutions in the present and exploring hope for the future."
                  },
                  {
                    title: "Emotion-Focused Therapy",
                    description: "Helps identify, experience, express, and regulate emotions in a healthier way."
                  }
                ].map((approach, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-mindwell-200 transition-colors">
                    <h3 className="font-medium text-mindwell-700 mb-1">{approach.title}</h3>
                    <p className="text-sm text-slate-600">{approach.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="relative glass-panel rounded-3xl overflow-hidden shadow-lg border border-white/50 animate-fade-in">
                  <div className="aspect-video">
                    <img 
                      src="https://images.unsplash.com/photo-1551739440-5dd934d3a94a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                      alt="Therapeutic approach" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">Continuous Improvement</h3>
                      <p className="text-white/80 text-sm">Our AI counselors learn and adapt from interactions to provide increasingly personalized support.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              Our AI Counselors
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Meet Your Virtual Support Team
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-balance">
              Our AI counselors are designed with specific therapeutic specializations to provide tailored support for your unique needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Emma AI",
                specialty: "Anxiety & Stress Management",
                description: "Specialized in cognitive behavioral techniques for managing anxiety, panic, and stress-related concerns.",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
              },
              {
                name: "Dr. Marcus AI",
                specialty: "Depression & Mood Disorders",
                description: "Focused on evidence-based approaches for depression, bipolar disorder, and other mood-related challenges.",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
              },
              {
                name: "Dr. Sophia AI",
                specialty: "Relationship & Family Dynamics",
                description: "Expert in navigating relationship challenges, family conflicts, and interpersonal communication issues.",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&h=256&q=80"
              }
            ].map((counselor, index) => (
              <div key={index} className="glass-panel rounded-xl p-6 hover-lift animate-fade-in">
                <div className="flex flex-col items-center text-center mb-4">
                  <Avatar src={counselor.avatar} size="xl" status="online" />
                  <h3 className="text-xl font-semibold mt-4">{counselor.name}</h3>
                  <p className="text-mindwell-600 text-sm font-medium">{counselor.specialty}</p>
                </div>
                <p className="text-slate-600 text-sm text-center mb-6">{counselor.description}</p>
                <NavLink to="/consultation" className="block">
                  <Button variant="outline" className="w-full">
                    Schedule Session
                  </Button>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Common Questions
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-balance">
              Find answers to frequently asked questions about our platform, technology, and therapeutic approach.
            </p>
          </div>
          
          <div className="space-y-6 animate-fade-in">
            {[
              {
                question: "How do AI counselors compare to human therapists?",
                answer: "AI counselors provide evidence-based therapeutic approaches similar to human therapists, with the advantages of 24/7 availability and complete privacy. While they don't replace human connection, they offer valuable support, especially for those who face barriers to traditional therapy."
              },
              {
                question: "Is my conversation data secure and private?",
                answer: "Absolutely. We use end-to-end encryption for all sessions, and your data is never shared with third parties. You can also delete your conversation history at any time from your account settings."
              },
              {
                question: "What mental health issues can the platform help with?",
                answer: "Our AI counselors are trained to support a wide range of concerns including anxiety, depression, stress management, relationship issues, grief, and personal growth. However, they are not equipped to handle crisis situations or severe mental health conditions that require immediate intervention."
              },
              {
                question: "How are the sessions structured?",
                answer: "Sessions typically last 30-45 minutes and adapt to your needs. Each session begins with a check-in about your current state, followed by exploration of specific concerns and practical strategies or insights. You can choose video, audio, or text-based communication."
              },
              {
                question: "What if I need human support during a crisis?",
                answer: "Our platform includes clear pathways to human support in crisis situations. The AI is programmed to recognize signs of severe distress and will provide immediate resources for appropriate emergency services and crisis helplines."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-lg hover:border-mindwell-200 transition-colors">
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-mindwell-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance animate-fade-in">
            Begin Your Wellness Journey
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-balance animate-fade-in">
            Take the first step towards better mental well-being with personalized AI counseling sessions designed around your needs.
          </p>
          <div className="animate-fade-in">
            <NavLink to="/consultation">
              <Button size="lg" className="bg-mindwell-500 hover:bg-mindwell-600 text-white">
                Book Your First Session
              </Button>
            </NavLink>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
