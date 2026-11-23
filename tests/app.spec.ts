import { expect, test, type Locator } from '@playwright/test'
import { laptops } from '../src/data/laptops'
import { observationsFor, offersFor } from '../src/data/priceHistory'
import { best, defaultFilters, filterCatalog } from '../src/lib/catalog'

const defaultResults = filterCatalog(laptops, defaultFilters).length
const comparisonIds = ['asus-vivobook-s14-oled', 'lenovo-ideapad-slim-3-15ahp10', 'acer-aspire-lite-15-r5tw']
const historyEmpty = 'Apenas estamos empezando a registrar precios. Pronto podrás ver cómo cambian con el tiempo.'

test('catalog filters, reset, buyer guide and preference persistence', async ({ page, isMobile }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Explorar portátiles' }).click()
  await expect(page).toHaveURL(/#catalogo/)
  const products = page.locator('.product-card')
  await expect(products).toHaveCount(defaultResults)
  await products.first().getByText('¿Cómo me serviría?').click()
  await expect(products.first().getByText('Espacio para tus archivos')).toBeVisible()

  if (isMobile) await page.getByRole('button', { name: 'Filtros', exact: true }).click()
  await page.getByRole('combobox', { name: 'Marca', exact: true }).selectOption('Acer')
  await expect(products).toHaveCount(2)
  await page.getByRole('combobox', { name: 'Peso máximo' }).selectOption('1.55')
  await expect(products).toHaveCount(1)
  await page.reload()
  await expect(products).toHaveCount(1)
  await page.getByRole('searchbox').fill('No existe')
  await expect(page.getByText('No encontramos portátiles con esos filtros')).toBeVisible()
  await page.getByRole('button', { name: 'Restablecer filtros' }).click()
  await expect(products).toHaveCount(defaultResults)
  await page.getByRole('combobox', { name: 'Ordenar por' }).selectOption('low')
  await expect(products.first()).toContainText(filterCatalog(laptops, { ...defaultFilters, sort: 'low' })[0].model)
})

test('comparison limit, persistence, removal and empty state', async ({ page }) => {
  await page.goto('/#catalogo')
  const add = page.getByRole('button', { name: /^Agregar a la comparación/ })
  for (let index = 0; index < 3; index++) await add.first().click()
  await add.first().click()
  await expect(page.getByText('Puedes comparar hasta 3 portátiles.')).toBeVisible()
  await page.reload()
  await expect(page.getByText('3 de 3 seleccionados')).toBeVisible()
  await page.getByRole('link', { name: 'Ver comparación' }).click()
  const table = page.getByRole('table')
  await expect(table.getByRole('columnheader')).toHaveCount(4)
  await expect(page.getByRole('heading', { name: '¿Cuál elegiría para Daniela?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Lo que cambia para ti' })).toBeVisible()
  await table.getByRole('button', { name: /^Quitar / }).first().click()
  await expect(table.getByRole('columnheader')).toHaveCount(3)
  await page.getByRole('button', { name: 'Limpiar comparación' }).click()
  await expect(page.getByText('Tu comparación está vacía')).toBeVisible()
})

async function expectAlignedHeader(table: Locator, expected: number) {
  const headers = table.locator('thead th').filter({ has: table.page().locator('.compare-product') })
  await expect(headers).toHaveCount(expected)
  const positions = await headers.evaluateAll(items => items.map(item => {
    const box = (selector: string) => item.querySelector(selector)!.getBoundingClientRect().toJSON()
    return {
      photo: box('.table-image'), image: box('img'), name: box('.compare-product-name'), sku: box('.sku'), remove: box('button'),
      objectFit: getComputedStyle(item.querySelector('img')!).objectFit,
    }
  }))
  for (const item of positions) {
    expect(item.image.bottom).toBeLessThanOrEqual(item.photo.bottom + 1)
    expect(item.photo.bottom).toBeLessThan(item.name.top)
    expect(item.name.bottom).toBeLessThanOrEqual(item.sku.top)
    expect(item.sku.bottom).toBeLessThanOrEqual(item.remove.top)
    expect(item.objectFit).toBe('contain')
    expect(Math.abs(item.photo.height - positions[0].photo.height)).toBeLessThan(2)
    expect(Math.abs(item.remove.bottom - positions[0].remove.bottom)).toBeLessThan(2)
  }
}

test('keeps portrait photos, long titles, model numbers and remove controls aligned with two and three laptops', async ({ page }) => {
  await page.route('https://cdn.dam.alkosto.com/products/**', route => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="200"><rect width="100" height="200" fill="teal"/></svg>',
  }))
  await page.addInitScript(ids => localStorage.setItem('daniela-comparison-v1', JSON.stringify(ids)), comparisonIds)
  await page.goto('/comparar')
  const table = page.getByRole('table')
  await expect(table.locator('thead img')).toHaveCount(3)
  await expectAlignedHeader(table, 3)
  const region = page.getByRole('region', { name: /Tabla de comparación/ })
  await page.getByRole('link', { name: 'Ver especificaciones lado a lado' }).click()
  await expect(region).toBeFocused()
  if (page.viewportSize()!.width < 650) {
    expect(await region.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width)
  await table.getByRole('button', { name: /^Quitar / }).last().click()
  await expectAlignedHeader(table, 2)
})

test('prices, marketplace seller, unverified data and progressive specifications', async ({ page }) => {
  await page.goto('/laptops/asus-vivobook-16-m1607ka')
  await expect(page.getByRole('heading', { name: 'Vivobook 16', exact: true })).toBeVisible()
  const offers = page.getByRole('region', { name: 'Precios por tienda' })
  const links = offers.getByRole('link', { name: /^Ver en la tienda/ })
  await expect(links).toHaveCount(6)
  await expect(offers.getByText('Marketplace · Vendido por Inteco MC SAS')).toBeVisible()
  await expect(offers.getByRole('link', { name: /^Ver en la tienda Falabella · Inteco/ })).toHaveAttribute('target', '_blank')
  await expect(offers.getByRole('link', { name: /Pronetsys/ })).toHaveAttribute('href', 'https://store.pronetsys.com.co/producto/asus-vivobook-16')
  await expect(offers.getByText('Agotado al consultar')).toHaveCount(3)
  await expect(offers.getByText('Precio sin verificar', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Para tu trabajo creativo' })).toBeVisible()
  await page.getByText('Especificaciones técnicas', { exact: true }).click()
  await expect(page.getByText('AMD Ryzen AI 5 330', { exact: true })).toBeVisible()
  await page.goto('/laptops/no-existe')
  await expect(page.getByRole('heading', { name: 'No encontramos este portátil' })).toBeVisible()
})

test('shows the one-day history and makes old prices explicit', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2030-01-01T15:00:00Z'))
  await page.goto('/laptops/hp-victus-15-fa2009la')
  await expect(page.getByText(historyEmpty)).toBeVisible()
  await expect(page.getByText('Precio anterior más bajo')).toBeVisible()
  const offers = page.getByRole('region', { name: 'Precios por tienda' })
  await expect(offers.getByText('Puede estar desactualizado')).toHaveCount(4)
  await expect(offers.getByText('Mejor precio encontrado')).toHaveCount(0)
  await expect(offers.getByText(/Puedes ahorrar/)).toHaveCount(0)
})

test('chart shows actual date spacing, retailer minimum and date-range controls', async ({ page }) => {
  await page.goto('/tests/chart.html')
  await expect(page.getByText('Mínimo observado')).toBeVisible()
  await expect(page.locator('.recharts-line-curve')).toHaveCount(2)
  await expect(page.getByText('El precio más bajo de este periodo se registró en', { exact: false })).toContainText('Alkosto')
  await page.getByRole('combobox', { name: 'Periodo' }).selectOption('30')
  await expect(page.getByText('Hay un solo registro en el periodo elegido.')).toBeVisible()
  await page.getByRole('combobox', { name: 'Periodo' }).selectOption('0')
  await expect(page.locator('.recharts-dot')).not.toHaveCount(0)
})

test('dataset keeps prices and observations attached to the exact listing', () => {
  expect(new Set(laptops.map(laptop => laptop.id)).size).toBe(laptops.length)
  const asus = laptops.find(laptop => laptop.id === 'asus-vivobook-16-m1607ka')!
  const exito = offersFor(asus).find(offer => offer.retailerId === 'exito')
  expect(exito?.price).toBeUndefined()
  expect(exito?.checkedAt).toBeUndefined()
  expect(best(asus)?.availability).not.toBe('sold-out')
  for (const laptop of laptops) {
    expect(new Set(laptop.offers.map(item => item.url)).size).toBe(laptop.offers.length)
    for (const item of observationsFor(laptop)) {
      expect(new URL(item.source).protocol).toBe('https:')
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isSafeInteger(item.price) && item.price > 0).toBe(true)
    }
  }
})
