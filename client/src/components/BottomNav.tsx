import { Home, Package, Box, Clock, Settings, User } from "lucide-react";
import { Link, useLocation } from "wouter";

const navItems = [
  { icon: Home, label: "Beranda", path: "/", testId: "nav-home" },
  { icon: Box, label: "Paket", path: "/packages", testId: "nav-packages" },
  { icon: User, label: "Saya", path: "/profile", testId: "nav-profile" },
  { icon: Clock, label: "Status", path: "/riwayat", testId: "nav-riwayat" },
  { icon: Settings, label: "Admin", path: "/admin", testId: "nav-admin" },
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
