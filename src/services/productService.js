import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { initialProducts } from "./mockData";

const COLLECTION_NAME = "products";
const LOCAL_PRODUCTS_KEY = "local-admin-products";
const LOCAL_DELETED_KEY = "local-admin-deleted-products";

const normalizeProduct = (product, fallbackId) => ({
  id: product.id || fallbackId,
  sku: product.sku || `SKU-${String(fallbackId || "").slice(0, 6).toUpperCase()}`,
  name: product.name || "",
  category: product.category || "Genel",
  brand: product.brand || product.category || "Markasız",
  stock: Number(product.stock ?? 0),
  reserved: Number(product.reserved ?? 0),
  threshold: Number(product.threshold ?? 5),
  location: product.location || "Atanmadı",
  velocity: product.velocity || "Normal",
  price: Number(product.price ?? 0),
  wholesalePrice: Number(product.wholesalePrice ?? product.price ?? 0),
  minOrderQty: Number(product.minOrderQty ?? 1),
  supplier: product.supplier || "Merkez Depo",
  channel: product.channel || "B2B + Pazaryeri",
  image: product.image || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  description: product.description || "",
  rating: Number(product.rating ?? 4.6),
});

const isBrowser = typeof window !== "undefined";

const readLocalList = (key) => {
  if (!isBrowser) {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const writeLocalList = (key, value) => {
  if (!isBrowser) {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getLocalProducts = () => readLocalList(LOCAL_PRODUCTS_KEY).map((item) => normalizeProduct(item, item.id));
const getDeletedIds = () => readLocalList(LOCAL_DELETED_KEY);

const upsertLocalProduct = (product) => {
  const current = getLocalProducts();
  const next = [...current.filter((item) => item.id !== product.id), product];
  writeLocalList(LOCAL_PRODUCTS_KEY, next);
};

const removeLocalProduct = (id) => {
  const current = getLocalProducts().filter((item) => item.id !== id);
  writeLocalList(LOCAL_PRODUCTS_KEY, current);
};

const clearDeletedFlag = (id) => {
  const next = getDeletedIds().filter((item) => item !== id);
  writeLocalList(LOCAL_DELETED_KEY, next);
};

const markDeletedLocally = (id) => {
  const deletedIds = getDeletedIds();
  if (!deletedIds.includes(id)) {
    writeLocalList(LOCAL_DELETED_KEY, [...deletedIds, id]);
  }
  removeLocalProduct(id);
};

const mergeProducts = (remoteProducts) => {
  const localProducts = getLocalProducts();
  const deletedIds = new Set(getDeletedIds());
  const merged = new Map();

  remoteProducts.forEach((product) => {
    if (!deletedIds.has(product.id)) {
      merged.set(product.id, product);
    }
  });

  localProducts.forEach((product) => {
    if (!deletedIds.has(product.id)) {
      merged.set(product.id, product);
    }
  });

  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name, "tr"));
};

export const getProducts = async () => {
  try {
    const productsCol = collection(db, COLLECTION_NAME);
    const productSnapshot = await getDocs(productsCol);
    const remoteProducts = productSnapshot.docs.map((item) => normalizeProduct(item.data(), item.id));
    return mergeProducts(remoteProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    const localProducts = getLocalProducts();
    if (localProducts.length > 0) {
      return mergeProducts(initialProducts.map((product) => normalizeProduct(product, product.id)));
    }
    return initialProducts.map((product) => normalizeProduct(product, product.id));
  }
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return normalizeProduct(docSnap.data(), docSnap.id);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  const localProduct = getLocalProducts().find((product) => product.id === id);
  if (localProduct) {
    return localProduct;
  }

  const fallback = initialProducts.find((product) => product.id === id);
  return fallback ? normalizeProduct(fallback, fallback.id) : null;
};

export const addProduct = async (product) => {
  const offlineId = `local-${Date.now()}`;
  const newDocRef = doc(collection(db, COLLECTION_NAME));
  const finalProduct = normalizeProduct(
    {
      ...product,
      id: newDocRef.id || offlineId,
      createdAt: new Date().toISOString(),
    },
    newDocRef.id || offlineId
  );

  try {
    await setDoc(newDocRef, { ...finalProduct, createdAt: serverTimestamp() });
    clearDeletedFlag(finalProduct.id);
    return { ...finalProduct, syncSource: "firebase" };
  } catch (error) {
    console.error("Error adding product:", error);
    const offlineProduct = { ...finalProduct, id: offlineId, syncSource: "local" };
    upsertLocalProduct(offlineProduct);
    clearDeletedFlag(offlineProduct.id);
    return offlineProduct;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating product:", error);
    const current = await getProductById(id);
    if (current) {
      upsertLocalProduct(normalizeProduct({ ...current, ...data }, id));
      return;
    }
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    removeLocalProduct(id);
    clearDeletedFlag(id);
  } catch (error) {
    console.error("Error deleting product:", error);
    markDeletedLocally(id);
  }
};

export const seedProducts = async () => {
  try {
    const batch = writeBatch(db);
    initialProducts.forEach((product) => {
      const docRef = doc(db, COLLECTION_NAME, product.id);
      batch.set(docRef, product);
    });
    await batch.commit();
    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};
