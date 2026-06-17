import React from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  Search,
  Truck,
  Warehouse,
} from "lucide-react";
import "./styles.css";

const products = [
  { sku: "SKU-1048", name: "Kablosuz Kulaklık", category: "Elektronik", stock: 84, reserved: 18, threshold: 35, location: "A-12", velocity: "Hızlı" },
  { sku: "SKU-2210", name: "Organik Pamuk Tişört", category: "Giyim", stock: 27, reserved: 9, threshold: 40, location: "B-04", velocity: "Orta" },
  { sku: "SKU-3302", name: "Seramik Kahve Seti", category: "Ev & Yaşam", stock: 112, reserved: 22, threshold: 30, location: "C-18", velocity: "Hızlı" },
  { sku: "SKU-4107", name: "Spor Matı", category: "Spor", stock: 16, reserved: 7, threshold: 25, location: "D-07", velocity: "Yavaş" },
  { sku: "SKU-5981", name: "Bebek Bakım Çantası", category: "Anne & Bebek", stock: 49, reserved: 12, threshold: 20, location: "A-05", velocity: "Orta" },
];

const orders = [
  { id: "ORD-9124", customer: "Trendyol", items: 18, status: "Toplanıyor", priority: "Yüksek", eta: "11:20" },
  { id: "ORD-9125", customer: "Hepsiburada", items: 7, status: "Paketleme", priority: "Normal", eta: "12:05" },
  { id: "ORD-9126", customer: "Shopify Mağaza", items: 31, status: "Kontrol", priority: "Yüksek", eta: "12:30" },
  { id: "ORD-9127", customer: "Amazon TR", items: 11, status: "Kargoya hazır", priority: "Normal", eta: "13:10" },
];

const activity = [
  "12 ürün kritik stok listesine eklendi",
  "42 sipariş için kargo etiketi üretildi",
  "A-12 rafında sayım farkı kapatıldı",
  "Yeni tedarik teslimatı kabul edildi",
];

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

function App() {
  const lowStock = products.filter((product) => product.stock < product.threshold).length;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Warehouse size={28} />
          <div>
            <strong>DepoPanel</strong>
            <span>E-ticaret operasyonu</span>
          </div>
        </div>

        <nav aria-label="Ana menü">
          <a className="active" href="#dashboard"><Boxes size={18} />Dashboard</a>
          <a href="#stok"><PackageCheck size={18} />Stok</a>
          <a href="#siparis"><ClipboardList size={18} />Sipariş</a>
          <a href="#kargo"><Truck size={18} />Kargo</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Bugünkü operasyon</span>
            <h1>E-ticaret depo yönetimi</h1>
          </div>
          <label className="search">
            <Search size={18} />
            <input placeholder="SKU, ürün veya sipariş ara" />
          </label>
        </header>

        <section className="stats-grid" aria-label="Özet metrikler">
          <StatCard icon={Boxes} label="Toplam stok" value="18.420" delta="+8.4%" trend="up" />
          <StatCard icon={ClipboardList} label="Açık sipariş" value="276" delta="+24" trend="up" />
          <StatCard icon={Truck} label="Kargoya hazır" value="119" delta="+31" trend="up" />
          <StatCard icon={AlertTriangle} label="Kritik stok" value={lowStock} delta="-2 ürün" trend="down" />
        </section>

        <section className="content-grid">
          <div className="panel stock-panel" id="stok">
            <div className="panel-head">
              <div>
                <h2>Stok durumu</h2>
                <p>Satış hızı, rezerv ve raf konumuyla ürün takibi</p>
              </div>
              <button type="button"><PackageCheck size={17} />Stok ekle</button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Kategori</th>
                    <th>Raf</th>
                    <th>Stok</th>
                    <th>Rezerv</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const isLow = product.stock < product.threshold;
                    return (
                      <tr key={product.sku}>
                        <td>
                          <strong>{product.name}</strong>
                          <span>{product.sku}</span>
                        </td>
                        <td>{product.category}</td>
                        <td>{product.location}</td>
                        <td>{product.stock}</td>
                        <td>{product.reserved}</td>
                        <td>
                          <span className={isLow ? "pill danger" : "pill success"}>
                            {isLow ? "Kritik" : product.velocity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="panel orders-panel" id="siparis">
            <div className="panel-head compact">
              <div>
                <h2>Sipariş kuyruğu</h2>
                <p>Öncelikli hazırlık akışı</p>
              </div>
            </div>

            <div className="order-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div>
                    <strong>{order.id}</strong>
                    <span>{order.customer}</span>
                  </div>
                  <div className="order-meta">
                    <span>{order.items} ürün</span>
                    <span>{order.eta}</span>
                  </div>
                  <span className={order.priority === "Yüksek" ? "pill danger" : "pill neutral"}>
                    {order.status}
                  </span>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <div className="panel-head compact">
              <div>
                <h2>Depo verimliliği</h2>
                <p>Toplama, paketleme ve çıkış oranları</p>
              </div>
            </div>
            <div className="progress-list">
              <label><span>Toplama</span><strong>86%</strong><progress value="86" max="100" /></label>
              <label><span>Paketleme</span><strong>74%</strong><progress value="74" max="100" /></label>
              <label><span>Kargo çıkışı</span><strong>91%</strong><progress value="91" max="100" /></label>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head compact">
              <div>
                <h2>Canlı hareketler</h2>
                <p>Son depo olayları</p>
              </div>
            </div>
            <ul className="activity-list">
              {activity.map((item) => (
                <li key={item}><CheckCircle2 size={18} />{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
