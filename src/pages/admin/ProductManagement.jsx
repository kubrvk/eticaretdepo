import React, { useEffect, useState } from 'react';
import { PackageCheck } from 'lucide-react';
import { getProducts } from '../../services/productService';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className="panel stock-panel" id="stok">
      <div className="panel-head">
        <div>
          <h2>Stok durumu</h2>
          <p>Satış hızı, rezerv ve raf konumuyla ürün takibi</p>
        </div>
        <button type="button"><PackageCheck size={17} />Stok ekle</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Kategori</th>
              <th>Raf</th>
              <th>Stok</th>
              <th>Rezerv</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isLow = product.stock < product.threshold;
              return (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <span>{product.sku}</span>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.location}</td>
                  <td>{product.stock}</td>
                  <td>{product.reserved}</td>
                  <td>
                    <span className={isLow ? "pill danger" : "pill success"}>
                      {isLow ? "Kritik" : product.velocity}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
