import { ReactNode } from "react";
import Sidebar, { SidebarMenuItem } from "./Sidebar";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  CreditCard,
  Settings,
  Home,
  Package,
  History,
} from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  variant?: "default" | "admin";
  menuItems?: SidebarMenuItem[];
}

const defaultMenuItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    href: "/",
  },
  {
    id: "data-pengiriman",
    label: "Data Pengiriman",
    icon: <FileText className="w-5 h-5" />,
    href: "/packages",
  },
  {
    id: "tambah-paket",
    label: "Tambah Paket",
    icon: <PlusCircle className="w-5 h-5" />,
    href: "/packages",
  },
  {
    id: "pembayaran",
    label: "Pembayaran",
    icon: <CreditCard className="w-5 h-5" />,
    href: "/pembayaran",
  },
  {
    id: "pengaturan",
    label: "Pengaturan",
    icon: <Settings className="w-5 h-5" />,
    href: "/pengaturan",
  },
];

export default function AppLayout({ children, variant = "default", menuItems = defaultMenuItems }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar variant={variant} menuItems={menuItems} />
      <main className="flex-1 lg:ml-0">{children}</main>
    </div>
  );
}

