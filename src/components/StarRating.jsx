import { starsString } from '../lib/helpers'

export default function StarRating({ rating, size }) {
  return (
    <span className="stars" style={size ? { fontSize: size } : undefined}>
      {starsString(rating)}
    </span>
  )
}
