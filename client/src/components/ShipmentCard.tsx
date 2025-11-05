import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
  Truck,
  CreditCard
} from "lucide-react";

interface ShipmentCardProps {
  type: "complete" | "incomplete" | "empty";
  id?: string;
  sender?: { name: string };
  recipient?: { name: string };
  address?: string;
  weight?: string;
  packageCode?: string;
  totalCost?: number;
  selected?: boolean;
  onSelect?: (checked: boolean) => void;
  onAction?: () => void;
}

export function ShipmentCard({
  type,
  id,
  sender,
  recipient,
  address,
  weight,
  packageCode,
  totalCost,
  selected = false,
  onSelect,
  onAction,
}: ShipmentCardProps) {
  const [isSelected, setIsSelected] = useState(selected);

  const handleSelect = (checked: boolean) => {
    setIsSelected(checked);
    onSelect?.(checked);
  };

  if (type === "empty") {
    return (
      <Card className="p-6 border-2 border-dashed border-muted/50 hover-elevate cursor-pointer flex flex-col items-center justify-center min-h-[280px] bg-gradient-to-br from-muted/20 to-muted/5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Plus className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2 text-center">Buat Kiriman Baru</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Mulai kirim paket dengan mengisi form pengiriman
        </p>
        <Button onClick={onAction} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Buat Kiriman
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover-elevate cursor-pointer relative group">
      {/* Checkbox - only for complete shipments */}
      {type === "complete" && onSelect && (
        <Checkbox
          className="absolute top-3 left-3 z-10"
          checked={isSelected}
          onCheckedChange={handleSelect}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {/* Status Badge */}
      <div className="flex items-start justify-between mb-4 pt-6">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Package className="w-6 h-6 text-primary" />
        </div>
        {type === "complete" ? (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Lengkap
          </Badge>
        ) : (
          <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Belum Lengkap
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Sender */}
        <div className="flex items-start gap-3">
          <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground font-medium">Pengirim</div>
            <div className="text-sm font-semibold truncate">
              {sender?.name || <span className="text-muted-foreground italic">Belum diisi</span>}
            </div>
          </div>
        </div>

        {/* Recipient */}
        <div className="flex items-start gap-3">
          <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground font-medium">Penerima</div>
            <div className="text-sm font-semibold truncate">
              {recipient?.name || <span className="text-muted-foreground italic">Belum diisi</span>}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground font-medium">Alamat</div>
            <div className="text-sm truncate">
              {address || <span className="text-muted-foreground italic">Belum diisi</span>}
            </div>
          </div>
        </div>

        {/* Weight */}
        <div className="flex items-center gap-3">
          <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground font-medium">Berat</div>
            <div className="text-sm">
              {weight || <span className="text-muted-foreground italic">Belum diisi</span>}
            </div>
          </div>
        </div>

        {/* Package Code and Total Cost - only for complete packages */}
        {type === "complete" && (packageCode || totalCost !== undefined) && (
          <div className="flex items-center gap-3 pt-2 border-t border-border/50">
            {packageCode && (
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="text-sm font-mono font-semibold text-green-700">
                  {packageCode}
                </div>
              </div>
            )}
            {totalCost !== undefined && (
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="text-sm font-semibold text-primary">
                  Rp {totalCost.toLocaleString('id-ID')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          onClick={onAction}
          variant={type === "complete" ? "outline" : "default"}
          className="w-full"
          size="sm"
        >
          {type === "complete" ? (
            <>
              <Truck className="w-4 h-4 mr-2" />
              Lihat Detail
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Lengkapi Data
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
