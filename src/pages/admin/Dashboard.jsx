import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Boxes,
  ClipboardList,
  PackageSearch,
  Percent,
  PlusCircle,
  Save,
  Search,
  Store,
  Trash2,
  Truck,
  Upload,
  Users,
} from "lucide-react";
import { defaultHomeSlides, getHomeSlides, updateHomeSlides } from "../../services/homeContentService";
import { getProducts } from "../../services/productService";
import { getOrders } from "../../services/orderService";

function StatCard({ icon: Icon, label, value, detail, trend = "up" }) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <section className="stat-card compact-stat">
      <div className="stat-icon" aria-hidden="true">
        <Icon size={21} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span className={trend === "up" ? "good" : "warn"}>
          <TrendIcon size={15} />
          {detail}
        </span>
      </div>
    </section>
  );
}

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("tr-TR")} TL`;

const readSliderImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 1600;
        const ratio = Math.min(maxWidth / image.width, maxWidth / image.height, 1);
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.76));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [slides, setSlides] = useState(defaultHomeSlides);
  const [loading, setLoading] = useState(true);
  const [slideSaving, setSlideSaving] = useState(false);
  const [slideMessage, setSlideMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [productData, orderData, slideData] = await Promise.all([getProducts(), getOrders(), getHomeSlides()]);
    setProducts(productData);
    setOrders(orderData);
    setSlides(slideData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = useMemo(() => {
    const totalStock = products.reduce((sum, item) => sum + Number(item.stock || 0), 0);
    const reservedStock = products.reduce((sum, item) => sum + Number(item.reserved || 0), 0);
    const lowStock = products.filter((item) => Number(item.stock || 0) <= Number(item.threshold || 0)).length;
    const dealerVisible = products.filter((item) => `${item.channel}`.includes("Bayi") || `${item.channel}`.includes("B2B")).length;
    const activeOrders = orders.filter((item) => item.shipmentStatus !== "Teslim Edildi" && !item.isArchived).length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const stockValue = products.reduce((sum, product) => sum + Number(product.stock || 0) * Number(product.wholesalePrice || 0), 0);
    const retailPotential = products.reduce((sum, product) => sum + Number(product.stock || 0) * Number(product.price || 0), 0);
    const marginRate = retailPotential > 0 ? Math.round(((retailPotential - stockValue) / retailPotential) * 100) : 0;
    const readyToShip = orders.filter((order) => ["Paketlendi", "Hazırlanıyor"].includes(order.fulfillmentStatus)).length;

    return {
      activeOrders,
      dealerVisible,
      lowStock,
      marginRate,
      readyToShip,
      reservedStock,
      stockValue,
      totalRevenue,
      totalStock,
    };
  }, [orders, products]);

  const channelStats = useMemo(() => {
    const grouped = orders.reduce((map, order) => {
      const channel = order.channel || "Diğer";
      map.set(channel, {
        count: (map.get(channel)?.count || 0) + 1,
        total: (map.get(channel)?.total || 0) + Number(order.total || 0),
      });
      return map;
    }, new Map());

    return Array.from(grouped.entries())
      .map(([channel, value]) => ({ channel, ...value }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [orders]);

  const criticalProducts = useMemo(
    () =>
      [...products]
        .filter((product) => Number(product.stock || 0) <= Number(product.threshold || 0))
        .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
        .slice(0, 5),
    [products]
  );

  const topProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.reserved || 0) - Number(a.reserved || 0)).slice(0, 5),
    [products]
  );

  const handleSlideChange = (index, field, value) => {
    setSlides((current) => current.map((slide, slideIndex) => (slideIndex === index ? { ...slide, [field]: value } : slide)));
  };

  const handleSlideImageUpload = async (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await readSliderImageFile(file);
    handleSlideChange(index, "image", image);
    event.target.value = "";
  };

  const addSlide = () => {
    setSlides((current) => [
      ...current,
      {
        eyebrow: "Yeni kampanya",
        title: "Yeni slider başlığı",
        text: "Kısa kampanya açıklaması",
        cta: "İncele",
        image: defaultHomeSlides[0].image,
        accent: "#ff6b2c",
      },
    ]);
  };

  const removeSlide = (index) => {
    setSlides((current) => (current.length > 1 ? current.filter((_, slideIndex) => slideIndex !== index) : current));
  };

  const handleSaveSlides = async () => {
    setSlideSaving(true);
    setSlideMessage("");
    const result = await updateHomeSlides(slides);
    setSlides(result.slides);
    setSlideMessage(result.syncSource === "firebase" ? "Ana sayfa slider içerikleri kaydedildi." : "Firebase yazma izni yok; slider bu tarayıcıda yerel olarak kaydedildi.");
    setSlideSaving(false);
  };

  if (loading) {
    return <div className="panel-empty">Yükleniyor...</div>;
  }

  return (
    <div className="admin-page-stack">
      <header className="dashboard-header">
        <div>
          <span className="eyebrow">Canlı operasyon</span>
          <h1>Yönetim paneli</h1>
          <p>Stok, sipariş, bayi kanalı ve ana sayfa vitrinini tek ekrandan takip edin.</p>
        </div>
        <div className="topbar-actions">
          <label className="search">
            <Search size={18} />
            <input placeholder="Ürün, SKU veya sipariş ara" />
          </label>
        </div>
      </header>

      <section className="stats-grid detailed-stats-grid" aria-label="Detaylı metrikler">
        <StatCard icon={Boxes} label="Toplam stok" value={metrics.totalStock} detail={`${metrics.reservedStock} rezerve`} />
        <StatCard icon={ClipboardList} label="Açık sipariş" value={metrics.activeOrders} detail={`${metrics.readyToShip} sevke yakın`} />
        <StatCard icon={Store} label="Bayi ürünü" value={metrics.dealerVisible} detail={`${products.length} ürün içinde`} />
        <StatCard icon={AlertTriangle} label="Kritik stok" value={metrics.lowStock} detail="Aksiyon gerekli" trend={metrics.lowStock > 0 ? "down" : "up"} />
        <StatCard icon={Banknote} label="Sipariş hacmi" value={formatCurrency(metrics.totalRevenue)} detail={`${orders.length} sipariş`} />
        <StatCard icon={PackageSearch} label="Stok maliyeti" value={formatCurrency(metrics.stockValue)} detail="Bayi alış değerine göre" />
        <StatCard icon={Percent} label="Tahmini marj" value={`%${metrics.marginRate}`} detail="Stok potansiyeli" />
        <StatCard icon={Users} label="Kanal sayısı" value={channelStats.length} detail="Aktif satış kanalı" />
      </section>

      <section className="ops-grid">
        <div className="panel">
          <div className="panel-head compact">
            <div>
              <h2>Kanal performansı</h2>
              <p>Sipariş kanallarının adet ve ciro dağılımı.</p>
            </div>
            <BarChart3 size={22} />
          </div>
          <div className="channel-list">
            {channelStats.map((item) => (
              <article key={item.channel} className="channel-row">
                <div>
                  <strong>{item.channel}</strong>
                  <span>{item.count} sipariş</span>
                </div>
                <strong>{formatCurrency(item.total)}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head compact">
            <div>
              <h2>Kritik stok takibi</h2>
              <p>Eşik altına düşen ürünler.</p>
            </div>
            <AlertTriangle size={22} />
          </div>
          <div className="order-list">
            {criticalProducts.length > 0 ? (
              criticalProducts.map((product) => (
                <article key={product.id} className="compact-row-card">
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.sku} · Eşik: {product.threshold}</span>
                  </div>
                  <span className="pill danger">{product.stock} adet</span>
                </article>
              ))
            ) : (
              <div className="panel-empty small-empty">Kritik stok bulunmuyor.</div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head compact">
            <div>
              <h2>Rezerv baskısı</h2>
              <p>En fazla ayrılan stoklar.</p>
            </div>
            <Truck size={22} />
          </div>
          <div className="order-list">
            {topProducts.map((product) => (
              <article key={product.id} className="compact-row-card">
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.brand} · {product.channel}</span>
                </div>
                <span className="pill success">{product.reserved} rezerve</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="panel slider-management-panel">
        <div className="panel-head compact">
          <div>
            <h2>Ana sayfa slider yönetimi</h2>
            <p>Buradan değiştirdiğiniz başlık, açıklama, buton, görsel ve renk ana sayfadaki slaytlara yansır.</p>
          </div>
          <div className="inline-actions">
            <button type="button" className="secondary-button" onClick={addSlide} disabled={slides.length >= 6}>
              <PlusCircle size={17} />
              Slayt ekle
            </button>
            <button type="button" onClick={handleSaveSlides} disabled={slideSaving}>
              <Save size={17} />
              {slideSaving ? "Kaydediliyor..." : "Sliderı kaydet"}
            </button>
          </div>
        </div>

        {slideMessage ? <p className="form-success">{slideMessage}</p> : null}

        <div className="slider-editor-grid">
          {slides.map((slide, index) => (
            <article key={`${slide.title}-${index}`} className="slider-editor-card">
              <div className="slider-editor-preview" style={{ "--preview-accent": slide.accent }}>
                <img src={slide.image} alt={slide.title} />
                <div>
                  <span>{slide.eyebrow}</span>
                  <strong>{slide.title}</strong>
                </div>
              </div>

              <div className="slider-editor-fields">
                <input value={slide.eyebrow} onChange={(event) => handleSlideChange(index, "eyebrow", event.target.value)} placeholder="Üst etiket" />
                <input value={slide.title} onChange={(event) => handleSlideChange(index, "title", event.target.value)} placeholder="Başlık" />
                <textarea value={slide.text} onChange={(event) => handleSlideChange(index, "text", event.target.value)} placeholder="Açıklama" rows="3" />
                <input value={slide.cta} onChange={(event) => handleSlideChange(index, "cta", event.target.value)} placeholder="Buton metni" />
                <input value={slide.image} onChange={(event) => handleSlideChange(index, "image", event.target.value)} placeholder="Görsel URL" />
                <label className="slider-upload-trigger">
                  <Upload size={16} />
                  Resim yükle
                  <input type="file" accept="image/*" onChange={(event) => handleSlideImageUpload(index, event)} hidden />
                </label>
                <label className="color-input-row">
                  <span>Vurgu rengi</span>
                  <input type="color" value={slide.accent} onChange={(event) => handleSlideChange(index, "accent", event.target.value)} />
                </label>
              </div>

              <button type="button" className="table-action-button danger-button" onClick={() => removeSlide(index)} disabled={slides.length <= 1}>
                <Trash2 size={16} />
                Slaytı sil
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
