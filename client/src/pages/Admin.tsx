import Header from "@/components/Header";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hide Header and Footer on Admin page for cleaner design */}
      <div className="hidden">
        <Header />
      </div>
      <AdminDashboard />
      <div className="hidden">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}
