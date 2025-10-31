import { Clock, CreditCard, Users, BarChart3, MessageCircle, Package } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Clock,
    title: "Akses 24/7",
    description: "Kirim paket kapan saja tanpa perlu menunggu jam operasional admin."
  },
  {
    icon: CreditCard,
    title: "Hitung Ongkir Otomatis",
    description: "Sistem menghitung tarif pengiriman secara real-time dari berbagai kurir."
  },
  {
    icon: Package,
    title: "Multi Kurir",
    description: "Pilih dari berbagai pilihan kurir seperti JNE, JNT, SiCepat, dan lainnya."
  },
  {
    icon: BarChart3,
    title: "Dashboard Admin",
    description: "Admin dapat memantau semua pengiriman dalam satu dashboard terpusat."
  },
  {
    icon: MessageCircle,
    title: "Bantuan Interaktif",
    description: "Panduan otomatis membantu pengguna baru dalam proses pengiriman."
  },
  {
    icon: Users,
    title: "Privasi Terjaga",
    description: "Proses mandiri menjaga privasi tanpa interaksi langsung."
  }
];

export default function FeatureSection() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kenapa Memilih SimpanAja?
          </h2>
          <p className="text-lg text-muted-foreground">
            Solusi lengkap untuk kebutuhan pengiriman Anda dengan teknologi modern dan kemudahan akses
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="p-6 hover-elevate" data-testid={`card-feature-${idx}`}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
