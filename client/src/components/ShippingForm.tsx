import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, User, MapPin, Truck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

//todo: remove mock functionality
const mockCouriers = [
  { code: "jne", service: "REG", price: 15000, estimatedDays: "2-3 hari", logo: "JNE" },
  { code: "jnt", service: "EZ", price: 12000, estimatedDays: "3-4 hari", logo: "J&T" },
  { code: "sicepat", service: "REG", price: 14000, estimatedDays: "2-3 hari", logo: "SiCepat" },
];

export default function ShippingForm() {
  const [step, setStep] = useState(1);
  const [selectedCourier, setSelectedCourier] = useState("");
  const [packageCode, setPackageCode] = useState("");
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    senderCity: "",
    senderPostalCode: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverCity: "",
    receiverPostalCode: "",
    packageWeight: "",
    packageLength: "",
    packageWidth: "",
    packageHeight: "",
    packageDescription: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log(`${field} updated:`, value);
  };

  const handleNext = () => {
    console.log('Moving to step', step + 1, formData);
    if (step === 4 && selectedCourier) {
      // Generate package code
      const code = `SP${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setPackageCode(code);
      console.log('Generated package code:', code);
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', { ...formData, courier: selectedCourier });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {s}
              </div>
              {s < 5 && (
                <div className={`flex-1 h-1 mx-2 ${s < step ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Pengirim</span>
          <span>Penerima</span>
          <span>Paket</span>
          <span>Kurir</span>
          <span>Kode</span>
        </div>
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Data Pengirim</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="sender-name">Nama Lengkap</Label>
                <Input
                  id="sender-name"
                  data-testid="input-sender-name"
                  value={formData.senderName}
                  onChange={(e) => handleInputChange('senderName', e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              
              <div>
                <Label htmlFor="sender-phone">Nomor Telepon</Label>
                <Input
                  id="sender-phone"
                  data-testid="input-sender-phone"
                  value={formData.senderPhone}
                  onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                  placeholder="08xx xxxx xxxx"
                />
              </div>
              
              <div>
                <Label htmlFor="sender-address">Alamat Lengkap</Label>
                <Textarea
                  id="sender-address"
                  data-testid="input-sender-address"
                  value={formData.senderAddress}
                  onChange={(e) => handleInputChange('senderAddress', e.target.value)}
                  placeholder="Jalan, nomor rumah, RT/RW"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sender-city">Kota/Kabupaten</Label>
                  <Input
                    id="sender-city"
                    data-testid="input-sender-city"
                    value={formData.senderCity}
                    onChange={(e) => handleInputChange('senderCity', e.target.value)}
                    placeholder="Nama kota"
                  />
                </div>
                
                <div>
                  <Label htmlFor="sender-postal">Kode Pos</Label>
                  <Input
                    id="sender-postal"
                    data-testid="input-sender-postal"
                    value={formData.senderPostalCode}
                    onChange={(e) => handleInputChange('senderPostalCode', e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Data Penerima</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="receiver-name">Nama Lengkap</Label>
                <Input
                  id="receiver-name"
                  data-testid="input-receiver-name"
                  value={formData.receiverName}
                  onChange={(e) => handleInputChange('receiverName', e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              
              <div>
                <Label htmlFor="receiver-phone">Nomor Telepon</Label>
                <Input
                  id="receiver-phone"
                  data-testid="input-receiver-phone"
                  value={formData.receiverPhone}
                  onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                  placeholder="08xx xxxx xxxx"
                />
              </div>
              
              <div>
                <Label htmlFor="receiver-address">Alamat Lengkap</Label>
                <Textarea
                  id="receiver-address"
                  data-testid="input-receiver-address"
                  value={formData.receiverAddress}
                  onChange={(e) => handleInputChange('receiverAddress', e.target.value)}
                  placeholder="Jalan, nomor rumah, RT/RW"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receiver-city">Kota/Kabupaten</Label>
                  <Input
                    id="receiver-city"
                    data-testid="input-receiver-city"
                    value={formData.receiverCity}
                    onChange={(e) => handleInputChange('receiverCity', e.target.value)}
                    placeholder="Nama kota"
                  />
                </div>
                
                <div>
                  <Label htmlFor="receiver-postal">Kode Pos</Label>
                  <Input
                    id="receiver-postal"
                    data-testid="input-receiver-postal"
                    value={formData.receiverPostalCode}
                    onChange={(e) => handleInputChange('receiverPostalCode', e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Detail Paket</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="package-weight">Berat Paket (gram)</Label>
                <Input
                  id="package-weight"
                  data-testid="input-package-weight"
                  type="number"
                  value={formData.packageWeight}
                  onChange={(e) => handleInputChange('packageWeight', e.target.value)}
                  placeholder="1000"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="package-length">Panjang (cm)</Label>
                  <Input
                    id="package-length"
                    data-testid="input-package-length"
                    type="number"
                    value={formData.packageLength}
                    onChange={(e) => handleInputChange('packageLength', e.target.value)}
                    placeholder="20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="package-width">Lebar (cm)</Label>
                  <Input
                    id="package-width"
                    data-testid="input-package-width"
                    type="number"
                    value={formData.packageWidth}
                    onChange={(e) => handleInputChange('packageWidth', e.target.value)}
                    placeholder="15"
                  />
                </div>
                
                <div>
                  <Label htmlFor="package-height">Tinggi (cm)</Label>
                  <Input
                    id="package-height"
                    data-testid="input-package-height"
                    type="number"
                    value={formData.packageHeight}
                    onChange={(e) => handleInputChange('packageHeight', e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="package-description">Deskripsi Paket (opsional)</Label>
                <Textarea
                  id="package-description"
                  data-testid="input-package-description"
                  value={formData.packageDescription}
                  onChange={(e) => handleInputChange('packageDescription', e.target.value)}
                  placeholder="Contoh: Pakaian, Buku, Elektronik"
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Pilih Kurir & Layanan</h2>
            </div>
            
            <RadioGroup value={selectedCourier} onValueChange={setSelectedCourier}>
              <div className="space-y-4">
                {mockCouriers.map((courier) => (
                  <label
                    key={courier.code}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer hover-elevate ${
                      selectedCourier === courier.code ? 'border-primary bg-primary/5' : 'border-card-border'
                    }`}
                    data-testid={`courier-option-${courier.code}`}
                  >
                    <RadioGroupItem value={courier.code} id={courier.code} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold">{courier.logo} - {courier.service}</div>
                        <div className="text-xl font-bold text-primary">
                          Rp {courier.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Estimasi: {courier.estimatedDays}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>
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
                Simpan kode ini untuk diserahkan ke admin saat drop-off paket
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
                    <span>Lakukan pembayaran sesuai metode yang dipilih</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">2.</span>
                    <span>Tunjukkan kode <strong className="text-foreground">{packageCode}</strong> ke admin saat drop-off</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">3.</span>
                    <span>Serahkan paket Anda di locker yang tersedia</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold">4.</span>
                    <span>Admin akan memproses dan meneruskan ke kurir pilihan Anda</span>
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
          
          {step < 4 ? (
            <Button
              onClick={handleNext}
              className="flex-1"
              data-testid="button-next"
            >
              Lanjutkan
            </Button>
          ) : step === 4 ? (
            <Button
              onClick={handleNext}
              className="flex-1"
              data-testid="button-generate-code"
              disabled={!selectedCourier}
            >
              Generate Kode Paket
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1"
              data-testid="button-proceed-payment"
            >
              Lanjut ke Pembayaran
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
