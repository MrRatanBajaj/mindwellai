
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConsultationForm from "@/components/ui-custom/ConsultationForm";

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
            Take the first step toward better mental wellbeing. Fill out the form below to schedule your consultation with one of our AI counselors.
          </p>
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
                title: "24/7 Availability",
                description: "Access support whenever you need it, regardless of time zone or schedule constraints."
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
                title: "Consistent Support",
                description: "Benefit from consistent methodology and approach across all your sessions."
              },
              {
                title: "No Geographical Limitations",
                description: "Receive quality support regardless of your location or local availability of specialists."
              },
              {
                title: "Ongoing Improvement",
                description: "Our AI counselors continuously learn from interactions to provide increasingly effective support."
              }
            ].map((benefit, index) => (
              <div key={index} className="flex p-6 bg-white rounded-xl shadow-sm border border-slate-100 animate-fade-in">
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
      
      <Footer />
    </div>
  );
};

export default Consultation;
