import { Package, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground" data-testid="link-logo">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            SimpanAja
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors" data-testid="link-home">
              Beranda
            </Link>
            <Link href="/packages" className="text-sm font-medium text-foreground hover:text-primary transition-colors" data-testid="link-kirim">
              Kirim Paket
            </Link>
            <Link href="/riwayat" className="text-sm font-medium text-foreground hover:text-primary transition-colors" data-testid="link-riwayat">
              Riwayat
            </Link>
            <Link href="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors" data-testid="link-admin">
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:inline-flex" data-testid="button-login">
              Masuk
            </Button>
            <Button size="sm" className="hidden md:inline-flex" data-testid="button-register">
              Daftar
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
