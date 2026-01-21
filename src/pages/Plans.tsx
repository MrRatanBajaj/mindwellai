
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Pricing from "@/components/ui-custom/Pricing";

const Plans = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6 animate-fade-in">
            Choose Your Plan
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance animate-fade-in">
            Start Your Mental Wellness Journey
          </h1>
          <p className="text-slate-600 text-lg mb-6 max-w-2xl mx-auto text-balance animate-fade-in">
            Select the plan that fits your needs. Begin with a free trial or choose one of our premium plans for comprehensive mental health support.
          </p>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-10 px-6 mb-20 flex-grow">
        <div className="max-w-7xl mx-auto">
          <Pricing />
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-mindwell-50 text-mindwell-700 font-medium text-xs mb-6">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Common Questions About Our Plans
            </h2>
          </div>
          
          <div className="space-y-6 animate-fade-in">
            {[
              {
                question: "What's included in the free trial?",
                answer: "The free trial includes 3 full counseling sessions with our AI therapist, a basic mental health assessment, and access to our meditation resources. It's a great way to experience the benefits of WellMindAI before committing to a paid plan."
              },
              {
                question: "Can I cancel my subscription at any time?",
                answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your subscription will remain active until the end of your current billing period."
              },
              {
                question: "How are the AI counseling sessions conducted?",
                answer: "Our AI counseling sessions are conducted through secure video calls with our virtual human avatars. The avatars use advanced natural language processing to provide personalized support and guidance for your mental health needs."
              },
              {
                question: "Is my information kept confidential?",
                answer: "Absolutely. We take your privacy seriously. All sessions and personal information are encrypted and kept strictly confidential. We comply with all relevant data protection regulations."
              },
              {
                question: "What if I need more than the allotted sessions?",
                answer: "If you need more sessions than your current plan allows, you can upgrade to a higher-tier plan at any time. The Premium Plan offers unlimited counseling sessions for those who need comprehensive support."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Plans;
