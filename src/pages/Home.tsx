import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CompareButton, type Comparison } from '../components/Controls'
import { BuyerGuide } from '../components/BuyerGuide'
import { CreativeWorkSelector, PersonalizedHero, PortfolioInspiration, type CreativePreferences } from '../components/CreativeWork'
import { CatalogFilters } from '../components/Filters'
import { ProductImage } from '../components/ProductImage'
import { Dropdown, type DropdownOption } from '../components/Dropdown'
import { laptops } from '../data/laptops'
import { updated } from '../data/priceHistory'
import type { Laptop } from '../data/types'
import type { CreativeId } from '../data/creative'
import { cardProjectNotes } from '../lib/projectFit'
import { badge, best, CEILING, cop, date, defaultFilters, filterCatalog, FLOOR, listed, readStorage, saveStorage, type Filters } from '../lib/catalog'

const preferenceKey = 'daniela-catalog-v1'
const sortOptions: DropdownOption<Filters['sort']>[] = [
  ['recommended', 'Recomendados para Daniela'], ['low', 'Menor precio'], ['high', 'Mayor precio'],
  ['light', 'Más livianos'], ['value', 'Mejor relación calidad-precio'],
]
function loadFilters(): Filters {
  const saved = readStorage(preferenceKey)
  if (!saved || typeof saved !== 'object') return defaultFilters
  const record = saved as Record<string, unknown>
  return { ...defaultFilters, ...Object.fromEntries(Object.entries(defaultFilters).map(([key, value]) => [key, typeof record[key] === typeof value ? record[key] : value])), sort: ['low', 'high', 'light', 'value'].includes(String(record.sort)) ? record.sort as Filters['sort'] : 'recommended' }
}

function Card({ laptop, comparison, eager, priorities }: { laptop: Laptop; comparison: Comparison; eager: boolean; priorities: CreativeId[] }) {
  const offer = best(laptop)
  const count = listed(laptop).length
  const label = badge(laptop, laptops)
  const route = `/laptops/${laptop.id}`
  return <article className="product-card">
    <Link to={route} className="product-art" tabIndex={-1} aria-hidden="true">
      {label && <span className="product-badge">{label}</span>}
      <ProductImage laptop={laptop} eager={eager} />
    </Link>
    <div className="product-content">
      <p className="product-brand">{laptop.brand}</p>
      <h3><Link to={route}>{laptop.model}</Link></h3>
      <p className="sku">{laptop.sku}</p>
      <div className="price-line">
        <strong>{offer ? cop(offer.price) : 'Precio sin verificar'}</strong>
        <span>{count === 1 ? '1 precio revisado' : `${count} precios revisados`}</span>
      </div>
      {offer?.stale && offer.checkedAt && <p className="price-aged">Precio anterior · {date(offer.checkedAt)}</p>}
      <div className="card-project-note">
        <h4>Pensando en tus proyectos</h4>
        {cardProjectNotes(laptop, priorities).map(note => <p key={note}>{note}</p>)}
      </div>
      <p className="card-caveat"><strong>Ten en cuenta</strong> · {laptop.cons[0]}.</p>
      <details className="buyer-details"><summary>¿Cómo me serviría?</summary><BuyerGuide laptop={laptop} /></details>
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

  return <main id="contenido">
    <PersonalizedHero />
    <CreativeWorkSelector {...preferences} />
    <section className="catalog-section" id="catalogo" aria-labelledby="catalog-title">
      <div className="shell">
        <div className="catalog-heading">
          <h2 id="catalog-title">Explora tus opciones</h2>
          {updated && <p className="updated"><CalendarDays size={16} /> Última actualización <time dateTime={updated}>{date(updated)}</time></p>}
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
    <PortfolioInspiration />
  </main>
}
