import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import ProductModal from './components/ProductModal'
import AdminLogin from './components/AdminLogin'
import AdminShell from './components/AdminShell'
import { waLink } from './lib/helpers'

const DEFAULT_SETTINGS = {
  store_name: 'Aisyrienne Fashion House',
  tagline: 'Koleksi busana dan rangkaian bunga pilihan untuk momen-momen terbaik kamu — lihat ulasan pelanggan lain, lalu pesan langsung lewat WhatsApp.',
  wa_number: '6281234567890',
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [products, setProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  const [session, setSession] = useState(null)
  const [view, setView] = useState('store') // 'store' | 'admin'
  const [loginOpen, setLoginOpen] = useState(false)

  const [activeCategory, setActiveCategory] = useState('semua')
  const [searchTerm, setSearchTerm] = useState('')
  const [detailProduct, setDetailProduct] = useState(null)

  useEffect(() => {
    fetchAll()
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  async function fetchAll() {
    setLoading(true)
    setLoadError('')
    const [productsRes, reviewsRes, settingsRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: true }),
      supabase.from('reviews').select('*'),
      supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
    ])
    if (productsRes.error || reviewsRes.error) {
      setLoadError('Gagal memuat data. Periksa koneksi internet atau konfigurasi Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).')
    }
    setProducts(productsRes.data || [])
    setReviews(reviewsRes.data || [])
    if (settingsRes.data) setSettings(settingsRes.data)
    setLoading(false)
  }

  async function handleSubmitReview(productId, { name, rating, comment }) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({ product_id: productId, name, rating, comment })
      .select()
      .single()
    if (!error) setReviews((prev) => [...prev, data])
    return { error }
  }

  async function handleSaveProduct(payload) {
    if (payload.id) {
      const { id, ...fields } = payload
      const { data, error } = await supabase.from('products').update(fields).eq('id', id).select().single()
      if (!error) setProducts((prev) => prev.map((p) => (p.id === id ? data : p)))
      return { error }
    }
    const { data, error } = await supabase.from('products').insert(payload).select().single()
    if (!error) setProducts((prev) => [...prev, data])
    return { error }
  }

  async function handleDeleteProduct(product) {
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      setReviews((prev) => prev.filter((r) => r.product_id !== product.id))
    }
  }

  async function handleDeleteReview(review) {
    const { error } = await supabase.from('reviews').delete().eq('id', review.id)
    if (!error) setReviews((prev) => prev.filter((r) => r.id !== review.id))
  }

  async function handleSaveSettings(fields) {
    const { data, error } = await supabase.from('settings').update(fields).eq('id', 1).select().single()
    if (!error) setSettings(data)
    return { error }
  }

  function handleOpenAdminEntry() {
    if (session) setView('admin')
    else setLoginOpen(true)
  }

  function scrollToCatalog() {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) {
    return <div className="page-loading">Memuat toko...</div>
  }

  if (view === 'admin' && session) {
    return (
      <AdminShell
        storeName={settings.store_name}
        products={products}
        reviews={reviews}
        settings={settings}
        onBackToStore={() => setView('store')}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onDeleteReview={handleDeleteReview}
        onSaveSettings={handleSaveSettings}
      />
    )
  }

  return (
    <>
      <Header
        storeName={settings.store_name}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenAdminLogin={handleOpenAdminEntry}
      />
      {loadError && <div className="wrap" style={{ paddingTop: 16 }}><div className="banner-error">{loadError}</div></div>}
      <Hero tagline={settings.tagline} products={products} reviews={reviews} onBrowse={scrollToCatalog} />
      <ProductGrid
        products={products}
        reviews={reviews}
        activeCategory={activeCategory}
        searchTerm={searchTerm}
        onViewDetail={setDetailProduct}
        onOrder={(p) => window.open(waLink(settings.wa_number, p), '_blank')}
      />
      <Footer storeName={settings.store_name} />

      {detailProduct && (
        <ProductModal
          product={detailProduct}
          reviews={reviews.filter((r) => r.product_id === detailProduct.id)}
          waNumber={settings.wa_number}
          onClose={() => setDetailProduct(null)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {loginOpen && (
        <AdminLogin
          onClose={() => setLoginOpen(false)}
          onLoggedIn={() => { setLoginOpen(false); setView('admin') }}
        />
      )}
    </>
  )
}
