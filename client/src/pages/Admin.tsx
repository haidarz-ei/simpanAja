import Header from "@/components/Header";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function Admin() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <AdminDashboard />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
