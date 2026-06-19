import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { initialProducts } from "./mockData";

const COLLECTION_NAME = "products";

export const getProducts = async () => {
  try {
    const productsCol = collection(db, COLLECTION_NAME);
    const productSnapshot = await getDocs(productsCol);
    if (productSnapshot.empty) {
      console.warn("No products found in Firebase. Ensure database is seeded.");
      return [];
    }
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return productList;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to mock data if Firebase config is missing
    return initialProducts;
  }
};

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return initialProducts.find(p => p.id === id) || null;
  }
};

export const addProduct = async (product) => {
  try {
    const newDocRef = doc(collection(db, COLLECTION_NAME));
    await setDoc(newDocRef, product);
    return { id: newDocRef.id, ...product };
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const seedProducts = async () => {
  try {
    const batch = writeBatch(db);
    initialProducts.forEach(product => {
      const docRef = doc(db, COLLECTION_NAME, product.id);
      batch.set(docRef, product);
    });
    await batch.commit();
    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};
