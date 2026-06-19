export const initialProducts = [
  { id: "1", sku: "SKU-1048", name: "Kablosuz Kulaklık", category: "Elektronik", stock: 84, reserved: 18, threshold: 35, location: "A-12", velocity: "Hızlı", price: 1299.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", description: "Yüksek kaliteli ses ve uzun pil ömrü sunan kablosuz kulaklık." },
  { id: "2", sku: "SKU-2210", name: "Organik Pamuk Tişört", category: "Giyim", stock: 27, reserved: 9, threshold: 40, location: "B-04", velocity: "Orta", price: 299.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", description: "Rahat ve çevre dostu %100 organik pamuk tişört." },
  { id: "3", sku: "SKU-3302", name: "Seramik Kahve Seti", category: "Ev & Yaşam", stock: 112, reserved: 22, threshold: 30, location: "C-18", velocity: "Hızlı", price: 549.99, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80", description: "Şık tasarımlı 2 kişilik el yapımı seramik kahve seti." },
  { id: "4", sku: "SKU-4107", name: "Spor Matı", category: "Spor", stock: 16, reserved: 7, threshold: 25, location: "D-07", velocity: "Yavaş", price: 189.99, image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?w=500&q=80", description: "Kaymaz yüzeyli ve kolay taşınabilir kalın yoga matı." },
  { id: "5", sku: "SKU-5981", name: "Bebek Bakım Çantası", category: "Anne & Bebek", stock: 49, reserved: 12, threshold: 20, location: "A-05", velocity: "Orta", price: 899.99, image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&q=80", description: "Çok bölmeli ve termal cepli geniş bebek bakım çantası." },
];

export const initialOrders = [
  { id: "ORD-9124", customer: "Trendyol", items: 18, status: "Toplanıyor", priority: "Yüksek", eta: "11:20" },
  { id: "ORD-9125", customer: "Hepsiburada", items: 7, status: "Paketleme", priority: "Normal", eta: "12:05" },
  { id: "ORD-9126", customer: "Shopify Mağaza", items: 31, status: "Kontrol", priority: "Yüksek", eta: "12:30" },
  { id: "ORD-9127", customer: "Amazon TR", items: 11, status: "Kargoya hazır", priority: "Normal", eta: "13:10" },
];

export const initialActivity = [
  "12 ürün kritik stok listesine eklendi",
  "42 sipariş için kargo etiketi üretildi",
  "A-12 rafında sayım farkı kapatıldı",
  "Yeni tedarik teslimatı kabul edildi",
];
