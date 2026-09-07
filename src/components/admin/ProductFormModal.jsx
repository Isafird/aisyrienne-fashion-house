import { useState } from 'react'

export default function ProductFormModal({ product, onClose, onSave }) {
  const [name, setName] = useState(product?.name || '')
  const [category, setCategory] = useState(product?.category || 'buket')
  const [price, setPrice] = useState(product?.price || '')
  const [imageUrl, setImageUrl] = useState(product?.image_url || '')
  const [description, setDescription] = useState(product?.description || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await onSave({
      id: product?.id,
      name: name.trim(),
      category,
      price: Number(price),
      image_url: imageUrl.trim(),
      description: description.trim(),
    })
    setSaving(false)
    if (error) setError('Gagal menyimpan produk, coba lagi.')
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520, padding: 30 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 18 }}>{product ? 'Ubah produk' : 'Tambah produk'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Nama produk</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid-2">
            <div className="field"><label>Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="buket">Buket Bunga</option>
                <option value="fashion">Fashion</option>
              </select>
            </div>
            <div className="field"><label>Harga (Rp)</label>
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
          </div>
          <div className="field"><label>URL gambar (opsional)</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="field"><label>Deskripsi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan produk'}
          </button>
          {error && <div className="form-msg err">{error}</div>}
        </form>
      </div>
    </div>
  )
}
