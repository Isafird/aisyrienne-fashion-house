import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

export default function SettingsTab({ settings, onSave }) {
  const [storeName, setStoreName] = useState(settings.store_name)
  const [tagline, setTagline] = useState(settings.tagline)
  const [waNumber, setWaNumber] = useState(settings.wa_number)
  const [msg, setMsg] = useState({ text: '', ok: true })

  const [newPassword, setNewPassword] = useState('')
  const [passMsg, setPassMsg] = useState({ text: '', ok: true })

  useEffect(() => {
    setStoreName(settings.store_name)
    setTagline(settings.tagline)
    setWaNumber(settings.wa_number)
  }, [settings])

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await onSave({ store_name: storeName.trim(), tagline: tagline.trim(), wa_number: waNumber.trim() })
    setMsg(error ? { text: 'Gagal menyimpan, coba lagi.', ok: false } : { text: 'Pengaturan disimpan.', ok: true })
    setTimeout(() => setMsg({ text: '', ok: true }), 2500)
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      setPassMsg({ text: 'Kata sandi minimal 6 karakter.', ok: false })
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPassMsg({ text: 'Gagal mengubah kata sandi.', ok: false })
      return
    }
    setNewPassword('')
    setPassMsg({ text: 'Kata sandi berhasil diubah.', ok: true })
  }

  return (
    <section>
      <h2>Pengaturan toko</h2>
      <div className="sub">Ubah nama toko, tagline, nomor WhatsApp, dan kata sandi admin.</div>

      <form className="settings-card" onSubmit={handleSubmit}>
        <div className="field"><label>Nama toko</label>
          <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
        </div>
        <div className="field"><label>Tagline hero</label>
          <textarea value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
        <div className="field"><label>Nomor WhatsApp (format 62xxxxxxxxxx)</label>
          <input type="text" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} placeholder="6281234567890" />
        </div>
        <button className="btn btn-primary btn-block" type="submit">Simpan pengaturan</button>
        {msg.text && <div className={`form-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      </form>

      <form className="settings-card" style={{ marginTop: 20 }} onSubmit={handlePasswordChange}>
        <div className="field"><label>Ganti kata sandi admin</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Kata sandi baru" />
        </div>
        <button className="btn btn-outline btn-block" type="submit">Simpan kata sandi baru</button>
        {passMsg.text && <div className={`form-msg ${passMsg.ok ? 'ok' : 'err'}`}>{passMsg.text}</div>}
      </form>
    </section>
  )
}
