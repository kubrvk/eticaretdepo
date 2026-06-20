import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { getProductById } from "../../services/productService";
import { useCartStore } from "../../store/useCartStore";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      setActiveImage(data?.images?.[0] || data?.image || "");
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    return [...new Set([...(product.images || []), product.image].filter(Boolean))];
  }, [product]);

  if (loading) {
    return <div className="page-state">Yükleniyor...</div>;
  }

  if (!product) {
    return <div className="page-state">Ürün bulunamadı.</div>;
  }

  return (
    <div className="product-detail-page">
      <button type="button" onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Geri Dön
      </button>

      <div className="product-detail-card">
        <div className="product-detail-media">
          <div className="product-detail-image-frame">
            <img src={activeImage || product.image} alt={product.name} />
          </div>

          <div className="gallery-strip" aria-label="Ürün görsel galerisi">
            {galleryImages.map((image, index) => (
              <button key={`${image}-${index}`} type="button" className={`gallery-thumb ${activeImage === image ? "active" : ""}`} onClick={() => setActiveImage(image)}>
                <img src={image} alt={`${product.name} görsel ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">
            {product.category} / {product.subcategory}
          </span>
          <h1>{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-pricing">
            <strong>{product.price?.toLocaleString("tr-TR")} TL</strong>
            <span>Bayi fiyatı: {product.wholesalePrice?.toLocaleString("tr-TR")} TL</span>
          </div>

          <div className="detail-badges">
            <span>
              <ShieldCheck size={16} />
              Kanal: {product.channel}
            </span>
            <span>
              <Truck size={16} />
              Min. bayi siparişi: {product.minOrderQty}
            </span>
          </div>

          <div className="detail-facts">
            <div>
              <span>Stok</span>
              <strong>{product.stock > 0 ? `${product.stock} adet` : "Tükendi"}</strong>
            </div>
            <div>
              <span>SKU</span>
              <strong>{product.sku}</strong>
            </div>
            <div>
              <span>Tedarikçi</span>
              <strong>{product.supplier}</strong>
            </div>
            <div>
              <span>Raf</span>
              <strong>{product.location}</strong>
            </div>
          </div>

          <button className="add-to-cart-btn detail-add-button" onClick={() => addItem(product)} disabled={product.stock <= 0}>
            <ShoppingCart size={20} />
            {product.stock > 0 ? "Sepete Ekle" : "Stokta Yok"}
          </button>
        </div>
      </div>

      <section className="product-description-panel">
        <div className="product-description-head">
          <span>Ürün Detayı</span>
          <h2>{product.name}</h2>
        </div>
        <div className="product-description-body">
          <p>{product.description}</p>
          <ul>
            <li>
              <CheckCircle2 size={18} />
              <span>{product.brand || product.category} güvencesiyle bayi ve web satışına uygun stok.</span>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <span>Minimum sipariş adedi {product.minOrderQty}; hazır stok {product.stock} adet.</span>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <span>{product.channel} kanalı için fiyatlandırılmış, merkez depo çıkışlı ürün.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
