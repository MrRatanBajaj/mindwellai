import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, AlertTriangle, MapPin, ShoppingCart, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Medication {
  id: string;
  name: string;
  description: string | null;
  dosage: string | null;
  price: number;
  stock_quantity: number;
  requires_prescription: boolean;
  category: string | null;
  manufacturer: string | null;
  image_url: string | null;
}

interface Prescription {
  id: string;
  verification_status: string;
  ai_verification_result: any;
}

export default function MedicineStore() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMeds, setFilteredMeds] = useState<Medication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [userPrescription, setUserPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    fetchMedications();
    if (user) {
      checkExistingPrescription();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMeds(medications);
    } else {
      const filtered = medications.filter(med =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMeds(filtered);
    }
  }, [searchQuery, medications]);

  const fetchMedications = async () => {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .gt('stock_quantity', 0)
      .order('name');

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load medications',
        variant: 'destructive',
      });
    } else {
      setMedications(data || []);
      setFilteredMeds(data || []);
    }
  };

  const checkExistingPrescription = async () => {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('user_id', user?.id)
      .eq('verification_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setUserPrescription(data);
    }
  };

  const handlePrescriptionUpload = async () => {
    if (!prescriptionFile || !user) {
      toast({
        title: 'Error',
        description: 'Please select a prescription file',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload prescription to storage
      const fileExt = prescriptionFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('prescriptions')
        .upload(fileName, prescriptionFile);

      if (uploadError) throw uploadError;

      // Create prescription record
      const { data: prescription, error: insertError } = await supabase
        .from('prescriptions')
        .insert({
          user_id: user.id,
          prescription_image_url: fileName,
          verification_status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Call verification function
      const { data: verificationData, error: verificationError } = await supabase.functions.invoke(
        'verify-prescription',
        {
          body: {
            prescriptionId: prescription.id,
            prescriptionImageUrl: fileName,
          },
        }
      );

      if (verificationError) throw verificationError;

      toast({
        title: 'Prescription Submitted',
        description: 'Your prescription is being verified by our AI system.',
      });

      // Refresh prescription status
      setTimeout(() => checkExistingPrescription(), 3000);
      setShowPrescriptionDialog(false);
      setPrescriptionFile(null);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload prescription',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePurchase = async (medication: Medication) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to purchase medications',
        variant: 'destructive',
      });
      return;
    }

    if (medication.requires_prescription && !userPrescription) {
      setSelectedMed(medication);
      setShowPrescriptionDialog(true);
      return;
    }

    // Process order
    const totalPrice = medication.price * quantity;

    const { error } = await supabase
      .from('medication_orders')
      .insert({
        user_id: user.id,
        prescription_id: medication.requires_prescription ? userPrescription?.id : null,
        medication_id: medication.id,
        quantity,
        total_price: totalPrice,
        delivery_address: deliveryAddress,
        status: 'pending',
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Order Placed',
        description: 'Your medication order has been placed successfully',
      });
      setSelectedMed(null);
      setQuantity(1);
      setDeliveryAddress('');
    }
  };

  const openGoogleMaps = () => {
    window.open('https://www.google.com/maps/search/doctors+near+me', '_blank');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Disclaimer Alert */}
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Medical Disclaimer</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              <strong>DO NOT USE THESE MEDICATIONS WITHOUT DOCTOR CONSULTATION</strong>
            </p>
            <p>
              All prescription medications require a valid prescription from a licensed medical professional.
              Self-medication can be dangerous to your health. Always consult with a doctor before taking any medication.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={openGoogleMaps}
              className="mt-2"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Find Nearby Doctors
            </Button>
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Medicine Store</h1>
            <p className="text-muted-foreground">Browse and purchase medications with valid prescriptions</p>
          </div>
          {userPrescription && (
            <Badge variant="default" className="text-lg p-3">
              ✓ Prescription Verified
            </Badge>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Medications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeds.map((medication) => (
            <Card key={medication.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{medication.name}</CardTitle>
                  {medication.requires_prescription && (
                    <Badge variant="secondary">Rx Required</Badge>
                  )}
                </div>
                <CardDescription>{medication.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{medication.description}</p>
                {medication.dosage && (
                  <p className="text-sm"><strong>Dosage:</strong> {medication.dosage}</p>
                )}
                {medication.manufacturer && (
                  <p className="text-sm"><strong>Manufacturer:</strong> {medication.manufacturer}</p>
                )}
                <p className="text-2xl font-bold text-primary">₹{medication.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Stock: {medication.stock_quantity} units</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    setSelectedMed(medication);
                    if (medication.requires_prescription && !userPrescription) {
                      setShowPrescriptionDialog(true);
                    }
                  }}
                  className="w-full"
                  disabled={!user}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Purchase
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Prescription Upload Dialog */}
        <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Prescription</DialogTitle>
              <DialogDescription>
                This medication requires a valid prescription. Please upload your doctor's prescription for AI verification.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Our AI system will verify your prescription. If rejected, please consult a nearby doctor.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prescription Image</label>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handlePrescriptionUpload}
                  disabled={!prescriptionFile || isUploading}
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? 'Uploading...' : 'Upload & Verify'}
                </Button>
                <Button
                  variant="outline"
                  onClick={openGoogleMaps}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Doctor
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Purchase Dialog */}
        {selectedMed && userPrescription && (
          <Dialog open={!!selectedMed} onOpenChange={() => setSelectedMed(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Complete Purchase</DialogTitle>
                <DialogDescription>
                  {selectedMed.name} - ₹{selectedMed.price.toFixed(2)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    max={selectedMed.stock_quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Address</label>
                  <Textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                  />
                </div>
                <div className="text-lg font-bold">
                  Total: ₹{(selectedMed.price * quantity).toFixed(2)}
                </div>
                <Button
                  onClick={() => handlePurchase(selectedMed)}
                  className="w-full"
                  disabled={!deliveryAddress}
                >
                  Confirm Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}