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
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80";

const normalizeImages = (product) => {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }
  if (product.image) {
    return [product.image];
  }
  return [FALLBACK_IMAGE];
};

const normalizeProduct = (product, fallbackId) => {
  const images = normalizeImages(product);
  return {
    id: product.id || fallbackId,
    sku: product.sku || `SKU-${String(fallbackId || "").slice(0, 6).toUpperCase()}`,
    name: product.name || "",
    category: product.category || "Genel",
    subcategory: product.subcategory || "Diğer",
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
    image: images[0],
    images,
    description: product.description || "",
    rating: Number(product.rating ?? 4.6),
  };
};

const isBrowser = typeof window !== "undefined";

const readLocalList = (key) => {
  if (!isBrowser) return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const writeLocalList = (key, value) => {
  if (!isBrowser) return;
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
  writeLocalList(LOCAL_DELETED_KEY, getDeletedIds().filter((item) => item !== id));
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
    if (!deletedIds.has(product.id)) merged.set(product.id, product);
  });
  localProducts.forEach((product) => {
    if (!deletedIds.has(product.id)) merged.set(product.id, product);
  });

  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name, "tr"));
};

export const getProducts = async () => {
  try {
    const productSnapshot = await getDocs(collection(db, COLLECTION_NAME));
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
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
    if (docSnap.exists()) {
      return normalizeProduct(docSnap.data(), docSnap.id);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  const localProduct = getLocalProducts().find((product) => product.id === id);
  if (localProduct) return localProduct;

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
  const normalized = normalizeProduct(data, id);
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), normalized);
  } catch (error) {
    console.error("Error updating product:", error);
    const current = await getProductById(id);
    if (current) {
      upsertLocalProduct(normalizeProduct({ ...current, ...normalized }, id));
      return;
    }
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
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
      batch.set(doc(db, COLLECTION_NAME, product.id), product);
    });
    await batch.commit();
    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};
