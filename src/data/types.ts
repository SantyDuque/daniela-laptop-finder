export type Retailer = 'Alkosto' | 'Ktronix' | 'Alkomprar' | 'Falabella' | 'HP Colombia' | 'Lenovo Colombia'
export type Offer = {
  retailer: Retailer
  url: string
  price?: number
  checkedAt: string
  availability?: 'available' | 'sold-out'
}
export type PriceObservation = {
  retailer: Retailer
  price: number
  date: string
  source: string
}
export type Laptop = {
  id: string
  brand: string
  model: string
  sku: string
  source: string
  image?: string
  cpu: string
  cpuBrand: 'Intel' | 'AMD'
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
  offers: Offer[]
}
