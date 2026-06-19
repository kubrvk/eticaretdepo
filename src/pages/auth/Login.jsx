import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Warehouse } from "lucide-react";
import { loginUser } from "../../services/authService";
import { getDefaultAdminCredentials } from "../../services/accountService";
import { useAuthStore } from "../../store/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const adminCredentials = getDefaultAdminCredentials();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginUser({ email, password });
      login(user);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError("Giriş başarısız. Kayıtlı bayi/admin hesabı ve şifre kontrolü yapın.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff6ef" }}>
      <div style={{ background: "white", padding: "3rem", borderRadius: "18px", boxShadow: "0 20px 40px rgba(242,122,26,0.12)", width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Warehouse size={40} color="#f27a1a" style={{ margin: "0 auto 1rem" }} />
          <h1 style={{ fontSize: "1.5rem", color: "#1f2937" }}>DepoMarket Giriş</h1>
          <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>Admin ve bayi hesapları ayrı yetkiyle yönetilir.</p>
        </div>

        {error ? <div style={{ background: "#fff0e8", color: "#c95610", padding: "0.85rem", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</div> : null}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#4b5563" }}>E-posta</label>
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1px solid #fed7aa" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#4b5563" }}>Şifre</label>
            <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1px solid #fed7aa" }} />
          </div>
          <button type="submit" disabled={loading} style={{ background: "#f27a1a", color: "white", border: "none", padding: "1rem", borderRadius: "10px", fontSize: "1rem", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#718096", fontSize: "0.875rem" }}>
          Hesabınız yok mu? <Link to="/register" style={{ color: "#f27a1a", fontWeight: "700", textDecoration: "none" }}>Bayi hesabı oluştur</Link>
        </p>
        <p style={{ textAlign: "center", marginTop: "0.75rem", color: "#9ca3af", fontSize: "0.8rem" }}>
          Demo admin: <strong>{adminCredentials.email}</strong> / <strong>{adminCredentials.password}</strong>
        </p>
      </div>
    </div>
  );
}
