import { CreditCard, Wallet, Building2, Truck, Package } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Step3PembayaranProps {
  selectedDeliveryMethod: string;
  setSelectedDeliveryMethod: React.Dispatch<React.SetStateAction<string>>;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  selectedOffice: string;
  setSelectedOffice: React.Dispatch<React.SetStateAction<string>>;
  mockOffices: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  calculateTotalCost: () => number;
}

export default function Step3Pembayaran({
  selectedDeliveryMethod,
  setSelectedDeliveryMethod,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  selectedOffice,
  setSelectedOffice,
  mockOffices,
  calculateTotalCost,
}: Step3PembayaranProps) {
  return (
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
          </div>
        </div>
      </div>
    </div>
  );
}
