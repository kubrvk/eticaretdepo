import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";

export default function Cart() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="empty-cart-card">
        <h2>Sepetiniz boş</h2>
        <p>Henüz ürün eklemediniz. Pazaryeri vitrini veya bayi fiyatlı ürünlerden seçim yapabilirsiniz.</p>
        <Link to="/" className="primary-link-button">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Sepetim</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article key={item.id} className="cart-item-card">
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <Link to={`/product/${item.id}`}>{item.name}</Link>
                <span>{item.brand}</span>
                <strong>{item.price.toLocaleString("tr-TR")} TL</strong>
              </div>

              <div className="quantity-box">
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>

              <div className="cart-total-price">{(item.price * item.quantity).toLocaleString("tr-TR")} TL</div>

              <button type="button" onClick={() => removeItem(item.id)} className="delete-item-button" title="Ürünü Sil">
                <Trash2 size={20} />
              </button>
            </article>
          ))}
        </div>

        <aside className="cart-summary-card">
          <h3>Sipariş Özeti</h3>
          <div className="summary-row">
            <span>Ara Toplam</span>
            <span>{getCartTotal().toLocaleString("tr-TR")} TL</span>
          </div>
          <div className="summary-row">
            <span>Kargo</span>
            <span>Ücretsiz</span>
          </div>
          <div className="summary-row total">
            <span>Genel Toplam</span>
            <span>{getCartTotal().toLocaleString("tr-TR")} TL</span>
          </div>

          <button type="button" onClick={() => navigate("/checkout")} className="checkout-button">
            Alışverişi Tamamla
            <ArrowRight size={18} />
          </button>
        </aside>
      </div>
    </div>
  );
}
