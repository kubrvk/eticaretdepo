import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Warehouse } from "lucide-react";
import { registerUser } from "../../services/authService";
import { useAuthStore } from "../../store/useAuthStore";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    try {
      const user = await registerUser({ email, password, fullName, companyName });
      login(user);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError("Kayıt başarısız. Aynı e-posta ile daha önce hesap açılmış olabilir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff6ef" }}>
      <div style={{ background: "white", padding: "3rem", borderRadius: "18px", boxShadow: "0 20px 40px rgba(242,122,26,0.12)", width: "100%", maxWidth: "460px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Warehouse size={40} color="#f27a1a" style={{ margin: "0 auto 1rem" }} />
          <h1 style={{ fontSize: "1.5rem", color: "#1f2937" }}>Bayi Hesabı Oluştur</h1>
          <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>Kayıt olan hesaplar varsayılan olarak bayi rolüyle açılır.</p>
        </div>

        {error ? <div style={{ background: "#fff0e8", color: "#c95610", padding: "0.85rem", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</div> : null}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.1rem" }}>
          <input required type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Yetkili kişi adı" style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1px solid #fed7aa" }} />
          <input required type="text" value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="Bayi / şirket adı" style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1px solid #fed7aa" }} />
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-posta" style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1px solid #fed7aa" }} />
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifre" style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1px solid #fed7aa" }} />
          <input required type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Şifre tekrar" style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1px solid #fed7aa" }} />
          <button type="submit" disabled={loading} style={{ background: "#f27a1a", color: "white", border: "none", padding: "1rem", borderRadius: "10px", fontSize: "1rem", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Kayıt oluşturuluyor..." : "Bayi Hesabı Aç"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#718096", fontSize: "0.875rem" }}>
          Zaten hesabınız var mı? <Link to="/login" style={{ color: "#f27a1a", fontWeight: "700", textDecoration: "none" }}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
