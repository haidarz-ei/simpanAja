import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Wallet, Building2, Truck, Package, ChevronDown, ChevronUp } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { packageService, paymentService } from "@/lib/packageService";
import { PackageData } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export default function Pembayaran() {
  const [, navigate] = useLocation();
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedOffice, setSelectedOffice] = useState("");
  const [currentPackageId, setCurrentPackageId] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [showCostDetails, setShowCostDetails] = useState(false);

  const mockOffices = [
    { id: "office-1", name: "Kantor Ekspedisi Jakarta Pusat", address: "Jl. Sudirman No. 123, Jakarta Pusat" },
    { id: "office-2", name: "Kantor Ekspedisi Jakarta Selatan", address: "Jl. Thamrin No. 456, Jakarta Selatan" },
    { id: "office-3", name: "Kantor Ekspedisi Jakarta Utara", address: "Jl. Gatot Subroto No. 789, Jakarta Utara" },
  ];

  // Load state from localStorage and package data
  useEffect(() => {
    const loadData = async () => {
      const state = localStorage.getItem('shippingState');
      if (state) {
        const { currentPackageId: pkgId } = JSON.parse(state);
        setCurrentPackageId(pkgId);
        if (pkgId) {
          try {
            const pkg = await packageService.getPackageById(pkgId);
            setPackageData(pkg);
          } catch (error) {
            console.error('Error loading package data:', error);
          }
        }
      }
    };
    loadData();
  }, []);

  const calculateTotalCost = () => {
    // Mock calculation - in real app, get from package data
    return 15000; // Example
  };

  const handlePayment = async () => {
    if (!selectedDeliveryMethod || !selectedPaymentMethod || (selectedPaymentMethod === 'cash' && !selectedOffice) || (selectedDeliveryMethod === 'self' && !selectedOffice)) {
      toast({
        title: "Error",
        description: "Silakan lengkapi semua pilihan pembayaran.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentPackageId) {
        // Update package with delivery method and selected office
        await packageService.updatePackage(currentPackageId, {
          delivery_method: selectedDeliveryMethod,
          selected_office: selectedOffice,
          step_completed: 4, // Proceed to success step
        });

        // Create payment record in payments table
        const totalCost = calculateTotalCost();
        await paymentService.createPayment({
          package_id: currentPackageId,
          amount: totalCost,
          method: selectedPaymentMethod as 'ewallet' | 'transfer' | 'cash',
          delivery_method: selectedDeliveryMethod as 'locker' | 'admin' | 'self',
          selected_office: selectedOffice,
          status: 'paid', // Simulate payment success
        });

        // Simulate payment success
        toast({
          title: "Pembayaran berhasil",
          description: "Pembayaran Anda telah diproses.",
        });

        // Navigate back to form with success
        navigate('/kirim?payment=success');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Gagal memproses pembayaran. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/packages')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center justify-between flex-1">
              <div>
                <h1 className="text-2xl font-bold">Pembayaran</h1>
                <p className="text-muted-foreground text-sm">
                  Pilih metode pengiriman dan pembayaran
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Pilih Metode Pengiriman Paket Anda</h3>
                <RadioGroup value={selectedDeliveryMethod} onValueChange={setSelectedDeliveryMethod}>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${selectedDeliveryMethod === 'locker' ? 'border-primary bg-primary/5' : 'border-card-border'}`}>
                      <RadioGroupItem value="locker" id="locker" />
                      <div className="flex items-center gap-3 flex-1">
                        <Package className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Simpan di Locker</div>
                          <div className="text-sm text-muted-foreground">Masukkan paket ke locker yang tersedia.</div>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${selectedDeliveryMethod === 'admin' ? 'border-primary bg-primary/5' : 'border-card-border'}`}>
                      <RadioGroupItem value="admin" id="admin" />
                      <div className="flex items-center gap-3 flex-1">
                        <Building2 className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Serahkan ke Kurir</div>
                          <div className="text-sm text-muted-foreground">kurir akan menjemput paket di alamat anda.</div>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${selectedDeliveryMethod === 'self' ? 'border-primary bg-primary/5' : 'border-card-border'}`}>
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
                                className={`flex items-center gap-4 p-3 border-2 rounded-lg cursor-pointer ${selectedOffice === office.id ? 'border-primary bg-primary/5' : 'border-card-border'}`}
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
                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${selectedPaymentMethod === 'ewallet' ? 'border-primary bg-primary/5' : 'border-card-border'}`}>
                      <RadioGroupItem value="ewallet" id="ewallet" />
                      <div className="flex items-center gap-3 flex-1">
                        <Wallet className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">E-Wallet</div>
                          <div className="text-sm text-muted-foreground">GoPay, OVO, Dana, LinkAja</div>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${selectedPaymentMethod === 'transfer' ? 'border-primary bg-primary/5' : 'border-card-border'}`}>
                      <RadioGroupItem value="transfer" id="transfer" />
                      <div className="flex items-center gap-3 flex-1">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Transfer Bank</div>
                          <div className="text-sm text-muted-foreground">BCA, BNI, Mandiri, BRI</div>
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-4 p-4 border-2 rounded-lg ${selectedDeliveryMethod === 'locker' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover-elevate'} ${selectedPaymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-card-border'}`}>
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
                    <h4 className="font-semibold mb-2 text-sm">Harap Lakukan Pembayaran Tunai di :</h4>
                    <div className="p-3 border-2 rounded-lg border-primary bg-primary/5">
                      <div className="font-medium">{mockOffices.find(o => o.id === selectedOffice)?.name}</div>
                      <div className="text-sm text-muted-foreground">{mockOffices.find(o => o.id === selectedOffice)?.address}</div>
                    </div>
                  </div>
                )}

                <div className="mt-6 bg-muted/50 rounded-lg p-4">
                  <div className="mb-2">
                    <span className="font-semibold">Total Biaya:</span>
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">Total:</span>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-primary">
                        Rp {calculateTotalCost().toLocaleString('id-ID')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCostDetails(!showCostDetails)}
                        className="text-sm text-muted-foreground hover:text-foreground mt-1"
                      >
                        Lihat Detail Biaya
                        {showCostDetails ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                      </Button>
                    </div>
                  </div>

                  {showCostDetails && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span>Biaya Dasar Pengiriman</span>
                        <span>Rp 10.000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Biaya Berat ({packageData?.package_weight || '0'} kg)</span>
                        <span>Rp {(parseFloat(packageData?.package_weight || '0') * 5000).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Biaya Kurir</span>
                        <span>Rp 0</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/kirim')}
              className="flex-1"
            >
              Kembali
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1"
            >
              Bayar Sekarang
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
