import { CheckCircle } from "lucide-react";

interface Step4SuccessProps {
  calculateTotalCost: () => number;
}

export default function Step4Success({ calculateTotalCost }: Step4SuccessProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Pembayaran Berhasil!</h2>
        <p className="text-muted-foreground mb-6">
          Pembayaran Anda telah berhasil diproses. Klik tombol di bawah untuk mendapatkan kode paket.
        </p>

        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Dibayar:</span>
            <span className="text-2xl font-bold text-primary">
              Rp {calculateTotalCost().toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
