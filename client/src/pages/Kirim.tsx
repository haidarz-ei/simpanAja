import Header from "@/components/Header";
import ShippingForm from "@/components/ShippingForm";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Kirim() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/packages')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Form Pengiriman</h1>
              <p className="text-muted-foreground text-sm">
                Isi detail pengiriman paket Anda
              </p>
            </div>
          </div>
        </div>
        <ShippingForm />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
