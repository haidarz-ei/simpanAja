import { Truck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Step2KurirProps {
  selectedCourierName: string | undefined;
  setSelectedCourierName: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedServiceCode: string | undefined;
  setSelectedServiceCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  uniqueCouriers: string[];
  servicesForSelectedCourier: Array<{
    courier: string;
    service: string;
    price: number;
    estimatedDays: string;
    code: string;
  }>;
  calculateTotalCost: () => number;
}

export default function Step2Kurir({
  selectedCourierName,
  setSelectedCourierName,
  selectedServiceCode,
  setSelectedServiceCode,
  uniqueCouriers,
  servicesForSelectedCourier,
  calculateTotalCost,
}: Step2KurirProps) {
  return (
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
  );
}
