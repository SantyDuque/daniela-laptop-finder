import type { Laptop } from '../data/types'
import { priceAdvice, practicalFacts } from '../lib/advice'

export function BuyerGuide({ laptop }: { laptop: Laptop }) {
  const facts = practicalFacts(laptop)
  const entries = [
    ['Diseño y uso diario', facts.work], ['Para llevar', facts.carrying],
    ['Varias aplicaciones', facts.memory], ['Pantalla y color', facts.display],
    ['Espacio para tus archivos', facts.space], ['Por este precio', priceAdvice(laptop)],
    ['Para quién', facts.buyer],
  ]
  return <dl className="buyer-guide">{entries.map(([label, text]) =>
    <div key={label}><dt>{label}</dt><dd>{text}</dd></div>
  )}</dl>
}
