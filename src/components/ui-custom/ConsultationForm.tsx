
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Calendar, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const ConsultationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    concerns: "",
  });

  // Simulating a user with a free trial remaining (in a real app this would come from user account)
  const [freeSessionsRemaining] = useState(3);
  const hasFreeTrialActive = freeSessionsRemaining > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const goToNextStep = () => {
    if (currentStep === 1 && (!formData.name || !formData.email)) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      toast.error("Please select a date and time");
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the data to your backend
    console.log({
      ...formData,
      date: selectedDate,
      time: selectedTime,
    });
    
    if (hasFreeTrialActive) {
      toast.success(`Consultation scheduled successfully! You have ${freeSessionsRemaining - 1} free sessions remaining.`);
    } else {
      toast.success("Consultation scheduled successfully!");
    }
    
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      concerns: "",
    });
    setSelectedDate("");
    setSelectedTime("");
    setCurrentStep(1);
  };

  const handleUpgradePlan = () => {
    navigate("/plans");
  };

  // Generate dates for the next 7 days
  const getNextSevenDays = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      
      const formattedDate = nextDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      
      dates.push(formattedDate);
    }
    
    return dates;
  };

  const renderStep1 = () => (
    <div className="space-y-4 animate-fade-in">
      {hasFreeTrialActive && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
          <Info className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800 font-medium">Free Trial Active</p>
            <p className="text-green-700 text-sm">You have {freeSessionsRemaining} free counseling sessions remaining.</p>
          </div>
        </div>
      )}
      
      {!hasFreeTrialActive && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
          <Info className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-medium">No Active Plan</p>
            <p className="text-amber-700 text-sm">You don't have an active subscription plan.</p>
            <Button 
              variant="link" 
              className="text-mindwell-600 p-0 h-auto text-sm"
              onClick={handleUpgradePlan}
            >
              View available plans
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="glass-input"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="glass-input"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="+1 (123) 456-7890"
          value={formData.phone}
          onChange={handleInputChange}
          className="glass-input"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="concerns">Primary Concerns</Label>
        <Textarea
          id="concerns"
          name="concerns"
          placeholder="Please briefly describe what you'd like to discuss in your consultation"
          value={formData.concerns}
          onChange={handleInputChange}
          className="glass-input min-h-[120px]"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Label className="block mb-3">Select a Date <span className="text-red-500">*</span></Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
          {getNextSevenDays().map((date) => (
            <button
              key={date}
              type="button"
              className={cn(
                "p-3 rounded-lg border transition-all duration-200 text-sm flex flex-col items-center justify-center",
                selectedDate === date
                  ? "border-mindwell-400 bg-mindwell-50 text-mindwell-800"
                  : "border-slate-200 hover:border-slate-300"
              )}
              onClick={() => setSelectedDate(date)}
            >
              <Calendar className="w-4 h-4 mb-1" />
              {date}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="block mb-3">Select a Time <span className="text-red-500">*</span></Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              type="button"
              className={cn(
                "p-3 rounded-lg border transition-all duration-200 text-sm flex items-center justify-center",
                selectedTime === time
                  ? "border-mindwell-400 bg-mindwell-50 text-mindwell-800"
                  : "border-slate-200 hover:border-slate-300"
              )}
              onClick={() => setSelectedTime(time)}
            >
              <Clock className="w-4 h-4 mr-2" />
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-mindwell-50 p-6 rounded-lg border border-mindwell-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Check className="w-5 h-5 text-mindwell-600 mr-2" />
          Consultation Summary
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Full Name</p>
              <p className="font-medium">{formData.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Phone Number</p>
              <p className="font-medium">{formData.phone || "Not provided"}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Scheduled Date & Time</p>
              <p className="font-medium">{selectedDate} at {selectedTime}</p>
            </div>
          </div>
          
          {formData.concerns && (
            <div>
              <p className="text-sm text-slate-500">Primary Concerns</p>
              <p className="font-medium">{formData.concerns}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <p className="text-sm text-slate-600">
          By clicking "Confirm Consultation", you agree to our Terms of Service and Privacy Policy. You will receive a confirmation email with further instructions.
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className="flex flex-col items-center"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep === step
                  ? "bg-mindwell-500 text-white"
                  : currentStep > step
                  ? "bg-mindwell-100 text-mindwell-700 border-2 border-mindwell-500"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {currentStep > step ? <Check className="w-5 h-5" /> : step}
            </div>
            <span className="text-xs mt-2 font-medium text-slate-600">
              {step === 1 ? "Personal Info" : step === 2 ? "Schedule" : "Confirm"}
            </span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        
        <div className="mt-8 flex justify-between">
          {currentStep > 1 ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={goToPreviousStep}
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {currentStep < 3 ? (
            <Button 
              type="button" 
              onClick={goToNextStep}
              className="bg-mindwell-500 hover:bg-mindwell-600 text-white"
            >
              Continue
            </Button>
          ) : (
            <Button 
              type="submit"
              className="bg-mindwell-500 hover:bg-mindwell-600 text-white"
            >
              Confirm Consultation
            </Button>
          )}
        </div>

        {!hasFreeTrialActive && currentStep === 1 && (
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm mb-2">Don't have an active plan?</p>
            <Button 
              type="button" 
              variant="outline"
              className="border-mindwell-200 text-mindwell-700"
              onClick={handleUpgradePlan}
            >
              View Available Plans
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ConsultationForm;
