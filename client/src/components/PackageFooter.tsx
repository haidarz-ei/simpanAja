import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Package, Info } from "lucide-react";

interface PackageFooterProps {
  totalPackages: number;
  selectedCount: number;
  totalCost: number;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onContinue: () => void;
}

export function PackageFooter({
  totalPackages,
  selectedCount,
  totalCost,
  allSelected,
  onSelectAll,
  onContinue,
}: PackageFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur-md shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="lg:hidden py-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
              <span className="text-foreground">
                Pilih Semua ({selectedCount}/{totalPackages})
              </span>
            </label>
            <Button
              size="sm"
              onClick={onContinue}
              disabled={selectedCount === 0}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Lanjut
            </Button>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>Total Biaya</span>
            </div>
            <div className="text-right">
              <div className="text-lg text-primary font-semibold">
                Rp {totalCost.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between py-5 gap-6">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
              <div className="flex flex-col">
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  Pilih Semua Paket
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedCount} dari {totalPackages} paket dipilih
                </span>
              </div>
            </label>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Package className="w-3 h-3" />
                Total Biaya Pengiriman
              </div>
              <div className="text-2xl text-primary font-semibold">
                Rp {totalCost.toLocaleString("id-ID")}
              </div>
              <button className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                <Info className="w-3 h-3" />
                Lihat Detail Biaya
              </button>
            </div>
            <Button
              size="lg"
              onClick={onContinue}
              disabled={selectedCount === 0}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              Lanjut Pembayaran
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
