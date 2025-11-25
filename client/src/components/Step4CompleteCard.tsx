import { CheckCircle } from "lucide-react";
import { ShipmentCard } from "./ShipmentCard";

interface Step4CompleteCardProps {
  formData: {
    senderName: string;
    senderAddress: string;
    receiverName: string;
    receiverAddress: string;
    packageWeight: string;
  };
  packageCode: string;
  totalCost: number;
  onFinalize: () => void;
}

export default function Step4CompleteCard({
  formData,
  packageCode,
  totalCost,
  onFinalize,
}: Step4CompleteCardProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Kartu Lengkap Paket</h2>
        <p className="text-muted-foreground mb-6">
          Berikut adalah ringkasan lengkap paket Anda. Pastikan semua data sudah benar sebelum menyelesaikan pengiriman.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <ShipmentCard
            type="complete"
            id="complete-package"
            sender={{ name: formData.senderName }}
            recipient={{ name: formData.receiverName }}
            address={formData.receiverAddress}
            weight={formData.packageWeight}
            packageCode={packageCode}
            totalCost={totalCost}
            onAction={onFinalize}
          />
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Klik tombol "Selesaikan Pengiriman" untuk menyimpan paket dan melanjutkan ke halaman riwayat.
      </div>
    </div>
  );
}
