import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Package, CheckCircle2, AlertCircle, ArrowLeft, Minus } from "lucide-react";
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
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

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

  const handleDeletePackage = (id: string) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== id));
    setSelectedPackages(prev => prev.filter(selectedId => selectedId !== id));
    // Update localStorage
    const updatedPackages = packages.filter(pkg => pkg.id !== id);
    localStorage.setItem('simpanaja_packages', JSON.stringify(updatedPackages));
  };

  const handleSelectPackage = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPackages(prev => [...prev, id]);
    } else {
      setSelectedPackages(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const completePackages = packages.filter(pkg => calculateCompleteness(pkg) === 100);
      setSelectedPackages(completePackages.map(pkg => pkg.id));
    } else {
      setSelectedPackages([]);
    }
  };

  const totalCost = packages.reduce((sum, pkg) => {
    const completeness = calculateCompleteness(pkg);
    if (completeness === 100) {
      // Mock cost calculation based on weight
      const weight = parseFloat(pkg.packageWeight || '0');
      return sum + (weight * 10000); // Rp 10,000 per kg
    }
    return sum;
  }, 0);

  const packageCount = packages.length;
  const selectedCount = selectedPackages.length;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">Paket Saya</h1>
              <p className="text-muted-foreground">
                Kelola pengiriman paket Anda dengan fitur auto-save
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Package Card */}
          <Card
            className="p-6 border-2 border-dashed border-muted/50 hover-elevate cursor-pointer flex flex-col items-center justify-center min-h-[280px]"
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
                className="p-6 hover-elevate cursor-pointer relative"
                onClick={() => handleEditPackage(pkg.id)}
                data-testid={`card-package-${pkg.id}`}
              >
                <Checkbox
                  className="absolute top-3 left-3"
                  checked={selectedPackages.includes(pkg.id)}
                  onCheckedChange={(checked) => handleSelectPackage(pkg.id, checked as boolean)}
                  disabled={!isComplete}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex items-start justify-between mb-4 pt-6">
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
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePackage(pkg.id);
                  }}
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground mt-4"
                  data-testid={`button-delete-${pkg.id}`}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="fixed bottom-4 left-4 right-4 bg-card rounded-2xl shadow-xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm">
                Total ({packageCount} paket)
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedCount === packages.filter(pkg => calculateCompleteness(pkg) === 100).length && selectedCount > 0}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
                Pilih Semua
              </label>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  Rp {totalCost.toLocaleString("id-ID")}
                </div>
                <a href="#" className="text-xs text-primary underline">
                  Lihat Detail Biaya
                </a>
              </div>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-0" disabled={selectedCount === 0}>
                Lanjut
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol + */}
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute bottom-32 right-8 pointer-events-auto">
        <Button
          className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 z-50"
          onClick={handleNewPackage}
        >
          <Plus className="!w-8 !h-8 text-white" />
        </Button>
      </div>
    </div>

    </>
  );
}


