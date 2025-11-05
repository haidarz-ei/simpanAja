import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";
import { ShipmentCard } from "@/components/ShipmentCard";
import { PackageFooter } from "@/components/PackageFooter";
import { packageService } from "@/lib/packageService";
import { PackageData } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";

export default function Packages() {
  const [, navigate] = useLocation();
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await packageService.getPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages:', error);
      // Don't show toast error for now since it's expected in development
      // toast({
      //   title: "Error",
      //   description: "Gagal memuat data paket",
      //   variant: "destructive",
      // });
      // Fallback to localStorage if Supabase fails
      const savedPackages = localStorage.getItem('simpanaja_packages');
      if (savedPackages) {
        const parsed = JSON.parse(savedPackages);
        const filtered = parsed.filter((pkg: PackageData) =>
          pkg.sender_name || pkg.receiver_name || pkg.package_weight
        );
        setPackages(filtered);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateCompleteness = (pkg: PackageData): number => {
    // Required fields for sender (4 required)
    const senderRequired = [
      pkg.sender_name,
      pkg.sender_phone,
      pkg.sender_address,
      pkg.sender_city,
    ].filter(f => f && f.trim() !== '').length;

    // Required fields for receiver (5 required)
    const receiverRequired = [
      pkg.receiver_name,
      pkg.receiver_phone,
      pkg.receiver_address,
      pkg.receiver_province,
      pkg.receiver_city,
      pkg.receiver_district,
    ].filter(f => f && f.trim() !== '').length;

    // Required fields for package (2 required)
    const packageRequired = [
      pkg.package_weight,
      pkg.package_description,
    ].filter(f => f && f.trim() !== '').length;

    // Total required fields: 4 (sender) + 5 (receiver) + 2 (package) = 11
    const totalRequired = 11;
    const totalFilled = senderRequired + receiverRequired + packageRequired;

    return Math.round((totalFilled / totalRequired) * 100);
  };

  const handleNewPackage = () => {
    navigate('/kirim');
  };

  const handleEditPackage = (id: string) => {
    navigate(`/kirim?edit=${id}`);
  };

  const handleDeletePackage = async (id: string) => {
    try {
      await packageService.deletePackage(id);
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
      setSelectedPackages(prev => prev.filter(selectedId => selectedId !== id));
      toast({
        title: "Berhasil",
        description: "Paket berhasil dihapus",
      });
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus paket",
        variant: "destructive",
      });
    }
  };

  const handleSelectPackage = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPackages(prev => [...prev, id]);
    } else {
      setSelectedPackages(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const completePackages = packages.filter(pkg => calculateCompleteness(pkg) === 100);
      setSelectedPackages(completePackages.map(pkg => pkg.id));
    } else {
      setSelectedPackages([]);
    }
  };

  const totalCost = packages.reduce((sum, pkg) => {
    const completeness = calculateCompleteness(pkg);
    if (completeness === 100) {
      // Mock cost calculation based on weight
      const weight = parseFloat(pkg.package_weight || '0');
      return sum + (weight * 10000); // Rp 10,000 per kg
    }
    return sum;
  }, 0);

  const packageCount = packages.length;
  const selectedCount = selectedPackages.length;

  // Convert packages to ShipmentCard format
  const shipmentCards = packages.map((pkg) => {
    const completeness = calculateCompleteness(pkg);
    const isComplete = completeness === 100;

    // Calculate total cost for complete packages
    let totalCost: number | undefined;
    if (isComplete && pkg.package_weight) {
      const weight = parseFloat(pkg.package_weight);
      // Mock cost calculation: base cost + weight-based cost
      const baseCost = 15000; // Base shipping cost
      const weightCost = weight * 10000; // Rp 10,000 per kg
      totalCost = baseCost + weightCost;
    }

    return {
      type: isComplete ? "complete" as const : "incomplete" as const,
      id: pkg.id,
      sender: { name: pkg.sender_name || "" },
      recipient: { name: pkg.receiver_name || "" },
      address: pkg.receiver_address ? `${pkg.receiver_address}, ${pkg.receiver_city || ''}` : undefined,
      weight: pkg.package_weight ? `${pkg.package_weight} kg` : undefined,
      packageCode: pkg.tracking_code || undefined,
      totalCost,
      selected: selectedPackages.includes(pkg.id),
      onSelect: isComplete ? (checked: boolean) => handleSelectPackage(pkg.id, checked) : undefined,
      onAction: () => handleEditPackage(pkg.id),
      onDelete: () => handleDeletePackage(pkg.id),
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-600">Memuat data paket...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-background pb-32 relative">
    <Header />

    {/* Main Content */}
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length === 0 && (
          <ShipmentCard type="empty" onAction={handleNewPackage} />
        )}

        {shipmentCards.map((card) => (
          <ShipmentCard key={card.id} {...card} />
        ))}
      </div>

      {selectedPackages.length > 0 && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-green-800">
            {selectedPackages.length} paket dipilih
          </p>
        </div>
      )}

      <PackageFooter
        totalPackages={packageCount}
        selectedCount={selectedCount}
        totalCost={totalCost}
        allSelected={
          selectedCount ===
            packages.filter((pkg) => calculateCompleteness(pkg) === 100).length &&
          selectedCount > 0
        }
        onSelectAll={handleSelectAll}
        onContinue={() => navigate("/pembayaran")}
      />
    </main>

    {/* Floating Add Button — keluarin dari main */}
    <div className="fixed bottom-40 right-6 z-50">
      <Button
        onClick={handleNewPackage}
        size="lg"
        className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-400/50 transition-transform hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  </div>
);

}


