export function formatRupiah(n) {
  return 'Rp' + Number(n || 0).toLocaleString('id-ID')
}

export function categoryLabel(cat) {
  return cat === 'buket' ? 'Buket Bunga' : 'Fashion'
}

export function avgRating(reviews) {
  if (!reviews || !reviews.length) return 0
  return reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length
}

export function waLink(waNumber, product) {
  const msg = `Halo, saya tertarik dengan produk *${product.name}* (${formatRupiah(product.price)}). Apakah masih tersedia?`
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
}

// Ilustrasi placeholder ringan (SVG) dipakai saat produk belum punya image_url,
// supaya toko tetap enak dilihat tanpa bergantung pada gambar eksternal.
export function placeholderImage(category) {
  const palettes = {
    buket: ['#F3DEE1', '#C4707C', '#5B2740'],
    fashion: ['#E4E8D9', '#748162', '#3A1029'],
  }
  const [bg, mid, dark] = palettes[category] || palettes.buket
  let art = ''
  if (category === 'buket') {
    art = `
      <line x1="150" y1="260" x2="150" y2="150" stroke="${dark}" stroke-width="5"/>
      <circle cx="120" cy="150" r="34" fill="${mid}"/>
      <circle cx="150" cy="120" r="34" fill="${dark}"/>
      <circle cx="182" cy="150" r="34" fill="${mid}"/>
      <circle cx="150" cy="150" r="20" fill="${bg}"/>`
  } else {
    art = `
      <path d="M120 90 L110 130 L95 260 L205 260 L190 130 L180 90 Z" fill="${mid}"/>
      <path d="M120 90 Q150 70 180 90 L172 110 Q150 95 128 110 Z" fill="${dark}"/>`
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 300 350"><rect width="300" height="350" fill="${bg}"/>${art}</svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

export function productImage(p) {
  return p.image_url && p.image_url.trim() ? p.image_url : placeholderImage(p.category)
}

export function starsString(rating) {
  const rounded = Math.round(rating)
  let out = ''
  for (let i = 1; i <= 5; i++) out += i <= rounded ? '★' : '☆'
  return out
}
