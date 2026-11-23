import raw from './price-history.json' with { type: 'json' }
import { listingKey, observationDay, validateHistory } from './observationRecords'
import { retailers } from './retailers'
import type { Laptop, PriceObservation, RetailListing } from './types'

const records = validateHistory(raw)
const byLaptop = new Map<string, PriceObservation[]>()
for (const record of records) {
  const existing = byLaptop.get(record.laptopId)
  if (existing) existing.push(record)
  else byLaptop.set(record.laptopId, [record])
}
const staleDays = 14

export const updated = records.map(record => observationDay(record.observedAt)).sort().at(-1)

export function listingName(listing: RetailListing) {
  const name = retailers[listing.retailerId].name
  return listing.marketplaceSeller ? `${name} · ${listing.marketplaceSeller}` : name
}

export function offersFor(laptop: Laptop, now = new Date()) {
  const relevant = (byLaptop.get(laptop.id) ?? []).filter(record => record.configurationId === laptop.sku)
  return laptop.offers.map(listing => {
    const observations = relevant.filter(record => record.retailerId === listing.retailerId && record.productUrl === listing.url)
      .sort((a, b) => b.observedAt.localeCompare(a.observedAt))
    const latest = observations[0]
    const lastPriced = observations.find(record => record.price !== null)
    const checkedAt = latest && observationDay(latest.observedAt)
    const stale = checkedAt && Date.parse(observationDay(now.toISOString())) - Date.parse(checkedAt) >= staleDays * 86_400_000
    return {
      ...listing,
      retailer: listingName(listing),
      listedBy: retailers[listing.retailerId].name,
      checkedAt,
      lastPriceAt: lastPriced && observationDay(lastPriced.observedAt),
      lastPrice: lastPriced?.price ?? undefined,
      price: latest?.price ?? undefined,
      availability: latest?.availability,
      stale: Boolean(stale),
    }
  })
}

export type PricePoint = {
  series: string
  retailer: string
  price: number
  date: string
  source: string
}

export function observationsFor(laptop: Laptop): PricePoint[] {
  const listings = new Map(laptop.offers.map(listing => [listingKey(listing), listing]))
  return (byLaptop.get(laptop.id) ?? []).flatMap((record: PriceObservation) => {
    if (record.price === null || record.availability === 'sold-out' || record.configurationId !== laptop.sku) return []
    const series = listingKey({ retailerId: record.retailerId, url: record.productUrl })
    const listing = listings.get(series)
    return listing ? [{ series, retailer: listingName(listing), price: record.price, date: observationDay(record.observedAt), source: record.productUrl }] : []
  }).sort((a, b) => a.date.localeCompare(b.date))
}
