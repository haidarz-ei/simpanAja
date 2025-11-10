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
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="p-6 border-2 border-dashed border-muted/50 hover-elevate cursor-pointer flex flex-col items-center justify-center min-h-[280px] bg-gradient-to-br from-muted/20 to-muted/5">
          <motion.div
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h3
            className="font-semibold text-lg mb-2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Buat Kiriman Baru
          </motion.h3>
          <motion.p
            className="text-sm text-muted-foreground text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Mulai kirim paket dengan mengisi form pengiriman
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={onAction} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Buat Kiriman
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.01 }}
    >
      <Card className="p-6 hover-elevate cursor-pointer relative group">
        {/* Checkbox - only for complete shipments */}
        {type === "complete" && onSelect && (
          <motion.div
            className="absolute top-3 left-3 z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleSelect}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}

        {/* Status Badge */}
        <motion.div
          className="flex items-start justify-center mb-4 pt-6 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            className="w-60 h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center gap-1 px-3 py-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Package className="w-10 h-10 text-primary" />
            {type === "complete" && packageCode && (
              <motion.span
                className="text-sm font-mono font-semibold text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {packageCode}
              </motion.span>
            )}
          </motion.div>
          {type === "incomplete" && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, delay: 0.4, type: "spring" }}
            >
              <Badge className="absolute bottom-3 right-3 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                <AlertCircle className="w-3 h-3 mr-1" />
                Belum Lengkap
              </Badge>
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Sender */}
          <motion.div
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground font-medium">Pengirim</div>
              <div className="text-sm font-semibold truncate">
                {sender?.name || <span className="text-muted-foreground italic">Belum diisi</span>}
              </div>
            </div>
          </motion.div>

          {/* Recipient */}
          <motion.div
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground font-medium">Penerima</div>
              <div className="text-sm font-semibold truncate">
                {recipient?.name || <span className="text-muted-foreground italic">Belum diisi</span>}
              </div>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground font-medium">Alamat</div>
              <div className="text-sm truncate">
                {address || <span className="text-muted-foreground italic">Belum diisi</span>}
              </div>
            </div>
          </motion.div>

          {/* Weight */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground font-medium">Berat</div>
              <div className="text-sm">
                {weight || <span className="text-muted-foreground italic">Belum diisi</span>}
              </div>
            </div>
          </motion.div>

          {/* Total Cost and Status - for packages with cost */}
          {totalCost !== undefined && (
            <motion.div
              className="flex items-center justify-between pt-2 border-t border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                <div className="text-sm font-semibold text-primary">
                  Rp {totalCost.toLocaleString('id-ID')}
                </div>
              </div>
              {type === "complete" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8, type: "spring" }}
                >
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Lengkap
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Action Button */}
        <motion.div
          className="mt-4 pt-4 border-t border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
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
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
