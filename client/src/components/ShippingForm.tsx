import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { User, MapPin, Package, Truck, CreditCard, CheckCircle, History, Edit, X, Plus, Search, Wallet, Building2 } from "lucide-react";
import Step1DataPaket from "./Step1DataPaket";
import Step2Kurir from "./Step2Kurir";
import Step3Pembayaran from "./Step3Pembayaran";
import Step4Success from "./Step4Success";
import Step5KodePaket from "./Step5KodePaket";
import { packageService } from "@/lib/packageService";
import { PackageData } from "@/lib/supabase";
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
  const [step, setStep] = useState<number>(1);
  const [selectedCourierName, setSelectedCourierName] = useState<string | undefined>(undefined);
  const [selectedServiceCode, setSelectedServiceCode] = useState<string | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
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
    const loadIncompletePackage = async () => {
      try {
        const incompletePackages = await packageService.getIncompletePackages();
        if (incompletePackages.length > 0) {
          const pkg = incompletePackages[0]; // Load the most recent incomplete package
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
          setSelectedDeliveryMethod(pkg.delivery_method || "");
          setSelectedPaymentMethod(pkg.payment_method || "");
          setSelectedOffice(pkg.selected_office || "");
          setPackingOptions(pkg.packing_options || []);

          toast({
            title: "Paket ditemukan",
            description: "Melanjutkan pengisian formulir yang belum selesai.",
          });
        }
      } catch (error) {
        console.error('Error loading incomplete package:', error);
        // Don't show error toast for now to avoid confusion
        // toast({
        //   title: "Error",
        //   description: "Gagal memuat data paket yang belum selesai.",
        //   variant: "destructive",
        // });
      }
    };

    loadIncompletePackage();
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
        delivery_method: selectedDeliveryMethod,
        payment_method: selectedPaymentMethod,
        selected_office: selectedOffice,
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
        delivery_method: selectedDeliveryMethod,
        payment_method: selectedPaymentMethod,
        selected_office: selectedOffice,
        packing_options: packingOptions,
      };

      const savedPackage = await packageService.autoSavePackage(packageData, step + 1);
      setCurrentPackageId(savedPackage.id);

      if (step === 2 && selectedServiceCode) {
        // Proceed to payment step
        setStep(3);
      } else if (step === 3 && selectedDeliveryMethod && selectedPaymentMethod && (selectedPaymentMethod !== 'cash' || selectedOffice) && (selectedDeliveryMethod !== 'self' || selectedOffice)) {
        // Simulate payment initiation - will redirect to payment page later
        setPaymentStatus('success');
        console.log('Payment initiated, proceeding to success step');
        setStep(4);
      } else if (step === 4) {
        // Generate package code after success confirmation
        const code = `SP${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setPackageCode(code);
        console.log('Package code generated:', code);
        setStep(5);
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
          {[1, 2, 3, 4, 5].map((s, index) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {s}
              </div>
              <span className="text-xs text-muted-foreground text-center">
                {['Data & Paket', 'Kurir', 'Pembayaran', 'Sukses', 'Kode'][index]}
              </span>
              {s < 5 && (
                <div className={`flex-1 h-1 ${s < step ? 'bg-primary' : 'bg-muted'}`} style={{ width: 'calc(100% - 2.5rem)', marginLeft: '1.25rem', marginTop: '0.5rem' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">
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
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Pembayaran</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Pilih Metode Pengiriman Paket Anda</h3>
                <RadioGroup value={selectedDeliveryMethod} onValueChange={setSelectedDeliveryMethod}>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${
                      selectedDeliveryMethod === 'locker' ? 'border-primary bg-primary/5' : 'border-card-border'
                    }`}>
                      <RadioGroupItem value="locker" id="locker" />
                      <div className="flex items-center gap-3 flex-1">
                        <Package className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Simpan di Locker</div>
                          <div className="text-sm text-muted-foreground">Masukkan paket ke locker yang tersedia.</div>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${
                      selectedDeliveryMethod === 'admin' ? 'border-primary bg-primary/5' : 'border-card-border'
                    }`}>
                      <RadioGroupItem value="admin" id="admin" />
                      <div className="flex items-center gap-3 flex-1">
                        <Building2 className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Serahkan ke Kurir</div>
                          <div className="text-sm text-muted-foreground">kurir akan menjemput paket di alamat anda.</div>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${
                      selectedDeliveryMethod === 'self' ? 'border-primary bg-primary/5' : 'border-card-border'
                    }`}>
                      <RadioGroupItem value="self" id="self" />
                      <div className="flex items-center gap-3 flex-1">
                        <Truck className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Antar Sendiri</div>
                          <div className="text-sm text-muted-foreground">Antar paket ke kantor yang anda pilih.</div>
                        </div>
                      </div>
                    </label>

                    {selectedDeliveryMethod === 'self' && (
                      <div className="mt-4 ml-6">
                        <h4 className="font-semibold mb-2 text-sm">Pilih Kantor Ekspedisi Terdekat</h4>
                        <RadioGroup value={selectedOffice} onValueChange={setSelectedOffice}>
                          <div className="space-y-2">
                            {mockOffices.map((office) => (
                              <label
                                key={office.id}
                                className={`flex items-center gap-4 p-3 border-2 rounded-lg cursor-pointer ${
                                  selectedOffice === office.id ? 'border-primary bg-primary/5' : 'border-card-border'
                                }`}
                              >
                                <RadioGroupItem value={office.id} id={office.id} />
                                <div className="flex-1">
                                  <div className="font-medium">{office.name}</div>
                                  <div className="text-sm text-muted-foreground">{office.address}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold mb-4">Pilih Metode Pembayaran</h3>
                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${
                      selectedPaymentMethod === 'ewallet' ? 'border-primary bg-primary/5' : 'border-card-border'
                    }`}>
                      <RadioGroupItem value="ewallet" id="ewallet" />
                      <div className="flex items-center gap-3 flex-1">
                        <Wallet className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">E-Wallet</div>
                          <div className="text-sm text-muted-foreground">GoPay, OVO, Dana, LinkAja</div>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${
                      selectedPaymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-card-border'
                    }`}>
                      <RadioGroupItem value="transfer" id="transfer" />
                      <div className="flex items-center gap-3 flex-1">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Transfer Bank</div>
                          <div className="text-sm text-muted-foreground">BCA, BNI, Mandiri, BRI</div>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg ${
                      selectedDeliveryMethod === 'locker' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover-elevate'
                    } ${
                      selectedPaymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-card-border'
                    }`}>
                      <RadioGroupItem
                        value="cash"
                        id="cash"
                        disabled={selectedDeliveryMethod === 'locker'}
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <Building2 className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Bayar Tunai</div>
                          <div className="text-sm text-muted-foreground">Bayar tunai langsung saat menyerahkan paket ke kantor atau kurir</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>

                {selectedDeliveryMethod === 'admin' && selectedPaymentMethod === 'cash' && (
                  <div className="mt-4 ml-6">
                    <p className="text-sm text-muted-foreground">Bayar tunai ketika kurir sampai.</p>
                  </div>
                )}

                {selectedDeliveryMethod === 'self' && selectedPaymentMethod === 'cash' && selectedOffice && (
                  <div className="mt-4 ml-6">
                    <h4 className="font-semibold mb-2 text-sm">Kantor Ekspedisi Terpilih (Bayar Tunai Di)</h4>
                    <div className="p-3 border-2 rounded-lg border-primary bg-primary/5">
                      <div className="font-medium">{mockOffices.find(o => o.id === selectedOffice)?.name}</div>
                      <div className="text-sm text-muted-foreground">{mockOffices.find(o => o.id === selectedOffice)?.address}</div>
                    </div>
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
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
              <p className="text-muted-foreground mb-6">
                Pembayaran Anda telah berhasil diproses. Klik tombol di bawah untuk mendapatkan kode paket.
              </p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-2">Kode Paket Anda</h2>
              <p className="text-muted-foreground mb-6">
                Simpan dan terapkan kode ini pada paket pengirim
              </p>

              <div className="bg-card border-2 border-primary rounded-xl p-8 mb-6">
                <div className="text-sm text-muted-foreground mb-2">Kode Paket</div>
                <div className="text-5xl font-bold text-primary tracking-wider font-mono" data-testid="text-package-code">
                  {packageCode}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3">Langkah Selanjutnya:</h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-semibold">1.</span>
                    <span>Tunjukkan / tempelkan kode <strong className="text-foreground">{packageCode}</strong> di paket anda saat drop-off.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">2.</span>
                    <span>Serahkan paket Anda ke admin/kurir yang tersedia.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">3.</span>
                    <span>Admin akan memproses dan meneruskan paket ke kurir pilihan Anda.</span>
                  </li>
                </ol>
              </div>

              <div className="text-sm text-muted-foreground">
                Nomor resi dari kurir akan dikirimkan setelah paket diproses oleh admin
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {step > 1 && step < 5 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              data-testid="button-back"
            >
              Kembali
            </Button>
          )}

          {step < 5 && (
            <Button
              onClick={handleNext}
              className="flex-1"
              data-testid={step === 4 ? "button-generate-code" : "button-next"}
            >
              {step === 3 ? 'Bayar Sekarang' : step === 4 ? 'Generate Kode Paket' : 'Lanjutkan'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
