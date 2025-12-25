import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Sidebar, { SidebarMenuItem } from "@/components/Sidebar";
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  Eye,
  Printer,
  Bell,
  MapPin,
  DollarSign,
  FileText,
  Copy,
  LayoutDashboard,
  FileText as FileTextIcon,
  PlusCircle,
  CreditCard,
  Settings,
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
    pending: { label: "Menunggu Pembayaran", className: "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-400 border border-amber-300/50 dark:border-amber-700/50 shadow-sm" },
    paid: { label: "Sudah Bayar", className: "bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-400 border border-blue-300/50 dark:border-blue-700/50 shadow-sm" },
    processing: { label: "Sedang Diproses", className: "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 border border-purple-300/50 dark:border-purple-700/50 shadow-sm" },
    shipped: { label: "Dikirim ke Kurir", className: "bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-300/50 dark:border-indigo-700/50 shadow-sm" },
    selesai: { label: "Selesai (Di Locker)", className: "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 border border-green-300/50 dark:border-green-700/50 shadow-sm" },
  };

  const variant = variants[status] || variants.pending;
  return (
    <Badge className={`${variant.className} font-medium px-3 py-1.5 rounded-full backdrop-blur-sm`}>
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
  const [trackingNumberModal, setTrackingNumberModal] = useState<{ open: boolean; trackingNumber: string; packageCode: string }>({
    open: false,
    trackingNumber: "",
    packageCode: "",
  });

  // Admin menu items
  const adminMenuItems: SidebarMenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/admin",
    },
    {
      id: "data-pengiriman",
      label: "Data Pengiriman",
      icon: <FileTextIcon className="w-5 h-5" />,
      href: "/admin/pengiriman",
    },
    {
      id: "tambah-paket",
      label: "Tambah Paket",
      icon: <PlusCircle className="w-5 h-5" />,
      href: "/admin/tambah-paket",
    },
    {
      id: "pembayaran",
      label: "Pembayaran",
      icon: <CreditCard className="w-5 h-5" />,
      href: "/admin/pembayaran",
    },
    {
      id: "pengaturan",
      label: "Pengaturan",
      icon: <Settings className="w-5 h-5" />,
      href: "/admin/pengaturan",
    },
  ];

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

  const handleViewTrackingNumber = (trackingNumber: string, packageCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTrackingNumberModal({
      open: true,
      trackingNumber,
      packageCode,
    });
  };

  const handleCopyTrackingNumber = () => {
    navigator.clipboard.writeText(trackingNumberModal.trackingNumber);
    // You can add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-auto">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-[1920px] mx-auto">
        <div className="flex min-h-screen">
          {/* Sidebar Component */}
          <Sidebar
            variant="admin"
            menuItems={adminMenuItems}
            userInfo={{
              name: "Haidar Jaimul Adyan",
              role: "Admin",
            }}
            showHamburger={true}
            collapsible={true}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 sticky top-0 z-30 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Dashboard Admin
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Kelola semua pengiriman dalam satu tempat</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Notification Bell */}
                  <div className="relative">
                    <Button variant="outline" size="icon" className="relative hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-md">
                      <Bell className="w-5 h-5" />
                      {showNotification && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white dark:border-slate-900"
                        />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="p-4 sm:p-6 lg:p-8 bg-transparent">
              {/* WhatsApp Notification */}
              {showNotification && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-6"
                >
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300/50 dark:border-green-700/50 p-5 lg:p-6 shadow-lg backdrop-blur-sm">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-6 lg:p-7 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800/50 border-blue-200/50 dark:border-slate-700 hover:from-blue-500 hover:to-blue-600 hover:text-white hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 group-hover:bg-white/20 rounded-xl">
                        <Package className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-500 group-hover:text-green-200 transition-colors" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold mb-1" data-testid="text-total-shipments">{totalShipments}</div>
                    <div className="text-sm text-muted-foreground group-hover:text-blue-50 transition-colors font-medium">Total Pengiriman</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-6 lg:p-7 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-slate-800/50 border-emerald-200/50 dark:border-slate-700 hover:from-emerald-500 hover:to-emerald-600 hover:text-white hover:shadow-2xl hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-white/20 rounded-xl">
                        <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-500 group-hover:text-green-200 transition-colors" />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold mb-1 truncate">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                    <div className="text-sm text-muted-foreground group-hover:text-emerald-50 transition-colors font-medium">Total Pendapatan</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-6 lg:p-7 bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-800 dark:to-slate-800/50 border-amber-200/50 dark:border-slate-700 hover:from-amber-500 hover:to-amber-600 hover:text-white hover:shadow-2xl hover:shadow-amber-500/25 hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/30 group-hover:bg-white/20 rounded-xl">
                        <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold mb-1">{pendingCount}</div>
                    <div className="text-sm text-muted-foreground group-hover:text-amber-50 transition-colors font-medium">Menunggu</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-6 lg:p-7 bg-gradient-to-br from-white to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/50 border-indigo-200/50 dark:border-slate-700 hover:from-indigo-500 hover:to-indigo-600 hover:text-white hover:shadow-2xl hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-white/20 rounded-xl">
                        <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold mb-1" data-testid="text-in-transit">{inTransitCount}</div>
                    <div className="text-sm text-muted-foreground group-hover:text-indigo-50 transition-colors font-medium">Dalam Perjalanan</div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-6 lg:p-7 bg-gradient-to-br from-white to-green-50/50 dark:from-slate-800 dark:to-slate-800/50 border-green-200/50 dark:border-slate-700 hover:from-green-500 hover:to-green-600 hover:text-white hover:shadow-2xl hover:shadow-green-500/25 hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-sm group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 group-hover:bg-white/20 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold mb-1" data-testid="text-completed">{completedCount}</div>
                    <div className="text-sm text-muted-foreground group-hover:text-green-50 transition-colors font-medium">Selesai</div>
                  </Card>
                </motion.div>
              </div>

              {/* Shipments List */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-4 sm:p-6 lg:p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-gray-200/50 dark:border-slate-800/50 shadow-xl">
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                      <Input
                        placeholder="Cari kode paket, nomor resi, pengirim, atau penerima..."
                        className="pl-12 pr-4 h-12 bg-white/90 dark:bg-slate-800/90 border-2 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm focus:shadow-md transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        data-testid="input-search"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 lg:space-y-4 max-h-[600px] lg:max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="hidden lg:grid grid-cols-7 gap-4 pb-4 border-b border-gray-200/50 dark:border-slate-700/50 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
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
                          className={`p-4 lg:p-5 transition-all backdrop-blur-sm ${
                            selectedShipment === shipment.id
                              ? 'border-blue-500 dark:border-blue-400 border-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 shadow-lg scale-[1.01]'
                              : 'border-gray-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md bg-white/60 dark:bg-slate-800/60'
                          }`}
                        >
                          <div
                            className="grid grid-cols-1 lg:grid-cols-7 gap-3 lg:gap-4 cursor-pointer"
                            onClick={() => handleViewDetails(shipment.id)}
                            data-testid={`shipment-row-${shipment.id}`}
                          >
                            <div className="lg:col-span-1">
                              <div className="lg:hidden text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Kode Paket</div>
                              <div className="font-mono text-sm lg:text-base font-semibold text-primary bg-primary/10 px-2 py-1 rounded inline-block">{shipment.packageCode}</div>
                            </div>

                            <div className="lg:col-span-1">
                              <div className="lg:hidden text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Nomor Resi</div>
                              {shipment.trackingNumber === '-' ? (
                                <span className="text-muted-foreground italic text-sm lg:text-base">-</span>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                                  onClick={(e) => handleViewTrackingNumber(shipment.trackingNumber, shipment.packageCode, e)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Lihat
                                </Button>
                              )}
                            </div>

                            <div className="lg:col-span-1">
                              <div className="lg:hidden text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Pengirim</div>
                              <div className="text-sm lg:text-base font-medium text-gray-900 dark:text-gray-100">{shipment.senderName}</div>
                            </div>

                            <div className="lg:col-span-1">
                              <div className="lg:hidden text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Penerima</div>
                              <div className="text-sm lg:text-base font-medium text-gray-900 dark:text-gray-100">{shipment.receiverName}</div>
                              <div className="text-xs lg:text-sm text-muted-foreground mt-0.5">{shipment.receiverCity}</div>
                            </div>

                            <div className="lg:col-span-1">
                              <div className="lg:hidden text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Kurir</div>
                              <div className="text-sm lg:text-base text-gray-700 dark:text-gray-300">{shipment.courier}</div>
                            </div>

                            <div className="lg:col-span-1">
                              <div className="lg:hidden text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Status</div>
                              {getStatusBadge(shipment.status)}
                            </div>

                            <div className="lg:col-span-1 flex items-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full lg:w-auto hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                                data-testid={`button-view-${shipment.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(shipment.id);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                <span className="hidden sm:inline">{selectedShipment === shipment.id ? 'Tutup' : 'Lihat'}</span>
                                <span className="sm:hidden">Detail</span>
                              </Button>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {selectedShipment === shipment.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200/50 dark:border-slate-700/50"
                            >
                              <Separator className="my-4 lg:my-5 bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent" />

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Waktu Dibuat</p>
                                  <p className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    {formatDate(shipment.createdAt)}
                                  </p>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50/50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Berat</p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">⚖️ {shipment.weight}</p>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
                                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Harga</p>
                                  <p className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Rp {shipment.price.toLocaleString('id-ID')}
                                  </p>
                                </div>

                                {shipment.locker !== '-' && (
                                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Lokasi Loker</p>
                                    <p className="text-sm font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                      <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                      {shipment.locker}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                  size="default"
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1 sm:flex-initial"
                                  onClick={() => handlePrintReceipt(shipment.packageCode)}
                                >
                                  <Printer className="w-4 h-4 mr-2" />
                                  Cetak Resi
                                </Button>

                                <Button
                                  size="default"
                                  variant="outline"
                                  className="border-2 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-200 flex-1 sm:flex-initial"
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

      {/* Tracking Number Modal */}
      <Dialog open={trackingNumberModal.open} onOpenChange={(open) => setTrackingNumberModal({ ...trackingNumberModal, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Nomor Resi
            </DialogTitle>
            <DialogDescription>
              Nomor resi untuk paket <span className="font-semibold text-foreground">{trackingNumberModal.packageCode}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Tracking Number</p>
                  <p className="font-mono text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 break-all">
                    {trackingNumberModal.trackingNumber}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="flex-shrink-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  onClick={handleCopyTrackingNumber}
                  title="Salin nomor resi"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => {
                  window.open(`https://www.jne.co.id/id/tracking/trace?awb=${trackingNumberModal.trackingNumber}`, '_blank');
                }}
              >
                Lacak di JNE
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setTrackingNumberModal({ ...trackingNumberModal, open: false })}
              >
                Tutup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
