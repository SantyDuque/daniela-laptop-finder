import { createRoot } from 'react-dom/client'
import PriceChart from '../src/components/PriceChart'
import type { PricePoint } from '../src/data/priceHistory'
import '../src/style.css'

// Synthetic browser-test fixture. This module is outside the production entry point.
const observations: PricePoint[] = [
  { series: 'alkosto', retailer: 'Alkosto', price: 2_800_000, date: '2025-01-10', source: 'https://example.com' },
  { series: 'alkosto', retailer: 'Alkosto', price: 2_850_000, date: '2025-02-10', source: 'https://example.com' },
  { series: 'ktronix', retailer: 'Ktronix', price: 2_860_000, date: '2025-02-10', source: 'https://example.com' },
  { series: 'ktronix', retailer: 'Ktronix', price: 2_790_000, date: '2025-03-10', source: 'https://example.com' },
  { series: 'alkosto', retailer: 'Alkosto', price: 2_650_000, date: '2025-06-10', source: 'https://example.com' },
]
createRoot(document.getElementById('chart')!).render(<PriceChart observations={observations} />)
