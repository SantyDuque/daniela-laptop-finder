import type { Laptop } from '../data/types'
import type { CreativeId } from '../data/creative'
import { assessProjects, hasWideGamut } from './projectFit'
import { offersFor } from '../data/priceHistory'

export const FLOOR = 1_000_000
export const CEILING = 6_000_000
export const DEFAULT_MIN = 2_000_000
export const INITIAL_MAX = 4_000_000
export const DEFAULT_MAX = 5_000_000

export const budgetRanges = [
  { min: DEFAULT_MIN, max: 3_000_000, label: 'Para cuidar el gasto' },
  { min: 3_000_000, max: INITIAL_MAX, label: 'Tramo preferido' },
  { min: INITIAL_MAX, max: DEFAULT_MAX, label: 'Para considerar mejoras' },
] as const
export const unknown = 'No verificado'

const currency = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
const numbers = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 })
const dates = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeZone: 'UTC' })

export const cop = (price: number) => currency.format(price)
export const number = (value: number) => numbers.format(value)
export const date = (value: string) => dates.format(new Date(value + 'T00:00:00Z'))
export const storage = (value: number) => value === 1024 ? '1 TB' : `${value} GB`
export const weight = (value?: number) => value === undefined ? unknown : `${number(value)} kg`
export const screen = (laptop: Laptop) => `${number(laptop.size)}″${laptop.panel ? ' ' + laptop.panel : ''}`
export const color = (laptop: Laptop) => laptop.gamut ? `${laptop.gamut.percent} % ${laptop.gamut.space}` : unknown

export const listed = (laptop: Laptop) => offersFor(laptop).filter((offer): offer is typeof offer & { price: number } =>
  offer.availability !== 'sold-out' && offer.price !== undefined
).sort((a, b) => Number(a.stale) - Number(b.stale) || a.price - b.price)
export const best = (laptop: Laptop) => listed(laptop)[0]

export const portable = (laptop: Laptop) => laptop.weight !== undefined && laptop.weight <= 1.55
export const creative = (laptop: Laptop) => laptop.ram >= 16 && Boolean(laptop.graphics)
export const designScreen = hasWideGamut
export const threeD = (laptop: Laptop) => laptop.graphics === 'Dedicada' && laptop.ram >= 8

function fit(laptop: Laptop) {
  const portability = laptop.weight === undefined ? 0 : Math.max(0, 32 - (laptop.weight - 1.2) * 33)
  return portability + Math.min(laptop.ram, 32) * 1.25 + (designScreen(laptop) ? 24 : laptop.panel === 'IPS' ? 7 : 0)
    + (laptop.storage >= 1024 ? 12 : laptop.storage >= 512 ? 4 : 0)
    + (creative(laptop) ? 5 : 0) + Math.min(laptop.cpuCores ?? 0, 8)
}

export const isVivobook = (laptop: Laptop) => laptop.brand === 'ASUS' && /^Vivobook\b/i.test(laptop.model)

export function recommended(laptop: Laptop) {
  const offer = best(laptop)
  const price = offer?.stale ? undefined : offer?.price
  const budget = price === undefined || price > DEFAULT_MAX ? 0
    : 22 - Math.max(0, price - DEFAULT_MIN) / 150_000 - (price > INITIAL_MAX ? 5 : 0)
  // Three points can break a close tie without overriding a materially stronger fit.
  const needsWindows = laptop.os?.includes('FreeDOS') || laptop.os?.includes('Sin Windows')
  return fit(laptop) + budget + (isVivobook(laptop) ? 3 : 0) - (needsWindows ? 5 : 0)
}

export function personalizedScore(laptop: Laptop, priorities: readonly CreativeId[]) {
  if (!priorities.length) return recommended(laptop)
  const fits = assessProjects(laptop)
  const projectScore = priorities.reduce((sum, id) => sum + fits[id].points, 0) / priorities.length
  return recommended(laptop) * 0.4 + projectScore * 0.75
}

export function value(laptop: Laptop) {
  const offer = best(laptop)
  const price = offer?.stale ? undefined : offer?.price
  return price === undefined ? -1 : fit(laptop) / price * 1_000_000
}

export function badge(laptop: Laptop, catalog: Laptop[]) {
  const lightest = Math.min(...catalog.flatMap(item => item.weight ?? []))
  if (designScreen(laptop)) return 'Buena pantalla para diseño'
  if (laptop.weight === lightest) return 'Más liviano'
  if (threeD(laptop)) return 'Para explorar 3D'
  if (value(laptop) >= 0 && value(laptop) === Math.max(...catalog.map(value))) return 'Mejor relación calidad-precio'
  if (creative(laptop)) return 'Para uso creativo'
}

export const sorters = {
  recommended,
  low: (laptop: Laptop) => -(best(laptop)?.price ?? Infinity),
  high: (laptop: Laptop) => best(laptop)?.price ?? -Infinity,
  light: (laptop: Laptop) => -(laptop.weight ?? Infinity),
  value,
}

export const defaultFilters = {
  min: DEFAULT_MIN, max: DEFAULT_MAX, brand: '', cpu: '', ram: '', ssd: '', screen: '', panel: '',
  weight: '', gpu: '', os: '', portable: false, design: false, creative: false, threeD: false,
  search: '', sort: 'recommended' as keyof typeof sorters, unpriced: false,
}
export type Filters = typeof defaultFilters

export function filterCatalog(catalog: Laptop[], f: Filters, priorities: readonly CreativeId[] = []) {
  const search = f.search.trim().toLocaleLowerCase('es-CO')
  return catalog.filter(laptop => {
    const price = best(laptop)?.price
    return (price === undefined ? f.unpriced : price >= f.min && price <= f.max)
      && (!search || `${laptop.brand} ${laptop.model} ${laptop.sku}`.toLocaleLowerCase('es-CO').includes(search))
      && (!f.brand || laptop.brand === f.brand)
      && (!f.cpu || laptop.cpuBrand === f.cpu)
      && (!f.ram || laptop.ram >= Number(f.ram))
      && (!f.ssd || laptop.storage >= Number(f.ssd))
      && (!f.screen || (f.screen === 'small' ? laptop.size <= 14 : laptop.size > 14))
      && (!f.panel || laptop.panel === f.panel)
      && (!f.weight || (laptop.weight !== undefined && laptop.weight <= Number(f.weight)))
      && (!f.gpu || laptop.graphics === f.gpu)
      && (!f.os || laptop.os === f.os)
      && (!f.portable || portable(laptop))
      && (!f.design || designScreen(laptop))
      && (!f.creative || creative(laptop))
      && (!f.threeD || threeD(laptop))
  }).sort((a, b) => f.sort === 'recommended'
    ? personalizedScore(b, priorities) - personalizedScore(a, priorities)
    : sorters[f.sort](b) - sorters[f.sort](a))
}

export function readStorage(key: string): unknown {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') } catch { return null }
}

export function saveStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* Settings remain available for this session. */ }
}
