import React, { useEffect, useMemo, useState } from "react";
import { Archive, CheckCircle2, CreditCard, PackageCheck, RotateCcw, Send, ShieldCheck, Trash2, Truck } from "lucide-react";
import { archiveOrder, deleteOrder, getOrders, restoreOrder, updateOrderWorkflow } from "../../services/orderService";

const getNextAction = (order) => {
  if (order.approvalStatus !== "Onaylandı") {
    return { label: "Onayla", patch: { approvalStatus: "Onaylandı", fulfillmentStatus: "Sırada" } };
  }
  if (order.paymentStatus !== "Ödeme Alındı") {
    return { label: "Ödeme al", patch: { paymentStatus: "Ödeme Alındı" } };
  }
  if (order.fulfillmentStatus === "Sırada") {
    return { label: "Depoya aktar", patch: { fulfillmentStatus: "Hazırlanıyor" } };
  }
  if (order.fulfillmentStatus === "Hazırlanıyor") {
    return { label: "Paketle", patch: { fulfillmentStatus: "Paketlendi" } };
  }
  if (order.shipmentStatus === "Sevk Bekliyor") {
    return { label: "Kargola", patch: { shipmentStatus: "Kargoya Verildi" } };
  }
  if (order.shipmentStatus === "Kargoya Verildi") {
    return { label: "Teslim et", patch: { shipmentStatus: "Teslim Edildi" } };
  }
  return null;
};

const workflowSteps = [
  { key: "approvalStatus", label: "Onay", done: "Onaylandı" },
  { key: "paymentStatus", label: "Ödeme", done: "Ödeme Alındı" },
  { key: "fulfillmentStatus", label: "Depo", done: "Paketlendi" },
  { key: "shipmentStatus", label: "Kargo", done: "Teslim Edildi" },
];

const actionIcons = {
  "Onayla": ShieldCheck,
  "Ödeme al": CreditCard,
  "Depoya aktar": Send,
  "Paketle": PackageCheck,
  "Kargola": Truck,
  "Teslim et": CheckCircle2,
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
    if (!window.confirm(message)) return;
    await callback();
  };

  const runOrderAction = async (order, action) => {
    setWorkingId(order.id);
    try {
      await action();
      await fetchOrders();
    } finally {
      setWorkingId("");
    }
  };

  const handleWorkflowAction = async (order) => {
    const nextAction = getNextAction(order);
    if (!nextAction) return;
    await runOrderAction(order, async () => {
      await confirmAndRun(`${order.id} için "${nextAction.label}" adımı uygulansın mı?`, async () => {
        await updateOrderWorkflow(order.id, nextAction.patch);
      });
    });
  };

  const handleArchive = async (order) => {
    await runOrderAction(order, async () => {
      await confirmAndRun(`${order.id} siparişi arşive alınsın mı?`, async () => {
        await archiveOrder(order.id);
      });
    });
  };

  const handleRestore = async (order) => {
    await runOrderAction(order, async () => {
      await confirmAndRun(`${order.id} tekrar aktif operasyona alınsın mı?`, async () => {
        await restoreOrder(order.id);
      });
    });
  };

  const handleDelete = async (order) => {
    await runOrderAction(order, async () => {
      await confirmAndRun(`${order.id} kalıcı olarak kaldırılsın mı? Bu işlem geri alınamaz.`, async () => {
        await deleteOrder(order.id);
      });
    });
  };

  if (loading) {
    return <div className="panel-empty">Yükleniyor...</div>;
  }

  return (
    <div className="admin-page-stack">
      <section className="panel orders-panel trendyol-panel">
        <div className="panel-head compact">
          <div>
            <h2>Sipariş operasyonu</h2>
            <p>Onay, ödeme, depo ve kargo adımlarını tek ekranda izleyin.</p>
          </div>
          <span className="pill trendyol-pill">{activeOrders.length} aktif</span>
        </div>

        <div className="admin-order-list">
          {activeOrders.length === 0 ? (
            <div className="panel-empty small-empty">Aktif sipariş bulunmuyor.</div>
          ) : (
            activeOrders.map((order) => {
              const nextAction = getNextAction(order);
              const ActionIcon = nextAction ? actionIcons[nextAction.label] || CheckCircle2 : null;
              return (
                <article key={order.id} className="admin-order-card">
                  <div className="admin-order-main">
                    <div>
                      <strong>{order.id}</strong>
                      <span>{order.orderType || order.channel} · {order.channel}</span>
                    </div>
                    <div>
                      <strong>{Number(order.total || 0).toLocaleString("tr-TR")} TL</strong>
                      <span>{order.items} ürün</span>
                    </div>
                    <div>
                      <strong>{order.dealer || order.customer}</strong>
                      <span>{order.customer}</span>
                    </div>
                  </div>

                  <div className="order-stepper" aria-label="Sipariş adımları">
                    {workflowSteps.map((step) => {
                      const isDone = order[step.key] === step.done;
                      return (
                        <div key={step.key} className={isDone ? "done" : ""}>
                          <CheckCircle2 size={16} />
                          <span>{step.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="admin-order-footer">
                    <div className="admin-order-products">
                      <Truck size={16} />
                      <span>{order.cartItems?.map((item) => item.name).slice(0, 2).join(", ") || order.status}</span>
                    </div>
                    <div className="admin-order-actions">
                      {nextAction ? (
                        <button type="button" className="table-action-button accent-soft-button compact-action-button" onClick={() => handleWorkflowAction(order)} disabled={workingId === order.id}>
                          {ActionIcon ? <ActionIcon size={18} /> : null}
                          {workingId === order.id ? "..." : nextAction.label}
                        </button>
                      ) : (
                        <span className="pill success">Tamamlandı</span>
                      )}
                      <button type="button" className="icon-action-button archive-action" onClick={() => handleArchive(order)} disabled={workingId === order.id} title="Arşive al">
                        <Archive size={21} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="panel trendyol-panel">
        <div className="panel-head compact">
          <div>
            <h2>Arşivlenen siparişler</h2>
            <p>Arşivden geri alınabilir veya kalıcı olarak kaldırılabilir.</p>
          </div>
          <span className="pill neutral">{archivedOrders.length} arşiv</span>
        </div>
        <div className="archived-order-grid">
          {archivedOrders.length === 0 ? (
            <div className="panel-empty small-empty">Arşivlenmiş sipariş yok.</div>
          ) : (
            archivedOrders.map((order) => (
              <article key={order.id} className="archived-order-card">
                <div>
                  <strong>{order.id}</strong>
                  <span>{order.dealer} · {order.customer}</span>
                </div>
                <div className="archived-order-total">
                  <strong>{Number(order.total || 0).toLocaleString("tr-TR")} TL</strong>
                  <span>{order.orderType}</span>
                </div>
                <div className="admin-order-actions">
                  <button type="button" className="icon-action-button restore-action" onClick={() => handleRestore(order)} disabled={workingId === order.id} title="Geri al">
                    <RotateCcw size={21} />
                  </button>
                  <button type="button" className="icon-action-button delete-action" onClick={() => handleDelete(order)} disabled={workingId === order.id} title="Kalıcı kaldır">
                    <Trash2 size={21} />
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
