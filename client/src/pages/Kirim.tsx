import Header from "@/components/Header";
import ShippingForm from "@/components/ShippingForm";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function Kirim() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <ShippingForm />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
