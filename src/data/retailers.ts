export const retailers = {
  alkosto: { name: 'Alkosto', host: 'www.alkosto.com' },
  ktronix: { name: 'Ktronix', host: 'www.ktronix.com' },
  alkomprar: { name: 'Alkomprar', host: 'www.alkomprar.com' },
  falabella: { name: 'Falabella', host: 'www.falabella.com.co' },
  exito: { name: 'Éxito', host: 'www.exito.com' },
  pronetsys: { name: 'Pronetsys Store', host: 'store.pronetsys.com.co' },
  pixelbuy: { name: 'Pixel Buy', host: 'pixelbuy.com.co' },
  klikken: { name: 'Klikken Group', host: 'klikken.com.co' },
} as const

export type RetailerId = keyof typeof retailers
