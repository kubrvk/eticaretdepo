import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Warehouse, Boxes, PackageCheck, ClipboardList, Truck, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { logoutUser } from '../../services/authService';

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    }
    logout();
    navigate('/login');
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Warehouse size={28} />
          <div>
            <strong>DepoPanel</strong>
            <span>E-ticaret operasyonu</span>
          </div>
        </div>

        <nav aria-label="Ana menü">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
            <Boxes size={18} />Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => (isActive ? 'active' : '')}>
            <PackageCheck size={18} />Ürün Yönetimi
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
            <ClipboardList size={18} />Siparişler
          </NavLink>
          {/* <NavLink to="/admin/shipping" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Truck size={18} />Kargo
          </NavLink> */}
          
          <button onClick={handleLogout} style={{ marginTop: 'auto', background: 'transparent', color: '#b7c6c1', border: 'none', display: 'flex', gap: '10px', alignItems: 'center', padding: '12px', cursor: 'pointer', textAlign: 'left', fontSize: '0.88rem' }}>
            <LogOut size={18} /> Çıkış Yap
          </button>
        </nav>
      </aside>

      <section className="workspace">
        <Outlet />
      </section>
    </main>
  );
}
