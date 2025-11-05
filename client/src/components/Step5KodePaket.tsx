import { Package } from "lucide-react";

interface Step5KodePaketProps {
  packageCode: string;
}

export default function Step5KodePaket({ packageCode }: Step5KodePaketProps) {
  return (
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
  );
}
