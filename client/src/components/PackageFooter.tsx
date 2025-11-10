import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Package, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface PackageFooterProps {
  totalPackages: number;
  selectedCount: number;
  totalCost: number;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onContinue: () => void;
  selectedPackages?: any[]; // Add selected packages for cost breakdown
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
              <div className="text-2xl text-primary font-semibold">
                Rp {totalCost.toLocaleString("id-ID")}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-1 h-auto p-0"
                  >
                    <Info className="w-3 h-3" />
                    Lihat Detail Biaya
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Rincian Biaya Pengiriman</DialogTitle>
                    <DialogDescription>
                      Breakdown biaya untuk {selectedCount} paket yang dipilih
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm">Biaya Dasar Pengiriman</span>
                        <span className="font-semibold">Rp {(selectedCount * 15000).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm">Biaya Berat</span>
                        <span className="font-semibold">Rp {(totalCost - (selectedCount * 15000)).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm">Biaya Kurir</span>
                        <span className="font-semibold">Rp 0</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="font-semibold">Total</span>
                      <span className="text-lg font-bold text-primary">Rp {totalCost.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Button
              size="lg"
              onClick={onContinue}
              disabled={selectedCount === 0}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              Lanjut Bayar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
