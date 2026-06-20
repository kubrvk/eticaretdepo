import React, { useState } from "react";
import { Outlet, Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingCart, User, Search, Settings, ShieldCheck, Truck, LogOut } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { logoutUser } from "../../services/authService";
import "./shop.css";

export default function ShopLayout() {
  const { items } = useCartStore();
  const { user, isAdmin, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  const accountLabel = role === "admin" ? "Admin Hesabı" : role === "dealer" ? "Bayi Panelim" : "Hesabım";

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}` : "/");
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
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img">
              <path d="M8 17.5 24 8l16 9.5v18.2L24 45 8 35.7V17.5Z" />
              <path d="M15 20.5 24 15l9 5.5v10.3L24 36l-9-5.2V20.5Z" />
              <path d="M24 15v21M15 20.5l9 5.2 9-5.2" />
            </svg>
          </span>
          <span className="brand-text">
            <strong>E-Ticaret</strong>
            <small>Depo</small>
          </span>
        </Link>

        <form className="shop-search" onSubmit={handleSearchSubmit}>
          <Search size={20} className="search-icon" />
          <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Ürün, kategori, marka veya bayi fiyatı ara" />
        </form>

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
          <strong>E-Ticaret Depo</strong>
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
