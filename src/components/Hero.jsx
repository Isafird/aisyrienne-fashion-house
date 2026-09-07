import { productImage } from '../lib/helpers'

export default function Hero({ tagline, products, reviews, onBrowse }) {
  const avg = reviews.length ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length : 0
  const buket = products.find((p) => p.category === 'buket')
  const fashion = products.find((p) => p.category === 'fashion')

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Butik busana &amp; rangkaian bunga</span>
          <h1>Kenakan gaya terbaikmu, lengkap dengan sentuhan bunga pilihan.</h1>
          <p className="lead">{tagline}</p>
          <div className="hero-stats">
            <div className="stat"><b>{products.length}</b><span>Koleksi tersedia</span></div>
            <div className="stat"><b>{reviews.length}</b><span>Ulasan pelanggan</span></div>
            <div className="stat"><b>{avg ? avg.toFixed(1) : '—'}</b><span>Rating rata-rata</span></div>
          </div>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={onBrowse}>Jelajahi koleksi</button>
          </div>
        </div>
        <div className="hero-collage" aria-hidden="true">
          <div className="blob" />
          <div className="card-a"><img src={buket ? productImage(buket) : ''} alt="" /></div>
          <div className="card-b"><img src={fashion ? productImage(fashion) : ''} alt="" /></div>
        </div>
      </div>
    </section>
  )
}
