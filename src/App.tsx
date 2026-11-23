import { useEffect, useState } from 'react'
import { ArrowRight, GitCompareArrows, Laptop as LaptopIcon, X } from 'lucide-react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { laptops } from './data/laptops'
import { readStorage, saveStorage } from './lib/catalog'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Compare from './pages/Compare'

const selectionKey = 'daniela-comparison-v1'
const byId = new Map(laptops.map(laptop => [laptop.id, laptop]))

function initialSelection() {
  const saved = readStorage(selectionKey)
  return Array.isArray(saved)
    ? [...new Set(saved.filter((id): id is string => typeof id === 'string' && byId.has(id)))].slice(0, 3)
    : []
}

export function NotFound() {
  return <main id="contenido" className="shell page-body"><div className="empty">
    <LaptopIcon /><h1>No encontramos este portátil</h1>
    <p>Explora el catálogo para encontrar otra opción.</p>
    <Link className="button primary" to="/#catalogo">Ir al catálogo <ArrowRight size={17} /></Link>
  </div></main>
}

export default function App() {
  const [ids, setIds] = useState(initialSelection)
  const [warning, setWarning] = useState(0)
  const { pathname, hash } = useLocation()
  useEffect(() => { saveStorage(selectionKey, ids) }, [ids])
  useEffect(() => {
    if (!warning) return
    const timer = window.setTimeout(() => setWarning(0), 4300)
    return () => window.clearTimeout(timer)
  }, [warning])
  useEffect(() => {
    if (hash) {
      const frame = requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1))
        target?.scrollIntoView()
        target?.focus({ preventScroll: true })
      })
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  useEffect(() => {
    const laptop = byId.get(pathname.split('/')[2])
    const prefix = laptop ? `${laptop.brand} ${laptop.model} | ` : pathname === '/comparar' ? 'Comparar | ' : ''
    document.title = prefix + 'El portátil ideal para Daniela'
  }, [pathname])

  function toggle(id: string) {
    if (ids.includes(id)) {
      setIds(ids.filter(item => item !== id))
      setWarning(0)
    } else if (ids.length < 3) {
      setIds([...ids, id])
    } else {
      setWarning(current => current + 1)
    }
  }
  const comparison = { ids, toggle, clear: () => { setIds([]); setWarning(0) } }

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header">
      <nav className="shell nav" aria-label="Navegación principal">
        <Link className="brand" to="/"><span className="brand-icon"><LaptopIcon size={22} /></span><span>Daniela<span className="brand-accent">/</span>Portátiles</span></Link>
        <div className="nav-actions">
          <Link className="nav-catalog" to="/#catalogo">Explorar catálogo</Link>
          <Link className="button secondary nav-compare" to="/comparar"><GitCompareArrows size={17} /> Comparar <span>{ids.length}</span></Link>
        </div>
      </nav>
    </header>
    <Routes>
      <Route path="/" element={<Home comparison={comparison} />} />
      <Route path="/laptops/:id" element={<Detail {...{ comparison, byId }} />} />
      <Route path="/comparar" element={<Compare {...{ comparison, byId }} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <footer className={`site-footer ${ids.length && pathname !== '/comparar' ? 'has-tray' : ''}`}>
      <div className="shell footer-inner"><span><LaptopIcon size={18} /> El portátil ideal para Daniela</span><span>Guía de compra · Colombia</span></div>
    </footer>
    {warning > 0 && <div className="toast" role="status">Puedes comparar hasta 3 portátiles. Quita uno para agregar otro.</div>}
    {ids.length > 0 && pathname !== '/comparar' && <aside className="tray" aria-label="Selección para comparar">
      <div className="tray-selected">
        <strong><GitCompareArrows size={17} /> {ids.length} de 3 seleccionados</strong>
        <div className="tray-items">{ids.map(id => {
          const laptop = byId.get(id)!
          return <button key={id} onClick={() => toggle(id)} aria-label={`Quitar ${laptop.brand} ${laptop.model}`} title={`Quitar ${laptop.model}`}>
            <span>{laptop.model}</span><X size={14} />
          </button>
        })}</div>
      </div>
      <Link className="button primary" to="/comparar">Ver comparación <ArrowRight size={17} /></Link>
    </aside>}
  </>
}
