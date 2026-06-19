import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Settings, Store, ShieldCheck, Truck, LogOut } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { logoutUser } from "../../services/authService";
import "./shop.css";

export default function ShopLayout() {
  const { items } = useCartStore();
  const { user, isAdmin, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const accountLabel = role === "admin" ? "Admin Hesabı" : role === "dealer" ? "Bayi Panelim" : "Hesabım";

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate("/");
  };

  return (
    <div className="shop-layout">
      <div className="shop-top-strip">
        <span>
          <ShieldCheck size={14} />
          Yetkili bayi fiyatları ve pazaryeri operasyonu tek sistemde
        </span>
        <span>
          <Truck size={14} />
          Aynı gün kargo destekli depo akışı
        </span>
      </div>

      <header className="shop-header">
        <Link to="/" className="shop-brand">
          <Store size={24} />
          DepoMarket
        </Link>

        <div className="shop-search">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Ürün, kategori, marka veya bayi fiyatı ara" />
        </div>

        <nav className="shop-nav">
          {user ? (
            <>
              <Link to="/account" className="nav-icon-block">
                <User size={20} />
                <span>{accountLabel}</span>
              </Link>
              <button type="button" onClick={handleLogout} className="nav-icon-block">
                <LogOut size={20} />
                <span>Çıkış</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-icon-block">
              <User size={20} />
              <span>Giriş Yap</span>
            </Link>
          )}

          {isAdmin ? (
            <button type="button" onClick={() => navigate("/admin")} className="nav-icon-block">
              <Settings size={20} />
              <span>Admin</span>
            </button>
          ) : null}

          <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingCart size={24} />
            {cartItemCount > 0 ? <span className="cart-badge">{cartItemCount}</span> : null}
            <span>Sepetim</span>
          </Link>
        </nav>
      </header>

      <main className="shop-main">
        <Outlet />
      </main>

      <footer className="shop-footer">
        <div>
          <strong>DepoMarket</strong>
          <p>Bayi ağı, pazaryeri yönetimi ve güçlü e-ticaret vitrini bir arada.</p>
        </div>
        <div className="shop-footer-links">
          <Link to="/">Kurumsal</Link>
          <Link to="/">Yardım Merkezi</Link>
          <Link to="/">İletişim</Link>
        </div>
      </footer>
    </div>
  );
}
