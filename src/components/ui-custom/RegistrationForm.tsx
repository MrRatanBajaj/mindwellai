
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Calendar, Heart, Shield } from "lucide-react";
import { toast } from "sonner";

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  emergencyContact: string;
  emergencyPhone: string;
  mentalHealthHistory: string;
  currentMedications: string;
  concerns: string;
  preferredLanguage: string;
  consentGiven: boolean;
  privacyAccepted: boolean;
}

interface RegistrationFormProps {
  onComplete: (data: RegistrationData) => void;
}

const RegistrationForm = ({ onComplete }: RegistrationFormProps) => {
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    emergencyContact: "",
    emergencyPhone: "",
    mentalHealthHistory: "",
    currentMedications: "",
    concerns: "",
    preferredLanguage: "English",
    consentGiven: false,
    privacyAccepted: false,
  });

  const handleInputChange = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consentGiven || !formData.privacyAccepted) {
      toast.error("Please accept consent and privacy terms to continue");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Registration completed successfully!");
    onComplete(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-mindwell-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-mindwell-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Client Registration</CardTitle>
        <CardDescription>
          Please complete your registration to access our counseling services
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="w-5 h-5 mr-2 text-mindwell-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  className="glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="glass-input">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Phone className="w-5 h-5 mr-2 text-mindwell-600" />
              Emergency Contact
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Heart className="w-5 h-5 mr-2 text-mindwell-600" />
              Medical Information
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mentalHealthHistory">Mental Health History</Label>
                <Textarea
                  id="mentalHealthHistory"
                  value={formData.mentalHealthHistory}
                  onChange={(e) => handleInputChange("mentalHealthHistory", e.target.value)}
                  placeholder="Please describe any previous mental health treatment or diagnoses"
                  className="glass-input min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  value={formData.currentMedications}
                  onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                  placeholder="List any medications you are currently taking"
                  className="glass-input min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="concerns">Primary Concerns</Label>
                <Textarea
                  id="concerns"
                  value={formData.concerns}
                  onChange={(e) => handleInputChange("concerns", e.target.value)}
                  placeholder="What would you like to work on in counseling?"
                  className="glass-input min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Consent and Privacy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Shield className="w-5 h-5 mr-2 text-mindwell-600" />
              Consent & Privacy
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consentGiven}
                  onCheckedChange={(checked) => handleInputChange("consentGiven", !!checked)}
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed">
                  I consent to receive mental health counseling services and understand that all sessions will be conducted by AI counselors with human oversight when necessary.
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacy"
                  checked={formData.privacyAccepted}
                  onCheckedChange={(checked) => handleInputChange("privacyAccepted", !!checked)}
                />
                <Label htmlFor="privacy" className="text-sm leading-relaxed">
                  I have read and accept the Privacy Policy and Terms of Service. I understand how my personal information will be used and protected.
                </Label>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-mindwell-500 hover:bg-mindwell-600 text-white py-3"
            size="lg"
          >
            Complete Registration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
