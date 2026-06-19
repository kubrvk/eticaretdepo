import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Boxes, CheckCircle2, ClipboardList, Truck, Search } from 'lucide-react';
import { getProducts, seedProducts } from '../../services/productService';
import { getOrders, seedOrders } from '../../services/orderService';
import { initialActivity } from '../../services/mockData';

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
      const [prods, ords] = await Promise.all([getProducts(), getOrders()]);
      setProducts(prods);
      setOrders(ords);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSeedData = async () => {
    if (window.confirm("Bu işlem veritabanına örnek ürünleri ve siparişleri ekleyecektir. Onaylıyor musunuz?")) {
      setSeeding(true);
      await seedProducts();
      await seedOrders();
      alert("Örnek veriler başarıyla eklendi! Sayfa yenileniyor...");
      window.location.reload();
    }
  };

  const lowStock = products.filter((product) => product.stock < product.threshold).length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock), 0);
  const openOrders = orders.filter(o => o.status !== 'Tamamlandı').length;

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <>
      <header className="topbar">
        <div>
          <span className="eyebrow">Bugünkü operasyon</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1>E-ticaret depo yönetimi</h1>
            <button 
              onClick={handleSeedData}
              disabled={seeding}
              style={{ background: '#2d6a4f', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: seeding ? 'not-allowed' : 'pointer', fontSize: '0.9rem' }}
            >
              {seeding ? 'Ekleniyor...' : 'Örnek Verileri Yükle'}
            </button>
          </div>
        </div>
        <label className="search">
          <Search size={18} />
          <input placeholder="SKU, ürün veya sipariş ara" />
        </label>
      </header>

      <section className="stats-grid" aria-label="Özet metrikler">
        <StatCard icon={Boxes} label="Toplam stok" value={totalStock} delta="+8.4%" trend="up" />
        <StatCard icon={ClipboardList} label="Açık sipariş" value={openOrders} delta="+24" trend="up" />
        <StatCard icon={Truck} label="Kargoya hazır" value="119" delta="+31" trend="up" />
        <StatCard icon={AlertTriangle} label="Kritik stok" value={lowStock} delta="-2 ürün" trend="down" />
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
            {initialActivity.map((item) => (
              <li key={item}><CheckCircle2 size={18} />{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
