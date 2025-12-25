import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-bold text-xl text-foreground" data-testid="link-logo">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline">SimpanAja</span>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Beranda
            </a>
            <a href="/packages" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Kirim Paket
            </a>
            <a href="/riwayat" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Status
            </a>
            <a href="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Admin
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden lg:inline-flex" data-testid="button-login">
              Masuk
            </Button>
            <Button size="sm" className="hidden lg:inline-flex" data-testid="button-register">
              Daftar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
