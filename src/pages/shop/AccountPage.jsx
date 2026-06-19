import React, { useEffect, useMemo, useState } from "react";
import { Building2, ClipboardList, User } from "lucide-react";
import { updateLocalAccount } from "../../services/accountService";
import { getOrdersByUser } from "../../services/orderService";
import { useAuthStore } from "../../store/useAuthStore";

export default function AccountPage() {
  const { user, role, updateUser } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    companyName: user?.companyName || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getOrdersByUser(user);
      setOrders(data.filter((order) => !order.isArchived));
      setLoading(false);
    };

    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        companyName: user.companyName || "",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
      });
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const purchasedProducts = useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      order.cartItems.forEach((item) => {
        const current = map.get(item.id) || { ...item, quantity: 0 };
        current.quantity += Number(item.quantity || 0);
        map.set(item.id, current);
      });
    });
    return Array.from(map.values());
  }, [orders]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    if (!window.confirm("Profil bilgilerinizi güncellemek istiyor musunuz?")) {
      return;
    }
    setSaving(true);
    try {
      const updated = updateLocalAccount(user.email, profileForm);
      updateUser(updated);
      setMessage("Profil bilgileriniz güncellendi.");
    } catch (error) {
      console.error(error);
      setMessage("Profil güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <div className="page-state">Profili görüntülemek için giriş yapın.</div>;
  }

  if (loading) {
    return <div className="page-state">Yükleniyor...</div>;
  }

  return (
    <div className="account-page">
      <section className="account-hero">
        <div>
          <span className="eyebrow">Hesap merkezi</span>
          <h1>{role === "dealer" ? "Bayi paneliniz" : "Hesap bilgileriniz"}</h1>
          <p>{role === "dealer" ? "Verdiğiniz siparişler, satın aldığınız ürünler ve teslimat bilgileriniz burada yer alır." : "Sipariş geçmişinizi ve profilinizi buradan yönetin."}</p>
        </div>
        <div className="account-badges">
          <span><User size={16} /> {user.fullName}</span>
          <span><Building2 size={16} /> {user.companyName}</span>
          <span><ClipboardList size={16} /> {orders.length} sipariş</span>
        </div>
      </section>

      <section className="account-grid">
        <article className="account-card">
          <h3>Profil ve Teslimat Bilgileri</h3>
          <form className="account-form" onSubmit={handleProfileSave}>
            <input name="fullName" value={profileForm.fullName} onChange={handleProfileChange} placeholder="Yetkili kişi adı" required />
            <input name="companyName" value={profileForm.companyName} onChange={handleProfileChange} placeholder="Bayi / şirket adı" required />
            <input name="phone" value={profileForm.phone} onChange={handleProfileChange} placeholder="Telefon" required />
            <input name="city" value={profileForm.city} onChange={handleProfileChange} placeholder="Şehir" required />
            <textarea name="address" value={profileForm.address} onChange={handleProfileChange} rows="4" placeholder="Açık adres" required />
            <div className="inline-actions">
              <button type="submit" className="checkout-button" disabled={saving}>
                {saving ? "Kaydediliyor..." : "Profili Kaydet"}
              </button>
              {message ? <span className="account-message">{message}</span> : null}
            </div>
          </form>
        </article>

        <article className="account-card">
          <h3>Satın Alınan Ürünler</h3>
          <div className="account-list">
            {purchasedProducts.length === 0 ? (
              <p>Henüz satın alınmış ürün yok.</p>
            ) : (
              purchasedProducts.map((item) => (
                <div key={item.id} className="account-list-row">
                  <span>{item.name}</span>
                  <strong>{item.quantity} adet</strong>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="account-card">
        <h3>Sipariş Geçmişi</h3>
        <div className="account-list">
          {orders.length === 0 ? (
            <p>Henüz sipariş bulunmuyor.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="account-order-row">
                <div>
                  <strong>{order.id}</strong>
                  <span>{order.orderType} • {order.channel}</span>
                </div>
                <div>
                  <strong>{Number(order.total).toLocaleString("tr-TR")} TL</strong>
                  <span>{order.status}</span>
                </div>
                <div>
                  <strong>{order.items} ürün</strong>
                  <span>{order.shipmentStatus}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
