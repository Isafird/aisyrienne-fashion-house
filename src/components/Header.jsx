const CATS = [
  { value: 'semua', label: 'Semua' },
  { value: 'buket', label: 'Buket Bunga' },
  { value: 'fashion', label: 'Fashion' },
]

export default function Header({ storeName, activeCategory, onCategoryChange, searchTerm, onSearchChange, onOpenAdminLogin }) {
  const parts = storeName.split('&')
  return (
    <header className="site">
      <div className="wrap nav-row">
        <div className="logo">
          {parts[0]}{parts.length > 1 && <span>&amp;{parts[1]}</span>}
        </div>
        <nav className="tabs">
          {CATS.map((c) => (
            <button
              key={c.value}
              className={`tab-btn ${activeCategory === c.value ? 'active' : ''}`}
              onClick={() => onCategoryChange(c.value)}
            >
              {c.label}
            </button>
          ))}
          <button className="tab-btn tab-btn-admin" onClick={onOpenAdminLogin}>
            Login Admin
          </button>
        </nav>
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari koleksi..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  )
}