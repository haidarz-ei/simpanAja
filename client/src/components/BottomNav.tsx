import { Home, Package, Clock, User } from "lucide-react";
import { Link, useLocation } from "wouter";

const navItems = [
  { icon: Home, label: "Beranda", path: "/", testId: "nav-home" },
  { icon: Package, label: "Kirim", path: "/kirim", testId: "nav-kirim" },
  { icon: Clock, label: "Riwayat", path: "/riwayat", testId: "nav-riwayat" },
  { icon: User, label: "Profil", path: "/profil", testId: "nav-profil" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              data-testid={item.testId}
            >
              <button
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover-elevate'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
