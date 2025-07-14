
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConsultationForm from "@/components/ui-custom/ConsultationForm";
import MentalHealthChat from "@/components/ui-custom/MentalHealthChat";

const Consultation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6 animate-fade-in">
            Book a Consultation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-fade-in">
            Schedule Your Virtual Session
          </h1>
          <p className="text-slate-600 text-lg mb-6 max-w-2xl mx-auto text-balance animate-fade-in">
            Take the first step toward better mental wellbeing. Fill out the form below to schedule your consultation with one of our AI counselors, or try our live AI chat for immediate support.
          </p>
          
          {/* Live AI Chat CTA */}
          <div className="bg-gradient-to-r from-mindwell-50 to-blue-50 rounded-xl p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-mindwell-700 font-semibold">Live AI Mental Health Support</span>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Get instant support from our AI trained on mental health data. Available 24/7 for immediate assistance.
            </p>
            <p className="text-xs text-slate-500">
              Click the chat icon in the bottom right corner to start talking
            </p>
          </div>
        </div>
      </section>
      
      {/* Form Section */}
      <section className="py-10 px-6 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel rounded-xl p-6 md:p-10 shadow-lg animate-fade-in">
            <ConsultationForm />
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Benefits of MindwellAI Consultations
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-balance">
              Our virtual consultation approach offers unique advantages for your mental health journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "24/7 AI Chat Support",
                description: "Access trained AI mental health support instantly through our live chat, available around the clock."
              },
              {
                title: "Human-Like Conversations",
                description: "Our AI is trained on extensive mental health data to provide natural, empathetic responses that don't feel robotic."
              },
              {
                title: "Complete Privacy",
                description: "Enjoy sessions from the comfort and privacy of your own space, with encrypted communications."
              },
              {
                title: "Personalized Approach",
                description: "Our AI adapts to your unique needs, communication style, and therapeutic goals."
              },
              {
                title: "Continuous Learning",
                description: "Our AI continuously learns from mental health interactions to provide increasingly effective support."
              },
              {
                title: "Immediate Response",
                description: "No waiting times - get instant mental health support when you need it most."
              }
            ].map((benefit, index) => (
              <div key={index} className="flex p-6 bg-white rounded-xl shadow-sm border border-slate-100 animate-fade-in hover:shadow-md transition-shadow">
                <div className="mr-4 w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-mindwell-50">
                  <span className="text-mindwell-600 font-semibold">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Live AI Chat Component */}
      <MentalHealthChat />
      
      <Footer />
    </div>
  );
};

export default Consultation;
