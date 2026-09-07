export default function ReviewsTab({ reviews, products, onDelete }) {
  const sorted = reviews.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  return (
    <section>
      <h2>Ulasan</h2>
      <div className="sub">Moderasi ulasan yang masuk dari pengunjung toko.</div>
      <table className="admin-table">
        <thead>
          <tr><th>Produk</th><th>Nama</th><th>Rating</th><th>Komentar</th><th>Tanggal</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: 24 }}>
              Belum ada ulasan masuk.
            </td></tr>
          )}
          {sorted.map((r) => {
            const p = products.find((x) => x.id === r.product_id)
            return (
              <tr key={r.id}>
                <td>{p ? p.name : '(produk dihapus)'}</td>
                <td>{r.name}</td>
                <td>{r.rating} ★</td>
                <td style={{ maxWidth: 260 }}>{r.comment}</td>
                <td>{new Date(r.created_at).toISOString().slice(0, 10)}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => onDelete(r)}>Hapus</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
