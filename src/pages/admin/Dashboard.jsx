import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Building2,
  CheckCircle2,
  ClipboardList,
  Search,
  Store,
  Truck,
} from "lucide-react";
import { getProducts, seedProducts } from "../../services/productService";
import { getOrders, seedOrders } from "../../services/orderService";
import { initialActivity } from "../../services/mockData";

function StatCard({ icon: Icon, label, value, delta, trend }) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <section className="stat-card">
      <div className="stat-icon" aria-hidden="true">
        <Icon size={22} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span className={trend === "up" ? "good" : "warn"}>
          <TrendIcon size={15} />
          {delta}
        </span>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [productData, orderData] = await Promise.all([getProducts(), getOrders()]);
      setProducts(productData);
      setOrders(orderData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const metrics = useMemo(() => {
    const totalStock = products.reduce((sum, item) => sum + Number(item.stock || 0), 0);
    const lowStock = products.filter((item) => item.stock <= item.threshold).length;
    const dealerVisible = products.filter((item) => `${item.channel}`.includes("Bayi") || `${item.channel}`.includes("B2B")).length;
    const activeOrders = orders.filter((item) => item.shipmentStatus !== "Teslim Edildi").length;
    return { totalStock, lowStock, dealerVisible, activeOrders };
  }, [orders, products]);

  const topDealerOrders = orders.slice(0, 4);
  const topProducts = [...products].sort((a, b) => Number(b.reserved || 0) - Number(a.reserved || 0)).slice(0, 4);

  const handleSeedData = async () => {
    if (!window.confirm("Örnek ürünleri ve siparişleri veritabanına eklemek istiyor musunuz?")) {
      return;
    }

    setSeeding(true);
    await seedProducts();
    await seedOrders();
    window.location.reload();
  };

  if (loading) {
    return <div className="panel-empty">Yükleniyor...</div>;
  }

  return (
    <>
      <header className="topbar">
        <div>
          <span className="eyebrow">Bugünkü operasyon</span>
          <h1>Bayi destekli e-ticaret komuta merkezi</h1>
          <p className="topbar-copy">Merkez depo, alt bayi satışları ve pazaryeri siparişlerini tek akışta yönetin.</p>
        </div>
        <div className="topbar-actions">
          <label className="search">
            <Search size={18} />
            <input placeholder="SKU, bayi, ürün veya sipariş ara" />
          </label>
          <button type="button" className="secondary-button" onClick={handleSeedData} disabled={seeding}>
            {seeding ? "Ekleniyor..." : "Örnek Verileri Yükle"}
          </button>
        </div>
      </header>

      <section className="hero-admin-card">
        <div>
          <span className="eyebrow">Haftalık görünüm</span>
          <h2>Kampanya haftasında bayi talepleri yükselişte</h2>
          <p>Trendyol, Hepsiburada ve doğrudan bayi siparişleri için stok eşitleme ve kârlılık takibi canlı durumda.</p>
        </div>
        <div className="hero-admin-metrics">
          <div>
            <strong>27</strong>
            <span>Aktif bayi</span>
          </div>
          <div>
            <strong>%18</strong>
            <span>Ortalama bayi marjı</span>
          </div>
          <div>
            <strong>4.2 saat</strong>
            <span>Ortalama çıkış süresi</span>
          </div>
        </div>
      </section>

      <section className="stats-grid" aria-label="Özet metrikler">
        <StatCard icon={Boxes} label="Toplam stok" value={metrics.totalStock} delta="+8.4%" trend="up" />
        <StatCard icon={ClipboardList} label="Açık sipariş" value={metrics.activeOrders} delta="+24 sipariş" trend="up" />
        <StatCard icon={Store} label="Bayiye açık ürün" value={metrics.dealerVisible} delta="+12 ürün" trend="up" />
        <StatCard icon={AlertTriangle} label="Kritik stok" value={metrics.lowStock} delta="-2 ürün" trend="down" />
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-head compact">
            <div>
              <h2>En çok rezerve edilen ürünler</h2>
              <p>Bayi ve pazaryeri çıkış baskısı en yüksek ürünler</p>
            </div>
          </div>
          <div className="order-list">
            {topProducts.map((product) => (
              <article key={product.id} className="order-card">
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.brand} • {product.sku}</span>
                </div>
                <span className={product.stock <= product.threshold ? "pill danger" : "pill success"}>
                  {product.stock <= product.threshold ? "Kritik stok" : product.channel}
                </span>
                <div className="order-meta">
                  <span>Stok: {product.stock}</span>
                  <span>Rezerv: {product.reserved}</span>
                  <span>Toptan: {product.wholesalePrice.toLocaleString("tr-TR")} TL</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head compact">
            <div>
              <h2>Bayi ve kanal akışı</h2>
              <p>Operasyon yükünün dağılımı</p>
            </div>
          </div>
          <div className="progress-list">
            <label><span>Pazaryeri siparişleri</span><strong>72%</strong><progress value="72" max="100" /></label>
            <label><span>Alt bayi siparişleri</span><strong>54%</strong><progress value="54" max="100" /></label>
            <label><span>Aynı gün kargolama</span><strong>91%</strong><progress value="91" max="100" /></label>
          </div>
        </div>
      </section>

      <section className="bottom-grid">
        <div className="panel">
          <div className="panel-head compact">
            <div>
              <h2>Canlı hareketler</h2>
              <p>Depo ve bayi ağındaki son aksiyonlar</p>
            </div>
          </div>
          <ul className="activity-list">
            {initialActivity.map((item) => (
              <li key={item}>
                <CheckCircle2 size={18} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-head compact">
            <div>
              <h2>Öncelikli siparişler</h2>
              <p>Bugün hızlı aksiyon gerektiren kanallar</p>
            </div>
          </div>
          <div className="order-list">
            {topDealerOrders.map((order) => (
              <article key={order.id} className="order-card">
                <div>
                  <strong>{order.customer}</strong>
                  <span>{order.dealer} • {order.channel}</span>
                </div>
                <span className={order.priority === "Yüksek" ? "pill danger" : "pill neutral"}>{order.priority}</span>
                <div className="order-meta">
                  <span><Truck size={15} /> {order.status}</span>
                  <span><Building2 size={15} /> {order.items} ürün</span>
                  <span>{order.orderType}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
