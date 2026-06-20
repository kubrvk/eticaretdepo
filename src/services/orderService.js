import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { initialOrders } from "./mockData";

const COLLECTION_NAME = "orders";
const LOCAL_ORDERS_KEY = "local-orders";
const LOCAL_DELETED_ORDERS_KEY = "local-deleted-orders";

const isBrowser = typeof window !== "undefined";

const normalizeOrder = (order, fallbackId) => ({
  id: order.id || fallbackId,
  customer: order.customer || "Müşteri",
  dealer: order.dealer || "Bireysel Sipariş",
  channel: order.channel || "D2C",
  items: Number(order.items || 0),
  total: Number(order.total || 0),
  priority: order.priority || "Normal",
  approvalStatus: order.approvalStatus || "Onay Bekliyor",
  paymentStatus: order.paymentStatus || "Ödeme Bekliyor",
  fulfillmentStatus: order.fulfillmentStatus || "Sırada",
  shipmentStatus: order.shipmentStatus || "Sevk Bekliyor",
  status: order.status || "Yeni Sipariş",
  orderType: order.orderType || "Standart",
  cartItems: order.cartItems || [],
  city: order.city || "",
  address: order.address || "",
  phone: order.phone || "",
  email: order.email || "",
  createdAt: order.createdAt || new Date().toISOString(),
  isArchived: Boolean(order.isArchived),
  archivedAt: order.archivedAt || null,
});

const readLocalOrders = () => {
  if (!isBrowser) return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const readDeletedOrderIds = () => {
  if (!isBrowser) return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_DELETED_ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeLocalOrders = (orders) => {
  if (!isBrowser) return;
  window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
};

const writeDeletedOrderIds = (ids) => {
  if (!isBrowser) return;
  window.localStorage.setItem(LOCAL_DELETED_ORDERS_KEY, JSON.stringify(ids));
};

const upsertLocalOrder = (order) => {
  const current = readLocalOrders().map((item) => normalizeOrder(item, item.id));
  writeLocalOrders([...current.filter((item) => item.id !== order.id), order]);
};

const removeLocalOrder = (id) => {
  const current = readLocalOrders().map((item) => normalizeOrder(item, item.id));
  writeLocalOrders(current.filter((item) => item.id !== id));
};

const clearDeletedOrderFlag = (id) => {
  writeDeletedOrderIds(readDeletedOrderIds().filter((item) => item !== id));
};

const markOrderDeletedLocally = (id) => {
  const deletedIds = readDeletedOrderIds();
  if (!deletedIds.includes(id)) {
    writeDeletedOrderIds([...deletedIds, id]);
  }
  removeLocalOrder(id);
};

const mergeOrders = (remoteOrders) => {
  const map = new Map();
  const deletedIds = new Set(readDeletedOrderIds());
  remoteOrders.forEach((order) => {
    if (!deletedIds.has(order.id)) map.set(order.id, order);
  });
  readLocalOrders()
    .map((item) => normalizeOrder(item, item.id))
    .forEach((order) => {
      if (!deletedIds.has(order.id)) map.set(order.id, order);
    });
  return Array.from(map.values()).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
};

export const deriveOrderStatus = (order) => {
  if (order.isArchived) return "Arşivlendi";
  if (order.shipmentStatus === "Teslim Edildi") return "Tamamlandı";
  if (order.shipmentStatus === "Kargoya Verildi") return "Sevk Edildi";
  if (order.fulfillmentStatus === "Paketlendi") return "Sevke Hazır";
  if (order.fulfillmentStatus === "Hazırlanıyor") return "Depoda Hazırlanıyor";
  if (order.paymentStatus === "Ödeme Alındı") return "Operasyona Aktarıldı";
  if (order.approvalStatus === "Onaylandı") return "Onaylandı";
  return "Yeni Sipariş";
};

const normalizeRemoteOrders = (docs) =>
  docs.map((item) => {
    const order = normalizeOrder(item.data(), item.id);
    return { ...order, status: deriveOrderStatus(order) };
  });

export const getOrders = async () => {
  try {
    const orderSnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return mergeOrders(normalizeRemoteOrders(orderSnapshot.docs));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return mergeOrders(initialOrders.map((order) => normalizeOrder(order, order.id)));
  }
};

export const getOrdersByUser = async (user) => {
  const orders = await getOrders();
  if (!user) return [];
  if (user.role === "admin") return orders;
  return orders.filter(
    (order) =>
      order.email?.toLowerCase() === user.email?.toLowerCase() ||
      order.dealer?.toLowerCase() === user.companyName?.toLowerCase()
  );
};

export const createOrder = async (orderData) => {
  const newDocRef = doc(collection(db, COLLECTION_NAME));
  const localId = `order-${Date.now()}`;
  const finalOrder = normalizeOrder(
    {
      ...orderData,
      id: newDocRef.id || localId,
      createdAt: new Date().toISOString(),
      isArchived: false,
    },
    newDocRef.id || localId
  );
  finalOrder.status = deriveOrderStatus(finalOrder);

  try {
    await setDoc(newDocRef, {
      ...finalOrder,
      createdAt: serverTimestamp(),
    });
    clearDeletedOrderFlag(finalOrder.id);
    return finalOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    upsertLocalOrder(finalOrder);
    clearDeletedOrderFlag(finalOrder.id);
    return finalOrder;
  }
};

export const updateOrderWorkflow = async (id, patch) => {
  const currentOrders = await getOrders();
  const current = currentOrders.find((order) => order.id === id) || normalizeOrder({ id }, id);
  const next = {
    ...current,
    ...patch,
  };
  next.status = deriveOrderStatus(next);

  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), next);
  } catch (error) {
    console.error("Error updating order workflow:", error);
    upsertLocalOrder(next);
  }
};

export const archiveOrder = async (id) => {
  await updateOrderWorkflow(id, {
    isArchived: true,
    archivedAt: new Date().toISOString(),
  });
};

export const restoreOrder = async (id) => {
  await updateOrderWorkflow(id, {
    isArchived: false,
    archivedAt: null,
  });
};

export const deleteOrder = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting order:", error);
  }
  markOrderDeletedLocally(id);
};

export const seedOrders = async () => {
  try {
    const batch = writeBatch(db);
    initialOrders.forEach((order) => {
      const docRef = doc(db, COLLECTION_NAME, order.id);
      batch.set(docRef, order);
    });
    await batch.commit();
    console.log("Orders seeded successfully!");
  } catch (error) {
    console.error("Error seeding orders:", error);
  }
};
