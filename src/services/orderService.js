import { collection, doc, getDocs, getDoc, setDoc, updateDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { initialOrders } from "./mockData";

const COLLECTION_NAME = "orders";

export const getOrders = async () => {
  try {
    const ordersCol = collection(db, COLLECTION_NAME);
    const orderSnapshot = await getDocs(ordersCol);
    if (orderSnapshot.empty) {
      return [];
    }
    const orderList = orderSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt descending locally if needed
    return orderList;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return initialOrders;
  }
};

export const createOrder = async (orderData) => {
  try {
    const newDocRef = doc(collection(db, COLLECTION_NAME));
    const finalOrder = {
      ...orderData,
      id: newDocRef.id,
      createdAt: serverTimestamp(),
      status: "Sipariş Alındı",
    };
    await setDoc(newDocRef, finalOrder);
    return finalOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const seedOrders = async () => {
  try {
    const batch = writeBatch(db);
    initialOrders.forEach(order => {
      const docRef = doc(db, COLLECTION_NAME, order.id);
      batch.set(docRef, order);
    });
    await batch.commit();
    console.log("Orders seeded successfully!");
  } catch (error) {
    console.error("Error seeding orders:", error);
  }
};
