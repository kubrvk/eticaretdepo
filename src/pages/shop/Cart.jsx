import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function Cart() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '2rem', color: '#2d3748', marginBottom: '1rem' }}>Sepetiniz boş</h2>
        <p style={{ color: '#718096', marginBottom: '2rem' }}>Sepetinizde henüz ürün bulunmuyor. Hemen alışverişe başlayın!</p>
        <Link to="/" style={{ display: 'inline-block', backgroundColor: '#2d6a4f', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1a202c' }}>Sepetim</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
              
              <div style={{ flex: 1 }}>
                <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                  {item.name}
                </Link>
                <div style={{ color: '#2d6a4f', fontWeight: 'bold', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                  {item.price.toLocaleString('tr-TR')} TL
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f7fafc', padding: '0.5rem', borderRadius: '8px' }}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }} disabled={item.quantity <= 1}>
                  <Minus size={16} />
                </button>
                <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}>
                  <Plus size={16} />
                </button>
              </div>

              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', minWidth: '100px', textAlign: 'right' }}>
                {(item.price * item.quantity).toLocaleString('tr-TR')} TL
              </div>

              <button onClick={() => removeItem(item.id)} style={{ border: 'none', background: 'none', color: '#e53e3e', cursor: 'pointer', padding: '0.5rem' }} title="Ürünü Sil">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#2d3748', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>Sipariş Özeti</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#4a5568' }}>
              <span>Ara Toplam</span>
              <span>{getCartTotal().toLocaleString('tr-TR')} TL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: '#4a5568' }}>
              <span>Kargo</span>
              <span>Ücretsiz</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#1a202c', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <span>Genel Toplam</span>
              <span style={{ color: '#2d6a4f' }}>{getCartTotal().toLocaleString('tr-TR')} TL</span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              style={{ width: '100%', background: '#2d6a4f', color: 'white', border: 'none', padding: '1rem', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              Alışverişi Tamamla <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
