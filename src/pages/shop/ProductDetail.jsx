import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { getProductById } from '../../services/productService';
import { useCartStore } from '../../store/useCartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem' }}>Yükleniyor...</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '3rem' }}>Ürün bulunamadı.</div>;

  return (
    <div>
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#4a5568', fontSize: '1rem' }}
      >
        <ArrowLeft size={20} /> Geri Dön
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div>
          <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: '#1a202c' }}>{product.name}</h1>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d6a4f', marginBottom: '2rem' }}>
            {product.price?.toLocaleString('tr-TR')} TL
          </div>
          
          <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.1rem' }}>
            {product.description}
          </p>

          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#4a5568' }}>Stok Durumu:</span>
              <span style={{ fontWeight: 'bold', color: product.stock > 0 ? '#38a169' : '#e53e3e' }}>
                {product.stock > 0 ? `${product.stock} adet stokta` : 'Tükendi'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#4a5568' }}>SKU:</span>
              <span style={{ fontWeight: '500' }}>{product.sku}</span>
            </div>
          </div>

          <button 
            className="add-to-cart-btn"
            style={{ padding: '1rem', fontSize: '1.1rem', marginTop: 'auto' }}
            onClick={() => addItem(product)}
            disabled={product.stock <= 0}
          >
            <ShoppingCart size={20} />
            {product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
          </button>
        </div>
      </div>
    </div>
  );
}
