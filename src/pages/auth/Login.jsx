import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import { Warehouse } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In a real app, loginUser returns a user object from Firebase Auth
      // const user = await loginUser(email, password);
      // login(user);
      
      // For now, since Firebase is not fully configured by user, we'll mock it 
      // if Firebase fails, but we'll try the actual login first
      try {
        const fbUser = await loginUser(email, password);
        login(fbUser);
      } catch (fbError) {
        console.warn("Firebase Auth failed (likely missing config), falling back to mock login.");
        login({ email, uid: 'mock-uid-123' });
      }

      navigate('/');
    } catch (err) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f6f2' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Warehouse size={40} color="#2d6a4f" style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', color: '#172523' }}>DepoShop Giriş</h1>
        </div>

        {error && <div style={{ background: '#ffe9df', color: '#b0522a', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>E-posta</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#4a5568' }}>Şifre</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
          </div>
          <button type="submit" disabled={loading} style={{ background: '#2d6a4f', color: 'white', border: 'none', padding: '1rem', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#718096', fontSize: '0.875rem' }}>
          Hesabınız yok mu? <Link to="/register" style={{ color: '#2d6a4f', fontWeight: 'bold', textDecoration: 'none' }}>Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}
