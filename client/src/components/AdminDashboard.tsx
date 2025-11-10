import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  Eye,
  Printer,
  LogOut,
  Bell,
  MapPin,
  DollarSign,
  FileText,
} from "lucide-react";

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
    locker: "#12 - Mal ABC",
    weight: "2 kg",
    price: 22000,
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
    locker: "#05 - Stasiun MRT",
    weight: "1 kg",
    price: 18000,
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
    locker: "#08 - Grand Indonesia",
    weight: "3 kg",
    price: 35000,
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
    locker: "-",
    weight: "1.5 kg",
    price: 25000,
  },
  {
    id: "5",
    packageCode: "SPE6U3V8",
    trackingNumber: "JNE00234567890",
    senderName: "Fajar Setiawan",
    receiverName: "Maya Sari",
    receiverCity: "Yogyakarta",
    courier: "JNE REG",
    status: "shipped",
    createdAt: "2024-10-31T11:00:00",
    locker: "#15 - Malioboro Mall",
    weight: "2.5 kg",
    price: 28000,
  },
  {
    id: "6",
    packageCode: "SPF7W4X9",
    trackingNumber: "-",
    senderName: "Gita Permata",
    receiverName: "Hendra Gunawan",
    receiverCity: "Semarang",
    courier: "J&T EZ",
    status: "paid",
    createdAt: "2024-10-31T13:30:00",
    locker: "#03 - Simpang Lima",
    weight: "1.2 kg",
    price: 20000,
  },
  {
    id: "7",
    packageCode: "SPG8Y5Z0",
    trackingNumber: "SICEPAT123456789",
    senderName: "Indra Kusuma",
    receiverName: "Jasmine Putri",
    receiverCity: "Makassar",
    courier: "SiCepat REG",
    status: "selesai",
    createdAt: "2024-10-30T16:45:00",
    locker: "#20 - Trans Studio",
    weight: "4 kg",
    price: 45000,
  },
  {
    id: "8",
    packageCode: "SPH9A6B1",
    trackingNumber: "-",
    senderName: "Kartika Sari",
    receiverName: "Lutfi Rahman",
    receiverCity: "Palembang",
    courier: "JNE YES",
    status: "pending",
    createdAt: "2024-11-01T09:15:00",
    locker: "-",
    weight: "0.8 kg",
    price: 15000,
  },
  {
    id: "9",
    packageCode: "SPI0C7D2",
    trackingNumber: "JNE00345678901",
    senderName: "Muhammad Ali",
    receiverName: "Nina Amelia",
    receiverCity: "Balikpapan",
    courier: "JNE REG",
    status: "shipped",
    createdAt: "2024-11-01T12:00:00",
    locker: "#07 - Plaza Balikpapan",
    weight: "3.5 kg",
    price: 40000,
  },
  {
    id: "10",
    packageCode: "SPJ1E8F3",
    trackingNumber: "-",
    senderName: "Olivia Tan",
    receiverName: "Putra Wijaya",
    receiverCity: "Medan",
    courier: "J&T EZ",
    status: "paid",
    createdAt: "2024-11-01T14:20:00",
    locker: "#11 - Grand Palladium",
    weight: "1.8 kg",
    price: 24000,
  },
  {
    id: "11",
    packageCode: "SPK2G9H4",
    trackingNumber: "SICEPAT234567890",
    senderName: "Qori Rahman",
    receiverName: "Rina Suryani",
    receiverCity: "Surabaya",
    courier: "SiCepat REG",
    status: "selesai",
    createdAt: "2024-10-31T17:30:00",
    locker: "#18 - Tunjungan Plaza",
    weight: "2.2 kg",
    price: 26000,
  },
  {
    id: "12",
    packageCode: "SPL3I0J5",
    trackingNumber: "-",
    senderName: "Surya Pratama",
    receiverName: "Tina Marlina",
    receiverCity: "Jakarta",
    courier: "JNE YES",
    status: "pending",
    createdAt: "2024-11-02T08:00:00",
    locker: "-",
    weight: "1.3 kg",
    price: 19000,
  },
  {
    id: "13",
    packageCode: "SPM4K1L6",
    trackingNumber: "JNE00456789012",
    senderName: "Umar Faruq",
    receiverName: "Vina Cahyani",
    receiverCity: "Bandung",
    courier: "JNE REG",
    status: "shipped",
    createdAt: "2024-11-02T10:45:00",
    locker: "#09 - Paris Van Java",
    weight: "2.8 kg",
    price: 32000,
  },
  {
    id: "14",
    packageCode: "SPN5M2N7",
    trackingNumber: "-",
    senderName: "Wahyu Nugroho",
    receiverName: "Xena Putri",
    receiverCity: "Yogyakarta",
    courier: "J&T EZ",
    status: "paid",
    createdAt: "2024-11-02T13:15:00",
    locker: "#14 - Jogja City Mall",
    weight: "1.6 kg",
    price: 22000,
  },
  {
    id: "15",
    packageCode: "SPO6O3P8",
    trackingNumber: "SICEPAT345678901",
    senderName: "Yusuf Rahman",
    receiverName: "Zara Amelia",
    receiverCity: "Semarang",
    courier: "SiCepat REG",
    status: "selesai",
    createdAt: "2024-11-01T15:00:00",
    locker: "#22 - DP Mall",
    weight: "3.2 kg",
    price: 38000,
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  const filteredShipments = mockShipments.filter(shipment =>
    shipment.packageCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.receiverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalShipments = 156;
  const pendingCount = 12;
  const inTransitCount = 45;
  const completedCount = 99;
  const totalRevenue = mockShipments.reduce((sum, shipment) => sum + shipment.price, 0);

  const handlePrintReceipt = (packageCode: string) => {
    alert(`Mencetak resi untuk paket ${packageCode}`);
  };

  const handleViewDetails = (id: string) => {
    setSelectedShipment(selectedShipment === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-auto">
      {/* Desktop Frame - 1440x900 */}
      <div className="max-w-[1440px] mx-auto bg-white shadow-2xl">
        <div className="flex">
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 bg-gradient-to-b from-[#007BFF] to-blue-700 text-white p-6 flex flex-col"
          >
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-8 h-8" />
                <span className="text-2xl">simpanAja</span>
              </div>
              <p className="text-blue-200 text-sm">Admin Panel</p>
            </div>

            {/* Admin Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <p className="text-sm">Admin</p>
                  <p className="text-xs text-blue-200">Haidar</p>
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/20 bg-white/10"
              >
                <Package className="w-5 h-5 mr-3" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                <MapPin className="w-5 h-5 mr-3" />
                Loker
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                <TrendingUp className="w-5 h-5 mr-3" />
                Laporan
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
                <Bell className="w-5 h-5 mr-3" />
                Notifikasi
              </Button>
            </nav>

            {/* Logout */}
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
            </Button>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl text-gray-800">Dashboard Admin</h1>
                  <p className="text-sm text-gray-600">Kelola semua pengiriman dalam satu tempat</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Notification Bell */}
                  <div className="relative">
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      {showNotification && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="p-8 bg-gray-50">
              {/* WhatsApp Notification */}
              {showNotification && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-6"
                >
                  <Card className="bg-green-50 border-green-300 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📱</span>
                        </div>
                        <div>
                          <p className="text-green-900">
                            <span className="mr-2">💬</span>
                            WhatsApp: Paket masuk loker!
                          </p>
                          <p className="text-sm text-green-700">
                            {mockShipments[0].packageCode} telah disimpan di loker {mockShipments[0].locker}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleViewDetails(mockShipments[0].id)}
                        >
                          Buka Dashboard
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowNotification(false)}
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="p-6 hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 hover:text-white hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-5 h-5 text-muted-foreground hover:text-white" />
                      <TrendingUp className="w-4 h-4 text-green-500 hover:text-green-200" />
                    </div>
                    <div className="text-2xl whitespace-nowrap" data-testid="text-total-shipments">{totalShipments}</div>
                    <div className="text-sm text-muted-foreground hover:text-green-100">Total Pengiriman</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Card className="p-6 hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 hover:text-white hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-5 h-5 text-muted-foreground hover:text-white" />
                      <TrendingUp className="w-4 h-4 text-green-500 hover:text-green-200" />
                    </div>
                    <div className="text-2xl whitespace-nowrap">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                    <div className="text-sm text-muted-foreground hover:text-green-100">Total Pendapatan</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-6 hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 hover:text-white hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-5 h-5 text-muted-foreground hover:text-white" />
                    </div>
                    <div className="text-2xl whitespace-nowrap">{pendingCount}</div>
                    <div className="text-sm text-muted-foreground hover:text-green-100">Menunggu</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <Card className="p-6 hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 hover:text-white hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <Package className="w-5 h-5 text-muted-foreground hover:text-white" />
                    </div>
                    <div className="text-2xl whitespace-nowrap" data-testid="text-in-transit">{inTransitCount}</div>
                    <div className="text-sm text-muted-foreground hover:text-green-100">Dalam Perjalanan</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-6 hover:bg-gradient-to-br hover:from-green-500 hover:to-green-600 hover:text-white hover:scale-105 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="w-5 h-5 text-muted-foreground hover:text-white" />
                    </div>
                    <div className="text-2xl whitespace-nowrap" data-testid="text-completed">{completedCount}</div>
                    <div className="text-sm text-muted-foreground hover:text-green-100">Selesai</div>
                  </Card>
                </motion.div>
              </div>

              {/* Shipments List */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
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

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="hidden md:grid grid-cols-7 gap-4 pb-4 border-b text-sm text-muted-foreground">
                      <div>Kode Paket</div>
                      <div>Nomor Resi</div>
                      <div>Pengirim</div>
                      <div>Penerima</div>
                      <div>Kurir</div>
                      <div>Status</div>
                      <div>Aksi</div>
                    </div>

                    {filteredShipments.map((shipment, index) => (
                      <motion.div
                        key={shipment.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card
                          className={`p-4 transition-all ${
                            selectedShipment === shipment.id
                              ? 'border-[#007BFF] border-2 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div
                            className="grid md:grid-cols-7 gap-4 cursor-pointer"
                            onClick={() => handleViewDetails(shipment.id)}
                            data-testid={`shipment-row-${shipment.id}`}
                          >
                            <div>
                              <div className="md:hidden text-xs text-muted-foreground mb-1">Kode Paket</div>
                              <div className="font-mono text-sm text-primary">{shipment.packageCode}</div>
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
                              <div className="text-sm">{shipment.courier}</div>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(shipment.id);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {selectedShipment === shipment.id ? 'Tutup' : 'Lihat'}
                              </Button>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {selectedShipment === shipment.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t"
                            >
                              <Separator className="my-3" />

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Waktu Dibuat</p>
                                  <p className="text-sm flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(shipment.createdAt)}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Berat</p>
                                  <p className="text-sm">⚖️ {shipment.weight}</p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Harga</p>
                                  <p className="text-sm text-[#007BFF]">
                                    💰 Rp {shipment.price.toLocaleString('id-ID')}
                                  </p>
                                </div>

                                {shipment.locker !== '-' && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Lokasi Loker</p>
                                    <p className="text-sm flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-[#007BFF]" />
                                      {shipment.locker}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-[#007BFF] hover:bg-blue-600"
                                  onClick={() => handlePrintReceipt(shipment.packageCode)}
                                >
                                  <Printer className="w-4 h-4 mr-2" />
                                  Cetak Resi
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => console.log('View full details:', shipment.id)}
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Detail Lengkap
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
