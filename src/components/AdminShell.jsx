import { useState } from 'react'
import ProductsTab from './admin/ProductsTab'
import ReviewsTab from './admin/ReviewsTab'
import SettingsTab from './admin/SettingsTab'
import ProductFormModal from './admin/ProductFormModal'
import { supabase } from '../supabaseClient'

export default function AdminShell({
  storeName, products, reviews, settings,
  onBackToStore, onSaveProduct, onDeleteProduct, onDeleteReview, onSaveSettings,
}) {
  const [tab, setTab] = useState('produk')
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  async function handleLogout() {
    await supabase.auth.signOut()
    onBackToStore()
  }

  function openAdd() { setEditingProduct(null); setFormOpen(true) }
  function openEdit(p) { setEditingProduct(p); setFormOpen(true) }

  async function handleSaveProduct(data) {
    const result = await onSaveProduct(data)
    if (!result.error) setFormOpen(false)
    return result
  }

  function handleDeleteProduct(p) {
    if (confirm('Hapus produk ini? Ulasan terkait juga akan dihapus.')) onDeleteProduct(p)
  }
  function handleDeleteReview(r) {
    if (confirm('Hapus ulasan ini?')) onDeleteReview(r)
  }

  const parts = storeName.split('&')

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <span className="logo">{parts[0]}{parts.length > 1 && <span>&amp;{parts[1]}</span>}</span>
        <button className={`admin-nav-btn ${tab === 'produk' ? 'active' : ''}`} onClick={() => setTab('produk')}>Produk</button>
        <button className={`admin-nav-btn ${tab === 'ulasan' ? 'active' : ''}`} onClick={() => setTab('ulasan')}>Ulasan</button>
        <button className={`admin-nav-btn ${tab === 'pengaturan' ? 'active' : ''}`} onClick={() => setTab('pengaturan')}>Pengaturan toko</button>
        <hr />
        <button className="admin-nav-btn" onClick={onBackToStore}>← Lihat toko</button>
        <button className="admin-nav-btn" onClick={handleLogout}>Keluar</button>
      </aside>

      <main className="admin-main">
        {tab === 'produk' && (
          <ProductsTab products={products} reviews={reviews} onAdd={openAdd} onEdit={openEdit} onDelete={handleDeleteProduct} />
        )}
        {tab === 'ulasan' && (
          <ReviewsTab reviews={reviews} products={products} onDelete={handleDeleteReview} />
        )}
        {tab === 'pengaturan' && (
          <SettingsTab settings={settings} onSave={onSaveSettings} />
        )}
      </main>

      {formOpen && (
        <ProductFormModal product={editingProduct} onClose={() => setFormOpen(false)} onSave={handleSaveProduct} />
      )}
    </div>
  )
}
