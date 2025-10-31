import { Package, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      
      {/* Animated floating packages background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <Package 
              className="text-primary" 
              size={40 + Math.random() * 40}
              style={{ transform: `rotate(${Math.random() * 45}deg)` }}
            />
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
      `}</style>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                Layanan 24/7 Tanpa Henti
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Kirim Paket Kapan Saja,{" "}
              <span className="text-primary">Tanpa Menunggu</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              SimpanAja adalah solusi pengiriman mandiri yang memungkinkan Anda mengirim paket 
              kapan saja tanpa perlu menunggu admin. Cepat, mudah, dan profesional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8"
                data-testid="button-start-shipping"
                onClick={() => console.log('Navigate to shipping form')}
              >
                Mulai Kirim Sekarang
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto px-8"
                data-testid="button-learn-more"
                onClick={() => console.log('Scroll to features')}
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Multi Kurir</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Aman & Terpercaya</span>
              </div>
            </div>
          </div>
          
          <div className="relative lg:block hidden">
            <div className="relative bg-card border border-card-border rounded-2xl p-8 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-semibold">SP-2024-001234</p>
                  </div>
                  <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    Dikirim
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    { status: "Paket Diterima", time: "10:30", active: false },
                    { status: "Dalam Perjalanan", time: "14:20", active: true },
                    { status: "Tiba di Kota Tujuan", time: "-", active: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-primary' : 'bg-muted'}`} />
                      <div className="flex-1">
                        <p className={`text-sm ${item.active ? 'font-semibold' : 'text-muted-foreground'}`}>
                          {item.status}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
