import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Policy = () => {
  useEffect(() => {
    document.title = "Privacy Policy & Terms - WellMindAI";
  }, []);

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
              <CardTitle className="text-2xl text-slate-900">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Information We Collect</h3>
                <p className="text-slate-600 mb-3">
                  We collect information you provide directly to us, such as when you create an account, 
                  schedule consultations, or communicate with our AI counselors. This may include:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Name, email address, and contact information</li>
                  <li>Mental health information shared during sessions</li>
                  <li>Usage data and session recordings for quality improvement</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">How We Use Your Information</h3>
                <p className="text-slate-600 mb-3">We use your information to:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Provide personalized mental health support and counseling services</li>
                  <li>Improve our AI algorithms and therapeutic approaches</li>
                  <li>Communicate with you about your appointments and our services</li>
                  <li>Ensure platform security and prevent unauthorized access</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Data Security</h3>
                <p className="text-slate-600">
                  We implement industry-standard security measures to protect your personal and health information. 
                  All data is encrypted in transit and at rest. We comply with HIPAA regulations and maintain 
                  strict confidentiality protocols for all therapeutic interactions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Your Rights</h3>
                <p className="text-slate-600 mb-3">You have the right to:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Access, update, or delete your personal information</li>
                  <li>Request a copy of your data</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
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
                  WellMindAI provides AI-powered mental health support and counseling services. Our platform 
                  is designed to supplement, not replace, traditional therapy and professional mental health care.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">User Responsibilities</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Provide accurate and truthful information</li>
                  <li>Use the service for its intended therapeutic purposes</li>
                  <li>Respect the privacy and confidentiality of the platform</li>
                  <li>Seek immediate professional help in case of mental health emergencies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Limitations of Service</h3>
                <p className="text-slate-600 mb-3">
                  Our AI counseling service has limitations and is not suitable for:
                </p>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li>Crisis intervention or emergency mental health situations</li>
                  <li>Diagnosis of mental health conditions</li>
                  <li>Prescription of medication</li>
                  <li>Treatment of severe mental health disorders requiring professional intervention</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Payment and Refunds</h3>
                <p className="text-slate-600">
                  Payment for services is processed securely through our payment partners. Refunds are available 
                  within 30 days of purchase, subject to our refund policy terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">What Are Cookies</h3>
                <p className="text-slate-600">
                  Cookies are small text files stored on your device that help us provide a better user experience. 
                  We use cookies to remember your preferences, analyze usage patterns, and improve our services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Types of Cookies We Use</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-1 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how users interact with our platform</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Analytics Cookies:</strong> Provide insights into platform usage and performance</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Managing Cookies</h3>
                <p className="text-slate-600">
                  You can control and manage cookies through your browser settings. However, disabling certain 
                  cookies may affect the functionality of our platform.
                </p>
              </div>
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
                <p className="text-slate-600">
                  <strong>Email:</strong> privacy@mindwellai.com
                </p>
                <p className="text-slate-600">
                  <strong>Address:</strong> 123 Mental Health Drive, Wellness City, WC 12345
                </p>
                <p className="text-slate-600">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
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