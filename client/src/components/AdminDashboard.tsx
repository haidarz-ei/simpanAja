import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, TrendingUp, Clock, CheckCircle, Search, Eye } from "lucide-react";

//todo: remove mock functionality
const mockShipments = [
  {
    id: "1",
    packageCode: "SPAX9K2L",
    trackingNumber: "JNE00123456789",
    senderName: "Ahmad Rizki",
    receiverName: "Siti Nurhaliza",
    receiverCity: "Jakarta",
    courier: "JNE REG",
    status: "shipped",
    createdAt: "2024-10-30T10:30:00",
  },
  {
    id: "2",
    packageCode: "SPB7M4N9",
    trackingNumber: "-",
    senderName: "Budi Santoso",
    receiverName: "Ani Wijaya",
    receiverCity: "Bandung",
    courier: "J&T EZ",
    status: "paid",
    createdAt: "2024-10-30T14:15:00",
  },
  {
    id: "3",
    packageCode: "SPC3P8Q1",
    trackingNumber: "SICEPAT987654321",
    senderName: "Dewi Lestari",
    receiverName: "Rudi Hermawan",
    receiverCity: "Surabaya",
    courier: "SiCepat REG",
    status: "selesai",
    createdAt: "2024-10-29T09:20:00",
  },
  {
    id: "4",
    packageCode: "SPD5R2T7",
    trackingNumber: "-",
    senderName: "Eko Prasetyo",
    receiverName: "Linda Wijayanti",
    receiverCity: "Medan",
    courier: "JNE YES",
    status: "pending",
    createdAt: "2024-10-31T08:45:00",
  },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { label: string; className: string }> = {
    pending: { label: "Menunggu Pembayaran", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" },
    paid: { label: "Sudah Bayar", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    processing: { label: "Sedang Diproses", className: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
    shipped: { label: "Dikirim ke Kurir", className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" },
    selesai: { label: "Selesai (Di Locker)", className: "bg-green-500/10 text-green-700 dark:text-green-400" },
  };
  
  const variant = variants[status] || variants.pending;
  return (
    <Badge className={variant.className}>
      {variant.label}
    </Badge>
  );
};

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredShipments = mockShipments.filter(shipment =>
    shipment.packageCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.receiverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Admin</h1>
        <p className="text-muted-foreground">Kelola semua pengiriman dalam satu tempat</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-muted-foreground" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold" data-testid="text-total-shipments">156</div>
          <div className="text-sm text-muted-foreground">Total Pengiriman</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold" data-testid="text-pending-shipments">12</div>
          <div className="text-sm text-muted-foreground">Menunggu</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold" data-testid="text-in-transit">45</div>
          <div className="text-sm text-muted-foreground">Dalam Perjalanan</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold" data-testid="text-completed">99</div>
          <div className="text-sm text-muted-foreground">Selesai</div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari kode paket, nomor resi, pengirim, atau penerima..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-7 gap-4 pb-4 border-b text-sm font-semibold text-muted-foreground">
            <div>Kode Paket</div>
            <div>Nomor Resi</div>
            <div>Pengirim</div>
            <div>Penerima</div>
            <div>Kurir</div>
            <div>Status</div>
            <div>Aksi</div>
          </div>

          {filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="grid md:grid-cols-7 gap-4 p-4 border border-card-border rounded-lg hover-elevate"
              data-testid={`shipment-row-${shipment.id}`}
            >
              <div>
                <div className="md:hidden text-xs text-muted-foreground mb-1">Kode Paket</div>
                <div className="font-mono text-sm font-bold text-primary">{shipment.packageCode}</div>
              </div>
              
              <div>
                <div className="md:hidden text-xs text-muted-foreground mb-1">Nomor Resi</div>
                <div className="font-mono text-sm">{shipment.trackingNumber}</div>
              </div>
              
              <div>
                <div className="md:hidden text-xs text-muted-foreground mb-1">Pengirim</div>
                <div className="text-sm">{shipment.senderName}</div>
              </div>
              
              <div>
                <div className="md:hidden text-xs text-muted-foreground mb-1">Penerima</div>
                <div className="text-sm">{shipment.receiverName}</div>
                <div className="text-xs text-muted-foreground">{shipment.receiverCity}</div>
              </div>
              
              <div>
                <div className="md:hidden text-xs text-muted-foreground mb-1">Kurir</div>
                <div className="text-sm font-medium">{shipment.courier}</div>
              </div>
              
              <div>
                <div className="md:hidden text-xs text-muted-foreground mb-1">Status</div>
                {getStatusBadge(shipment.status)}
              </div>
              
              <div>
                <Button
                  size="sm"
                  variant="outline"
                  data-testid={`button-view-${shipment.id}`}
                  onClick={() => console.log('View shipment:', shipment.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
