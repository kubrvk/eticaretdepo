import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, ShieldCheck, Store, Truck } from "lucide-react";
import { getProducts, seedProducts } from "../../services/productService";
import { useCartStore } from "../../store/useCartStore";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let data = await getProducts();
      if (data.length === 0) {
        await seedProducts();
        data = await getProducts();
      }
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => ["Tümü", ...new Set(products.map((product) => product.category))], [products]);
  const featuredProducts = useMemo(() => products.slice(0, 16), [products]);
  const filteredProducts = activeCategory === "Tümü" ? featuredProducts : featuredProducts.filter((product) => product.category === activeCategory);

  if (loading) {
    return <div className="page-state">Yükleniyor...</div>;
  }

  return (
    <div className="shop-home">
      <section className="market-hero">
        <div className="market-hero-copy">
          <span className="eyebrow">Yeni nesil e-ticaret vitrini</span>
          <h1>Gerçek bayi mantığında yüksek devirli, güçlü stoklu ürün kataloğu</h1>
          <p>Pazaryeri kampanyaları, bayi fiyat listeleri ve merkez depo stokları tek ekran deneyimiyle sunuluyor.</p>
          <div className="market-hero-badges">
            <span><ShieldCheck size={16} /> Yetkili bayi fiyatı</span>
            <span><Truck size={16} /> Aynı gün sevkiyat</span>
            <span><Store size={16} /> Çok kanallı satış</span>
          </div>
        </div>
        <div className="market-hero-card">
          <div>
            <strong>Bugünün öne çıkan fırsatı</strong>
            <h3>Yüksek stoklu hızlı dönen toptan ürünler</h3>
            <p>Temizlik, ofis, elektronik ve bebek kategorilerinde bayi alış fiyatı avantajı.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=700&q=80" alt="Kampanya" />
        </div>
      </section>

      <section className="market-strip">
        <div>
          <strong>{products.length} aktif ürün</strong>
          <span>Yüksek stokla yönetilen gerçekçi bayi kataloğu</span>
        </div>
        <div>
          <strong>{categories.length - 1} ana kategori</strong>
          <span>Elektronikten gıdaya çoklu tedarik yapısı</span>
        </div>
        <div>
          <strong>%91 zamanında çıkış</strong>
          <span>Depo ekibi aynı gün operasyon yürütüyor</span>
        </div>
      </section>

      <div className="home-container">
        <aside className="sidebar-categories">
          <h3>Kategoriler</h3>
          <ul>
            {categories.map((category) => (
              <li key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>
                {category}
              </li>
            ))}
          </ul>
        </aside>

        <section>
          <div className="section-head">
            <div>
              <h2>Öne çıkan ürünler</h2>
              <p>Bayiye açık fiyat avantajı ve güçlü pazaryeri görünürlüğü olan seçili ürünler.</p>
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-card-top">
                  <span className="product-chip">{product.channel}</span>
                  <span className="product-chip muted">Min. {product.minOrderQty} adet</span>
                </div>

                <Link to={`/product/${product.id}`} className="product-image-link">
                  <img src={product.image} alt={product.name} className="product-image" />
                </Link>

                <div className="product-info">
                  <Link to={`/product/${product.id}`} className="product-title-link">
                    <div className="product-brand">{product.brand || product.category}</div>
                    <h3 className="product-title">{product.name}</h3>
                  </Link>

                  <div className="product-rating">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{product.rating}</span>
                    <small>{product.stock} adet hazır stok</small>
                  </div>

                  <div className="price-stack">
                    <strong>{product.price.toLocaleString("tr-TR")} TL</strong>
                    <span>Bayi fiyatı: {product.wholesalePrice.toLocaleString("tr-TR")} TL</span>
                  </div>

                  <button className="add-to-cart-btn" onClick={() => addItem(product)} disabled={product.stock <= 0}>
                    <ShoppingCart size={18} />
                    {product.stock > 0 ? "Sepete Ekle" : "Tükendi"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
