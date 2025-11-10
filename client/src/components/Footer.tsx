import { Package } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiFacebook } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-card-border py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">SimpanAja</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Solusi pengiriman mandiri yang memudahkan Anda mengirim paket dimana saja dan kapan saja.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Kirim Paket</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Cek Ongkir</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Lacak Paket</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Riwayat</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Perusahaan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Kontak</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hubungi Kami</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover-elevate transition-colors" data-testid="link-whatsapp">
                <SiWhatsapp className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover-elevate transition-colors" data-testid="link-instagram">
                <SiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover-elevate transition-colors" data-testid="link-facebook">
                <SiFacebook className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Email: info@simpanaja.com<br />
              WhatsApp: +62 812-3456-7890
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 SimpanAja. All rights reserved.
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Terintegrasi dengan berbagai kurir terpercaya</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
