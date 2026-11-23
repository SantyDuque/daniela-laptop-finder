import { ArrowDown, ArrowRight, ArrowUpRight, Box, Check, LayoutTemplate, Palette, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { creativeIds, creativeWork, portfolioProjects, portfolioUrl, solidworksRequirements, type CreativeId } from '../data/creative'

export type CreativePreferences = {
  priorities: CreativeId[]
  toggle: (id: CreativeId) => void
  clear: () => void
}

const projectIcons = { graphic: Palette, product: Box, ux: LayoutTemplate }

export function PersonalizedHero() {
  return <section className="hero creative-hero shell">
    <div className="hero-copy">
      <h1>Daniela, encontremos el portátil para <em>todo lo que imaginas.</em></h1>
      <p className="hero-intro">Desde crear identidades visuales hasta diseñar productos en 3D. Comparemos opciones que acompañen tus ideas, tu trabajo y tu presupuesto.</p>
      <div className="hero-actions">
        <Link to="/#prioridades" className="button primary">Elegir prioridades <ArrowDown size={18} /></Link>
        <Link to="/#catalogo" className="button secondary">Explorar portátiles <ArrowRight size={17} /></Link>
        <span className="budget-pill">COP $2–4 M · Hasta $5 M</span>
      </div>
    </div>
    <div className="hero-visual"><img src="/images/creative-workspace.jpg" alt="Portátil abierto junto a un prototipo, un empaque y muestras de color" fetchPriority="high" width={1200} height={800} /></div>
  </section>
}

export function CreativeWorkSelector({ priorities, toggle, clear }: CreativePreferences) {
  const selected = priorities.length
  return <section className="creative-section shell" id="prioridades" tabIndex={-1} aria-labelledby="creative-title">
    <div className="creative-heading">
      <div><h2 id="creative-title">¿Qué quieres crear con tu próximo portátil?</h2>
        <p>Elige una o varias prioridades y mira cómo cambia el orden de los recomendados.</p></div>
      {selected > 0 && <button type="button" className="button secondary" onClick={clear}><RotateCcw size={15} /> Borrar prioridades</button>}
    </div>
    <div className="creative-options" role="group" aria-label="Tus prioridades creativas">
      {creativeIds.map(id => {
        const work = creativeWork[id]
        const Icon = projectIcons[id]
        const active = priorities.includes(id)
        return <button key={id} type="button" className={`creative-option creative-option-${id}`} aria-pressed={active}
          aria-labelledby={`creative-${id}-name`} aria-describedby={`creative-${id}-examples creative-${id}-features`}
          onClick={() => toggle(id)}>
          <span className="creative-option-top" aria-hidden="true"><span className="creative-glyph"><Icon size={22} /></span><span className="creative-check">{active && <Check size={15} />}</span></span>
          <strong id={`creative-${id}-name`}>{work.title}</strong>
          <span className="creative-examples" id={`creative-${id}-examples`}>{work.examples}</span>
          <span className="creative-features" id={`creative-${id}-features`}>{work.priorities}</span>
        </button>
      })}
    </div>
    <div className="creative-foot">
      <p role="status">{selected ? `Prioridades seleccionadas: ${priorities.map(id => creativeWork[id].short).join(' · ')}` : 'Puedes explorar el catálogo con la recomendación general.'}</p>
      {priorities.includes('product') && <a className="creative-source" href={solidworksRequirements} target="_blank" rel="noopener noreferrer">Requisitos de SOLIDWORKS <ArrowUpRight size={14} /></a>}
      <Link to="/#catalogo" className="creative-source">Ver portátiles <ArrowDown size={15} /></Link>
    </div>
  </section>
}

export function PortfolioInspiration() {
  return <section className="portfolio-strip shell" aria-labelledby="portfolio-title">
    <div>
      <h2 id="portfolio-title">Un portátil a la altura de tus ideas.</h2>
      <p>Tus proyectos reúnen identidades visuales, objetos e interfaces. Así empezamos a pensar qué equipo podría servirte.</p>
      <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="creative-source">Portafolio de Daniela Duque Robledo <ArrowUpRight size={15} /></a>
    </div>
    <ul>{portfolioProjects.map(project => <li key={project.path}>
      <a href={project.url} target="_blank" rel="noopener noreferrer">
        <span><strong>{project.name}</strong><small>{project.discipline}</small></span><ArrowUpRight size={16} />
      </a>
    </li>)}</ul>
  </section>
}
