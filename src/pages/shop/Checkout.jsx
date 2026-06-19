import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { createOrder } from "../../services/orderService";
import { updateProduct, getProductById } from "../../services/productService";

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user, role } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const missingProfileFields = useMemo(() => {
    if (!user) return [];
    return ["fullName", "phone", "city", "address"].filter((field) => !String(user[field] || "").trim());
  }, [user]);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  if (!user) {
    return (
      <div className="page-state">
        Satın alma için önce giriş yapmanız gerekiyor.
        <div style={{ marginTop: "1rem" }}>
          <button className="checkout-button" type="button" onClick={() => navigate("/login")}>
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (missingProfileFields.length > 0) {
      window.alert("Sipariş oluşturmadan önce profilinizde telefon, şehir ve adres bilgilerini tamamlayın.");
      navigate("/account");
      return;
    }

    if (!window.confirm("Sepetteki ürünlerle sipariş oluşturulsun mu?")) {
      return;
    }

    setLoading(true);

    try {
      const isDealer = role === "dealer";
      const newOrder = {
        customer: user.fullName,
        dealer: isDealer ? user.companyName || user.fullName : "Web Siparişi",
        channel: isDealer ? "B2B" : "D2C",
        orderType: isDealer ? "Bayi Siparişi" : "Perakende Sipariş",
        email: user.email,
        address: user.address,
        city: user.city,
        phone: user.phone,
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
            ...product,
            stock: product.stock - item.quantity,
            reserved: Math.max(Number(product.reserved || 0) + item.quantity, 0),
          });
        }
      }

      clearCart();
      window.alert(isDealer ? "Bayi siparişiniz onaya alındı." : "Siparişiniz başarıyla oluşturuldu.");
      navigate("/account");
    } catch (error) {
      console.error(error);
      window.alert("Sipariş oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-card">
      <h2>Siparişinizi profil bilgilerinizle tamamlayın</h2>
      <p>Bu hesapla sipariş oluşturulacak. Profilinizdeki teslimat bilgileri kullanılacaktır.</p>

      <div className="account-facts">
        <div><span>Yetkili kişi</span><strong>{user.fullName}</strong></div>
        <div><span>Şirket / bayi</span><strong>{user.companyName}</strong></div>
        <div><span>Telefon</span><strong>{user.phone || "Eksik"}</strong></div>
        <div><span>Şehir</span><strong>{user.city || "Eksik"}</strong></div>
        <div><span>Adres</span><strong>{user.address || "Eksik"}</strong></div>
      </div>

      <div className="summary-row total" style={{ marginTop: "1rem" }}>
        <span>Genel Toplam</span>
        <span>{getCartTotal().toLocaleString("tr-TR")} TL</span>
      </div>

      <div className="inline-actions" style={{ marginTop: "1rem" }}>
        <button type="button" className="secondary-button" onClick={() => navigate("/account")}>
          Profili Düzenle
        </button>
        <button type="button" className="checkout-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "İşleniyor..." : "Siparişi Oluştur"}
        </button>
      </div>
    </div>
  );
}
