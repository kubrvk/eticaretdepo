export const initialProducts = [
  // Elektronik
  { id: "1", sku: "SKU-1001", name: "Apple iPhone 15 Pro 128 GB", category: "Elektronik", stock: 45, reserved: 12, threshold: 20, location: "A-01", velocity: "Hızlı", price: 64999, image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&q=80", description: "Titanyum tasarım, A17 Pro çip, 48 MP Ana kamera.", brand: "Apple", rating: 4.8 },
  { id: "2", sku: "SKU-1002", name: "Samsung Galaxy S24 Ultra 256 GB", category: "Elektronik", stock: 30, reserved: 5, threshold: 15, location: "A-02", velocity: "Hızlı", price: 69999, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80", description: "Yapay zeka özellikleri ile donatılmış yeni nesil akıllı telefon.", brand: "Samsung", rating: 4.7 },
  { id: "3", sku: "SKU-1003", name: "Sony WH-1000XM5 Kablosuz Kulaklık", category: "Elektronik", stock: 84, reserved: 18, threshold: 35, location: "A-12", velocity: "Hızlı", price: 12999, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80", description: "Sektör lideri gürültü engelleme teknolojisi.", brand: "Sony", rating: 4.9 },
  { id: "4", sku: "SKU-1004", name: "MacBook Air M3 13.6 inç", category: "Elektronik", stock: 15, reserved: 2, threshold: 10, location: "A-05", velocity: "Normal", price: 42999, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80", description: "Ultra ince, ultra hızlı yeni M3 çipli MacBook Air.", brand: "Apple", rating: 4.9 },
  { id: "5", sku: "SKU-1005", name: "Dyson V15 Detect Absolute", category: "Elektronik", stock: 8, reserved: 3, threshold: 10, location: "A-15", velocity: "Hızlı", price: 28999, image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80", description: "Lazer teknolojisiyle görünmeyen tozları açığa çıkarır.", brand: "Dyson", rating: 4.8 },
  { id: "6", sku: "SKU-1006", name: "LG 55 Inç 4K Smart OLED TV", category: "Elektronik", stock: 12, reserved: 1, threshold: 5, location: "B-01", velocity: "Yavaş", price: 45999, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80", description: "Kendinden aydınlatmalı piksellerle kusursuz siyah.", brand: "LG", rating: 4.7 },

  // Moda
  { id: "7", sku: "SKU-2001", name: "Oversize Organik Pamuk Tişört", category: "Moda", stock: 120, reserved: 25, threshold: 50, location: "C-01", velocity: "Hızlı", price: 349, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", description: "Rahat kesim, çevre dostu organik pamuk.", brand: "Mavi", rating: 4.5 },
  { id: "8", sku: "SKU-2002", name: "Yüksek Bel Skinny Jean", category: "Moda", stock: 85, reserved: 10, threshold: 30, location: "C-05", velocity: "Orta", price: 599, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80", description: "Esnek kumaş, toparlayıcı etki.", brand: "Levi's", rating: 4.6 },
  { id: "9", sku: "SKU-2003", name: "Erkek Spor Ayakkabı Air Max", category: "Moda", stock: 45, reserved: 8, threshold: 20, location: "D-12", velocity: "Hızlı", price: 3299, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", description: "Günlük kullanım için maksimum konfor.", brand: "Nike", rating: 4.8 },
  { id: "10", sku: "SKU-2004", name: "Deri Çapraz Askılı Çanta", category: "Moda", stock: 32, reserved: 4, threshold: 15, location: "C-11", velocity: "Normal", price: 1199, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", description: "Hakiki deri, zarif tasarım.", brand: "Vakko", rating: 4.7 },
  { id: "11", sku: "SKU-2005", name: "Kapüşonlu Sweatshirt", category: "Moda", stock: 150, reserved: 40, threshold: 60, location: "C-02", velocity: "Hızlı", price: 499, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80", description: "Kış ayları için sıcak tutan kalın kumaş.", brand: "Puma", rating: 4.4 },
  { id: "12", sku: "SKU-2006", name: "Güneş Gözlüğü UV400", category: "Moda", stock: 65, reserved: 5, threshold: 20, location: "C-20", velocity: "Normal", price: 1899, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80", description: "%100 UV korumalı polarize cam.", brand: "Ray-Ban", rating: 4.8 },

  // Ev & Yaşam
  { id: "13", sku: "SKU-3001", name: "Seramik Kahve Seti 2'li", category: "Ev & Yaşam", stock: 112, reserved: 22, threshold: 30, location: "E-18", velocity: "Hızlı", price: 549, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80", description: "El yapımı seramik kahve takımı.", brand: "Paşabahçe", rating: 4.9 },
  { id: "14", sku: "SKU-3002", name: "Ortopedik Visco Yastık", category: "Ev & Yaşam", stock: 48, reserved: 6, threshold: 20, location: "E-05", velocity: "Orta", price: 799, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=500&q=80", description: "Boyun destekli hafızalı sünger yastık.", brand: "Yataş", rating: 4.6 },
  { id: "15", sku: "SKU-3003", name: "Çift Kişilik Nevresim Takımı", category: "Ev & Yaşam", stock: 75, reserved: 12, threshold: 25, location: "E-10", velocity: "Hızlı", price: 1299, image: "https://images.unsplash.com/photo-1522771730841-5a920d5f48cd?w=500&q=80", description: "%100 pamuklu ranforce kumaş.", brand: "Taç", rating: 4.7 },
  { id: "16", sku: "SKU-3004", name: "Dekoratif Masa Lambası", category: "Ev & Yaşam", stock: 34, reserved: 3, threshold: 15, location: "E-12", velocity: "Normal", price: 459, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80", description: "Modern tasarımlı metal gövdeli lamba.", brand: "IKEA", rating: 4.5 },
  { id: "17", sku: "SKU-3005", name: "Döküm Demir Tava", category: "Ev & Yaşam", stock: 25, reserved: 5, threshold: 10, location: "E-01", velocity: "Yavaş", price: 1499, image: "https://images.unsplash.com/photo-1584285421711-d576a8fa7075?w=500&q=80", description: "Ömür boyu garantili emaye kaplı döküm.", brand: "Lava", rating: 4.8 },
  { id: "18", sku: "SKU-3006", name: "Bambu Kesme Tahtası", category: "Ev & Yaşam", stock: 150, reserved: 15, threshold: 40, location: "E-08", velocity: "Hızlı", price: 199, image: "https://images.unsplash.com/photo-1605335956041-8f553dc79667?w=500&q=80", description: "Doğal bambudan üretilmiş antibakteriyel tahta.", brand: "Bambum", rating: 4.3 },

  // Kozmetik & Kişisel Bakım
  { id: "19", sku: "SKU-4001", name: "Nemlendirici Yüz Kremi 50ml", category: "Kozmetik", stock: 210, reserved: 45, threshold: 50, location: "F-01", velocity: "Hızlı", price: 499, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80", description: "24 saat etkili yoğun nemlendirici bakım.", brand: "CeraVe", rating: 4.9 },
  { id: "20", sku: "SKU-4002", name: "C Vitamini Serumu 30ml", category: "Kozmetik", stock: 88, reserved: 14, threshold: 30, location: "F-02", velocity: "Hızlı", price: 699, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80", description: "Cilt tonu eşitleyici aydınlatıcı serum.", brand: "La Roche-Posay", rating: 4.7 },
  { id: "21", sku: "SKU-4003", name: "Erkek Parfüm EDP 100ml", category: "Kozmetik", stock: 45, reserved: 8, threshold: 15, location: "F-05", velocity: "Normal", price: 3499, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80", description: "Odunsu ve baharatlı kalıcı koku.", brand: "Dior", rating: 4.8 },
  { id: "22", sku: "SKU-4004", name: "Mat Ruj Seti 3'lü", category: "Kozmetik", stock: 65, reserved: 10, threshold: 20, location: "F-07", velocity: "Orta", price: 549, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80", description: "Kuruluk yapmayan kadifemsi mat bitiş.", brand: "MAC", rating: 4.6 },
  { id: "23", sku: "SKU-4005", name: "Güneş Kremi 50+ SPF 50ml", category: "Kozmetik", stock: 300, reserved: 80, threshold: 100, location: "F-10", velocity: "Çok Hızlı", price: 399, image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&q=80", description: "Su bazlı, parlamayı önleyen yüksek koruma.", brand: "Bioderma", rating: 4.9 },
  { id: "24", sku: "SKU-4006", name: "Saç Bakım Yağı 100ml", category: "Kozmetik", stock: 120, reserved: 15, threshold: 40, location: "F-12", velocity: "Hızlı", price: 649, image: "https://images.unsplash.com/photo-1608248593842-8021c60b9435?w=500&q=80", description: "Argan yağı özlü yıpranma karşıtı saç serumu.", brand: "Kerastase", rating: 4.8 }
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
