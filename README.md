# ETicaretDepo

![React](https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61dafb)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-ffca28?logo=firebase&logoColor=black)
![Status](https://img.shields.io/badge/status-active-success)

ETicaretDepo, bayi mantığıyla çalışan bir e-ticaret depo ve operasyon paneli denemesi.  
Proje hem vitrin tarafını hem de yönetim tarafını tek repo içinde topluyor. Mantık şu:

- bayi veya kullanıcı giriş yapar
- ürünleri görür, sepete ekler
- sipariş oluşturur
- admin siparişi onay, ödeme, depo, kargo ve teslim akışında yönetir

Kısacası düz bir mağaza arayüzünden çok, ürün + bayi + operasyon tarafını aynı yerde toplamaya çalışan bir sistem.

---

## Ne Var?

Projede şu an çalışan ana parçalar:

- mağaza ana sayfası
- ürün detay sayfası
- çoklu görselli ürün galerisi
- sepet
- hesap merkezi
- bayi kayıt / giriş sistemi
- demo admin hesabı
- admin ürün yönetimi
- admin sipariş operasyon paneli
- arşive alma / geri alma mantığı

Ürünler sadece isim-fiyat listesi değil.  
Kategori, alt kategori, bayi fiyatı, minimum sipariş adedi, stok, tedarikçi, açıklama ve galeri görselleriyle tutuluyor.

---

## Demo Giriş

### Admin

- mail: `admin@eticaretdepo.com`
- şifre: `admin1234`

### Bayi

İstersen `/register` üzerinden yeni bayi hesabı oluşturabilirsin.  
Yeni açılan hesaplar bayi rolüyle sisteme girer.

---

## Proje Mantığı

Bu projede satın alma tarafı bilerek biraz daha gerçekçi kurulmaya çalışıldı.

Misafir kullanıcı sipariş veremez.  
Önce giriş yapılması gerekir.

Giriş yapan kullanıcı checkout ekranında tekrar form doldurmaz.  
Sistem, hesap merkezindeki kayıtlı bilgileri kullanır.

Eksik bilgi varsa kullanıcıyı profil sayfasına yollar:

- ad soyad
- bayi / şirket adı
- telefon
- şehir
- açık adres

Bu bilgi mantığı özellikle bayi siparişi tarafında önemli olduğu için formu checkout’tan ayırdım.

---

## Sipariş Akışı

Siparişler burada tek satırlık bir `status` mantığıyla ilerlemiyor.  
Admin tarafında süreç birkaç adıma ayrılmış durumda:

1. Onay bekliyor
2. Onaylandı
3. Ödeme alındı
4. Depoya aktarıldı
5. Hazırlanıyor
6. Paketlendi
7. Kargoya verildi
8. Teslim edildi

Yanlışlıkla işlem yapılırsa sipariş tamamen uçmuyor.

- operasyondan kaldırılabiliyor
- arşive alınabiliyor
- sonra geri alınabiliyor

Yani “sil” yerine daha güvenli bir operasyon mantığı var.

---

## Ürün Yapısı

Her ürün şu tip alanlarla tutuluyor:

```js
{
  id: "1",
  sku: "SKU-1001",
  name: "Apple iPhone 15 Pro 128 GB",
  brand: "Apple",
  category: "Elektronik",
  subcategory: "Tüketici Elektroniği",
  price: 64999,
  wholesalePrice: 62150,
  stock: 45,
  reserved: 12,
  threshold: 20,
  minOrderQty: 1,
  supplier: "Apple Distribütör",
  location: "A-01",
  channel: "Pazaryeri + Bayi",
  description: "Ürün açıklaması",
  image: "ana görsel",
  images: ["ana görsel", "galeri 1", "galeri 2"]
}
```

Admin panelinde ürün eklerken:

- çoklu görsel yüklenebilir
- yüklenen görseller önizlenir
- istenen görsel kaldırılabilir
- ilk görsel ana görsel olarak kullanılır

Ürün detay sayfasında da bu yapı doğrudan galeri olarak gösterilir.

---

## Katalog

Katalog tek bir kategoriye sıkışık değil.  
Daha çok bayi ve toptan satış tarafına yakın dursun diye ürünler farklı gruplara ayrıldı:

- elektronik
- moda
- temizlik
- anne bebek
- gıda
- ofis
- telefon aksesuar
- küçük ev aletleri

Buradaki amaç gerçek market / bayi / pazaryeri karışımı bir katalog hissi vermekti.  
O yüzden sadece “şık ürünler” değil, hızlı dönen ve yüksek stoklu kalemler de var.

---

## Teknik Taraf

### Frontend

- React 19
- Vite
- React Router DOM
- Zustand
- Lucide React

### Backend / Veri

- Firebase Auth
- Firebase Firestore

### Yedek Çalışma Mantığı

Firebase her zaman hazır olmayabileceği için bazı akışlarda local fallback var.

Özetle:

- auth mümkünse Firebase ile deneniyor
- ürünler mümkünse Firestore’a yazılıyor
- siparişler mümkünse Firestore’a yazılıyor
- hata olursa bazı veriler `localStorage` üzerinden tutuluyor

Bu production için ideal değil ama geliştirme ve demo için sistemi ayakta tutuyor.

---

## Kod Yapısı

```text
src/
├── pages/
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ProductManagement.jsx
│   │   └── OrderManagement.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   └── shop/
│       ├── ShopLayout.jsx
│       ├── HomePage.jsx
│       ├── ProductDetail.jsx
│       ├── Cart.jsx
│       ├── Checkout.jsx
│       └── AccountPage.jsx
├── services/
│   ├── accountService.js
│   ├── authService.js
│   ├── productService.js
│   ├── orderService.js
│   └── mockData.js
├── store/
│   ├── useAuthStore.js
│   └── useCartStore.js
├── App.jsx
└── firebase.js
```

---

## Yerelde Çalıştırma

```bash
npm install
npm run dev
```

Preview:

```bash
npm run preview
```

Production build:

```bash
npm run build
```

Build çıktısı `dist/` klasörüne gider.

---

## Şu Anda Bilinçli Olarak Basit Bıraktığım Yerler

Bu repo hâlâ geliştirme halinde, o yüzden bazı parçalar tam production seviyesi değil:

- görseller şu an Firebase Storage yerine tarayıcı tarafında işleniyor
- kullanıcı rolleri gerçek bir `users` koleksiyonu yerine local + auth mantığıyla yürütülüyor
- sipariş detay ekranı henüz ayrı sayfa değil
- ürün arama / filtreleme derinleştirilmedi
- bundle boyutu hâlâ büyük

Yani iskelet oturmuş durumda ama büyütülebilecek çok yer var.

---

## Sonraki Mantıklı Adımlar

Ben bu projeyi devam ettirsem sıradaki işler büyük ihtimalle şunlar olurdu:

1. Firebase Storage ile gerçek görsel upload
2. Firestore üzerinde gerçek kullanıcı rol yönetimi
3. bayi bazlı fiyat listesi
4. sipariş detay sayfası
5. dashboard grafik ve raporlar
6. ürün arama / filtre / sıralama
7. code splitting ile bundle küçültme

---

## Not

README’yi özellikle daha doğal ve proje sahibi ağzına yakın tutmaya çalıştım.  
İstersen bir sonraki adımda buna repo içi gerçek ekran görüntüleri de ekleyebilirim. En düzgünü `docs/` klasörü açıp mağaza, ürün detay, admin panel ve sipariş operasyon ekranlarını oraya koymak olur.
