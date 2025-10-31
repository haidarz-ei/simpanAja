import { FileText, Truck, CreditCard } from "lucide-react";

const steps = [
  {
    icon: FileText,
    number: "01",
    title: "Isi Form Pengiriman",
    description: "Masukkan data pengirim, penerima, dan detail paket Anda dengan mudah"
  },
  {
    icon: Truck,
    number: "02",
    title: "Pilih Kurir & Layanan",
    description: "Sistem akan menampilkan pilihan kurir dengan harga dan estimasi waktu"
  },
  {
    icon: CreditCard,
    number: "03",
    title: "Bayar & Selesai",
    description: "Lakukan pembayaran dan paket Anda siap untuk dijemput kurir"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cara Kerja SimpanAja
          </h2>
          <p className="text-lg text-muted-foreground">
            Hanya 3 langkah mudah untuk mengirim paket Anda
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative" data-testid={`step-${idx}`}>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-border" 
                     style={{ transform: 'translateX(50%)' }} />
              )}
              
              <div className="relative bg-card border border-card-border rounded-xl p-6 text-center hover-elevate">
                <div className="inline-flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4 relative z-10">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
