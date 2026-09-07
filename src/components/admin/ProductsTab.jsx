import { formatRupiah, categoryLabel, productImage, avgRating } from '../../lib/helpers'

export default function ProductsTab({ products, reviews, onAdd, onEdit, onDelete }) {
  return (
    <section>
      <div className="admin-head-row">
        <div>
          <h2>Produk</h2>
          <div className="sub">Tambah, ubah, atau hapus produk yang tampil di toko.</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>+ Tambah produk</button>
      </div>
    <div style={{ overflowX: 'auto'}}>  
      <table className="admin-table">
        <thead>
          <tr><th>Foto</th><th>Nama</th><th>Kategori</th><th>Harga</th><th>Rating</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: 24 }}>
              Belum ada produk. Klik "Tambah produk" untuk mulai.
            </td></tr>
          )}
          {products.map((p) => {
            const rating = avgRating(reviews.filter((r) => r.product_id === p.id))
            return (
              <tr key={p.id}>
                <td><img src={productImage(p)} alt="" /></td>
                <td>{p.name}</td>
                <td>{categoryLabel(p.category)}</td>
                <td>{formatRupiah(p.price)}</td>
                <td>{rating ? `${rating.toFixed(1)} ★` : '—'}</td>
                <td className="row-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => onEdit(p)}>Ubah</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(p)}>Hapus</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>  
    </section>
  )
}
