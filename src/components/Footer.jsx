export default function Footer({ storeName }) {
  const parts = storeName.split('&')
  return (
    <footer className="site">
      <div className="wrap">
        <div className="logo">
          {parts[0]}{parts.length > 1 && <span>&amp;{parts[1]}</span>}
        </div>
        <small>Setiap pemesanan dilayani secara personal melalui WhatsApp.</small>
      </div>
    </footer>
  )
}
