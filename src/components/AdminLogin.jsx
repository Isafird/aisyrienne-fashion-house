import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AdminLogin({ onClose, onLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Email atau kata sandi salah.')
      return
    }
    onLoggedIn()
  }

  return (
    <div className="overlay admin-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal login-card">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Masuk admin</h2>
        <p>Khusus untuk pengelola toko — kelola koleksi, ulasan pelanggan, dan pengaturan toko di sini.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email admin</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tokokamu.com" required />
          </div>
          <div className="field">
            <label>Kata sandi</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan kata sandi" required />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Memeriksa...' : 'Masuk'}
          </button>
          {error && <div className="form-msg err">{error}</div>}
        </form>
      </div>
    </div>
  )
}
