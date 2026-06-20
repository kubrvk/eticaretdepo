import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const SETTINGS_COLLECTION = "settings";
const HOME_DOC_ID = "homepage";
const LOCAL_HOME_SLIDES_KEY = "local-home-slides";

export const defaultHomeSlides = [
  {
    eyebrow: "Haftanın depo fırsatı",
    title: "Elektronik ve ofis ürünlerinde bayi alış avantajı",
    text: "Yüksek stoklu ürünleri pazaryeri hızında sepete ekleyin.",
    cta: "Fırsatları incele",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=85",
    accent: "#ff6b2c",
  },
  {
    eyebrow: "Hızlı sevkiyat",
    title: "Aynı gün çıkışa hazır toptan katalog",
    text: "Depodan mağazanıza, mağazanızdan pazaryerine akıcı operasyon.",
    cta: "Çok satanlara bak",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=85",
    accent: "#0f766e",
  },
  {
    eyebrow: "Yeni sezon",
    title: "Temizlik, bebek ve gıda kategorilerinde güçlü stok",
    text: "Trend ürünleri tek ekrandan filtreleyin ve hızlıca sipariş verin.",
    cta: "Kategorileri gez",
    image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1400&q=85",
    accent: "#7c3aed",
  },
];

const isBrowser = typeof window !== "undefined";

const cleanSlide = (slide, index) => ({
  eyebrow: slide.eyebrow || `Kampanya ${index + 1}`,
  title: slide.title || "Yeni kampanya başlığı",
  text: slide.text || "Kampanya açıklaması",
  cta: slide.cta || "İncele",
  image: slide.image || defaultHomeSlides[index % defaultHomeSlides.length].image,
  accent: slide.accent || defaultHomeSlides[index % defaultHomeSlides.length].accent,
});

const normalizeSlides = (slides) => {
  if (!Array.isArray(slides) || slides.length === 0) return defaultHomeSlides;
  return slides.slice(0, 6).map(cleanSlide);
};

const readLocalSlides = () => {
  if (!isBrowser) return null;
  try {
    const slides = JSON.parse(window.localStorage.getItem(LOCAL_HOME_SLIDES_KEY) || "null");
    return slides ? normalizeSlides(slides) : null;
  } catch {
    return null;
  }
};

const writeLocalSlides = (slides) => {
  if (!isBrowser) return;
  window.localStorage.setItem(LOCAL_HOME_SLIDES_KEY, JSON.stringify(normalizeSlides(slides)));
};

export const getHomeSlides = async () => {
  const localSlides = readLocalSlides();

  try {
    const snapshot = await getDoc(doc(db, SETTINGS_COLLECTION, HOME_DOC_ID));
    if (snapshot.exists()) {
      return normalizeSlides(snapshot.data().slides);
    }
  } catch (error) {
    console.error("Error fetching homepage slides:", error);
  }

  return localSlides || defaultHomeSlides;
};

export const updateHomeSlides = async (slides) => {
  const normalizedSlides = normalizeSlides(slides);
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, HOME_DOC_ID), {
      slides: normalizedSlides,
      updatedAt: serverTimestamp(),
    });
    writeLocalSlides(normalizedSlides);
    return { slides: normalizedSlides, syncSource: "firebase" };
  } catch (error) {
    console.error("Error updating homepage slides:", error);
    writeLocalSlides(normalizedSlides);
    return { slides: normalizedSlides, syncSource: "local" };
  }
};
