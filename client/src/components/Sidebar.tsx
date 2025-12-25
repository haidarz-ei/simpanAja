import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  CreditCard,
  Settings,
  ChevronLeft,
  X,
  Menu,
  Home,
  FileText,
  History,
} from "lucide-react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

interface SidebarProps {
  menuItems?: SidebarMenuItem[];
  logo?: React.ReactNode;
  userInfo?: {
    name: string;
    role?: string;
    avatar?: string;
  };
  variant?: "default" | "admin";
  showHamburger?: boolean;
  collapsible?: boolean;
}

const defaultMenuItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
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

export default function Sidebar({ menuItems = defaultMenuItems, logo, userInfo, variant = "default", showHamburger = true, collapsible }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Only allow collapsing if collapsible is true (default: false for non-admin, true for admin)
  const isCollapsible = collapsible ?? (variant === "admin");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [location] = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  const sidebarWidth = (isCollapsible && isCollapsed) ? "w-20" : "w-72";
  const sidebarBg = variant === "admin" 
    ? "bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800" 
    : "bg-white dark:bg-slate-900 border-r border-border";

  return (
    <>
      {/* Hamburger Button - Always visible on mobile */}
      {showHamburger && (
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-border hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      )}

      {/* Overlay - Mobile only */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          ${sidebarWidth}
          ${sidebarBg}
          flex flex-col
          shadow-2xl lg:shadow-none
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/10 dark:border-border">
          <AnimatePresence mode="wait">
            {(!isCollapsible || !isCollapsed) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                {logo || (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                      <Package className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl text-foreground">SimpanAja</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsible && isCollapsed && !logo && (
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Close button - Mobile only */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            {/* Collapse button - Desktop only, only show if collapsible */}
            {isCollapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`hidden lg:flex p-1.5 rounded-lg transition-colors ${
                  variant === "admin"
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-foreground"
                }`}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronLeft
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isCollapsed ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* User Info - Optional */}
        {userInfo && (
          <AnimatePresence>
            {(!isCollapsible || !isCollapsed) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 lg:p-6 border-b border-white/10 dark:border-border overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {userInfo.avatar ? (
                      <img src={userInfo.avatar} alt={userInfo.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{userInfo.name}</p>
                    {userInfo.role && (
                      <p className="text-xs text-muted-foreground truncate">{userInfo.role}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.id}>
                  <Link href={item.href}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      className={`
                        w-full
                        ${(isCollapsible && isCollapsed) ? "px-0 justify-center" : "justify-start"}
                        ${active 
                          ? variant === "admin" 
                            ? "bg-white/20 text-white hover:bg-white/30 shadow-lg" 
                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                          : variant === "admin"
                            ? "text-white/80 hover:bg-white/10 hover:text-white"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        }
                        transition-all duration-200
                        h-11
                        font-medium
                      `}
                      title={(isCollapsible && isCollapsed) ? item.label : ""}
                    >
                      <span className={(isCollapsible && isCollapsed) ? "text-xl" : ""}>
                        {item.icon}
                      </span>
                      <AnimatePresence>
                        {(!isCollapsible || !isCollapsed) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3 whitespace-nowrap overflow-hidden"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {item.badge && (!isCollapsible || !isCollapsed) && (
                        <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - Optional logout or other actions */}
        {variant === "admin" && (
          <AnimatePresence>
            {(!isCollapsible || !isCollapsed) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 border-t border-white/10 overflow-hidden"
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/80 hover:bg-red-500/20 hover:text-white"
                  onClick={() => {
                    // Handle logout
                    console.log("Logout");
                  }}
                >
                  <Settings className="w-5 h-5" />
                  <span className="ml-3">Pengaturan</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </aside>
    </>
  );
}

