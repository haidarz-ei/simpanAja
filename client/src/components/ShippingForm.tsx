import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Package, Truck, CheckCircle } from "lucide-react";
import Step1DataPaket from "./Step1DataPaket";
import Step2Kurir from "./Step2Kurir";
import Step3KodePaket from "./Step3KodePaket";
import { packageService } from "@/lib/packageService";
import { toast } from "@/hooks/use-toast";

// Mock data - TODO: replace with API calls
const mockCouriers = [
  { courier: "JNE", service: "REG", price: 15000, estimatedDays: "2-3 hari", code: "jne-reg" },
  { courier: "JNE", service: "YES", price: 20000, estimatedDays: "1-2 hari", code: "jne-yes" },
  { courier: "J&T", service: "EZ", price: 12000, estimatedDays: "3-4 hari", code: "jnt-ez" },
  { courier: "J&T", service: "REG", price: 14000, estimatedDays: "2-3 hari", code: "jnt-reg" },
  { courier: "SiCepat", service: "REG", price: 14000, estimatedDays: "2-3 hari", code: "sicepat-reg" },
  { courier: "SiCepat", service: "BEST", price: 18000, estimatedDays: "1-2 hari", code: "sicepat-best" },
  { courier: "TIKI", service: "REG", price: 16000, estimatedDays: "2-4 hari", code: "tiki-reg" },
  { courier: "TIKI", service: "ONS", price: 22000, estimatedDays: "1 hari", code: "tiki-ons" },
  { courier: "POS Indonesia", service: "Paket Kilat Khusus", price: 18000, estimatedDays: "3-5 hari", code: "pos-kilat" },
  { courier: "Wahana", service: "REG", price: 13000, estimatedDays: "2-3 hari", code: "wahana-reg" },
];

const mockOffices = [
  { id: "office-1", name: "Kantor Ekspedisi Jakarta Pusat", address: "Jl. Sudirman No. 123, Jakarta Pusat" },
  { id: "office-2", name: "Kantor Ekspedisi Jakarta Selatan", address: "Jl. Thamrin No. 456, Jakarta Selatan" },
  { id: "office-3", name: "Kantor Ekspedisi Jakarta Utara", address: "Jl. Gatot Subroto No. 789, Jakarta Utara" },
];

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  district: string;
  postalCode: string;
  type: "sender" | "receiver";
};

export default function ShippingForm() {
  const [, navigate] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const isNewPackage = urlParams.get('new') === 'true';
  const editPackageId = urlParams.get('edit');

  const [step, setStep] = useState<number>(1);
  const [selectedCourierName, setSelectedCourierName] = useState<string | undefined>(undefined);
  const [selectedServiceCode, setSelectedServiceCode] = useState<string | undefined>(undefined);
  const [packageCode, setPackageCode] = useState("");
  const [packingOptions, setPackingOptions] = useState<string[]>([]);
  const [currentPackageId, setCurrentPackageId] = useState<string | null>(null);

  // Address management
  const [addressHistory, setAddressHistory] = useState<Address[]>([]);
  const [selectedSenderAddress, setSelectedSenderAddress] = useState<Address | null>(null);
  const [selectedReceiverAddress, setSelectedReceiverAddress] = useState<Address | null>(null);
  const [showSenderModal, setShowSenderModal] = useState(false);
  const [showReceiverModal, setShowReceiverModal] = useState(false);
  const [showSenderHistory, setShowSenderHistory] = useState(false);
  const [showReceiverHistory, setShowReceiverHistory] = useState(false);
  const [showSenderInputModal, setShowSenderInputModal] = useState(false);
  const [showReceiverInputModal, setShowReceiverInputModal] = useState(false);
  const [searchSenderHistory, setSearchSenderHistory] = useState("");
  const [searchReceiverHistory, setSearchReceiverHistory] = useState("");
  const [editingSenderId, setEditingSenderId] = useState<string | null>(null);
  const [editingReceiverId, setEditingReceiverId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    senderCity: "",
    senderProvince: "",
    senderDistrict: "",
    senderPostalCode: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverCity: "",
    receiverProvince: "",
    receiverDistrict: "",
    receiverPostalCode: "",
    packageWeight: "",
    packageLength: "",
    packageWidth: "",
    packageHeight: "",
    packageDescription: "",
  });

  // Auto-save state
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load address history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('addressHistory');
    if (savedHistory) {
      setAddressHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save address history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('addressHistory', JSON.stringify(addressHistory));
  }, [addressHistory]);

  // Load incomplete packages on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isNewPackage = urlParams.get('new') === 'true';
    const editPackageId = urlParams.get('edit');

    const loadPackageData = async () => {
      try {
        if (isNewPackage) {
          // Creating new package - reset everything and don't load any existing data
          setCurrentPackageId(null);
          setStep(1);
          setFormData({
            senderName: "",
            senderPhone: "",
            senderAddress: "",
            senderCity: "",
            senderProvince: "",
            senderDistrict: "",
            senderPostalCode: "",
            receiverName: "",
            receiverPhone: "",
            receiverAddress: "",
            receiverCity: "",
            receiverProvince: "",
            receiverDistrict: "",
            receiverPostalCode: "",
            packageWeight: "",
            packageLength: "",
            packageWidth: "",
            packageHeight: "",
            packageDescription: "",
          });
          setSelectedCourierName(undefined);
          setSelectedServiceCode(undefined);
          setPackingOptions([]);
          setPackageCode("");
          // Don't load any incomplete packages for new package creation
        } else if (editPackageId) {
          // Editing specific package
          const pkg = await packageService.getPackageById(editPackageId);
          if (pkg) {
            setCurrentPackageId(pkg.id);
            setStep(pkg.step_completed || 1);

            // Restore form data
            setFormData({
              senderName: pkg.sender_name || "",
              senderPhone: pkg.sender_phone || "",
              senderAddress: pkg.sender_address || "",
              senderCity: pkg.sender_city || "",
              senderProvince: pkg.sender_province || "",
              senderDistrict: pkg.sender_district || "",
              senderPostalCode: pkg.sender_postal_code || "",
              receiverName: pkg.receiver_name || "",
              receiverPhone: pkg.receiver_phone || "",
              receiverAddress: pkg.receiver_address || "",
              receiverCity: pkg.receiver_city || "",
              receiverProvince: pkg.receiver_province || "",
              receiverDistrict: pkg.receiver_district || "",
              receiverPostalCode: pkg.receiver_postal_code || "",
              packageWeight: pkg.package_weight || "",
              packageLength: pkg.package_length || "",
              packageWidth: pkg.package_width || "",
              packageHeight: pkg.package_height || "",
              packageDescription: pkg.package_description || "",
            });

            // Restore selections
            setSelectedCourierName(pkg.courier_name || undefined);
            setSelectedServiceCode(pkg.courier_service_code || undefined);
            setPackingOptions(pkg.packing_options || []);
            setPackageCode(pkg.tracking_code || "");

            toast({
              title: "Paket ditemukan",
              description: "Melanjutkan pengisian formulir yang belum selesai.",
            });
          }
        } else {
          // Default behavior - load most recent incomplete package only if not explicitly creating new
          const incompletePackage = await packageService.getIncompletePackage();
          if (incompletePackage) {
            setCurrentPackageId(incompletePackage.id);
            setStep(incompletePackage.step_completed || 1);

            // Restore form data
            setFormData({
              senderName: incompletePackage.sender_name || "",
              senderPhone: incompletePackage.sender_phone || "",
              senderAddress: incompletePackage.sender_address || "",
              senderCity: incompletePackage.sender_city || "",
              senderProvince: incompletePackage.sender_province || "",
              senderDistrict: incompletePackage.sender_district || "",
              senderPostalCode: incompletePackage.sender_postal_code || "",
              receiverName: incompletePackage.receiver_name || "",
              receiverPhone: incompletePackage.receiver_phone || "",
              receiverAddress: incompletePackage.receiver_address || "",
              receiverCity: incompletePackage.receiver_city || "",
              receiverProvince: incompletePackage.receiver_province || "",
              receiverDistrict: incompletePackage.receiver_district || "",
              receiverPostalCode: incompletePackage.receiver_postal_code || "",
              packageWeight: incompletePackage.package_weight || "",
              packageLength: incompletePackage.package_length || "",
              packageWidth: incompletePackage.package_width || "",
              packageHeight: incompletePackage.package_height || "",
              packageDescription: incompletePackage.package_description || "",
            });

            // Restore selections
            setSelectedCourierName(incompletePackage.courier_name || undefined);
            setSelectedServiceCode(incompletePackage.courier_service_code || undefined);
            setPackingOptions(incompletePackage.packing_options || []);
            setPackageCode(incompletePackage.tracking_code || "");

            toast({
              title: "Paket ditemukan",
              description: "Melanjutkan pengisian formulir yang belum selesai.",
            });
          }
        }
      } catch (error) {
        console.error('Error loading package data:', error);
        // Don't show error toast for now to avoid confusion
        // toast({
        //   title: "Error",
        //   description: "Gagal memuat data paket.",
        //   variant: "destructive",
        // });
      }
    };

    loadPackageData();
  }, []);

  const performAutoSave = async () => {
    if (isAutoSaving) return; // Prevent multiple concurrent auto-saves

    setIsAutoSaving(true);
    try {
      const packageData = {
        sender_name: formData.senderName,
        sender_phone: formData.senderPhone,
        sender_address: formData.senderAddress,
        sender_city: formData.senderCity,
        sender_province: formData.senderProvince,
        sender_district: formData.senderDistrict,
        sender_postal_code: formData.senderPostalCode,
        receiver_name: formData.receiverName,
        receiver_phone: formData.receiverPhone,
        receiver_address: formData.receiverAddress,
        receiver_city: formData.receiverCity,
        receiver_province: formData.receiverProvince,
        receiver_district: formData.receiverDistrict,
        receiver_postal_code: formData.receiverPostalCode,
        package_weight: formData.packageWeight,
        package_length: formData.packageLength,
        package_width: formData.packageWidth,
        package_height: formData.packageHeight,
        package_description: formData.packageDescription,
        courier_name: selectedCourierName,
        courier_service_code: selectedServiceCode,
        packing_options: packingOptions,
      };

      const savedPackage = await packageService.autoSavePackage(packageData, step);
      setCurrentPackageId(savedPackage.id);
      console.log('Auto-saved package:', savedPackage.id);
    } catch (error) {
      console.error('Error auto-saving package:', error as Error);
      // Don't show toast for auto-save errors to avoid annoying the user
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log(`${field} updated:`, value);

    // Trigger auto-save after user stops typing
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, 2000); // 2 seconds delay
  };

  // Get unique courier names
  const uniqueCouriers = Array.from(new Set(mockCouriers.map(c => c.courier)));

  // Get services for selected courier
  const servicesForSelectedCourier = selectedCourierName
    ? mockCouriers.filter(c => c.courier === selectedCourierName)
    : [];

  // Calculate total cost
  const calculateTotalCost = () => {
    const selectedCourierData = mockCouriers.find(c => c.code === selectedServiceCode);
    const courierCost = selectedCourierData ? selectedCourierData.price : 0;

    const packingCost = packingOptions.reduce((total, option) => {
      switch (option) {
        case 'bubble': return total + 5000;
        case 'cardboard': return total + 8000;
        case 'wooden': return total + 25000;
        case 'insurance': return total + 10000;
        default: return total;
      }
    }, 0);

    return courierCost + packingCost;
  };

  const handleNext = async () => {
    console.log('Moving to step', step + 1, formData);

    try {
      // Auto-save current package data
      const packageData = {
        sender_name: formData.senderName,
        sender_phone: formData.senderPhone,
        sender_address: formData.senderAddress,
        sender_city: formData.senderCity,
        sender_province: formData.senderProvince,
        sender_district: formData.senderDistrict,
        sender_postal_code: formData.senderPostalCode,
        receiver_name: formData.receiverName,
        receiver_phone: formData.receiverPhone,
        receiver_address: formData.receiverAddress,
        receiver_city: formData.receiverCity,
        receiver_province: formData.receiverProvince,
        receiver_district: formData.receiverDistrict,
        receiver_postal_code: formData.receiverPostalCode,
        package_weight: formData.packageWeight,
        package_length: formData.packageLength,
        package_width: formData.packageWidth,
        package_height: formData.packageHeight,
        package_description: formData.packageDescription,
        courier_name: selectedCourierName,
        courier_service_code: selectedServiceCode,
        packing_options: packingOptions,
      };

      const savedPackage = await packageService.autoSavePackage(packageData, step + 1);
      setCurrentPackageId(savedPackage.id);

      if (step === 2) {
        // Generate package code after courier selection
        const code = `SP${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setPackageCode(code);
        console.log('Package code generated:', code);

        // Save the tracking code to database
        if (currentPackageId) {
          await packageService.updatePackage(currentPackageId, {
            tracking_code: code,
            step_completed: 3,
          });
        }

        setStep(3);
      } else if (step === 3) {
        // Finalize the package
        await handleSubmit();
      } else {
        setStep(step + 1);
      }
    } catch (error) {
      console.error('Error auto-saving package:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data paket. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    console.log('Form submitted:', { ...formData, courier: selectedServiceCode });

    try {
      if (currentPackageId) {
        // Finalize the package in database
        await packageService.finalizePackage(currentPackageId, packageCode);

        toast({
          title: "Paket berhasil disimpan",
          description: "Data paket telah disimpan ke sistem.",
        });

        // Navigate to history page after successful submission
        navigate('/riwayat');
      } else {
        // Fallback: Save to localStorage if no package ID
        const packageData = {
          id: `pkg-${Date.now()}`,
          senderName: formData.senderName,
          senderPhone: formData.senderPhone,
          senderAddress: formData.senderAddress,
          senderCity: formData.senderCity,
          senderProvince: formData.senderProvince,
          senderDistrict: formData.senderDistrict,
          senderPostalCode: formData.senderPostalCode,
          receiverName: formData.receiverName,
          receiverPhone: formData.receiverPhone,
          receiverAddress: formData.receiverAddress,
          receiverCity: formData.receiverCity,
          receiverProvince: formData.receiverProvince,
          receiverDistrict: formData.receiverDistrict,
          receiverPostalCode: formData.receiverPostalCode,
          packageWeight: formData.packageWeight,
          packageDescription: formData.packageDescription,
          packageLength: formData.packageLength,
          packageWidth: formData.packageWidth,
          packageHeight: formData.packageHeight,
          isComplete: true,
          paymentStatus: 'paid',
          trackingCode: packageCode,
          lastUpdated: new Date().toISOString(),
        };

        const existingPackages = JSON.parse(localStorage.getItem('simpanaja_packages') || '[]');
        existingPackages.push(packageData);
        localStorage.setItem('simpanaja_packages', JSON.stringify(existingPackages));
      }
    } catch (error) {
      console.error('Error finalizing package:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data paket. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  // Edit and delete handlers for sender
  const handleEditSender = (address: Address) => {
    setFormData({
      ...formData,
      senderName: address.name,
      senderPhone: address.phone,
      senderAddress: address.address,
      senderCity: address.city,
      senderProvince: address.province,
      senderPostalCode: address.postalCode,
    });
    setEditingSenderId(address.id);
    setShowSenderInputModal(true);
  };

  const handleDeleteSender = (id: string) => {
    setAddressHistory(prev => prev.filter(addr => addr.id !== id));
    if (selectedSenderAddress && selectedSenderAddress.id === id) {
      setSelectedSenderAddress(null);
    }
  };

  const handleDeselectSender = () => {
    setSelectedSenderAddress(null);
  };

  // Edit and delete handlers for receiver
  const handleEditReceiver = (address: Address) => {
    setFormData({
      ...formData,
      receiverName: address.name,
      receiverPhone: address.phone,
      receiverAddress: address.address,
      receiverCity: address.city,
      receiverProvince: address.province,
      receiverPostalCode: address.postalCode,
    });
    setEditingReceiverId(address.id);
    setShowReceiverInputModal(true);
  };

  const handleDeleteReceiver = (id: string) => {
    setAddressHistory(prev => prev.filter(addr => addr.id !== id));
    if (selectedReceiverAddress && selectedReceiverAddress.id === id) {
      setSelectedReceiverAddress(null);
    }
  };

  const handleDeselectReceiver = () => {
    setSelectedReceiverAddress(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3].map((s, index) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {s}
              </div>
              <span className="text-xs text-muted-foreground text-center">
                {['Data & Paket', 'Kurir', 'Kode'][index]}
              </span>
              {s < 3 && (
                <div className={`flex-1 h-1 ${s < step ? 'bg-primary' : 'bg-muted'}`} style={{ width: 'calc(100% - 2.5rem)', marginLeft: '1.25rem', marginTop: '0.5rem' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <>
          {step === 1 && (
            <Step1DataPaket
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              addressHistory={addressHistory}
              setAddressHistory={setAddressHistory}
              selectedSenderAddress={selectedSenderAddress}
              setSelectedSenderAddress={setSelectedSenderAddress}
              selectedReceiverAddress={selectedReceiverAddress}
              setSelectedReceiverAddress={setSelectedReceiverAddress}
              packingOptions={packingOptions}
              setPackingOptions={setPackingOptions}
              showSenderHistory={showSenderHistory}
              setShowSenderHistory={setShowSenderHistory}
              showReceiverHistory={showReceiverHistory}
setShowReceiverHistory={setShowReceiverHistory}
              showSenderInputModal={showSenderInputModal}
              setShowSenderInputModal={setShowSenderInputModal}
              showReceiverInputModal={showReceiverInputModal}
              setShowReceiverInputModal={setShowReceiverInputModal}
              searchSenderHistory={searchSenderHistory}
              setSearchSenderHistory={setSearchSenderHistory}
              searchReceiverHistory={searchReceiverHistory}
              setSearchReceiverHistory={setSearchReceiverHistory}
              editingSenderId={editingSenderId}
              setEditingSenderId={setEditingSenderId}
              editingReceiverId={editingReceiverId}
              setEditingReceiverId={setEditingReceiverId}
              handleEditSender={handleEditSender}
              handleDeleteSender={handleDeleteSender}
              handleEditReceiver={handleEditReceiver}
              handleDeleteReceiver={handleDeleteReceiver}
              calculateTotalCost={calculateTotalCost}
            />
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Kurir</h2>
              </div>

              <div className="space-y-6">
                {/* Pilih Kurir */}
                <div>
                  <h3 className="font-semibold mb-4">Pilih Kurir</h3>
                  <RadioGroup value={selectedCourierName} onValueChange={(val) => {
                    setSelectedCourierName(val);
                    setSelectedServiceCode(undefined); // reset service saat ganti kurir
                  }}>
                    <div className="space-y-4">
                      {uniqueCouriers.map((courier) => (
                        <label
                          key={courier}
                          className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${
                            selectedCourierName === courier ? 'border-primary bg-primary/5' : 'border-card-border'
                          }`}
                        >
                          <RadioGroupItem value={courier} id={courier} />
                          <div className="font-semibold">{courier}</div>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Pilih Layanan */}
                {selectedCourierName && (
                  <div>
                    <h3 className="font-semibold mb-4">Pilih Layanan</h3>
                    <RadioGroup value={selectedServiceCode} onValueChange={setSelectedServiceCode}>
                      <div className="space-y-4">
                        {servicesForSelectedCourier.map((service) => (
                          <label
                            key={service.code}
                            className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${
                              selectedServiceCode === service.code ? 'border-primary bg-primary/5' : 'border-card-border'
                            }`}
                          >
                            <RadioGroupItem value={service.code} id={service.code} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="font-semibold">{service.courier} - {service.service}</div>
                                <div className="text-xl font-bold text-primary">
                                  Rp {service.price.toLocaleString('id-ID')}
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Estimasi: {service.estimatedDays}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="mt-6 bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Biaya:</span>
                    <span className="text-2xl font-bold text-primary">
                      Rp {calculateTotalCost().toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="mt-2 text-right">
                    <a href="#" className="text-sm text-primary hover:underline">Detail Harga</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <Step3KodePaket packageCode={packageCode} />
          )}

          <div className="flex gap-4 mt-8">
            {step > 1 && step < 3 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1"
                data-testid="button-back"
              >
                Kembali
              </Button>
            )}

            {step < 3 && (
              <Button
                onClick={handleNext}
                className="flex-1"
                data-testid={step === 2 ? "button-generate-code" : "button-next"}
              >
                {step === 2 ? 'Dapatkan Kode paket' : 'Lanjut'}
              </Button>
            )}
          </div>
        </>
      </Card>
    </div>
  );
}
