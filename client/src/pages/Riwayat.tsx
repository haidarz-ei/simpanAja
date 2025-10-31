import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin } from "lucide-react";

//todo: remove mock functionality
const mockHistory = [
  {
    id: "1",
    trackingNumber: "SP-2024-001234",
    receiverName: "Siti Nurhaliza",
    receiverCity: "Jakarta",
    courier: "JNE REG",
    status: "dikirim",
    date: "30 Okt 2024",
  },
  {
    id: "2",
    trackingNumber: "SP-2024-001230",
    receiverName: "Budi Santoso",
    receiverCity: "Bandung",
    courier: "J&T EZ",
    status: "selesai",
    date: "28 Okt 2024",
  },
];

export default function Riwayat() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="min-h-[calc(100vh-4rem)] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Riwayat Pengiriman</h1>
          
          <div className="space-y-4">
            {mockHistory.map((item) => (
              <Card key={item.id} className="p-6 hover-elevate" data-testid={`history-item-${item.id}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-primary" />
                      <span className="font-mono font-semibold">{item.trackingNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>{item.receiverName} - {item.receiverCity}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.courier} • {item.date}
                    </div>
                  </div>
                  
                  <div>
                    {item.status === "dikirim" && (
                      <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400">
                        Dalam Perjalanan
                      </Badge>
                    )}
                    {item.status === "selesai" && (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                        Selesai
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
