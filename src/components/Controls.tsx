import { Check, Plus } from 'lucide-react'
import type { Laptop } from '../data/types'

export type Comparison = {
  ids: string[]
  toggle: (id: string) => void
  clear: () => void
}

export function CompareButton({ laptop, comparison }: { laptop: Laptop; comparison: Comparison }) {
  const selected = comparison.ids.includes(laptop.id)
  return <button type="button" aria-pressed={selected} className={`button compare-toggle ${selected ? 'is-selected' : ''}`}
    onClick={() => comparison.toggle(laptop.id)} aria-label={`${selected ? 'Quitar de la comparación' : 'Agregar a la comparación'}: ${laptop.brand} ${laptop.model}`}>
    {selected ? <Check size={17} /> : <Plus size={17} />}{selected ? 'Agregado' : 'Comparar'}
  </button>
}
