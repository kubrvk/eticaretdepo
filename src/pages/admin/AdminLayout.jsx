import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, PackageCheck, ClipboardList, Building2, LogOut, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { logoutUser } from "../../services/authService";

const menuItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Ürün Yönetimi", icon: PackageCheck },
  { to: "/admin/orders", label: "Sipariş Operasyonu", icon: ClipboardList },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error);
    }
    logout();
    navigate("/login");
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">
            <Building2 size={26} />
          </div>
          <div>
            <strong>DepoBayi Pro</strong>
            <span>Distribütör ve pazaryeri yönetimi</span>
          </div>
        </div>

        <div className="sidebar-summary">
          <ShieldCheck size={18} />
          <div>
            <strong>Yetkili Yönetim</strong>
            <span>Merkez depo, bayi ve pazaryeri akışı tek ekranda</span>
          </div>
        </div>

        <nav aria-label="Ana menü">
          {menuItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <button type="button" onClick={handleLogout} className="sidebar-logout">
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </nav>
      </aside>

      <section className="workspace">
        <Outlet />
      </section>
    </main>
  );
}
