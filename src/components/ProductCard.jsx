import StarRating from './StarRating'
import { formatRupiah, categoryLabel, productImage, avgRating } from '../lib/helpers'

export default function ProductCard({ product, reviews, onViewDetail, onOrder }) {
  const rating = avgRating(reviews)
  return (
    <article className="card">
      <div className="thumb">
        <img src={productImage(product)} alt={product.name} />
      </div>
      <div className="card-body">
        <span className={`pill ${product.category}`}>{categoryLabel(product.category)}</span>
        <h3>{product.name}</h3>
        <div className="price">{formatRupiah(product.price)}</div>
        <div className="rating-row">
          <StarRating rating={rating} />
          <span>{rating ? rating.toFixed(1) : '—'} ({reviews.length} ulasan)</span>
        </div>
        <div className="card-actions">
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => onViewDetail(product)}>
            Detail
          </button>
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => onOrder(product)}>
            Pesan
          </button>
        </div>
      </div>
    </article>
  )
}
