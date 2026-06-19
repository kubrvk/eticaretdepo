import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Settings } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import './shop.css';

export default function ShopLayout() {
  const { items } = useCartStore();
  const { user, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="shop-layout">
      <header className="shop-header">
        <Link to="/" className="shop-brand">
          DepoShop
        </Link>
        
        <div className="shop-search">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Aradığınız ürün, kategori veya markayı yazınız" />
        </div>

        <nav className="shop-nav">
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <User size={20} />
              <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Hesabım</span>
            </div>
          ) : (
            <Link to="/login">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <User size={20} />
                <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Giriş Yap</span>
              </div>
            </Link>
          )}

          {isAdmin && (
            <button onClick={() => navigate('/admin')}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Settings size={20} />
                <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Admin</span>
              </div>
            </button>
          )}

          <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
            <span style={{ fontSize: '0.75rem', marginTop: '28px', position: 'absolute', whiteSpace: 'nowrap', left: '-50%' }}>Sepetim</span>
          </Link>
        </nav>
      </header>

      <main className="shop-main">
        <Outlet />
      </main>
      
      <footer style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '0.875rem', backgroundColor: 'white', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Hakkımızda</Link>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Yardım</Link>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>İletişim</Link>
        </div>
        &copy; 2026 DepoShop E-Commerce. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
