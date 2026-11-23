import { isRecord, observationDay, validCop } from '../src/data/observationRecords.ts'
import type { Availability, Laptop, PriceObservation, RetailListing } from '../src/data/types.ts'

export const crawler = 'DanielaLaptopFinder'
const productAgent = crawler.toLowerCase()

type Rule = { allow: boolean; pattern: string }
type Group = { agents: string[]; rules: Rule[]; delay: number }

export function robotsPolicy(body: string, url: URL) {
  const groups: Group[] = []
  let group: Group | undefined
  let hasDirectives = false
  for (const line of body.split(/\r?\n/u)) {
    const match = line.replace(/#.*/u, '').match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/u)
    if (!match) continue
    const [, directive, value] = match
    const field = directive.toLowerCase()
    if (field === 'user-agent' && value) {
      if (!group || hasDirectives) {
        group = { agents: [], rules: [], delay: 0 }
        groups.push(group)
        hasDirectives = false
      }
      group.agents.push(value.toLowerCase())
    } else if (group && (field === 'allow' || field === 'disallow' || field === 'crawl-delay')) {
      hasDirectives = true
      if (field === 'crawl-delay' && Number.isFinite(Number(value))) group.delay = Math.max(0, Number(value))
      if (field !== 'crawl-delay' && value) group.rules.push({ pattern: value, allow: field === 'allow' })
    }
  }
  if (!groups.length) throw new Error('El archivo robots.txt no contiene reglas interpretables.')

  const specific = groups.filter(item => item.agents.includes(productAgent))
  const matched = specific.length ? specific : groups.filter(item => item.agents.includes('*'))
  const path = url.pathname + url.search
  const applicable = matched.flatMap(item => item.rules).filter(({ pattern }) => {
    const anchored = pattern.endsWith('$')
    const raw = anchored ? pattern.slice(0, -1) : pattern
    const escaped = raw.split('*').map(part => part.replace(/[\\^$.+?()[\]{}|]/gu, '\\$&')).join('.*')
    return new RegExp('^' + escaped + (anchored ? '$' : ''), 'u').test(path)
  }).sort((a, b) => b.pattern.replace(/[*$]/g, '').length - a.pattern.replace(/[*$]/g, '').length || Number(b.allow) - Number(a.allow))

  return { allowed: applicable[0]?.allow ?? true, delay: Math.max(2, ...matched.map(item => item.delay)) }
}

function hasType(node: Record<string, unknown>, type: string) {
  const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]
  return types.some(value => value === type || value === 'https://schema.org/' + type)
}

function productNodes(node: unknown): Record<string, unknown>[] {
  if (Array.isArray(node)) return node.flatMap(productNodes)
  if (!isRecord(node)) return []
  return [...(hasType(node, 'Product') ? [node] : []), ...productNodes(node['@graph'])]
}

function normalizedSku(value: unknown) {
  return typeof value === 'string' ? value.trim().toUpperCase() : undefined
}

function schemaValue(value: unknown, expected: string) {
  return value === `https://schema.org/${expected}` || value === `http://schema.org/${expected}`
}

export function readProductOffer(html: string, laptop: Laptop, listing: RetailListing, observedAt: string): PriceObservation {
  const products = [...html.matchAll(/<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/giu)]
    .flatMap(([, json]) => {
      try { return productNodes(JSON.parse(json)) } catch { return [] }
    }).filter(product => normalizedSku(product.mpn ?? product.sku) === normalizedSku(laptop.sku))

  const offers = products.flatMap(product => Array.isArray(product.offers) ? product.offers : [product.offers])
    .filter((offer): offer is Record<string, unknown> => isRecord(offer) && hasType(offer, 'Offer') && offer.url === listing.url)
  if (offers.length !== 1) throw new Error('La ficha no publica una oferta inequívoca para la referencia y el enlace exactos.')
  const [offer] = offers
  if (offer.priceCurrency !== 'COP' || (offer.itemCondition !== undefined && !schemaValue(offer.itemCondition, 'NewCondition'))) {
    throw new Error('La oferta no confirma moneda COP o corresponde a otra condición del producto.')
  }
  if (offer.priceValidUntil !== undefined) {
    const expires = offer.priceValidUntil
    if (typeof expires !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(expires)
      || expires < observationDay(observedAt)) throw new Error('El precio publicado venció o tiene una vigencia ambigua.')
  }

  let availability: Availability | undefined
  if (schemaValue(offer.availability, 'InStock')) availability = 'available'
  else if (schemaValue(offer.availability, 'OutOfStock')) availability = 'sold-out'
  else if (offer.availability !== undefined) throw new Error('No se pudo interpretar el estado de disponibilidad.')

  const rawPrice = offer.price
  const parsed = typeof rawPrice === 'string' && /^\d+(?:\.0+)?$/.test(rawPrice) ? Number(rawPrice) : rawPrice
  if (!validCop(parsed) && !(availability === 'sold-out' && (parsed === 0 || parsed == null))) {
    throw new Error('El precio publicado no es un valor entero válido en COP.')
  }

  return {
    laptopId: laptop.id, configurationId: laptop.sku, retailerId: listing.retailerId,
    productUrl: listing.url, price: validCop(parsed) ? parsed : null, observedAt,
    currency: 'COP', availability, verifiedBy: 'structured-data',
  }
}
