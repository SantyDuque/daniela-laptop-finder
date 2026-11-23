import { ArrowUpRight } from 'lucide-react'
import type { Laptop } from '../data/types'
import { storage } from '../lib/catalog'

export function memoryConfiguration(laptop: Laptop) {
  const { memory } = laptop
  const origin = memory?.origin === 'factory' ? 'Instalada de fábrica'
    : memory?.origin === 'seller-upgraded' ? 'Ampliada por el vendedor'
      : 'Origen de la memoria por confirmar'
  const upgrade = memory?.upgrade === 'soldered' ? 'Soldada, sin ampliación'
    : memory?.upgrade && memory.upgrade.max > laptop.ram ? `Memoria ampliable hasta ${memory.upgrade.max} GB`
      : memory?.upgrade ? `Capacidad máxima documentada de ${memory.upgrade.max} GB` : undefined
  return [origin, upgrade].filter(Boolean).join(' · ')
}

export function MemoryGuide({ laptops }: { laptops: Laptop[] }) {
  return <section className="section-card memory-guide" aria-labelledby="memory-guide-title">
    <h2 id="memory-guide-title">¿Vale la pena pagar más por memoria y almacenamiento?</h2>
    <dl className="design-list">
      <div><dt>16 GB frente a 32 GB de RAM</dt><dd>16 GB suelen alcanzar para prototipos como el sitio del hospital y piezas de identidad de tamaño moderado. 32 GB dan margen para trabajar con empaques con muchas capas, varias apps abiertas o modelos grandes. Para 3D y CAD también importan el procesador, la tarjeta gráfica, la refrigeración y los requisitos del programa.</dd></div>
      <div><dt>SSD de 512 GB frente a 1 TB</dt><dd>Con 1 TB tienes más espacio para instalar tus programas y guardar fotos, versiones de empaques y modelos de producto. La capacidad por sí sola no acelera las aplicaciones.</dd></div>
    </dl>
    <ul className="memory-models">{laptops.map(laptop => <li key={laptop.id}>
      <strong>{laptop.brand} {laptop.model} · {laptop.ram} GB + {storage(laptop.storage)}</strong>
      <p>{memoryConfiguration(laptop)}. {laptop.memory?.warranty ?? (laptop.memory?.origin === 'seller-upgraded'
        ? 'Confirma por escrito quién cubre el equipo y el módulo instalado.' : '')}</p>
      {laptop.memory && <a className="creative-source" href={laptop.memory.source} target="_blank" rel="noopener noreferrer">Fuente de memoria <ArrowUpRight size={14} /></a>}
    </li>)}</ul>
  </section>
}
