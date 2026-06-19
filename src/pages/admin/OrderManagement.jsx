import React, { useEffect, useMemo, useState } from "react";
import { archiveOrder, getOrders, restoreOrder, updateOrderWorkflow } from "../../services/orderService";

const getNextAction = (order) => {
  if (order.approvalStatus !== "Onaylandı") {
    return { label: "Siparişi Onayla", patch: { approvalStatus: "Onaylandı", fulfillmentStatus: "Sırada" } };
  }
  if (order.paymentStatus !== "Ödeme Alındı") {
    return { label: "Ödeme Alındı", patch: { paymentStatus: "Ödeme Alındı" } };
  }
  if (order.fulfillmentStatus === "Sırada") {
    return { label: "Depoya Aktar", patch: { fulfillmentStatus: "Hazırlanıyor" } };
  }
  if (order.fulfillmentStatus === "Hazırlanıyor") {
    return { label: "Paketlendi", patch: { fulfillmentStatus: "Paketlendi" } };
  }
  if (order.shipmentStatus === "Sevk Bekliyor") {
    return { label: "Kargoya Ver", patch: { shipmentStatus: "Kargoya Verildi" } };
  }
  if (order.shipmentStatus === "Kargoya Verildi") {
    return { label: "Teslim Edildi", patch: { shipmentStatus: "Teslim Edildi" } };
  }
  return null;
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const activeOrders = useMemo(() => orders.filter((order) => !order.isArchived), [orders]);
  const archivedOrders = useMemo(() => orders.filter((order) => order.isArchived), [orders]);

  const confirmAndRun = async (message, callback) => {
    if (!window.confirm(message)) {
      return;
    }
    await callback();
  };

  const handleWorkflowAction = async (order) => {
    const nextAction = getNextAction(order);
    if (!nextAction) return;
    setWorkingId(order.id);
    try {
      await confirmAndRun(`${order.id} siparişi için "${nextAction.label}" adımı uygulansın mı?`, async () => {
        await updateOrderWorkflow(order.id, nextAction.patch);
        await fetchOrders();
      });
    } finally {
      setWorkingId("");
    }
  };

  const handleArchive = async (order) => {
    setWorkingId(order.id);
    try {
      await confirmAndRun(`${order.id} siparişi operasyon listesinden kaldırılıp arşive alınsın mı?`, async () => {
        await archiveOrder(order.id);
        await fetchOrders();
      });
    } finally {
      setWorkingId("");
    }
  };

  const handleRestore = async (order) => {
    setWorkingId(order.id);
    try {
      await confirmAndRun(`${order.id} siparişi tekrar aktif operasyona alınsın mı?`, async () => {
        await restoreOrder(order.id);
        await fetchOrders();
      });
    } finally {
      setWorkingId("");
    }
  };

  if (loading) {
    return <div className="panel-empty">Yükleniyor...</div>;
  }

  return (
    <div className="admin-page-stack">
      <section className="panel orders-panel trendyol-panel">
        <div className="panel-head compact">
          <div>
            <h2>Sipariş operasyon akışı</h2>
            <p>Gerçek bayi e-ticaret düzeninde siparişler onay, ödeme, depo, kargo ve teslim adımlarıyla ilerler.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sipariş</th>
                <th>Tip</th>
                <th>Bayi / Müşteri</th>
                <th>Ürünler</th>
                <th>Onay</th>
                <th>Ödeme</th>
                <th>Depo</th>
                <th>Kargo</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map((order) => {
                const nextAction = getNextAction(order);
                return (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                      <span>{order.items} ürün • {Number(order.total || 0).toLocaleString("tr-TR")} TL</span>
                    </td>
                    <td>
                      <strong>{order.orderType || order.channel}</strong>
                      <span>{order.channel}</span>
                    </td>
                    <td>
                      <strong>{order.dealer || order.customer}</strong>
                      <span>{order.customer}</span>
                    </td>
                    <td>
                      <strong>{order.cartItems?.map((item) => item.name).slice(0, 2).join(", ") || "-"}</strong>
                      <span>{order.cartItems?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0} adet toplam</span>
                    </td>
                    <td><span className={order.approvalStatus === "Onaylandı" ? "pill success" : "pill neutral"}>{order.approvalStatus}</span></td>
                    <td><span className={order.paymentStatus === "Ödeme Alındı" ? "pill success" : "pill neutral"}>{order.paymentStatus}</span></td>
                    <td><span className={order.fulfillmentStatus === "Paketlendi" ? "pill success" : "pill neutral"}>{order.fulfillmentStatus}</span></td>
                    <td><span className={order.shipmentStatus === "Teslim Edildi" ? "pill success" : "pill neutral"}>{order.shipmentStatus}</span></td>
                    <td>
                      <div className="inline-actions">
                        {nextAction ? (
                          <button type="button" className="table-action-button accent-soft-button" onClick={() => handleWorkflowAction(order)} disabled={workingId === order.id}>
                            {workingId === order.id ? "İşleniyor..." : nextAction.label}
                          </button>
                        ) : (
                          <span className="pill success">Tamamlandı</span>
                        )}
                        <button type="button" className="table-action-button danger-button" onClick={() => handleArchive(order)} disabled={workingId === order.id}>
                          Operasyondan Kaldır
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel trendyol-panel">
        <div className="panel-head compact">
          <div>
            <h2>Arşivlenen siparişler</h2>
            <p>Yanlışlıkla kaldırılan siparişler buradan tek tıkla geri alınabilir.</p>
          </div>
        </div>
        <div className="order-list">
          {archivedOrders.length === 0 ? (
            <p>Arşivlenmiş sipariş yok.</p>
          ) : (
            archivedOrders.map((order) => (
              <article key={order.id} className="order-card">
                <div>
                  <strong>{order.id}</strong>
                  <span>{order.dealer} • {order.customer}</span>
                </div>
                <span className="pill neutral">Arşivde</span>
                <div className="order-meta">
                  <span>{Number(order.total || 0).toLocaleString("tr-TR")} TL</span>
                  <span>{order.orderType}</span>
                  <button type="button" className="table-action-button accent-soft-button" onClick={() => handleRestore(order)} disabled={workingId === order.id}>
                    {workingId === order.id ? "İşleniyor..." : "Geri Al"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
