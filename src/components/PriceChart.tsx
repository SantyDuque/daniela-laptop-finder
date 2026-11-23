import { useState } from 'react'
import { ArrowUpRight, CalendarDays, TrendingUp } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { PricePoint } from '../data/priceHistory'
import { observationDay } from '../data/observationRecords'
import { cop, date } from '../lib/catalog'
import { Dropdown } from './Dropdown'

const palette = ['#ae3c25', '#514285', '#217453', '#7b5909', '#236584', '#7f375a']
const dateFromTime = (value: number) => date(new Date(value).toISOString().slice(0, 10))

function DailySnapshot({ observations, isStart }: { observations: PricePoint[]; isStart: boolean }) {
  const ranked = [...observations].sort((a, b) => a.price - b.price)
  const first = ranked[0]
  const today = first.date === observationDay(new Date().toISOString())

  return <div className="daily-prices">
    <div className="daily-prices-heading">
      <h3>{today ? 'Precios verificados hoy' : 'Precios verificados'}</h3>
      <time dateTime={first.date}>{date(first.date)}</time>
    </div>
    <ul>{ranked.map(item => <li key={item.series} className={item.price === first.price ? 'daily-best' : undefined}>
      <a href={item.source} target="_blank" rel="noopener noreferrer">{item.retailer} <ArrowUpRight size={13} /></a>
      {ranked.length > 1 && item.price === first.price && <span className="offer-badge">Mejor precio</span>}
      <strong>{cop(item.price)}</strong>
    </li>)}</ul>
    <p className="fineprint muted">{isStart
      ? (today && ranked.length === 1
        ? 'Aún estamos empezando a registrar este precio. Por ahora solo tenemos el valor verificado de hoy.'
        : 'Apenas estamos empezando a registrar precios. Mostraremos cómo cambian cuando tengamos registros de más fechas.')
      : 'Hay un solo día con precios registrados en el periodo elegido.'}</p>
  </div>
}

export default function PriceChart({ observations }: { observations: PricePoint[] }) {
  const [range, setRange] = useState(0)
  const chronological = [...observations].sort((a, b) => a.date.localeCompare(b.date))
  const latest = chronological.at(-1)
  const distinctDates = new Set(chronological.map(item => item.date)).size
  const cutoff = latest ? Date.parse(latest.date) - range * 86_400_000 : 0
  const visible = chronological.filter(item => !range || Date.parse(item.date) >= cutoff)
  const seriesNames = new Map(visible.map(item => [item.series, item.retailer]))
  const series = new Map([...seriesNames].map(([id, retailer], index) => [id, { retailer, key: `price${index}`, color: palette[index % palette.length] }]))
  const pointsByDate = new Map<string, Record<string, number>>()
  for (const item of visible) {
    const point = pointsByDate.get(item.date) ?? { day: Date.parse(item.date) }
    point[series.get(item.series)!.key] = item.price
    pointsByDate.set(item.date, point)
  }
  const points = [...pointsByDate.values()]
  const prices = visible.map(item => item.price)
  const lowest = visible.reduce<PricePoint | undefined>((min, item) => !min || item.price < min.price ? item : min, undefined)
  const lowestStores = lowest && [...new Set(visible.filter(item => item.price === lowest.price).map(item => item.retailer))]

  return <section className="section-card" aria-labelledby="history-title">
    <div className="section-heading">
      <div><h2 id="history-title"><TrendingUp /> Historial de precios</h2>
        {latest && points.length >= 2 && <p><CalendarDays size={15} /> Último precio registrado el {date(latest.date)}</p>}</div>
      {distinctDates >= 4 && <Dropdown className="history-range" label="Periodo" value={String(range)} onChange={value => setRange(Number(value))}
        options={ [['0', 'Todo el historial'], ['30', 'Últimos 30 días'], ['90', 'Últimos 90 días']] } />}
    </div>
    {points.length >= 2 ? <>
      <div className="observed"><span>Mínimo observado <strong>{cop(Math.min(...prices))}</strong></span><span>Máximo observado <strong>{cop(Math.max(...prices))}</strong></span></div>
      {lowestStores && <p className="fineprint">El precio más bajo de este periodo se registró en <strong>{lowestStores.join(' y ')}</strong>.</p>}
      <div className="chart">
        <ResponsiveContainer width="100%" height={290} minWidth={0} initialDimension={{ width: 600, height: 290 }}>
          <LineChart data={points} accessibilityLayer margin={{ top: 12, right: 20, bottom: 6, left: 4 }}>
            <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e6ded5" />
            <XAxis dataKey="day" type="number" domain={['dataMin', 'dataMax']} ticks={points.map(point => point.day)} tickFormatter={dateFromTime} minTickGap={28} fontSize={12} />
            <YAxis width={84} domain={['auto', 'auto']} tickFormatter={cop} fontSize={12} />
            <Tooltip formatter={value => typeof value === 'number' ? cop(value) : ''} labelFormatter={label => dateFromTime(Number(label))} />
            <Legend />
            {[...series.values()].map(({ key, retailer, color }) => <Line key={key} dataKey={key} name={retailer}
              stroke={color} strokeWidth={2} dot={{ r: 4 }} connectNulls isAnimationActive={false} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </> : visible.length ? <DailySnapshot observations={visible} isStart={distinctDates < 2} />
      : <p className="history-empty">Aún no tenemos un precio de venta verificado para esta configuración.</p>}
    {visible.length > 0 && <>
      <p className="muted fineprint">Estos precios corresponden a las fechas anotadas. Confirma el precio y la disponibilidad en la tienda.</p>
      <details className="history-sources"><summary>Ver registros y fuentes</summary>
        <ul>{visible.map(item => <li key={`${item.date}-${item.series}`}><a href={item.source} target="_blank" rel="noopener noreferrer">{item.retailer}</a> · {date(item.date)} · {cop(item.price)}</li>)}</ul>
      </details>
    </>}
  </section>
}
