import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, User, Package } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import './shop.css';

export default function ShopLayout() {
  const { items } = useCartStore();
  const { user, isAdmin } = useAuthStore();
  
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="shop-layout">
      <header className="shop-header">
        <Link to="/" className="shop-brand">
          <Package size={28} color="#2d6a4f" />
          DepoShop
        </Link>
        
        <nav className="shop-nav">
          <Link to="/">Ürünler</Link>
          
          {isAdmin && (
            <Link to="/admin" style={{ color: '#2d6a4f', fontWeight: 'bold' }}>Admin Panel</Link>
          )}

          {user ? (
            <span style={{color: '#718096'}}>Merhaba, {user.email.split('@')[0]}</span>
          ) : (
            <Link to="/login"><User size={20} /></Link>
          )}
          
          <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        </nav>
      </header>

      <main className="shop-main">
        <Outlet />
      </main>
      
      <footer style={{ textAlign: 'center', padding: '2rem', color: '#a0aec0', fontSize: '0.875rem' }}>
        &copy; 2026 DepoShop E-Commerce. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
