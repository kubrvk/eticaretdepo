# E-Ticaret Depo Yönetimi

React ile hazırlanmış e-ticaret depo yönetimi paneli. Ürün stoğu, sipariş kuyruğu, depo performansı ve kritik stok uyarıları için tek ekranlı bir operasyon arayüzü içerir.

## Yerelde çalıştırma

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Build çıktısı `dist` klasörüne üretilir ve Firebase Hosting bu klasörü yayınlar.

## Firebase deploy ayarı

1. Firebase Console'da bir proje oluştur.
2. `.firebaserc` dosyasındaki `YOUR_FIREBASE_PROJECT_ID` değerini Firebase proje ID'n ile değiştir.
3. `.github/workflows/firebase-hosting.yml` içindeki `projectId` değerini aynı proje ID ile değiştir.
4. Firebase servis hesabı JSON'unu GitHub repository secrets içine `FIREBASE_SERVICE_ACCOUNT` adıyla ekle.
5. Kod `main` branch'ine push edilince GitHub Actions otomatik build alır ve Firebase Hosting'e deploy eder.

Firebase servis hesabı üretmek için:

```bash
firebase init hosting:github
```

Bu komut GitHub bağlantısını ve secret oluşturma işini otomatik yapabilir. Bu repoda workflow dosyası hazır olduğu için istersen yalnızca secret ve project ID alanlarını tamamlayabilirsin.
