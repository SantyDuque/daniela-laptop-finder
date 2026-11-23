import { ArrowDown, ArrowLeft, ArrowUpRight, GitCompareArrows, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Comparison } from '../components/Controls'
import { MemoryGuide, memoryConfiguration } from '../components/MemoryGuide'
import { ProductImage } from '../components/ProductImage'
import { creativeWork, solidworksRequirements, type CreativeId } from '../data/creative'
import type { Laptop } from '../data/types'
import { assessProjects, cardProjectNotes, preferredProjectOrder } from '../lib/projectFit'
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

function projectWinner(laptops: Laptop[], id: CreativeId) {
  if (laptops.length < 2) return
  const ranked = laptops.map(laptop => ({ laptop, fit: assessProjects(laptop)[id] }))
    .sort((a, b) => b.fit.points - a.fit.points)
  const [first, second] = ranked
  if (second.fit.level === 'unknown' || first.fit.points === second.fit.points) return
  if (first.fit.level === 'good' || first.fit.level === 'strong') return first
}

const projectHeadings = {
  graphic: 'Para diseño gráfico',
  product: 'Para explorar 3D',
  ux: 'Para diseño UX/UI',
}

export default function Compare({ comparison, byId, priorities }: { comparison: Comparison; byId: Map<string, Laptop>; priorities: CreativeId[] }) {
  const selected = comparison.ids.flatMap(id => byId.get(id) ?? [])
  const cheapest = winner(selected, price)
  const lightest = winner(selected, light)
  const memory = winner(selected, ram, true)
  const documented = selected.filter(item => item.gamut)
  const documentedOnly = selected.length >= 2 && documented.length === 1 ? documented[0] : undefined
  const wideGamut = selected.filter(designScreen)
  const highlightedDisplay = documentedOnly ?? (selected.length >= 2 && wideGamut.length === 1 ? wideGamut[0] : undefined)
  const recommendation = pickForDaniela(selected, priorities)
  const projectHighlights = preferredProjectOrder(priorities).map(id => ({ id, result: projectWinner(selected, id) }))
  const rows = [
    { label: 'Mejor precio encontrado', field: (l: Laptop) => {
      const offer = best(l)
      return offer ? <a className="table-offer" href={offer.url} target="_blank" rel="noopener noreferrer"><strong>{cop(offer.price)}</strong>{offer.retailer} <ArrowUpRight size={14} />{offer.checkedAt && <time className="table-price-date" dateTime={offer.checkedAt}>{date(offer.checkedAt)}{offer.stale && ' · Puede estar desactualizado'}</time>}</a> : unknown
    }, highlight: cheapest },
    { label: 'Procesador', field: (l: Laptop) => l.cpu },
    { label: 'Memoria RAM', field: (l: Laptop) => `${l.ram} GB`, highlight: memory },
    { label: 'Origen y ampliación de la memoria', field: memoryConfiguration },
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
    { label: 'Pensando en tus proyectos', field: (l: Laptop) => cardProjectNotes(l, priorities).join(' ') },
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
        <div className="creative-heading">
          <h2 id="recommendation-title">Daniela, ¿cuál te conviene más para lo que creas?</h2>
          <Link to="/#prioridades" className="creative-source">{priorities.length ? 'Cambiar prioridades' : 'Elegir prioridades'}</Link>
        </div>
        {priorities.length > 0 && <p>Tus prioridades · {priorities.map(id => creativeWork[id].short).join(' · ')}</p>}
        {suggested && recommendation ? <>
          <p><strong>{selected.length > 1 ? 'Mejor equilibrio' : 'Dentro de tu presupuesto'} · {name(suggested)} · {cop(recommendation.price)}</strong></p>
          {priorities.map(id => <p key={id}><strong>{creativeWork[id].short}</strong> · {assessProjects(suggested)[id].text}</p>)}
          <p>{practicalFacts(suggested).carrying} {!priorities.length && practicalFacts(suggested).work} {priceAdvice(suggested)}</p>
          {!priorities.length && <p>{practicalFacts(suggested).display}</p>}
          {recommendation.preference && <p>{recommendation.preference}</p>}
          {alternatives && <p><strong>Si prefieres gastar menos</strong> · {name(alternatives.laptop)} cuesta {cop(recommendation.price - alternatives.price)} menos. {practicalFacts(alternatives.laptop).memory} {practicalFacts(alternatives.laptop).carrying}</p>}
          {screenAlternative && <p><strong>Si priorizas la pantalla</strong> · {name(screenAlternative.laptop)} tiene una cobertura de color amplia y documentada.</p>}
        </> : <p>{priorities.length
          ? 'Con los precios y las fichas disponibles, todavía no hay una opción clara para tus prioridades dentro de $2 a $5 millones.'
          : 'Con los precios disponibles, todavía no hay una opción clara dentro de $2 a $5 millones.'}</p>}
        <details className="buyer-details"><summary>Cómo elijo</summary>
          <p>Primero miro cuáles caben en el presupuesto con precios revisados en los últimos 14 días. Por encima de $4 millones, busco una mejora concreta antes de sugerir el gasto adicional. Tus prioridades cambian cuánto pesan la pantalla, la memoria y los gráficos. También cuentan el peso y el precio. Si dos opciones son parecidas, la línea Vivobook tiene una pequeña ventaja.</p>
        </details>
      </section>
      {selected.length > 1 && <section className="section-card" aria-labelledby="highlights-title">
        <h2 id="highlights-title">En qué destaca cada portátil</h2>
        <div className="project-highlights">
          {projectHighlights.map(({ id, result }) => <article key={id} className={priorities.includes(id) ? 'assessment priority-assessment' : 'assessment'}>
            <h3>{projectHeadings[id]}</h3>
            {result ? <><Link to={`/laptops/${result.laptop.id}`}>{name(result.laptop)}</Link><p>{result.fit.text}</p></>
              : <p>No hay una diferencia favorable con los datos disponibles.</p>}
            {id === 'product' && <a className="creative-source" href={solidworksRequirements} target="_blank" rel="noopener noreferrer">Requisitos de SOLIDWORKS <ArrowUpRight size={14} /></a>}
          </article>)}
          <article className="assessment"><h3>Más fácil de llevar</h3>
            {lightest ? <><Link to={`/laptops/${lightest.id}`}>{name(lightest)}</Link><p>{weight(lightest.weight)} · El peso más bajo verificado.</p></> : <p>No hay una diferencia de peso verificada.</p>}
          </article>
          <article className="assessment"><h3>Menor precio</h3>
            {cheapest ? <><Link to={`/laptops/${cheapest.id}`}>{name(cheapest)}</Link><p>{cop(price(cheapest)!)} · El menor precio reciente verificado.</p></> : <p>No hay una diferencia entre precios recientes verificados.</p>}
          </article>
        </div>
      </section>}
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
      <MemoryGuide laptops={selected} />
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
