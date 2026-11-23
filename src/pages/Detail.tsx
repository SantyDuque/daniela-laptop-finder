import { lazy, Suspense } from 'react'
import { ArrowLeft, ArrowUpRight, Check, CircleMinus, Palette, ShoppingBag, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { BuyerGuide } from '../components/BuyerGuide'
import { CompareButton, type Comparison } from '../components/Controls'
import { ProductImage } from '../components/ProductImage'
import { observationsFor, offersFor } from '../data/priceHistory'
import type { Laptop } from '../data/types'
import { best, color, cop, date, listed, screen, storage, threeD, unknown, weight } from '../lib/catalog'

const PriceChart = lazy(() => import('../components/PriceChart'))

function Offers({ laptop }: { laptop: Laptop }) {
  const listedOffers = listed(laptop)
  const recent = listedOffers.filter(offer => !offer.stale)
  const offers = [...listedOffers, ...offersFor(laptop).filter(offer => offer.price === undefined || offer.availability === 'sold-out')]
  const spread = recent.length >= 2 ? recent.at(-1)!.price - recent[0].price : undefined
  return <section className="section-card" aria-labelledby="offers-title">
    <div className="section-heading"><div><h2 id="offers-title"><ShoppingBag /> Precios por tienda</h2>
      <p>Precios publicados para esta configuración. Confirma el total y el inventario en la tienda.</p></div></div>
    {offers.length ? <div className="offer-list">{offers.map((offer, index) => <article className="offer" key={offer.url}>
      <div><strong>{offer.listedBy}</strong>{recent.length > 0 && index === 0 && <span className="offer-badge">Mejor precio encontrado</span>}
        {offer.marketplaceSeller && <p>Marketplace · Vendido por {offer.marketplaceSeller}</p>}
        {offer.checkedAt && <p>{offer.price === undefined ? 'Disponibilidad revisada' : 'Precio revisado'} el <time dateTime={offer.checkedAt}>{date(offer.checkedAt)}</time></p>}
        <p>{offer.availability === 'available' ? 'Disponible al consultar' : offer.availability === 'sold-out' ? 'Agotado al consultar' : 'Disponibilidad sin verificar'}</p>
        {offer.stale && <p className="price-aged">Puede estar desactualizado</p>}
        {offer.paymentNote && <p>{offer.paymentNote}</p>}
      </div>
      <div className="offer-action"><div>
        {offer.availability === 'sold-out' || offer.price === undefined ? <>
          <strong>{offer.availability === 'sold-out' ? 'Sin oferta disponible' : 'Precio sin verificar'}</strong>
          {offer.lastPrice !== undefined && offer.lastPriceAt && <p>Último precio observado {cop(offer.lastPrice)} · {date(offer.lastPriceAt)}</p>}
        </> : <strong>{cop(offer.price)}</strong>}
      </div>
        <a className="button secondary" href={offer.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver en la tienda ${offer.retailer} (abre en otra pestaña)`}>Ver en la tienda <ArrowUpRight size={16} /></a>
      </div>
    </article>)}</div> : <p className="history-empty">Aún no hay ofertas verificadas para esta configuración.</p>}
    {spread !== undefined && <p className="spread">{spread === 0 ? 'Las ofertas recientes tienen el mismo precio.' : `Puedes ahorrar hasta ${cop(spread)} frente a la oferta reciente más cara.`}</p>}
    <p className="muted fineprint">Precios web generales. Se excluyen los descuentos condicionados por tarjeta y los costos de envío sin verificar.</p>
  </section>
}

const specifications = (laptop: Laptop): [string, [string, string][]][] => [
  ['Rendimiento', [['Procesador', laptop.cpu], ['Sistema operativo', laptop.os ?? unknown]]],
  ['Memoria y almacenamiento', [['Memoria RAM', `${laptop.ram} GB`], ['Unidad SSD', storage(laptop.storage)]]],
  ['Pantalla', [['Tamaño y panel', screen(laptop)], ['Tecnología del panel', laptop.panel ?? unknown], ['Resolución', laptop.resolution ?? unknown], ['Cobertura de color', color(laptop)]]],
  ['Portabilidad y batería', [['Peso', weight(laptop.weight)], ['Batería', laptop.battery ?? unknown]]],
  ['Conectividad', [['Puertos', laptop.ports ?? unknown]]],
  ['Gráficos', [['GPU', laptop.gpu ?? unknown], ['Tipo de gráficos', laptop.graphics ?? unknown]]],
]

function DesignFit({ laptop }: { laptop: Laptop }) {
  const enoughRam = laptop.ram >= 16
  return <section className="section-card" aria-labelledby="design-title"><h2 id="design-title"><Palette /> Para tu trabajo creativo</h2>
    <dl className="design-list">
      <div><dt>Canva y Figma</dt><dd>Adecuado para diseños y prototipos habituales{enoughRam ? ' y para trabajar con varias pestañas abiertas' : ', con pocas pestañas abiertas'}.</dd></div>
      <div><dt>Photoshop, Illustrator y diseño gráfico</dt><dd>{enoughRam
        ? 'Buena base para composiciones y archivos moderados. Para impresión o entregas con color crítico, revisa la cobertura y calibra la pantalla.'
        : 'Útil para retoques y documentos sencillos. Los archivos con muchas capas y varias apps abiertas pueden superar los 8 GB.'}</dd></div>
      <div><dt>Edición de video básica</dt><dd>{enoughRam ? 'Razonable para cortes sencillos en 1080p. Los efectos complejos y los proyectos en 4K pueden exigir más.' : 'Limítate a clips cortos y usa archivos proxy si la edición se vuelve lenta.'}</dd></div>
      {threeD(laptop) && <div><dt>Modelado 3D</dt><dd>La GPU dedicada puede ayudar con vistas previas y escenas sencillas. El tamaño de la escena y la memoria gráfica condicionan el rendimiento.{!enoughRam && ' Los 8 GB de RAM dejan poco margen para trabajar con varias aplicaciones a la vez.'}</dd></div>}
    </dl>
    <p className="muted fineprint">Estimaciones basadas en las especificaciones publicadas. El rendimiento depende del archivo y de la aplicación.</p>
  </section>
}

export default function Detail({ comparison, byId }: { comparison: Comparison; byId: Map<string, Laptop> }) {
  const { id } = useParams()
  const laptop = byId.get(id ?? '')
  if (!laptop) return <main id="contenido" className="shell page-body"><div className="empty">
    <h1>No encontramos este portátil</h1><Link className="button primary" to="/#catalogo">Volver al catálogo</Link>
  </div></main>
  const offer = best(laptop)
  return <main id="contenido" className="shell page-body">
    <Link className="back" to="/#catalogo"><ArrowLeft size={18} /> Volver al catálogo</Link>
    <div className="detail-overview">
      <div className="detail-art"><ProductImage key={laptop.id} laptop={laptop} eager /></div>
      <div>
        <p className="eyebrow"><span /> {laptop.brand}</p><h1>{laptop.model}</h1><p className="sku">{laptop.sku}</p>
        <p className="detail-reason"><Sparkles size={21} /> {laptop.reason}</p>
        <p className="detail-price"><span>{offer?.stale ? 'Precio anterior más bajo' : 'Mejor precio encontrado'}</span><strong>{offer ? cop(offer.price) : unknown}</strong>
          {offer?.checkedAt && <span>{offer.retailer} · {date(offer.checkedAt)}{offer.stale && ' · Puede estar desactualizado'}</span>}</p>
        <div className="detail-actions"><a className="button primary" href="#ofertas">Ver tiendas</a><CompareButton {...{ laptop, comparison }} /></div>
      </div>
    </div>
    <section className="section-card"><h2>Cómo te serviría</h2><BuyerGuide laptop={laptop} /></section>
    <div className="pros-grid">
      <section className="section-card"><h2><Check /> Lo mejor</h2><ul>{laptop.pros.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className="section-card"><h2><CircleMinus /> Lo que debes considerar</h2><ul>{laptop.cons.map(item => <li key={item}>{item}</li>)}</ul></section>
    </div>
    <div id="ofertas"><Offers laptop={laptop} /></div>
    <Suspense fallback={<div className="section-card" role="status">Cargando historial…</div>}><PriceChart key={laptop.id} observations={observationsFor(laptop)} /></Suspense>
    <details className="section-card technical-details"><summary>Especificaciones técnicas</summary>
      <div className="detail-specs">{specifications(laptop).map(([title, rows]) => <div key={title}><h3>{title}</h3>
        <dl>{rows.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>
      </div>)}</div>
      <a className="back spec-source" href={laptop.source} target="_blank" rel="noopener noreferrer">Consultar la ficha original <ArrowUpRight size={15} /></a>
    </details>
    <DesignFit laptop={laptop} />
  </main>
}
