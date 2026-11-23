import type { Laptop, PriceObservation } from './types'

// Add observations here before replacing an offer snapshot. Each row needs
// an exact configuration, an unconditional COP price, and its dated source.
export const archivedObservations: Record<string, PriceObservation[]> = {}

export function observationsFor(laptop: Laptop): PriceObservation[] {
  const observations = new Map<string, PriceObservation>()
  for (const item of archivedObservations[laptop.id] ?? []) {
    observations.set(`${item.retailer}/${item.date}`, item)
  }
  for (const offer of laptop.offers) {
    if (offer.price === undefined || offer.availability === 'sold-out') continue
    const item = { retailer: offer.retailer, date: offer.checkedAt, price: offer.price, source: offer.url }
    observations.set(`${item.retailer}/${item.date}`, item)
  }
  return [...observations.values()].sort((a, b) => a.date.localeCompare(b.date))
}
