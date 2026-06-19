import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { getProducts, seedProducts } from '../../services/productService';
import { useCartStore } from '../../store/useCartStore';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let data = await getProducts();
      
      // Auto-seed if database is empty
      if (data.length === 0) {
        console.log("Database is empty, auto-seeding rich data...");
        await seedProducts();
        data = await getProducts(); // refetch after seed
      }
      
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = ["Tümü", ...new Set(products.map(p => p.category))];

  const filteredProducts = activeCategory === "Tümü" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.2rem', color: '#f27a1a' }}>Yükleniyor...</div>;
  }

  return (
    <div className="home-container">
      {/* Left Sidebar */}
      <aside className="sidebar-categories">
        <h3>Kategoriler</h3>
        <ul>
          {categories.map(cat => (
            <li 
              key={cat} 
              className={activeCategory === cat ? 'active' : ''}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div>
        {/* Banner */}
        <div className="hero-banner">
          <div>
            <h2>Bahar Fırsatları Başladı!</h2>
            <p>Elektronik ve Modada %50'ye varan indirimler</p>
          </div>
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80" alt="Sale" style={{ borderRadius: '12px', width: '200px', height: '120px', objectFit: 'cover' }} />
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
                <img src={product.image} alt={product.name} className="product-image" />
              </Link>
              <div className="product-info">
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div className="product-brand">{product.brand || product.category}</div>
                  <h3 className="product-title">{product.name}</h3>
                </Link>
                
                <div className="product-rating">
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <Star size={14} fill={product.rating >= 4.8 ? "#fbbf24" : "none"} color="#fbbf24" />
                  <span>({Math.floor(Math.random() * 500) + 50})</span>
                </div>

                <div className="product-price">{product.price.toLocaleString('tr-TR')} TL</div>
                
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addItem(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Sepete Ekle' : 'Tükendi'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
