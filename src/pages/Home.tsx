import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, CalendarDays, Cpu, HardDrive, Laptop as LaptopIcon, MemoryStick, Search, Weight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CompareButton, type Comparison } from '../components/Controls'
import { CatalogFilters } from '../components/Filters'
import { ProductImage } from '../components/ProductImage'
import { laptops, updated } from '../data/laptops'
import type { Laptop } from '../data/types'
import { badge, best, cop, date, defaultFilters, filterCatalog, listed, readStorage, saveStorage, screen, storage, unknown, weight, type Filters } from '../lib/catalog'

const preferenceKey = 'daniela-catalog-v1'
function loadFilters(): Filters {
  const saved = readStorage(preferenceKey)
  if (!saved || typeof saved !== 'object') return defaultFilters
  const record = saved as Record<string, unknown>
  return { ...defaultFilters, ...Object.fromEntries(Object.entries(defaultFilters).map(([key, value]) => [key, typeof record[key] === typeof value ? record[key] : value])), sort: ['low', 'high', 'light', 'value'].includes(String(record.sort)) ? record.sort as Filters['sort'] : 'recommended' }
}

function Card({ laptop, comparison }: { laptop: Laptop; comparison: Comparison }) {
  const offer = best(laptop)
  const count = listed(laptop).length
  const label = badge(laptop, laptops)
  const route = `/laptops/${laptop.id}`
  return <article className="product-card">
    <Link to={route} className="product-art" tabIndex={-1} aria-hidden="true">
      {label && <span className="product-badge">{label}</span>}
      <ProductImage laptop={laptop} />
    </Link>
    <div className="product-content">
      <p className="product-brand">{laptop.brand}</p>
      <h3><Link to={route}>{laptop.model}</Link></h3>
      <p className="sku">{laptop.sku}</p>
      <div className="price-line">
        <strong>{offer ? cop(offer.price) : 'Precio sin verificar'}</strong>
        <span>{count === 1 ? '1 oferta' : `${count} ofertas`}</span>
      </div>
      <ul className="spec-list">
        <li><Cpu />{laptop.cpu}</li><li><MemoryStick />{laptop.ram} GB RAM</li>
        <li><HardDrive />{storage(laptop.storage)} SSD</li><li><LaptopIcon />{screen(laptop)}</li>
        <li><Weight />{weight(laptop.weight)}</li><li><Zap />{laptop.gpu ?? laptop.graphics ?? unknown}</li>
      </ul>
      <p className="card-reason">{laptop.reason}</p>
      <div className="card-actions">
        <Link className="button details-link" to={route}>Ver detalles <ArrowRight size={16} /></Link>
        <CompareButton {...{ laptop, comparison }} />
      </div>
    </div>
  </article>
}

export default function Home({ comparison }: { comparison: Comparison }) {
  const [filters, setFilters] = useState(loadFilters)
  const filtered = filterCatalog(laptops, filters)
  useEffect(() => { saveStorage(preferenceKey, filters) }, [filters])

  return <main id="contenido">
    <section className="hero shell">
      <div className="hero-copy">
        <p className="eyebrow"><span /> Guía de compra en Colombia</p>
        <h1>El portátil ideal<br className="hero-break" /> para <em>Daniela.</em></h1>
        <p className="hero-intro">Encuentra un portátil liviano para diseñar, crear y trabajar. Compara los equipos y los precios publicados por tiendas de Colombia.</p>
        <div className="hero-actions">
          <Link to="/#catalogo" className="button primary">Explorar portátiles <ArrowDown size={18} /></Link>
          <span className="budget-pill">COP $2 M a $4 M</span>
        </div>
      </div>
      <div className="hero-visual"><img src="/images/hero.jpg" alt="Portátil abierto sobre un escritorio con muestras de color" fetchPriority="high" width={1200} height={800} /></div>
    </section>
    <section className="catalog-section" id="catalogo" aria-labelledby="catalog-title">
      <div className="shell">
        <div className="catalog-heading">
          <h2 id="catalog-title">Explora tus opciones</h2>
          <p className="updated"><CalendarDays size={16} /> Última actualización <time dateTime={updated}>{date(updated)}</time></p>
        </div>
        <div className="catalog-layout">
          <CatalogFilters {...{ filters, setFilters, laptops }} />
          <div className="catalog-results">
            <div className="catalog-tools">
              <label className="search"><Search size={18} /><span className="sr-only">Buscar por marca o modelo</span>
                <input type="search" placeholder="Busca marca o modelo" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
              </label>
              <label className="sort"><span className="sr-only">Ordenar por</span><select value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value as Filters['sort'] })}>
                <option value="recommended">Recomendados para Daniela</option><option value="low">Menor precio</option>
                <option value="high">Mayor precio</option><option value="light">Más livianos</option><option value="value">Mejor relación calidad-precio</option>
              </select></label>
            </div>
            <p className="results-meta" id="catalog-results" tabIndex={-1} role="status">{filtered.length} {filtered.length === 1 ? 'portátil encontrado' : 'portátiles encontrados'}</p>
            {filtered.length ? <div className="product-grid">{filtered.map(laptop => <Card key={laptop.id} {...{ laptop, comparison }} />)}</div>
              : <div className="empty"><Search /><h3>No encontramos portátiles con esos filtros</h3>
                <p>Prueba con un presupuesto más amplio o quita algún filtro.</p>
                <button className="button secondary" onClick={() => setFilters(defaultFilters)}>Restablecer filtros</button></div>}
          </div>
        </div>
        <details className="methodology"><summary>¿Cómo se ordenan los recomendados?</summary>
          <p>La selección favorece los precios dentro del presupuesto, los equipos livianos, la memoria RAM, los núcleos documentados del procesador, la cobertura de color documentada y la capacidad del SSD. La relación calidad-precio pondera esas características frente al precio publicado. Los datos faltantes no suman puntos. El orden es una guía de compra y no representa pruebas de rendimiento ni de autonomía.</p>
        </details>
      </div>
    </section>
  </main>
}
