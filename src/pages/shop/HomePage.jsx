import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, Star, ShieldCheck, Store, Truck } from "lucide-react";
import { getHomeSlides, defaultHomeSlides } from "../../services/homeContentService";
import { getProducts, seedProducts } from "../../services/productService";
import { useCartStore } from "../../store/useCartStore";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState(defaultHomeSlides);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [activeSlide, setActiveSlide] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      const [slideData, productData] = await Promise.all([getHomeSlides(), getProducts()]);
      let nextProducts = productData;
      if (nextProducts.length === 0) {
        await seedProducts();
        nextProducts = await getProducts();
      }
      setSlides(slideData);
      setProducts(nextProducts);
      setLoading(false);
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(slideTimer);
  }, [slides.length]);

  useEffect(() => {
    if (activeSlide >= slides.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, slides.length]);

  const categories = useMemo(() => ["Tümü", ...new Set(products.map((product) => product.category))], [products]);
  const featuredProducts = useMemo(() => products.slice(0, 16), [products]);
  const searchQuery = (searchParams.get("q") || "").trim().toLocaleLowerCase("tr-TR");
  const searchableProducts = searchQuery ? products : featuredProducts;
  const categoryProducts = activeCategory === "Tümü" ? searchableProducts : searchableProducts.filter((product) => product.category === activeCategory);
  const filteredProducts = searchQuery
    ? categoryProducts.filter((product) =>
        [product.name, product.brand, product.category, product.subcategory, product.channel, product.description]
          .filter(Boolean)
          .some((value) => String(value).toLocaleLowerCase("tr-TR").includes(searchQuery))
      )
    : categoryProducts;
  const slide = slides[activeSlide] || defaultHomeSlides[0];

  const goToSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  if (loading) {
    return <div className="page-state">Yükleniyor...</div>;
  }

  return (
    <div className="shop-home">
      <section className="market-slider" style={{ "--slide-accent": slide.accent }}>
        <img src={slide.image} alt={slide.title} className="market-slider-image" />
        <div className="market-slider-overlay" />

        <button className="slider-arrow slider-arrow-left" type="button" onClick={() => goToSlide(-1)} aria-label="Önceki kampanya">
          <ChevronLeft size={22} />
        </button>

        <div className="market-slider-copy">
          <span className="eyebrow">{slide.eyebrow}</span>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>
          <a href="#featured-products" className="slider-cta">{slide.cta}</a>
        </div>

        <button className="slider-arrow slider-arrow-right" type="button" onClick={() => goToSlide(1)} aria-label="Sonraki kampanya">
          <ChevronRight size={22} />
        </button>

        <div className="slider-dots" aria-label="Kampanya slaytları">
          {slides.map((heroSlide, index) => (
            <button
              key={`${heroSlide.title}-${index}`}
              type="button"
              className={activeSlide === index ? "active" : ""}
              onClick={() => setActiveSlide(index)}
              aria-label={`${index + 1}. kampanyayı göster`}
            />
          ))}
        </div>
      </section>

      <section className="market-benefits">
        <div>
          <ShieldCheck size={18} />
          <div>
            <strong>Yetkili bayi fiyatı</strong>
            <span>Liste ve toptan fiyatlar bir arada</span>
          </div>
        </div>
        <div>
          <Truck size={18} />
          <div>
            <strong>Aynı gün sevkiyat</strong>
            <span>Hazır stoktan hızlı çıkış</span>
          </div>
        </div>
        <div>
          <Store size={18} />
          <div>
            <strong>Çok kanallı satış</strong>
            <span>Mağaza ve pazaryeri uyumlu katalog</span>
          </div>
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

      <div className="home-container" id="featured-products">
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
            {filteredProducts.length === 0 ? (
              <div className="empty-results">
                <strong>Sonuç bulunamadı</strong>
                <span>Aramanızı farklı bir ürün, marka veya kategoriyle tekrar deneyin.</span>
              </div>
            ) : filteredProducts.map((product) => (
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
