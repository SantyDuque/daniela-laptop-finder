import { open, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { setTimeout } from 'node:timers/promises'
import { laptops } from '../src/data/laptops.ts'
import { appendObservations, observationDay, observationKey, validateHistory, validateObservation } from '../src/data/observationRecords.ts'
import { retailers, type RetailerId } from '../src/data/retailers.ts'
import type { PriceObservation } from '../src/data/types.ts'
import { crawler, readProductOffer, robotsPolicy } from './retailer-data.ts'

const historyPath = fileURLToPath(new URL('../src/data/price-history.json', import.meta.url))
const repository = 'https://github.com/SantyDuque/daniela-laptop-finder'
const automatic = new Set<RetailerId>(['pronetsys', 'pixelbuy'])
const flags = {
  'dry-run': { type: 'boolean' },
  validate: { type: 'boolean' },
  manual: { type: 'string' },
} as const

async function publicText(url: URL, mime: string) {
  const response = await fetch(url, {
    headers: { 'User-Agent': `${crawler}/1.0 (+${repository})`, Accept: mime },
    signal: AbortSignal.timeout(12_000),
    redirect: 'manual',
  })
  if (!response.ok || !response.headers.get('content-type')?.startsWith(mime)) {
    await response.body?.cancel()
    throw new Error(`HTTP ${response.status} o formato no reconocido.`)
  }
  if (Number(response.headers.get('content-length')) > 8_000_000) {
    await response.body?.cancel()
    throw new Error('La respuesta supera el tamaño de lectura permitido.')
  }
  const body = await response.text()
  if (body.length > 8_000_000) throw new Error('La respuesta supera el tamaño de lectura permitido.')
  return body
}

const loadHistory = async () => validateHistory(JSON.parse(await readFile(historyPath, 'utf8')), laptops)

async function collect(existing: PriceObservation[], dryRun: boolean) {
  const records: PriceObservation[] = []
  const existingKeys = new Set(existing.map(observationKey))
  const robots = new Map<string, string | null>()
  const day = observationDay(new Date().toISOString())
  for (const laptop of laptops) {
    for (const listing of laptop.offers) {
      if (!automatic.has(listing.retailerId) || listing.marketplaceSeller) continue
      if (!dryRun && existingKeys.has(`${listing.retailerId}|${listing.url}|${day}`)) {
        console.log(`Ya registrado hoy: ${laptop.sku} en ${listing.retailerId}`)
        continue
      }
      const url = new URL(listing.url)
      if (url.protocol !== 'https:' || url.host !== retailers[listing.retailerId].host || url.username || url.password) {
        throw new Error(`Dominio inesperado en el catálogo: ${listing.retailerId}.`)
      }
      try {
        if (!robots.has(url.origin)) {
          robots.set(url.origin, null)
          robots.set(url.origin, await publicText(new URL('/robots.txt', url.origin), 'text/plain'))
        }
        const rules = robots.get(url.origin)
        if (!rules) throw new Error('No se pudo confirmar robots.txt.')
        const policy = robotsPolicy(rules, url)
        if (!policy.allowed || policy.delay > 60) throw new Error('La política de rastreo no permite consultar esta ficha en esta ejecución.')
        await setTimeout(policy.delay * 1_000)
        const html = await publicText(url, 'text/html')
        const record = validateObservation(readProductOffer(html, laptop, listing, new Date().toISOString()))
        records.push(record)
        console.log(`Verificado: ${laptop.sku} en ${listing.retailerId} (${record.price ?? 'sin precio'} COP, ${record.availability ?? 'disponibilidad sin verificar'}).`)
      } catch (error) {
        console.warn(`Omitido: ${laptop.sku} en ${listing.retailerId}. ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }
  return records
}

async function save(incoming: PriceObservation[]) {
  const lockPath = historyPath + '.lock'
  const tempPath = historyPath + `.${process.pid}.tmp`
  const lock = await open(lockPath, 'wx')
  try {
    const { records, added } = appendObservations(await loadHistory(), incoming)
    if (!added.length) return 0
    validateHistory(records, laptops)
    await writeFile(tempPath, JSON.stringify(records, null, 2) + '\n', { flag: 'wx' })
    await rename(tempPath, historyPath)
    return added.length
  } finally {
    await lock.close()
    await Promise.all([rm(lockPath, { force: true }), rm(tempPath, { force: true })])
  }
}

async function main() {
  const { values } = parseArgs({ options: flags })
  const existing = await loadHistory()
  if (values.validate) {
    if (values.manual || values['dry-run']) throw new Error('Usa --validate por separado.')
    console.log(`${existing.length} registros válidos.`)
    return
  }
  const incoming = !values.manual
    ? await collect(existing, Boolean(values['dry-run']))
    : validateHistory(JSON.parse(await readFile(values.manual, 'utf8')), laptops)
  if (values.manual && incoming.some(record => record.verifiedBy !== 'manual')) {
    throw new Error('Los registros ingresados manualmente deben indicar verifiedBy: manual.')
  }
  const { added } = appendObservations(existing, incoming)
  const dryRun = values['dry-run']
  const count = dryRun || !added.length ? added.length : await save(incoming)
  console.log(dryRun ? `Simulación: ${count} registros nuevos. No se escribió el historial.`
    : `${count} registros nuevos guardados. ${incoming.length - count} omitidos por duplicados.`)
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
