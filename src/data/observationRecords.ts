import { retailers } from './retailers.ts'
import type { Laptop, PriceObservation, RetailListing } from './types.ts'

const colombianDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota', dateStyle: 'short' })
const dateOnly = /^\d{4}-\d{2}-\d{2}$/
const utcTimestamp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/

export function observationDay(value: string) {
  return dateOnly.test(value) ? value : colombianDate.format(new Date(value))
}

export function listingKey(listing: RetailListing) {
  return `${listing.retailerId}|${listing.url}`
}

export function observationKey(record: PriceObservation) {
  return `${record.retailerId}|${record.productUrl}|${observationDay(record.observedAt)}`
}

function validTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || (!dateOnly.test(value) && !utcTimestamp.test(value))) return false
  const time = new Date(value)
  return Number.isFinite(time.getTime()) && time.toISOString().slice(0, 10) === value.slice(0, 10)
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function validCop(price: unknown): price is number {
  return typeof price === 'number' && Number.isSafeInteger(price) && price > 0
}

export function validateObservation(value: unknown): PriceObservation {
  if (!isRecord(value) || typeof value.laptopId !== 'string' || !value.laptopId.trim()
    || typeof value.configurationId !== 'string' || !value.configurationId.trim()
    || typeof value.retailerId !== 'string' || !Object.hasOwn(retailers, value.retailerId)
    || typeof value.productUrl !== 'string' || value.currency !== 'COP' || !validTimestamp(value.observedAt)
    || (value.verifiedBy !== 'manual' && value.verifiedBy !== 'structured-data')
    || (value.availability !== undefined && value.availability !== 'available' && value.availability !== 'sold-out')
    || (value.price === null ? value.availability !== 'sold-out' : !validCop(value.price))) {
    throw new Error('El registro tiene datos inválidos o incompletos.')
  }
  const record = value as PriceObservation
  const url = new URL(record.productUrl)
  if (url.protocol !== 'https:' || url.host !== retailers[record.retailerId].host
    || url.username || url.password || url.hash || url.pathname === '/') {
    throw new Error('El enlace no corresponde a una ficha HTTPS de la tienda.')
  }
  return record
}

export function validateHistory(data: unknown, laptops?: Laptop[]) {
  if (!Array.isArray(data)) throw new Error('El historial debe ser una lista JSON.')
  const catalog = laptops && new Map(laptops.map(laptop => [laptop.id, laptop]))
  const seen = new Set<string>()
  return data.map((value, index) => {
    try {
      const record = validateObservation(value)
      const key = observationKey(record)
      if (seen.has(key)) throw new Error('Ya hay un registro de esta tienda, ficha y día.')
      const laptop = catalog?.get(record.laptopId)
      if (catalog && (!laptop || laptop.sku !== record.configurationId
        || !laptop.offers.some(listing => listing.retailerId === record.retailerId && listing.url === record.productUrl))) {
        throw new Error('La configuración o el enlace no coincide con el catálogo.')
      }
      seen.add(key)
      return record
    } catch (error) {
      throw new Error(`Registro ${index + 1}: ${error instanceof Error ? error.message : String(error)}`, { cause: error })
    }
  })
}

export function appendObservations(existing: PriceObservation[], incoming: PriceObservation[]) {
  const seen = new Set(existing.map(observationKey))
  const added = incoming.filter(record => {
    const key = observationKey(record)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return { added, records: [...existing, ...added] }
}
