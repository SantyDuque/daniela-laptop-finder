import { useState } from 'react'
import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { Laptop } from '../data/types'
import { CEILING, cop, defaultFilters, FLOOR, type Filters } from '../lib/catalog'

type Props = { filters: Filters; setFilters: (filters: Filters) => void; laptops: Laptop[] }
type Option = [string, string]
const options = (values: string[]): Option[] => [...new Set(values)].sort().map(value => [value, value])
const step = 50_000

export function CatalogFilters({ filters, setFilters, laptops }: Props) {
  const [open, setOpen] = useState(false)
  const change = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters({ ...filters, [key]: value })
  function select(key: 'brand' | 'cpu' | 'ram' | 'ssd' | 'screen' | 'panel' | 'weight' | 'gpu' | 'os', label: string, entries: Option[]) {
    return <label className="filter-label">{label}
      <select value={filters[key]} onChange={event => change(key, event.target.value)}>
        <option value="">Cualquiera</option>
        {entries.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
      </select>
    </label>
  }
  function check(key: 'portable' | 'design' | 'creative' | 'threeD' | 'unpriced', text: string) {
    return <label className="check"><input type="checkbox" checked={filters[key]} onChange={e => change(key, e.target.checked)} />{text}</label>
  }

  return <aside className={`filter-panel ${open ? 'filters-open' : ''}`} aria-label="Filtros del catálogo">
    <button className="mobile-filters button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="filter-content">
      <SlidersHorizontal size={17} /> Filtros
    </button>
    <div className="filters-content" id="filter-content">
      <div className="filters-title"><h3><SlidersHorizontal size={17} /> Filtros</h3>
        <button className="reset" onClick={() => setFilters(defaultFilters)}><RotateCcw size={13} /> Restablecer</button>
      </div>
      <fieldset><legend>Presupuesto</legend>
        <div className="budget-values"><span>{cop(filters.min)}</span><span>{cop(filters.max)}</span></div>
        <label className="range-label">Desde<input aria-label="Presupuesto mínimo" type="range" min={FLOOR} max={CEILING} step={step}
          aria-valuetext={cop(filters.min)} value={filters.min}
          onChange={e => change('min', Math.min(Number(e.target.value), filters.max))} /></label>
        <label className="range-label">Hasta<input aria-label="Presupuesto máximo" type="range" min={FLOOR} max={CEILING} step={step}
          aria-valuetext={cop(filters.max)} value={filters.max}
          onChange={e => change('max', Math.max(Number(e.target.value), filters.min))} /></label>
        {check('unpriced', 'Incluir equipos sin precio verificado')}
      </fieldset>
      <fieldset><legend>Especificaciones</legend>
        {select('brand', 'Marca', options(laptops.map(item => item.brand)))}
        {select('cpu', 'Procesador', options(laptops.map(item => item.cpuBrand)))}
        {select('ram', 'RAM mínima', [['8', '8 GB'], ['16', '16 GB'], ['24', '24 GB'], ['32', '32 GB']])}
        {select('ssd', 'SSD mínimo', [['512', '512 GB'], ['1024', '1 TB']])}
        {select('screen', 'Tamaño de pantalla', [['small', 'Hasta 14 pulgadas'], ['large', 'Más de 14 pulgadas']])}
        {select('panel', 'Tecnología de pantalla', options(laptops.flatMap(item => item.panel ?? [])))}
        {select('weight', 'Peso máximo', [['1.4', '1,4 kg'], ['1.55', '1,55 kg'], ['1.8', '1,8 kg'], ['2', '2 kg']])}
        {select('gpu', 'Gráficos', options(laptops.flatMap(item => item.graphics ?? [])))}
        {select('os', 'Sistema operativo', options(laptops.flatMap(item => item.os ?? [])))}
      </fieldset>
      <fieldset><legend>Para tu trabajo</legend>
        {check('portable', 'Liviano (hasta 1,55 kg)')}
        {check('design', 'Buena pantalla para diseño')}
        {check('creative', 'Trabajo creativo')}
        {check('threeD', 'Modelado 3D básico')}
      </fieldset>
      <button className="button primary apply-filters" onClick={() => {
        setOpen(false)
        document.getElementById('catalog-results')?.focus()
      }}>Ver resultados</button>
    </div>
  </aside>
}
