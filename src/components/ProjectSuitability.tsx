import { ArrowUpRight, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { creativeWork, solidworksCertification, solidworksRequirements, type CreativeId } from '../data/creative'
import type { Laptop } from '../data/types'
import { assessProjects, fitLabels, preferredProjectOrder } from '../lib/projectFit'

export function ProjectSuitability({ laptop, priorities }: { laptop: Laptop; priorities: CreativeId[] }) {
  const fits = assessProjects(laptop)
  return <section className="section-card project-suitability" aria-labelledby="suitability-title">
    <div className="creative-heading">
      <h2 id="suitability-title">¿Cómo te iría con tus proyectos, Daniela?</h2>
      <Link className="creative-source" to="/#prioridades"><SlidersHorizontal size={16} /> Cambiar prioridades</Link>
    </div>
    <div className="assessment-grid">
      {preferredProjectOrder(priorities).map(id => <article key={id} className={priorities.includes(id) ? 'assessment priority-assessment' : 'assessment'}>
        <h3>{creativeWork[id].title}</h3>
        <span className={`fit-label fit-${fits[id].level}`}>{fitLabels[fits[id].level]}</span>
        <p>{fits[id].text}</p>
        {id === 'product' && <div className="project-sources">
          <a href={solidworksRequirements} target="_blank" rel="noopener noreferrer">Requisitos de SOLIDWORKS <ArrowUpRight size={14} /></a>
          <a href={solidworksCertification} target="_blank" rel="noopener noreferrer">Equipos y tarjetas certificados <ArrowUpRight size={14} /></a>
        </div>}
      </article>)}
    </div>
    <p className="muted fineprint">La evaluación se basa en la ficha de cada equipo. El rendimiento también depende del programa y del tamaño de tus archivos.</p>
  </section>
}
