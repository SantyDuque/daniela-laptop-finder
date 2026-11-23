import { useState } from 'react'
import { CalendarDays, TrendingUp } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PriceObservation } from '../data/types'
import { cop, date } from '../lib/catalog'

const palette = ['#ae3c25', '#514285', '#217453', '#7b5909', '#236584', '#7f375a']

export default function PriceChart({ observations }: { observations: PriceObservation[] }) {
  const [range, setRange] = useState(0)
  const chronological = [...observations].sort((a, b) => a.date.localeCompare(b.date))
  const latest = chronological.at(-1)
  const distinctDates = new Set(chronological.map(item => item.date)).size
  const cutoff = latest ? Date.parse(latest.date) - range * 86_400_000 : 0
  const visible = chronological.filter(item => !range || Date.parse(item.date) >= cutoff)
  const series = [...new Set(visible.map(item => item.retailer))]
  const points = [...new Set(visible.map(item => item.date))].map(day => ({
    day,
    ...Object.fromEntries(visible.filter(item => item.date === day).map(item => [item.retailer, item.price])),
  }))
  const prices = visible.map(item => item.price)

  return <section className="section-card" aria-labelledby="history-title">
    <div className="section-heading">
      <div><h2 id="history-title"><TrendingUp /> Historial de precios</h2>
        {latest && <p><CalendarDays size={15} /> Último registro: {date(latest.date)}</p>}</div>
      {distinctDates >= 4 && <label className="history-range">Periodo
        <select value={range} onChange={e => setRange(Number(e.target.value))}>
          <option value={0}>Todo el historial</option><option value={30}>Últimos 30 días</option><option value={90}>Últimos 90 días</option>
        </select>
      </label>}
    </div>
    {points.length >= 2 ? <>
      <div className="observed"><span>Mínimo observado <strong>{cop(Math.min(...prices))}</strong></span><span>Máximo observado <strong>{cop(Math.max(...prices))}</strong></span></div>
      <div className="chart">
        <ResponsiveContainer width="100%" height={290} minWidth={0} initialDimension={{ width: 600, height: 290 }}>
          <LineChart data={points} accessibilityLayer margin={{ top: 12, right: 20, bottom: 6, left: 4 }}>
            <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e6ded5" />
            <XAxis dataKey="day" tickFormatter={date} minTickGap={28} fontSize={12} />
            <YAxis width={84} domain={['auto', 'auto']} tickFormatter={cop} fontSize={12} />
            <Tooltip formatter={value => typeof value === 'number' ? cop(value) : ''} labelFormatter={label => date(String(label))} />
            <Legend />
            {series.map((retailer, index) => <Line key={retailer} dataKey={retailer} name={retailer}
              stroke={palette[index % palette.length]} strokeWidth={2} dot={{ r: 4 }} connectNulls isAnimationActive={false} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </> : <div className="history-empty">
      <TrendingUp size={27} />
      <p>{distinctDates >= 2 ? 'Hay un solo registro en el periodo elegido.' : 'Aún no hay suficientes registros para mostrar la evolución del precio.'}</p>
      {points.length === 1 && visible.map(item => <span key={item.retailer}>{item.retailer} · <strong>{cop(item.price)}</strong></span>)}
    </div>}
    {visible.length > 0 && <details className="history-sources"><summary>Ver registros y fuentes</summary>
      <ul>{visible.map(item => <li key={`${item.date}-${item.retailer}`}><a href={item.source} target="_blank" rel="noopener noreferrer">{item.retailer}</a> · {date(item.date)} · {cop(item.price)}</li>)}</ul>
    </details>}
  </section>
}
