import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Kirim from "@/pages/Kirim";
import Packages from "@/pages/Packages";
import Riwayat from "@/pages/Riwayat";
import Admin from "@/pages/Admin";
import Pembayaran from "@/pages/Pembayaran";

export const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/kirim", component: Kirim, name: "Kirim" },
  { path: "/packages", component: Packages, name: "Packages" },
  { path: "/pembayaran", component: Pembayaran, name: "Pembayaran" },
  { path: "/riwayat", component: Riwayat, name: "Riwayat" },
  { path: "/admin", component: Admin, name: "Admin" },
];

export function Router() {
  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} component={route.component} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}
