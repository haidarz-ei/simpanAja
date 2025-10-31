import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

interface PackageData {
  id: string;
  senderName?: string;
  senderPhone?: string;
  senderAddress?: string;
  receiverName?: string;
  receiverPhone?: string;
  receiverAddress?: string;
  packageWeight?: string;
  packageDescription?: string;
  isComplete: boolean;
  lastUpdated: string;
}

export default function Packages() {
  const [, navigate] = useLocation();
  const [packages, setPackages] = useState<PackageData[]>([]);

  useEffect(() => {
    // Load packages from localStorage (auto-save feature)
    const savedPackages = localStorage.getItem('simpanaja_packages');
    if (savedPackages) {
      const parsed = JSON.parse(savedPackages);
      // Filter out empty packages
      const filtered = parsed.filter((pkg: PackageData) => 
        pkg.senderName || pkg.receiverName || pkg.packageWeight
      );
      setPackages(filtered);
    }
  }, []);

  const calculateCompleteness = (pkg: PackageData): number => {
    const fields = [
      pkg.senderName,
      pkg.senderPhone,
      pkg.senderAddress,
      pkg.receiverName,
      pkg.receiverPhone,
      pkg.receiverAddress,
      pkg.packageWeight,
    ];
    const filledFields = fields.filter(f => f && f.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleNewPackage = () => {
    navigate('/kirim');
  };

  const handleEditPackage = (id: string) => {
    navigate(`/kirim?edit=${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paket Saya</h1>
        <p className="text-muted-foreground">
          Kelola pengiriman paket Anda dengan fitur auto-save
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* New Package Card */}
        <Card
          className="p-6 border-2 border-dashed border-primary/50 hover-elevate cursor-pointer flex flex-col items-center justify-center min-h-[280px]"
          onClick={handleNewPackage}
          data-testid="card-new-package"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Buat Paket Baru</h3>
          <p className="text-sm text-muted-foreground text-center">
            Mulai kirim paket dengan mengisi form pengiriman
          </p>
        </Card>

        {/* Existing Packages */}
        {packages.map((pkg) => {
          const completeness = calculateCompleteness(pkg);
          const isComplete = completeness === 100;

          return (
            <Card
              key={pkg.id}
              className="p-6 hover-elevate cursor-pointer"
              onClick={() => handleEditPackage(pkg.id)}
              data-testid={`card-package-${pkg.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                {isComplete ? (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Lengkap
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {completeness}%
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Pengirim</div>
                  <div className="font-semibold text-sm">
                    {pkg.senderName || <span className="text-muted-foreground italic">Belum diisi</span>}
                  </div>
                  {pkg.senderPhone && (
                    <div className="text-xs text-muted-foreground">{pkg.senderPhone}</div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Penerima</div>
                  <div className="font-semibold text-sm">
                    {pkg.receiverName || <span className="text-muted-foreground italic">Belum diisi</span>}
                  </div>
                  {pkg.receiverPhone && (
                    <div className="text-xs text-muted-foreground">{pkg.receiverPhone}</div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Berat Paket</div>
                  <div className="text-sm">
                    {pkg.packageWeight ? `${pkg.packageWeight} kg` : <span className="text-muted-foreground italic">Belum diisi</span>}
                  </div>
                </div>

                {pkg.packageDescription && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Deskripsi</div>
                    <div className="text-sm line-clamp-2">{pkg.packageDescription}</div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Terakhir disimpan: {new Date(pkg.lastUpdated).toLocaleString('id-ID', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                data-testid={`button-edit-${pkg.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditPackage(pkg.id);
                }}
              >
                {isComplete ? 'Lihat Detail' : 'Lanjutkan Pengisian'}
              </Button>
            </Card>
          );
        })}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Belum Ada Paket</h3>
          <p className="text-muted-foreground mb-6">
            Mulai kirim paket pertama Anda dengan klik tombol di atas
          </p>
        </div>
      )}
    </div>
  );
}
