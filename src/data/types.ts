import type { RetailerId } from './retailers.ts'

export type Availability = 'available' | 'sold-out'
export type RetailListing = {
  retailerId: RetailerId
  url: string
  marketplaceSeller?: string
  officialMarketplaceStore?: boolean
  paymentNote?: string
}

export type PriceObservation = {
  laptopId: string
  configurationId: string
  retailerId: RetailerId
  productUrl: string
  price: number | null
  observedAt: string
  currency: 'COP'
  availability?: Availability
  verifiedBy: 'manual' | 'structured-data'
}

export type Laptop = {
  id: string
  brand: string
  model: string
  sku: string
  source: string
  image?: string
  cpu: string
  cpuBrand: 'Intel' | 'AMD' | 'Qualcomm'
  cpuCores?: number
  ram: number
  storage: number
  size: number
  panel?: 'IPS' | 'OLED' | 'TN' | 'VA'
  resolution?: string
  gamut?: { space: 'sRGB' | 'DCI-P3' | 'NTSC'; percent: number }
  weight?: number
  gpu?: string
  graphics?: 'Integrada' | 'Dedicada'
  battery?: string
  ports?: string
  os?: string
  reason: string
  pros: string[]
  cons: string[]
  offers: RetailListing[]
}
