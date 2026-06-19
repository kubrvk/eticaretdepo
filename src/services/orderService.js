import { collection, doc, getDocs, setDoc, updateDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { initialOrders } from "./mockData";

const COLLECTION_NAME = "orders";
const LOCAL_ORDERS_KEY = "local-orders";

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
});

const readLocalOrders = () => {
  if (!isBrowser) {
    return [];
  }
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeLocalOrders = (orders) => {
  if (!isBrowser) {
    return;
  }
  window.localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
};

const mergeOrders = (remoteOrders) => {
  const map = new Map();
  remoteOrders.forEach((order) => map.set(order.id, order));
  readLocalOrders().map((item) => normalizeOrder(item, item.id)).forEach((order) => map.set(order.id, order));
  return Array.from(map.values()).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
};

export const deriveOrderStatus = (order) => {
  if (order.shipmentStatus === "Teslim Edildi") return "Tamamlandı";
  if (order.shipmentStatus === "Kargoya Verildi") return "Sevk Edildi";
  if (order.fulfillmentStatus === "Paketlendi") return "Sevke Hazır";
  if (order.fulfillmentStatus === "Hazırlanıyor") return "Depoda Hazırlanıyor";
  if (order.paymentStatus === "Ödeme Alındı") return "Operasyona Aktarıldı";
  if (order.approvalStatus === "Onaylandı") return "Onaylandı";
  return "Yeni Sipariş";
};

export const getOrders = async () => {
  try {
    const ordersCol = collection(db, COLLECTION_NAME);
    const orderSnapshot = await getDocs(ordersCol);
    const remoteOrders = orderSnapshot.docs.map((item) => {
      const order = normalizeOrder(item.data(), item.id);
      return { ...order, status: deriveOrderStatus(order) };
    });
    return mergeOrders(remoteOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return mergeOrders(initialOrders.map((order) => normalizeOrder(order, order.id)));
  }
};

export const createOrder = async (orderData) => {
  const newDocRef = doc(collection(db, COLLECTION_NAME));
  const localId = `order-${Date.now()}`;
  const finalOrder = normalizeOrder(
    {
      ...orderData,
      id: newDocRef.id || localId,
      approvalStatus: orderData.approvalStatus || "Onay Bekliyor",
      paymentStatus: orderData.paymentStatus || "Ödeme Bekliyor",
      fulfillmentStatus: orderData.fulfillmentStatus || "Sırada",
      shipmentStatus: orderData.shipmentStatus || "Sevk Bekliyor",
      createdAt: new Date().toISOString(),
    },
    newDocRef.id || localId
  );
  finalOrder.status = deriveOrderStatus(finalOrder);

  try {
    await setDoc(newDocRef, {
      ...finalOrder,
      createdAt: serverTimestamp(),
    });
    return finalOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    const localOrders = readLocalOrders();
    writeLocalOrders([...localOrders, finalOrder]);
    return finalOrder;
  }
};

export const updateOrderWorkflow = async (id, patch) => {
  const update = { ...patch };
  if (!update.status) {
    const currentOrders = await getOrders();
    const current = currentOrders.find((order) => order.id === id);
    update.status = deriveOrderStatus({ ...current, ...patch });
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, update);
  } catch (error) {
    console.error("Error updating order workflow:", error);
    const orders = readLocalOrders().map((item) => normalizeOrder(item, item.id));
    const current = orders.find((item) => item.id === id) || normalizeOrder(initialOrders.find((item) => item.id === id) || { id }, id);
    const next = { ...current, ...update };
    writeLocalOrders([...orders.filter((item) => item.id !== id), next]);
  }
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
