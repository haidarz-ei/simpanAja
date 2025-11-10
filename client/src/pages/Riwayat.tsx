import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MapPin, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { packageService } from "@/lib/packageService";
import { PackageData } from "@/lib/supabase";

// Dummy data for demonstration
const dummyPackages: PackageData[] = [
  {
    id: "1",
    created_at: "2024-11-15T10:00:00Z",
    last_updated: "2024-11-15T10:00:00Z",
    sender_name: "John Doe",
    sender_phone: "08123456789",
    sender_address: "Jl. Sudirman No. 1",
    sender_city: "Jakarta",
    sender_province: "DKI Jakarta",
    sender_district: "Tanah Abang",
    sender_postal_code: "10230",
    receiver_name: "Jane Smith",
    receiver_phone: "08198765432",
    receiver_address: "Jl. Malioboro No. 10",
    receiver_city: "Yogyakarta",
    receiver_province: "DI Yogyakarta",
    receiver_district: "Yogyakarta",
    receiver_postal_code: "55281",
    package_weight: "2.5",
    package_description: "Buku dan elektronik",
    package_length: "30",
    package_width: "20",
    package_height: "15",
    courier_name: "JNE REG",
    courier_service_code: "REG",
    packing_options: ["bubble_wrap"],
    delivery_method: "pickup",
    selected_office: "Kantor Pusat",
    status: "in_progress",
    step_completed: 2,
    is_complete: false,
    tracking_code: "SP-2024-001234",
    submitted_at: undefined,
    deleted: false,
    user_session_id: "session_123",
    device_id: "device_123",
    payment_delivery_method: "pickup",
    payment_method: "transfer",
    payment_selected_office: "Kantor Pusat",
    payment_total_cost: 25000,
    payment_status: "pending",
    payment_completed_at: undefined
  },
  {
    id: "2",
    created_at: "2024-11-10T08:30:00Z",
    last_updated: "2024-11-12T14:20:00Z",
    sender_name: "Ahmad Rahman",
    sender_phone: "08134567890",
    sender_address: "Jl. Malioboro No. 5",
    sender_city: "Yogyakarta",
    sender_province: "DI Yogyakarta",
    sender_district: "Yogyakarta",
    sender_postal_code: "55281",
    receiver_name: "Budi Santoso",
    receiver_phone: "08187654321",
    receiver_address: "Jl. Asia Afrika No. 15",
    receiver_city: "Bandung",
    receiver_province: "Jawa Barat",
    receiver_district: "Bandung",
    receiver_postal_code: "40111",
    package_weight: "1.0",
    package_description: "Dokumen penting",
    package_length: "25",
    package_width: "18",
    package_height: "5",
    courier_name: "TIKI REG",
    courier_service_code: "REG",
    packing_options: ["document"],
    delivery_method: "dropoff",
    selected_office: "Kantor Bandung",
    status: "completed",
    step_completed: 3,
    is_complete: true,
    tracking_code: "SP-2024-001235",
    submitted_at: "2024-11-12T14:20:00Z",
    deleted: false,
    user_session_id: "session_123",
    device_id: "device_123",
    payment_delivery_method: "dropoff",
    payment_method: "cod",
    payment_selected_office: "Kantor Bandung",
    payment_total_cost: 15000,
    payment_status: "paid",
    payment_completed_at: "2024-11-12T14:20:00Z"
  },
  {
    id: "3",
    created_at: "2024-11-08T12:15:00Z",
    last_updated: "2024-11-09T09:45:00Z",
    sender_name: "Maya Sari",
    sender_phone: "08156789012",
    sender_address: "Jl. Sudirman No. 25",
    sender_city: "Surabaya",
    sender_province: "Jawa Timur",
    sender_district: "Surabaya",
    sender_postal_code: "60271",
    receiver_name: "Rina Putri",
    receiver_phone: "08123456789",
    receiver_address: "Jl. Malioboro No. 8",
    receiver_city: "Yogyakarta",
    receiver_province: "DI Yogyakarta",
    receiver_district: "Yogyakarta",
    receiver_postal_code: "55281",
    package_weight: "3.2",
    package_description: "Pakaian dan aksesoris",
    package_length: "40",
    package_width: "30",
    package_height: "20",
    courier_name: "J&T EZ",
    courier_service_code: "EZ",
    packing_options: ["bubble_wrap", "fragile"],
    delivery_method: "pickup",
    selected_office: "Kantor Surabaya",
    status: "returned",
    step_completed: 3,
    is_complete: false,
    tracking_code: "SP-2024-001236",
    submitted_at: "2024-11-09T09:45:00Z",
    deleted: false,
    user_session_id: "session_123",
    device_id: "device_123",
    payment_delivery_method: "pickup",
    payment_method: "transfer",
    payment_selected_office: "Kantor Surabaya",
    payment_total_cost: 35000,
    payment_status: "paid",
    payment_completed_at: "2024-11-09T09:45:00Z"
  },
  {
    id: "4",
    created_at: "2024-11-05T14:20:00Z",
    last_updated: "2024-11-06T11:30:00Z",
    sender_name: "Dedi Kurniawan",
    sender_phone: "08167890123",
    sender_address: "Jl. Diponegoro No. 12",
    sender_city: "Semarang",
    sender_province: "Jawa Tengah",
    sender_district: "Semarang",
    sender_postal_code: "50241",
    receiver_name: "Siti Aminah",
    receiver_phone: "08134567890",
    receiver_address: "Jl. Malioboro No. 3",
    receiver_city: "Yogyakarta",
    receiver_province: "DI Yogyakarta",
    receiver_district: "Yogyakarta",
    receiver_postal_code: "55281",
    package_weight: "0.8",
    package_description: "Surat dan dokumen",
    package_length: "22",
    package_width: "15",
    package_height: "3",
    courier_name: "POS Indonesia",
    courier_service_code: "REG",
    packing_options: ["document"],
    delivery_method: "dropoff",
    selected_office: "Kantor Semarang",
    status: "cancelled",
    step_completed: 2,
    is_complete: false,
    tracking_code: "SP-2024-001237",
    submitted_at: undefined,
    deleted: false,
    user_session_id: "session_123",
    device_id: "device_123",
    payment_delivery_method: "dropoff",
    payment_method: "cod",
    payment_selected_office: "Kantor Semarang",
    payment_total_cost: 12000,
    payment_status: "pending",
    payment_completed_at: undefined
  }
];

export default function Riwayat() {
  const [, navigate] = useLocation();
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await packageService.getPackages();
        // If no data from database, use dummy data for demonstration
        if (data.length === 0) {
          setPackages(dummyPackages);
        } else {
          setPackages(data);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        // Fallback to dummy data if database fails
        setPackages(dummyPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const statusPackages = packages.filter(pkg => !pkg.is_complete && pkg.status !== 'cancelled' && pkg.status !== 'returned');
  const riwayatPackages = packages.filter(pkg => pkg.is_complete);
  const returnPackages = packages.filter(pkg => pkg.status === 'returned');
  const dibatalkanPackages = packages.filter(pkg => pkg.status === 'cancelled');

  const renderPackageList = (packages: PackageData[]) => (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Memuat data paket...
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Tidak ada paket dalam kategori ini
        </div>
      ) : (
        packages.map((pkg) => (
          <Card key={pkg.id} className="p-6 hover-elevate" data-testid={`history-item-${pkg.id}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="font-mono font-semibold">{pkg.tracking_code || `PKG-${pkg.id.slice(-6)}`}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{pkg.receiver_name || 'N/A'} - {pkg.receiver_city || 'N/A'}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {pkg.courier_name || 'N/A'} • {new Date(pkg.created_at).toLocaleDateString('id-ID')}
                </div>
              </div>

              <div>
                {pkg.is_complete && (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                    Selesai
                  </Badge>
                )}
                {!pkg.is_complete && pkg.status === 'completed' && (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                    Selesai
                  </Badge>
                )}
                {!pkg.is_complete && pkg.status !== 'cancelled' && pkg.status !== 'returned' && (
                  <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                    Dalam Perjalanan
                  </Badge>
                )}
                {pkg.status === 'returned' && (
                  <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
                    Return
                  </Badge>
                )}
                {pkg.status === 'cancelled' && (
                  <Badge className="bg-red-500/10 text-red-700 dark:text-red-400">
                    Dibatalkan
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="min-h-[calc(100vh-4rem)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Riwayat Pengiriman</h1>
              <p className="text-muted-foreground text-sm">
                Lihat status dan riwayat pengiriman paket Anda
              </p>
            </div>
          </div>

          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="riwayat">Selesai</TabsTrigger>
              <TabsTrigger value="return">Return</TabsTrigger>
              <TabsTrigger value="dibatalkan">Dibatalkan</TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="mt-6">
              {renderPackageList(statusPackages)}
            </TabsContent>

            <TabsContent value="riwayat" className="mt-6">
              {renderPackageList(riwayatPackages)}
            </TabsContent>

            <TabsContent value="return" className="mt-6">
              {renderPackageList(returnPackages)}
            </TabsContent>

            <TabsContent value="dibatalkan" className="mt-6">
              {renderPackageList(dibatalkanPackages)}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
