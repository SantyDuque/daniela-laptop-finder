import { ArrowLeft, ArrowUpRight, GitCompareArrows, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Comparison } from '../components/Controls'
import { ProductImage } from '../components/ProductImage'
import type { Laptop } from '../data/types'
import { best, color, cop, designScreen, screen, storage, threeD, unknown, weight } from '../lib/catalog'

type Metric = (laptop: Laptop) => number | undefined
const light: Metric = laptop => laptop.weight
const price: Metric = laptop => best(laptop)?.price
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
  const dedicated = selected.filter(threeD)
  const name = (laptop: Laptop) => `${laptop.brand} ${laptop.model}`
  const rows = [
    { label: 'Menor precio verificado', field: (l: Laptop) => {
      const offer = best(l)
      return offer ? <a className="table-offer" href={offer.url} target="_blank" rel="noopener noreferrer"><strong>{cop(offer.price)}</strong>{offer.retailer} <ArrowUpRight size={14} /></a> : unknown
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
  const differences = [
    cheapest && `${name(cheapest)} tiene el menor precio registrado en esta selección.`,
    lightest && `Si lo llevas a diario, ${name(lightest)} tiene el menor peso verificado.`,
    memory && `${name(memory)} ofrece más memoria RAM para mantener varias aplicaciones abiertas.`,
    documentedOnly && `Solo ${name(documentedOnly)} cuenta con una cobertura de color documentada entre los equipos seleccionados.`,
    !documentedOnly && highlightedDisplay && `${name(highlightedDisplay)} documenta una cobertura amplia de color (${color(highlightedDisplay)}).`,
    dedicated.length === 1 && selected.length > 1 && `La GPU dedicada del ${name(dedicated[0])} puede ayudar con escenas 3D sencillas.`,
  ].filter(Boolean)

  return <main id="contenido" className="shell page-body compare-page">
    <Link className="back" to="/#catalogo"><ArrowLeft size={18} /> Volver al catálogo</Link>
    <div className="page-heading"><div><h1>Compara tus portátiles</h1><p>{selected.length} de 3 seleccionados</p></div>
      {selected.length > 0 && <button className="button secondary" onClick={comparison.clear}>Limpiar comparación</button>}
    </div>
    {!selected.length ? <div className="empty"><GitCompareArrows /><h2>Tu comparación está vacía</h2>
      <p>Agrega hasta tres portátiles del catálogo para revisar sus diferencias.</p>
      <Link className="button primary" to="/#catalogo">Explorar portátiles</Link></div> : <>
      <section className="section-card tradeoffs"><h2>Lo que cambia para ti</h2>
        {differences.length ? <ul>{differences.map(item => <li key={String(item)}>{item}</li>)}</ul>
          : <p>{selected.length === 1 ? 'Agrega otro portátil para ver las diferencias en precio, peso y memoria.' : 'Revisa la pantalla, los gráficos y las ventajas de cada equipo para decidir cuál te conviene.'}</p>}
      </section>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Tabla de comparación, desplazable horizontalmente">
        <table><caption className="sr-only">Comparación de las configuraciones seleccionadas</caption>
          <thead><tr><th scope="col">Especificación</th>{selected.map(laptop => <th key={laptop.id} scope="col">
            <div className="table-image"><ProductImage laptop={laptop} /></div>
            <Link to={`/laptops/${laptop.id}`}>{name(laptop)}</Link><p className="sku">{laptop.sku}</p>
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
