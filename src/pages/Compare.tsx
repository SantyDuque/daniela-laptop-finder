import { ArrowDown, ArrowLeft, ArrowUpRight, GitCompareArrows, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Comparison } from '../components/Controls'
import { ProductImage } from '../components/ProductImage'
import type { Laptop } from '../data/types'
import { comparePrice, pickForDaniela, practicalFacts, priceAdvice } from '../lib/advice'
import { best, color, cop, date, designScreen, screen, storage, unknown, weight } from '../lib/catalog'

type Metric = (laptop: Laptop) => number | undefined
const light: Metric = laptop => laptop.weight
const price: Metric = laptop => {
  const offer = best(laptop)
  return offer?.stale ? undefined : offer?.price
}
const ram: Metric = laptop => laptop.ram

function winner(laptops: Laptop[], metric: Metric, descending = false) {
  const known = laptops.flatMap(laptop => {
    const value = metric(laptop)
    return value === undefined ? [] : [{ laptop, value }]
  }).sort((a, b) => descending ? b.value - a.value : a.value - b.value)
  return known.length >= 2 && known[0].value !== known[1].value ? known[0].laptop : undefined
}

export default function Compare({ comparison, byId }: { comparison: Comparison; byId: Map<string, Laptop> }) {
  const selected = comparison.ids.flatMap(id => byId.get(id) ?? [])
  const cheapest = winner(selected, price)
  const lightest = winner(selected, light)
  const memory = winner(selected, ram, true)
  const documented = selected.filter(item => item.gamut)
  const documentedOnly = selected.length >= 2 && documented.length === 1 ? documented[0] : undefined
  const wideGamut = selected.filter(designScreen)
  const highlightedDisplay = documentedOnly ?? (selected.length >= 2 && wideGamut.length === 1 ? wideGamut[0] : undefined)
  const recommendation = pickForDaniela(selected)
  const rows = [
    { label: 'Mejor precio encontrado', field: (l: Laptop) => {
      const offer = best(l)
      return offer ? <a className="table-offer" href={offer.url} target="_blank" rel="noopener noreferrer"><strong>{cop(offer.price)}</strong>{offer.retailer} <ArrowUpRight size={14} />{offer.checkedAt && <time className="table-price-date" dateTime={offer.checkedAt}>{date(offer.checkedAt)}{offer.stale && ' · Puede estar desactualizado'}</time>}</a> : unknown
    }, highlight: cheapest },
    { label: 'Procesador', field: (l: Laptop) => l.cpu },
    { label: 'Memoria RAM', field: (l: Laptop) => `${l.ram} GB`, highlight: memory },
    { label: 'Almacenamiento SSD', field: (l: Laptop) => storage(l.storage) },
    { label: 'Pantalla y resolución', field: (l: Laptop) => `${screen(l)} · ${l.resolution ?? unknown}` },
    { label: 'Tecnología del panel', field: (l: Laptop) => l.panel ?? unknown },
    { label: 'Cobertura de color', field: color, highlight: highlightedDisplay },
    { label: 'Peso', field: (l: Laptop) => weight(l.weight), highlight: lightest },
    { label: 'Gráficos', field: (l: Laptop) => [l.gpu, l.graphics].filter(Boolean).join(' · ') || unknown },
    { label: 'Batería', field: (l: Laptop) => l.battery ?? unknown },
    { label: 'Puertos', field: (l: Laptop) => l.ports ?? unknown },
    { label: 'Ventajas', field: (l: Laptop) => <ul>{l.pros.map(item => <li key={item}>{item}</li>)}</ul> },
    { label: 'Para tener en cuenta', field: (l: Laptop) => <ul>{l.cons.map(item => <li key={item}>{item}</li>)}</ul> },
    { label: 'Para diseño', field: (l: Laptop) => l.reason },
  ]
  const name = (laptop: Laptop) => `${laptop.brand} ${laptop.model}`
  const suggested = recommendation?.laptop
  const alternatives = recommendation?.alternative
  const screenAlternative = recommendation?.screenAlternative

  return <main id="contenido" className="shell page-body compare-page">
    <Link className="back" to="/#catalogo"><ArrowLeft size={18} /> Volver al catálogo</Link>
    <div className="page-heading"><div><h1>Compara tus portátiles</h1><p>{selected.length} de 3 seleccionados</p></div>
      {selected.length > 0 && <button className="button secondary" onClick={comparison.clear}>Limpiar comparación</button>}
    </div>
    {!selected.length ? <div className="empty"><GitCompareArrows /><h2>Tu comparación está vacía</h2>
      <p>Agrega hasta tres portátiles del catálogo para revisar sus diferencias.</p>
      <Link className="button primary" to="/#catalogo">Explorar portátiles</Link></div> : <>
      <section className="section-card recommendation" aria-labelledby="recommendation-title">
        <h2 id="recommendation-title">¿Cuál elegiría para Daniela?</h2>
        {suggested && recommendation ? <>
          <p><strong>{name(suggested)} · {cop(recommendation.price)}</strong></p>
          <p>{practicalFacts(suggested).carrying} {practicalFacts(suggested).work} {priceAdvice(suggested)}</p>
          <p>{practicalFacts(suggested).display}</p>
          {alternatives && <p><strong>Si prefieres gastar menos</strong> · {name(alternatives.laptop)} cuesta {cop(recommendation.price - alternatives.price)} menos. {practicalFacts(alternatives.laptop).memory} {practicalFacts(alternatives.laptop).carrying}</p>}
          {screenAlternative && <p><strong>Si priorizas la pantalla</strong> · {name(screenAlternative.laptop)} tiene una cobertura de color amplia y documentada.</p>}
        </> : <p>Falta un precio reciente dentro de los $2 a $4 millones para recomendar uno de estos equipos con confianza.</p>}
        <details className="buyer-details"><summary>Cómo elijo</summary>
          <p>Primero miro cuáles caben en el presupuesto con precios revisados en los últimos 14 días. Entre esos equipos doy prioridad a los fáciles de cargar, con al menos 16 GB de memoria, una pantalla documentada para diseño y un precio que corresponda a sus ventajas.</p>
        </details>
      </section>
      <section className="section-card tradeoffs" aria-labelledby="tradeoffs-title"><h2 id="tradeoffs-title">Lo que cambia para ti</h2>
        <div className="tradeoff-grid">{selected.map(laptop => <article key={laptop.id}>
          <h3><Link to={`/laptops/${laptop.id}`}>{name(laptop)}</Link></h3>
          <p><strong>Lo mejor</strong> · {laptop.reason}</p>
          <p><strong>Ten en cuenta</strong> · {laptop.cons[0]}.</p>
          <p><strong>Para quién</strong> · {practicalFacts(laptop).buyer}</p>
          {selected.length > 1 && <p>{comparePrice(laptop, selected)} {laptop === lightest ? 'Es el más liviano de los equipos con peso verificado.' : laptop === memory ? 'Es el que tiene más espacio para trabajar con varias aplicaciones abiertas.' : laptop === highlightedDisplay ? 'Su cobertura de color está documentada.' : ''}</p>}
        </article>)}</div>
        <Link to="#tabla-comparacion" className="back details-jump">Ver especificaciones lado a lado <ArrowDown size={16} /></Link>
      </section>
      <div className="table-wrap" id="tabla-comparacion" tabIndex={0} role="region" aria-label="Tabla de comparación, desplazable horizontalmente">
        <table><caption className="sr-only">Comparación de las configuraciones seleccionadas</caption>
          <thead><tr><th scope="col">Especificación</th>{selected.map(laptop => <th key={laptop.id} scope="col">
            <div className="compare-product">
              <div className="table-image"><ProductImage laptop={laptop} eager /></div>
              <Link className="compare-product-name" to={`/laptops/${laptop.id}`}>{name(laptop)}</Link>
              <p className="sku">{laptop.sku}</p>
            </div>
            <button className="quiet-button" onClick={() => comparison.toggle(laptop.id)} aria-label={`Quitar ${name(laptop)}`}><X size={15} /> Quitar</button>
          </th>)}</tr></thead>
          <tbody>{rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th>{selected.map(laptop => (
            <td key={laptop.id} className={row.highlight?.id === laptop.id ? 'table-highlight' : ''}>{row.field(laptop)}</td>
          ))}</tr>)}</tbody>
        </table>
      </div>
    </>}
  </main>
}
