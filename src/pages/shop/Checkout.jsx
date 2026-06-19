import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { createOrder } from '../../services/orderService';
import { updateProduct, getProductById } from '../../services/productService';

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create Order
      const newOrder = {
        customer: formData.fullName,
        email: user?.email || 'guest@example.com',
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        items: items.length, // simple item count
        total: getCartTotal(),
        priority: 'Normal',
        cartItems: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price }))
      };

      await createOrder(newOrder);

      // Decrease stock conceptually
      for (const item of items) {
        const prod = await getProductById(item.id);
        if (prod && prod.stock >= item.quantity) {
          await updateProduct(item.id, { stock: prod.stock - item.quantity });
        }
      }

      clearCart();
      alert("Siparişiniz başarıyla alındı!");
      navigate('/');

    } catch (error) {
      console.error(error);
      alert("Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1a202c' }}>Ödeme ve Teslimat</h1>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Ad Soyad</label>
            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Telefon</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Şehir</label>
            <input required type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Açık Adres</label>
            <textarea required name="address" value={formData.address} onChange={handleChange} rows="3" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#4a5568', display: 'block' }}>Ödenecek Tutar</span>
              <strong style={{ fontSize: '1.5rem', color: '#2d6a4f' }}>{getCartTotal().toLocaleString('tr-TR')} TL</strong>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ background: '#2d6a4f', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'İşleniyor...' : 'Siparişi Onayla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
