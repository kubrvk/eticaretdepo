import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../services/orderService';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrders(); // Refresh orders after update
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="panel orders-panel" id="siparis" style={{ width: '100%' }}>
      <div className="panel-head compact">
        <div>
          <h2>Sipariş kuyruğu</h2>
          <p>Tüm siparişlerin listesi ve durum yönetimi</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Sipariş ID</th>
              <th>Müşteri</th>
              <th>Ürün Sayısı</th>
              <th>Durum</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong></td>
                <td>{order.customer}</td>
                <td>{order.items} ürün</td>
                <td>
                  <span className={order.priority === "Yüksek" || order.status === "Bekliyor" ? "pill danger" : "pill neutral"}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="Sipariş Alındı">Sipariş Alındı</option>
                    <option value="Toplanıyor">Toplanıyor</option>
                    <option value="Paketleme">Paketleme</option>
                    <option value="Kargoya hazır">Kargoya hazır</option>
                    <option value="Tamamlandı">Tamamlandı</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
