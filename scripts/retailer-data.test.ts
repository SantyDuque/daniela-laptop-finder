import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { laptops } from '../src/data/laptops.ts'
import { appendObservations, observationDay, validateHistory, validateObservation } from '../src/data/observationRecords.ts'
import { readProductOffer, robotsPolicy } from './retailer-data.ts'

const laptop = laptops.find(item => item.id === 'asus-vivobook-16-m1607ka')!
const listing = laptop.offers.find(item => item.retailerId === 'pronetsys')!
const now = '2026-11-24T03:00:00.000Z'
const sample = {
  '@type': 'Offer', url: listing.url, price: '2500000', priceCurrency: 'COP',
  availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/NewCondition',
}

function page(offer: unknown = sample, mpn = laptop.sku) {
  return '<script type="application/ld+json">' + JSON.stringify({
    '@graph': [
      { '@type': 'Product', mpn: 'OTRO-MODELO', offers: { ...sample, price: 1 } },
      { '@type': 'Product', mpn, sku: 'un-id-interno', offers: offer },
    ],
  }) + '</script>'
}

test('accepts one COP offer for the exact manufacturer SKU and URL', () => {
  const record = readProductOffer(page(), laptop, listing, now)
  assert.equal(record.price, 2_500_000)
  assert.equal(record.availability, 'available')
  assert.equal(record.configurationId, laptop.sku)
  assert.equal(observationDay(record.observedAt), '2026-11-23')
  assert.equal(validateObservation(record), record)
})

test('skips ambiguous, wrong-SKU, wrong-currency and expired prices', () => {
  for (const html of [
    page([sample, { ...sample, price: 1 }]), page(sample, 'M1607KA-MB068W'),
    page({ ...sample, priceCurrency: 'USD' }), page({ ...sample, url: listing.url + '/otra' }),
    page({ ...sample, price: '2500.25' }), page({ ...sample, price: '0' }),
    page({ ...sample, priceValidUntil: '2026-11-22' }),
  ]) assert.throws(() => readProductOffer(html, laptop, listing, now))
})

test('preserves confirmed stock changes without recording a zero price', () => {
  const record = readProductOffer(page({ ...sample, price: '0', availability: 'https://schema.org/OutOfStock' }), laptop, listing, now)
  assert.equal(record.availability, 'sold-out')
  assert.equal(record.price, null)
  assert.equal(validateObservation(record), record)
})

test('uses the Colombian day for deduplication and preserves earlier timestamps', () => {
  const current = readProductOffer(page(), laptop, listing, now)
  const duplicate = { ...current, observedAt: '2026-11-24T04:59:59.000Z', price: 2_000_000 }
  const next = { ...current, observedAt: '2026-11-24T05:00:00.000Z' }
  const { added, records } = appendObservations([current], [duplicate, next, next])
  assert.deepEqual(added, [next])
  assert.deepEqual(records, [current, next])
  assert.throws(() => validateHistory([current, duplicate], laptops))
  assert.throws(() => validateHistory([{ ...current, configurationId: 'otra' }], laptops))
  assert.throws(() => validateHistory([{ ...current, observedAt: '2026-02-30' }], laptops))
})

test('honors the named crawler, most specific route, anchors and crawl-delay', () => {
  const rules = 'User-agent: *\nDisallow: /\nUser-agent: DanielaLaptopFinder\nDisallow: /producto/*\nAllow: /producto/asus-vivobook-16$\nCrawl-delay: 3'
  assert.deepEqual(robotsPolicy(rules, new URL(listing.url)), { allowed: true, delay: 3 })
  assert.equal(robotsPolicy(rules, new URL(listing.url + '?promo=1')).allowed, false)
  assert.throws(() => robotsPolicy('<html>Captcha</html>', new URL(listing.url)))
  assert.equal(robotsPolicy('User-agent: *\nDisallow: /\nUser-agent: Googlebot\nAllow: /', new URL(listing.url)).allowed, false)
})

test('all recorded prices are listed for their exact configuration', async () => {
  const json = await readFile(new URL('../src/data/price-history.json', import.meta.url), 'utf8')
  const observations = validateHistory(JSON.parse(json), laptops)
  assert.ok(observations.some(record => record.retailerId === 'pronetsys'))
  assert.ok(observations.some(record => record.retailerId === 'pixelbuy'))
})
