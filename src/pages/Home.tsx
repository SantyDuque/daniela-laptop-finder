import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, CalendarDays, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CompareButton, type Comparison } from '../components/Controls'
import { CreativeWorkSelector, PersonalizedHero, PortfolioInspiration, type CreativePreferences } from '../components/CreativeWork'
import { CatalogFilters } from '../components/Filters'
import { ProductImage } from '../components/ProductImage'
import { Dropdown, type DropdownOption } from '../components/Dropdown'
import { laptops } from '../data/laptops'
import { updated } from '../data/priceHistory'
import type { Laptop } from '../data/types'
import type { CreativeId } from '../data/creative'
import { assessProjects, cardProjectSummary } from '../lib/projectFit'
import { stretchReason } from '../lib/advice'
import { badge, best, budgetRanges, CEILING, cop, date, DEFAULT_MIN, defaultFilters, filterCatalog, FLOOR, INITIAL_MAX, listed, storage, readStorage, saveStorage, type Filters } from '../lib/catalog'

const preferenceKey = 'daniela-catalog-v2'
const sortOptions: DropdownOption<Filters['sort']>[] = [
  ['recommended', 'Recomendados para Daniela'], ['low', 'Menor precio'], ['high', 'Mayor precio'],
  ['light', 'Más livianos'], ['value', 'Mejor relación calidad-precio'],
]
function loadFilters(): Filters {
  const current = readStorage(preferenceKey)
  const saved = current ?? readStorage('daniela-catalog-v1')
  if (!saved || typeof saved !== 'object') return defaultFilters
  const record = saved as Record<string, unknown>
  const filters = { ...defaultFilters, ...Object.fromEntries(Object.entries(defaultFilters).map(([key, value]) => [key, typeof record[key] === typeof value ? record[key] : value])) }
  if (current === null && filters.min === DEFAULT_MIN && filters.max === INITIAL_MAX) filters.max = defaultFilters.max
  filters.sort = ['low', 'high', 'light', 'value'].includes(String(record.sort)) ? record.sort as Filters['sort'] : 'recommended'
  return filters
}

function CardText({ className, label, children }: { className: string; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const section = ref.current
    if (!section) return
    const update = () => {
      const scrollable = section.scrollHeight > section.clientHeight + 1
      section.tabIndex = scrollable ? 0 : -1
      section.toggleAttribute('data-overflowing', scrollable)
    }
    const observer = new ResizeObserver(update)
    observer.observe(section)
    if (section.firstElementChild) observer.observe(section.firstElementChild)
    update()
    return () => observer.disconnect()
  }, [])

  return <div ref={ref} className={`card-text ${className}`} role="group" aria-label={label}><div>{children}</div></div>
}

function Card({ laptop, comparison, eager, priorities }: { laptop: Laptop; comparison: Comparison; eager: boolean; priorities: CreativeId[] }) {
  const offer = best(laptop)
  const count = listed(laptop).length
  const label = badge(laptop, laptops)
  const route = `/laptops/${laptop.id}`
  const stretch = offer && !offer.stale && offer.price > INITIAL_MAX ? stretchReason(laptop, offer.price) : undefined
  return <article className="product-card">
    <Link to={route} className="product-art" tabIndex={-1} aria-hidden="true">
      {label && <span className="product-badge">{label}</span>}
      <ProductImage laptop={laptop} eager={eager} />
    </Link>
    <div className="product-content">
      <p className="product-brand">{laptop.brand}</p>
      <h3><Link to={route}>{laptop.model}</Link></h3>
      <CardText className="sku card-sku" label="Referencia"><p>{laptop.sku}</p></CardText>
      <p className="card-capacity">{laptop.ram} GB de RAM · SSD de {storage(laptop.storage)}</p>
      <div className="price-line">
        <strong>{offer ? cop(offer.price) : 'Precio sin verificar'}</strong>
        <span>{offer?.stale && offer.checkedAt ? `Precio anterior · ${date(offer.checkedAt)}`
          : count === 1 ? '1 precio revisado' : `${count} precios revisados`}</span>
      </div>
      <div className="card-budget">
        {offer && stretch && <CardText className="stretch-note" label="Aviso de presupuesto">
          <p><strong>Supera tu presupuesto inicial{offer.price <= defaultFilters.max ? ', pero podría valer la pena' : ' y el tope de $5 millones'}.</strong> {stretch}</p>
        </CardText>}
      </div>
      <div className="card-project-note">
        <h4>Pensando en tus proyectos</h4>
        <CardText className="card-project-copy" label="Recomendación según tus proyectos">
          {cardProjectSummary(laptop, priorities).map(note => <p key={note}>{note}</p>)}
        </CardText>
      </div>
      <CardText className="card-caveat" label="Consideraciones del equipo"><p><strong>Ten en cuenta</strong> · {laptop.cons[0].replace(/\.$/, '')}.</p></CardText>
      <div className="card-actions">
        <Link className="button details-link" to={route}>Ver detalles <ArrowRight size={16} /></Link>
        <CompareButton {...{ laptop, comparison }} />
      </div>
    </div>
  </article>
}

export default function Home({ comparison, preferences }: { comparison: Comparison; preferences: CreativePreferences }) {
  const { priorities } = preferences
  const [filters, setFilters] = useState(loadFilters)
  const filtered = filterCatalog(laptops, filters, priorities)
  const vivobookPreset = filters.brand === 'ASUS' && filters.search === 'Vivobook'
    && filters.min === FLOOR && filters.max === CEILING
  useEffect(() => { saveStorage(preferenceKey, filters) }, [filters])
  const featured = filterCatalog(laptops, { ...defaultFilters, ram: '32', ssd: '1024', weight: '1.8' }, priorities)
    .filter(laptop => !best(laptop)?.stale && Object.values(assessProjects(laptop)).some(fit => fit.level === 'strong')).slice(0, 3)
  const quickFilters = [
    { label: '32 GB de memoria', active: filters.ram === '32', next: { ram: filters.ram === '32' ? '' : '32' } },
    { label: '1 TB de almacenamiento', active: filters.ssd === '1024', next: { ssd: filters.ssd === '1024' ? '' : '1024' } },
    { label: '32 GB + 1 TB', active: filters.ram === '32' && filters.ssd === '1024',
      next: filters.ram === '32' && filters.ssd === '1024' ? { ram: '', ssd: '' } : { ram: '32', ssd: '1024' } },
    { label: 'Fácil de transportar', active: filters.portable, next: { portable: !filters.portable } },
    { label: 'Para diseño 3D', active: filters.threeD, next: { threeD: !filters.threeD } },
  ]

  return <main id="contenido">
    <PersonalizedHero />
    <CreativeWorkSelector {...preferences} />
    <section className="catalog-section" id="catalogo" aria-labelledby="catalog-title">
      <div className="shell">
        <div className="catalog-heading">
          <h2 id="catalog-title">Explora tus opciones</h2>
          {updated && <p className="updated"><CalendarDays size={16} /> Última actualización <time dateTime={updated}>{date(updated)}</time></p>}
        </div>
        <div className="budget-discovery">
          <p>Presupuesto inicial <strong>COP $2–4 millones</strong> · Puedes explorar hasta <strong>$5 millones</strong>.</p>
          <div className="quick-filters" role="group" aria-label="Rangos de presupuesto">
            {budgetRanges.map(({ min, max, label }) => {
              const active = filters.min === min && filters.max === max
              return <button key={min} type="button" aria-pressed={active} onClick={() => setFilters({ ...filters, min: active ? defaultFilters.min : min, max: active ? defaultFilters.max : max })}>
                <strong>${min / 1_000_000}–${max / 1_000_000} M</strong> · {label}
              </button>
            })}
          </div>
        </div>
        <div className="catalog-layout">
          <CatalogFilters {...{ filters, setFilters, laptops }} />
          <div className="catalog-results">
            <div className="catalog-tools">
              <label className="search"><Search size={18} /><span className="sr-only">Buscar por marca o modelo</span>
                <input type="search" placeholder="Busca marca o modelo" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
              </label>
              <Dropdown className="sort" label="Ordenar por" showLabel={false} options={sortOptions}
                value={filters.sort} onChange={sort => setFilters({ ...filters, sort })} />
            </div>
            <div className="quick-filters spec-shortcuts" role="group" aria-label="Filtros rápidos">
              {quickFilters.map(({ label, active, next }) => <button key={label} type="button" aria-pressed={active} onClick={() => setFilters({ ...filters, ...next })}>{label}</button>)}
            </div>
            <div className="results-heading">
              <p className="results-meta" id="catalog-results" tabIndex={-1} role="status">{filtered.length} {filtered.length === 1 ? 'portátil encontrado' : 'portátiles encontrados'}</p>
              <button className="vivobook-shortcut" type="button" onClick={() => setFilters(vivobookPreset ? defaultFilters : {
                ...defaultFilters, brand: 'ASUS', search: 'Vivobook', min: FLOOR, max: CEILING,
              })}>{vivobookPreset ? 'Volver al presupuesto de Daniela' : 'Ver Vivobook de todos los precios'}</button>
            </div>
            {filtered.length ? <div className="product-grid">{filtered.map((laptop, index) => <Card key={laptop.id} {...{ laptop, comparison, priorities }} eager={index < 3} />)}</div>
              : <div className="empty"><Search /><h3>No encontramos portátiles con esos filtros</h3>
                <p>Prueba con un presupuesto más amplio o quita algún filtro.</p>
                <button className="button secondary" onClick={() => setFilters(defaultFilters)}>Restablecer filtros</button></div>}
          </div>
        </div>
        <details className="methodology"><summary>¿Cómo se ordenan los recomendados?</summary>
          <p>Damos prioridad a los precios dentro del presupuesto, los equipos fáciles de llevar, la memoria para usar varias aplicaciones y las pantallas con una buena cobertura de color documentada. También contamos el espacio para archivos y las características del procesador que la tienda confirma. Tus prioridades cambian el peso que tienen la pantalla, la memoria o los gráficos. Si dos equipos son parecidos, damos una pequeña ventaja a la línea ASUS Vivobook. Los datos que faltan no suman puntos.</p>
        </details>
      </div>
    </section>
    {featured.length > 0 && <section className="shell storage-feature" aria-labelledby="storage-feature-title">
      <h2 id="storage-feature-title">Más espacio y potencia para crear</h2>
      <p>32 GB de memoria y 1 TB de almacenamiento para trabajar con más archivos abiertos y guardar tus proyectos.</p>
      <ul>{featured.map(laptop => <li key={laptop.id}>
        <Link to={`/laptops/${laptop.id}`}><strong>{laptop.brand} {laptop.model}</strong><ArrowRight size={16} /></Link>
        <p>{cop(best(laptop).price)} · {laptop.reason}</p>
      </li>)}</ul>
    </section>}
    <PortfolioInspiration />
  </main>
}
