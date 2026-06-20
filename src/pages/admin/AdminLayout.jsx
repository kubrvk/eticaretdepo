import React from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { ClipboardList, LayoutDashboard, LogOut, PackageCheck, ShieldCheck, Store } from "lucide-react";
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
        <div className="brand admin-brand">
          <div className="admin-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img">
              <path d="M8 17.5 24 8l16 9.5v18.2L24 45 8 35.7V17.5Z" />
              <path d="M15 20.5 24 15l9 5.5v10.3L24 36l-9-5.2V20.5Z" />
              <path d="M24 15v21M15 20.5l9 5.2 9-5.2" />
            </svg>
          </div>
          <div>
            <strong>E-Ticaret Depo</strong>
            <span>Yönetim paneli</span>
          </div>
        </div>

        <div className="sidebar-summary">
          <ShieldCheck size={18} />
          <div>
            <strong>Yetkili Yönetim</strong>
            <span>Merkez depo, bayi ve pazaryeri akışı tek ekranda</span>
          </div>
        </div>

        <div className="sidebar-main">
          <nav aria-label="Ana menü">
            {menuItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <Link to="/" className="sidebar-site-link">
            <Store size={18} />
            Web sitesine dön
          </Link>
        </div>

        <div className="sidebar-bottom">
          <button type="button" onClick={handleLogout} className="sidebar-logout">
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <section className="workspace">
        <Outlet />
      </section>
    </main>
  );
}
