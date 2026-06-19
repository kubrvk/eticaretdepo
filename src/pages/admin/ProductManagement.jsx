import React, { useEffect, useState } from "react";
import { FilePenLine, PackageCheck, PlusCircle, Trash2 } from "lucide-react";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../../services/productService";

const initialForm = {
  name: "",
  sku: "",
  brand: "",
  category: "Elektronik",
  price: "",
  wholesalePrice: "",
  stock: "",
  reserved: "0",
  threshold: "5",
  location: "",
  supplier: "",
  minOrderQty: "1",
  channel: "B2B + Pazaryeri",
  image: "",
  description: "",
};

const mapProductToForm = (product) => ({
  name: product.name || "",
  sku: product.sku || "",
  brand: product.brand || "",
  category: product.category || "",
  price: String(product.price || ""),
  wholesalePrice: String(product.wholesalePrice || ""),
  stock: String(product.stock || ""),
  reserved: String(product.reserved || 0),
  threshold: String(product.threshold || 5),
  location: product.location || "",
  supplier: product.supplier || "",
  minOrderQty: String(product.minOrderQty || 1),
  channel: product.channel || "",
  image: product.image || "",
  description: product.description || "",
});

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
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
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
    const confirmed = window.confirm(`"${product.name}" ürününü silmek istiyor musunuz?`);
    if (!confirmed) return;

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
            <p>Gerçek bayi sistemlerinde ürün kartı tek formdan eklenir ve aynı formdan revize edilir.</p>
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
          <input name="price" value={form.price} onChange={handleChange} placeholder="Perakende fiyat" type="number" min="0" required />
          <input name="wholesalePrice" value={form.wholesalePrice} onChange={handleChange} placeholder="Bayi fiyatı" type="number" min="0" required />
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stok" type="number" min="0" required />
          <input name="reserved" value={form.reserved} onChange={handleChange} placeholder="Rezerve stok" type="number" min="0" />
          <input name="threshold" value={form.threshold} onChange={handleChange} placeholder="Kritik stok eşiği" type="number" min="0" />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Raf konumu" required />
          <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Tedarikçi / distribütör" required />
          <input name="minOrderQty" value={form.minOrderQty} onChange={handleChange} placeholder="Minimum bayi siparişi" type="number" min="1" required />
          <input name="channel" value={form.channel} onChange={handleChange} placeholder="Satış kanalı" required />
          <input name="image" value={form.image} onChange={handleChange} placeholder="Ürün görsel URL" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Ürün açıklaması" rows="4" required />

          <div className="form-actions">
            <div>
              {message ? <p className="form-success">{message}</p> : null}
              {error ? <p className="form-error">{error}</p> : null}
            </div>
            <div className="inline-actions">
              {editingId ? <button type="button" className="secondary-button" onClick={resetForm}>İptal</button> : null}
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
            <p>Bayi fiyatı, stok ve kanal bilgisiyle ürünler burada yönetilir.</p>
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
                <th>Kanal</th>
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
                    <td>{product.channel}</td>
                    <td><span className={isLow ? "pill danger" : "pill success"}>{product.stock} adet</span></td>
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
