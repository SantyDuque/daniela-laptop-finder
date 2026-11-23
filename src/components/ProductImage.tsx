import { useState } from 'react'
import { Laptop as LaptopIcon } from 'lucide-react'
import type { Laptop } from '../data/types'

export function ProductImage({ laptop, eager = false }: { laptop: Laptop; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  return laptop.image && !failed
    ? <img src={laptop.image} alt={`${laptop.brand} ${laptop.model}`} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />
    : <div className="image-fallback"><LaptopIcon size={54} strokeWidth={1.2} /><span>Imagen no disponible</span></div>
}
