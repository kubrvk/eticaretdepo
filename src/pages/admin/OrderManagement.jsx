import React, { useEffect, useState } from "react";
import { getOrders, updateOrderWorkflow } from "../../services/orderService";

const getNextAction = (order) => {
  if (order.approvalStatus !== "Onaylandı") {
    return {
      label: "Siparişi Onayla",
      patch: {
        approvalStatus: "Onaylandı",
        fulfillmentStatus: "Sırada",
      },
    };
  }

  if (order.paymentStatus !== "Ödeme Alındı") {
    return {
      label: "Ödeme Alındı",
      patch: {
        paymentStatus: "Ödeme Alındı",
      },
    };
  }

  if (order.fulfillmentStatus === "Sırada") {
    return {
      label: "Depoya Aktar",
      patch: {
        fulfillmentStatus: "Hazırlanıyor",
      },
    };
  }

  if (order.fulfillmentStatus === "Hazırlanıyor") {
    return {
      label: "Paketlendi",
      patch: {
        fulfillmentStatus: "Paketlendi",
      },
    };
  }

  if (order.shipmentStatus === "Sevk Bekliyor") {
    return {
      label: "Kargoya Ver",
      patch: {
        shipmentStatus: "Kargoya Verildi",
      },
    };
  }

  if (order.shipmentStatus === "Kargoya Verildi") {
    return {
      label: "Teslim Edildi",
      patch: {
        shipmentStatus: "Teslim Edildi",
      },
    };
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

  const handleWorkflowAction = async (order) => {
    const nextAction = getNextAction(order);
    if (!nextAction) {
      return;
    }

    setWorkingId(order.id);
    try {
      await updateOrderWorkflow(order.id, nextAction.patch);
      await fetchOrders();
    } catch (error) {
      console.error(error);
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
            <p>Gerçek bayi e-ticaret mantığında siparişler onay, ödeme, depo ve kargo adımlarıyla ilerler.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sipariş</th>
                <th>Tip</th>
                <th>Bayi / Müşteri</th>
                <th>Onay</th>
                <th>Ödeme</th>
                <th>Depo</th>
                <th>Kargo</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
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
                    <td><span className={order.approvalStatus === "Onaylandı" ? "pill success" : "pill neutral"}>{order.approvalStatus}</span></td>
                    <td><span className={order.paymentStatus === "Ödeme Alındı" ? "pill success" : "pill neutral"}>{order.paymentStatus}</span></td>
                    <td><span className={order.fulfillmentStatus === "Paketlendi" ? "pill success" : "pill neutral"}>{order.fulfillmentStatus}</span></td>
                    <td><span className={order.shipmentStatus === "Teslim Edildi" ? "pill success" : "pill neutral"}>{order.shipmentStatus}</span></td>
                    <td>
                      {nextAction ? (
                        <button
                          type="button"
                          className="table-action-button accent-soft-button"
                          onClick={() => handleWorkflowAction(order)}
                          disabled={workingId === order.id}
                        >
                          {workingId === order.id ? "İşleniyor..." : nextAction.label}
                        </button>
                      ) : (
                        <span className="pill success">Tamamlandı</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
