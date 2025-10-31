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
    trackingNumber: "SP-2024-001234",
    senderName: "Ahmad Rizki",
    receiverName: "Siti Nurhaliza",
    receiverCity: "Jakarta",
    courier: "JNE REG",
    status: "dikirim",
    createdAt: "2024-10-30T10:30:00",
  },
  {
    id: "2",
    trackingNumber: "SP-2024-001235",
    senderName: "Budi Santoso",
    receiverName: "Ani Wijaya",
    receiverCity: "Bandung",
    courier: "J&T EZ",
    status: "pending",
    createdAt: "2024-10-30T14:15:00",
  },
  {
    id: "3",
    trackingNumber: "SP-2024-001236",
    senderName: "Dewi Lestari",
    receiverName: "Rudi Hermawan",
    receiverCity: "Surabaya",
    courier: "SiCepat REG",
    status: "selesai",
    createdAt: "2024-10-29T09:20:00",
  },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400" },
    dikirim: { label: "Dikirim", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    selesai: { label: "Selesai", className: "bg-green-500/10 text-green-700 dark:text-green-400" },
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
              placeholder="Cari nomor resi, pengirim, atau penerima..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b text-sm font-semibold text-muted-foreground">
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
              className="grid md:grid-cols-6 gap-4 p-4 border border-card-border rounded-lg hover-elevate"
              data-testid={`shipment-row-${shipment.id}`}
            >
              <div>
                <div className="md:hidden text-xs text-muted-foreground mb-1">Nomor Resi</div>
                <div className="font-mono text-sm font-semibold">{shipment.trackingNumber}</div>
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
