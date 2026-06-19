import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { useCartStore } from '../../store/useCartStore';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Ürünler yükleniyor...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#1a202c' }}>Tüm Ürünler</h1>
      
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} className="product-image" />
            </Link>
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                <h3 className="product-title">{product.name}</h3>
              </Link>
              <div className="product-price">{product.price.toLocaleString('tr-TR')} TL</div>
              
              <button 
                className="add-to-cart-btn"
                onClick={() => addItem(product)}
                disabled={product.stock <= 0}
              >
                <ShoppingCart size={18} />
                {product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
