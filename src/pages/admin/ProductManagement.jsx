import React, { useEffect, useState } from "react";
import { FilePenLine, PackageCheck, PlusCircle, Trash2, Upload } from "lucide-react";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../../services/productService";

const initialForm = {
  name: "",
  sku: "",
  brand: "",
  category: "Elektronik",
  subcategory: "",
  price: "",
  wholesalePrice: "",
  stock: "",
  reserved: "0",
  threshold: "5",
  location: "",
  supplier: "",
  minOrderQty: "1",
  channel: "B2B + Pazaryeri",
  description: "",
  images: [],
};

const mapProductToForm = (product) => ({
  name: product.name || "",
  sku: product.sku || "",
  brand: product.brand || "",
  category: product.category || "",
  subcategory: product.subcategory || "",
  price: String(product.price || ""),
  wholesalePrice: String(product.wholesalePrice || ""),
  stock: String(product.stock || ""),
  reserved: String(product.reserved || 0),
  threshold: String(product.threshold || 5),
  location: product.location || "",
  supplier: product.supplier || "",
  minOrderQty: String(product.minOrderQty || 1),
  channel: product.channel || "",
  description: product.description || "",
  images: product.images || (product.image ? [product.image] : []),
});

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 1200;
        const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const readFilesAsDataUrls = async (files) => Promise.all(Array.from(files).map((file) => readImageFile(file)));

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageChange = async (event) => {
    const files = event.target.files;
    if (!files?.length) return;
    const images = await readFilesAsDataUrls(files);
    setForm((current) => ({
      ...current,
      images: [...current.images, ...images],
    }));
    event.target.value = "";
  };

  const removeImage = (imageIndex) => {
    if (!window.confirm("Bu görseli kaldırmak istiyor musunuz?")) {
      return;
    }
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, index) => index !== imageIndex),
    }));
  };

  const resetForm = () => {
    setEditingId("");
    setForm(initialForm);
  };

  const buildPayload = () => ({
    ...form,
    price: Number(form.price),
    wholesalePrice: Number(form.wholesalePrice || form.price),
    stock: Number(form.stock),
    reserved: Number(form.reserved),
    threshold: Number(form.threshold),
    minOrderQty: Number(form.minOrderQty),
    velocity: Number(form.stock) <= Number(form.threshold) ? "Kritik" : "Normal",
    images: form.images.length ? form.images : [],
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (form.images.length === 0) {
        throw new Error("IMAGE_REQUIRED");
      }

      if (editingId) {
        await updateProduct(editingId, buildPayload());
        setMessage("Ürün güncellendi.");
      } else {
        const created = await addProduct(buildPayload());
        setMessage(
          created.syncSource === "local"
            ? "Ürün eklendi. Firebase yazma izni olmadığı için bu tarayıcıda yerel olarak saklandı."
            : "Ürün başarıyla eklendi."
        );
      }

      resetForm();
      await fetchProducts();
    } catch (submitError) {
      console.error(submitError);
      setError(editingId ? "Ürün güncellenirken hata oluştu." : "Ürün eklenirken hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm(mapProductToForm(product));
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`"${product.name}" ürününü silmek istiyor musunuz?`)) return;
    setDeletingId(product.id);
    setMessage("");
    setError("");

    try {
      await deleteProduct(product.id);
      setMessage("Ürün listeden kaldırıldı.");
      await fetchProducts();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Ürün silinirken bir hata oluştu.");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return <div className="panel-empty">Yükleniyor...</div>;
  }

  return (
    <div className="admin-page-stack">
      <section className="panel trendyol-panel">
        <div className="panel-head compact">
          <div>
            <h2>{editingId ? "Ürünü düzenle" : "Yeni ürün ekle"}</h2>
            <p>Ürün kartı, kategori, alt kategori, açıklama ve galeri görselleriyle tek formdan yönetilir.</p>
          </div>
          <span className="pill trendyol-pill">
            <PlusCircle size={15} />
            {editingId ? "Düzenleme modu" : "Canlı kayıt"}
          </span>
        </div>

        <form className="product-form-grid" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Ürün adı" required />
          <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU kodu" required />
          <input name="brand" value={form.brand} onChange={handleChange} placeholder="Marka" required />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Kategori" required />
          <input name="subcategory" value={form.subcategory} onChange={handleChange} placeholder="Alt kategori" required />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Perakende fiyat" type="number" min="0" required />
          <input name="wholesalePrice" value={form.wholesalePrice} onChange={handleChange} placeholder="Bayi fiyatı" type="number" min="0" required />
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stok" type="number" min="0" required />
          <input name="reserved" value={form.reserved} onChange={handleChange} placeholder="Rezerve stok" type="number" min="0" />
          <input name="threshold" value={form.threshold} onChange={handleChange} placeholder="Kritik stok eşiği" type="number" min="0" />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Raf konumu" required />
          <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Tedarikçi / distribütör" required />
          <input name="minOrderQty" value={form.minOrderQty} onChange={handleChange} placeholder="Minimum bayi siparişi" type="number" min="1" required />
          <input name="channel" value={form.channel} onChange={handleChange} placeholder="Satış kanalı" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Ürün açıklaması" rows="4" required />

          <div className="product-upload-box">
            <label className="upload-trigger">
              <Upload size={18} />
              Görselleri yükle
              <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden />
            </label>
            <p>Link yerine doğrudan dosya yükleyin. İlk görsel ana resim olarak kullanılır.</p>
            <div className="upload-preview-grid">
              {form.images.map((image, index) => (
                <div key={`${image}-${index}`} className="upload-preview-card">
                  <img src={image} alt={`Ürün görseli ${index + 1}`} />
                  <button type="button" className="danger-button table-action-button" onClick={() => removeImage(index)}>
                    Kaldır
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <div>
              {message ? <p className="form-success">{message}</p> : null}
              {error ? <p className="form-error">{error}</p> : null}
            </div>
            <div className="inline-actions">
              {editingId ? (
                <button type="button" className="secondary-button" onClick={resetForm}>
                  İptal
                </button>
              ) : null}
              <button type="submit" disabled={saving} className="trendyol-submit-button">
                {saving ? "Kaydediliyor..." : editingId ? "Ürünü Güncelle" : "Ürünü Kaydet"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="panel stock-panel trendyol-panel">
        <div className="panel-head">
          <div>
            <h2>Ürün ve bayi kataloğu</h2>
            <p>Bayi fiyatı, alt kategori, stok ve kanal bilgisiyle ürünler burada yönetilir.</p>
          </div>
          <button type="button" className="accent-soft-button">
            <PackageCheck size={17} />
            {products.length} ürün aktif
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Perakende</th>
                <th>Bayi</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isLow = product.stock <= product.threshold;
                return (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                      <span>{product.brand} • {product.sku}</span>
                    </td>
                    <td>
                      <strong>{product.category}</strong>
                      <span>{product.subcategory}</span>
                    </td>
                    <td>
                      <span className={isLow ? "pill danger" : "pill success"}>{product.stock} adet</span>
                    </td>
                    <td>{product.price.toLocaleString("tr-TR")} TL</td>
                    <td>{product.wholesalePrice.toLocaleString("tr-TR")} TL</td>
                    <td>
                      <div className="inline-actions">
                        <button type="button" className="table-action-button accent-soft-button" onClick={() => handleEdit(product)}>
                          <FilePenLine size={16} />
                          Düzenle
                        </button>
                        <button type="button" className="table-action-button danger-button" onClick={() => handleDelete(product)} disabled={deletingId === product.id}>
                          <Trash2 size={16} />
                          {deletingId === product.id ? "Siliniyor..." : "Sil"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
