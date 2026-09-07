import ProductCard from './ProductCard'
import { categoryLabel } from '../lib/helpers'

export default function ProductGrid({ products, reviews, activeCategory, searchTerm, onViewDetail, onOrder }) {
  const list = products.filter((p) => {
    const matchCat = activeCategory === 'semua' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCat && matchSearch
  })

  const title = activeCategory === 'semua' ? 'Koleksi kami' : categoryLabel(activeCategory)

  return (
    <section className="catalog wrap" id="catalog">
      <div className="catalog-head">
        <h2>{title}</h2>
        <span className="catalog-count">{list.length} item</span>
      </div>
      <div className="grid">
        {list.length === 0 && (
          <div className="empty-state">
            <div className="serif">Tidak ada hasil yang cocok</div>
            <div>Coba kata kunci lain atau pilih kategori yang berbeda.</div>
          </div>
        )}
        {list.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            reviews={reviews.filter((r) => r.product_id === p.id)}
            onViewDetail={onViewDetail}
            onOrder={onOrder}
          />
        ))}
      </div>
    </section>
  )
}
