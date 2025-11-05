import Header from "@/components/Header";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AdminDashboard />
      <Footer />
      <BottomNav />
    </div>
  );
}
