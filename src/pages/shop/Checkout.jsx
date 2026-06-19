import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { createOrder } from "../../services/orderService";
import { updateProduct, getProductById } from "../../services/productService";

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user, role } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    address: "",
    city: "",
    phone: "",
  });

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const isDealer = role === "dealer";
      const newOrder = {
        customer: formData.fullName,
        dealer: isDealer ? user?.companyName || formData.fullName : "Web Siparişi",
        channel: isDealer ? "B2B" : "D2C",
        orderType: isDealer ? "Bayi Siparişi" : "Perakende Sipariş",
        email: user?.email || "guest@example.com",
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        items: items.reduce((sum, item) => sum + item.quantity, 0),
        total: getCartTotal(),
        priority: getCartTotal() > 50000 ? "Yüksek" : "Normal",
        approvalStatus: isDealer ? "Onay Bekliyor" : "Onaylandı",
        paymentStatus: isDealer ? "Vade / Havale Bekliyor" : "Ödeme Alındı",
        fulfillmentStatus: isDealer ? "Onay Bekliyor" : "Sırada",
        shipmentStatus: "Sevk Bekliyor",
        cartItems: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await createOrder(newOrder);

      for (const item of items) {
        const product = await getProductById(item.id);
        if (product && product.stock >= item.quantity) {
          await updateProduct(item.id, {
            stock: product.stock - item.quantity,
            reserved: Math.max(Number(product.reserved || 0) + item.quantity, 0),
          });
        }
      }

      clearCart();
      alert(isDealer ? "Bayi siparişiniz onaya alındı." : "Siparişiniz başarıyla oluşturuldu.");
      navigate(role === "admin" ? "/admin/orders" : "/");
    } catch (error) {
      console.error(error);
      alert("Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-card">
        <div className="product-detail-info">
          <span className="product-detail-category">Teslimat ve ödeme</span>
          <h1>{role === "dealer" ? "Bayi siparişini tamamlayın" : "Sipariş bilgilerinizi tamamlayın"}</h1>
          <p className="product-detail-description">
            {role === "dealer"
              ? "Bayi siparişleri önce yönetsel onaya düşer, ardından ödeme ve depo hazırlık süreci başlar."
              : "Perakende siparişler ödeme sonrası doğrudan operasyon kuyruğuna aktarılır."}
          </p>

          <form onSubmit={handleSubmit} className="product-form-grid">
            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Ad Soyad" />
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefon" />
            <input required type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Şehir" />
            <textarea required name="address" value={formData.address} onChange={handleChange} rows="5" placeholder="Açık adres" />

            <div className="form-actions">
              <div>
                <span className="product-detail-category">Ödenecek tutar</span>
                <h2>{getCartTotal().toLocaleString("tr-TR")} TL</h2>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "İşleniyor..." : role === "dealer" ? "Siparişi Onaya Gönder" : "Siparişi Onayla"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
