import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
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
          <img src={activeImage || product.image} alt={product.name} />
          <div className="gallery-strip">
            {product.images.map((image, index) => (
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
    </div>
  );
}
