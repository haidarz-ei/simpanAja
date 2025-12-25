import { ReactNode } from "react";
import Sidebar, { SidebarMenuItem } from "./Sidebar";

interface PageLayoutProps {
  children: ReactNode;
  sidebarMenuItems?: SidebarMenuItem[];
  sidebarVariant?: "default" | "admin";
  sidebarUserInfo?: {
    name: string;
    role?: string;
    avatar?: string;
  };
}

export default function PageLayout({ 
  children, 
  sidebarMenuItems,
  sidebarVariant = "default",
  sidebarUserInfo 
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar 
        variant={sidebarVariant} 
        menuItems={sidebarMenuItems}
        userInfo={sidebarUserInfo}
        showHamburger={true}
        collapsible={sidebarVariant === "admin"}
      />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}

