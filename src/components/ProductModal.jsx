import { useState } from 'react'
import StarRating from './StarRating'
import { formatRupiah, categoryLabel, productImage, avgRating, waLink } from '../lib/helpers'

export default function ProductModal({ product, reviews, waNumber, onClose, onSubmitReview }) {
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [selected, setSelected] = useState(0)
  const [msg, setMsg] = useState({ text: '', ok: false })
  const [sending, setSending] = useState(false)

  if (!product) return null
  const rating = avgRating(reviews)
  const sorted = reviews.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !comment.trim() || selected === 0) {
      setMsg({ text: 'Lengkapi nama, rating bintang, dan komentar terlebih dahulu.', ok: false })
      return
    }
    setSending(true)
    const { error } = await onSubmitReview(product.id, {
      name: name.trim(),
      rating: selected,
      comment: comment.trim(),
    })
    setSending(false)
    if (error) {
      setMsg({ text: 'Gagal mengirim ulasan, coba lagi sebentar lagi.', ok: false })
      return
    }
    setName('')
    setComment('')
    setSelected(0)
    setMsg({ text: 'Terima kasih, ulasan kamu sudah ditambahkan.', ok: true })
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 920 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="pd-grid">
          <div className="pd-image"><img src={productImage(product)} alt={product.name} /></div>
          <div className="pd-info">
            <span className={`pill ${product.category}`}>{categoryLabel(product.category)}</span>
            <h2>{product.name}</h2>
            <div className="price">{formatRupiah(product.price)}</div>
            <div className="rating-row">
              <StarRating rating={rating} />
              <span>{rating ? `${rating.toFixed(1)} (${reviews.length} ulasan)` : 'Belum ada rating'}</span>
            </div>
            <p className="pd-desc">{product.description}</p>
            <a className="btn btn-primary btn-block" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
               href={waLink(waNumber, product)} target="_blank" rel="noreferrer">
              Pesan via WhatsApp
            </a>
          </div>
        </div>

        <div className="reviews-block">
          <h3>Ulasan pembeli</h3>
          {sorted.length === 0 && <p className="no-reviews">Belum ada ulasan untuk produk ini — jadilah yang pertama membagikan pengalaman kamu.</p>}
          {sorted.map((r) => (
            <div className="review" key={r.id}>
              <div className="review-head">
                <b>{r.name}</b>
                <span className="review-date">{new Date(r.created_at).toISOString().slice(0, 10)}</span>
              </div>
              <StarRating rating={r.rating} size="0.85rem" />
              <p>{r.comment}</p>
            </div>
          ))}

          <form className="review-form" onSubmit={handleSubmit}>
            <h4>Tulis ulasan kamu</h4>
            <div className="field">
              <label>Nama</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" />
            </div>
            <div className="field">
              <label>Rating</label>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button type="button" key={v} className={v <= selected ? 'on' : ''} onClick={() => setSelected(v)}>★</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Komentar</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ceritakan pengalaman kamu dengan produk ini" />
            </div>
            <button className="btn btn-outline" type="submit" disabled={sending}>
              {sending ? 'Mengirim...' : 'Kirim ulasan'}
            </button>
            {msg.text && <div className={`form-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
          </form>
        </div>
      </div>
    </div>
  )
}
