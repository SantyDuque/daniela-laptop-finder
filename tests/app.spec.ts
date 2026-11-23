import { expect, test, type Locator, type Page } from '@playwright/test'
import { laptops } from '../src/data/laptops'
import { observationsFor, offersFor } from '../src/data/priceHistory'
import { best, defaultFilters, filterCatalog, isVivobook, recommended } from '../src/lib/catalog'

const defaultResults = filterCatalog(laptops, defaultFilters).length
const comparisonIds = ['asus-vivobook-s14-oled', 'lenovo-ideapad-slim-3-15ahp10', 'acer-aspire-lite-15-r5tw']
const historyStart = 'Apenas estamos empezando a registrar precios. Mostraremos cómo cambian cuando tengamos registros de más fechas.'

async function choose(page: Page, label: string, option: string) {
  await page.getByRole('combobox', { name: label, exact: true }).click()
  await page.getByRole('option', { name: option, exact: true }).click()
}

test('catalog filters, reset, buyer guide and preference persistence', async ({ page, isMobile }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Explorar portátiles' }).click()
  await expect(page).toHaveURL(/#catalogo/)
  const products = page.locator('.product-card')
  await expect(products).toHaveCount(defaultResults)
  await products.first().getByText('¿Cómo me serviría?').click()
  await expect(products.first().getByText('Espacio para tus archivos')).toBeVisible()

  if (isMobile) await page.getByRole('button', { name: 'Filtros', exact: true }).click()
  await expect(page.locator('select')).toHaveCount(0)
  await choose(page, 'Marca', 'Acer')
  await expect(products).toHaveCount(2)
  await choose(page, 'Peso máximo', '1,55 kg')
  await expect(products).toHaveCount(1)
  await page.reload()
  await expect(products).toHaveCount(1)
  await page.getByRole('searchbox').fill('No existe')
  await expect(page.getByText('No encontramos portátiles con esos filtros')).toBeVisible()
  await page.getByRole('button', { name: 'Restablecer filtros' }).click()
  await expect(products).toHaveCount(defaultResults)
  await choose(page, 'Ordenar por', 'Menor precio')
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
  await expect(links).toHaveCount(7)
  await expect(offers.getByText('Marketplace · Vendido por Inteco MC SAS')).toBeVisible()
  await expect(offers.getByRole('link', { name: /^Ver en la tienda Falabella · Inteco/ })).toHaveAttribute('target', '_blank')
  await expect(offers.getByRole('link', { name: /Pronetsys/ })).toHaveAttribute('href', 'https://store.pronetsys.com.co/producto/asus-vivobook-16')
  await expect(offers.getByText('Agotado al consultar')).toHaveCount(3)
  await expect(offers.getByText('Precio sin verificar', { exact: true })).toHaveCount(2)
  await expect(offers.getByText(/Vendido por Ultra Gamer.*Tienda oficial en Mercado Libre/)).toBeVisible()
  await offers.getByText('¿Y si lo compro en Amazon?').click()
  await expect(offers.getByText(/cargos de importación/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Para tu trabajo creativo' })).toBeVisible()
  await page.getByText('Especificaciones técnicas', { exact: true }).click()
  await expect(page.getByText('AMD Ryzen AI 5 330', { exact: true })).toBeVisible()
  await page.goto('/laptops/no-existe')
  await expect(page.getByRole('heading', { name: 'No encontramos este portátil' })).toBeVisible()
})

test('shows the one-day history and makes old prices explicit', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2030-01-01T15:00:00Z'))
  await page.goto('/laptops/hp-victus-15-fa2009la')
  await expect(page.getByText(historyStart)).toBeVisible()
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
  await expect(page.locator('select')).toHaveCount(0)
  await choose(page, 'Periodo', 'Últimos 30 días')
  await expect(page.getByText('Hay un solo día con precios registrados en el periodo elegido.')).toBeVisible()
  await choose(page, 'Periodo', 'Todo el historial')
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

test('Vivobook shortcut includes cheaper models and keeps the product image in frame', async ({ page }) => {
  await page.route('https://media.falabella.com/**', route => route.fulfill({
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="288" height="360"><rect width="288" height="360" fill="teal"/></svg>',
  }))
  await page.goto('/#catalogo')
  await page.getByRole('button', { name: 'Ver Vivobook de todos los precios' }).click()
  const products = page.locator('.product-card')
  await expect(products).toHaveCount(8)
  const go = products.filter({ hasText: 'E1404FA-EB1395W' })
  await expect(go).toBeVisible()
  const frame = go.locator('.product-art')
  const photo = frame.locator('img')
  await expect(photo).toBeVisible()
  const sizing = await photo.evaluate(img => ({
    photo: img.getBoundingClientRect().toJSON(),
    frame: img.parentElement!.getBoundingClientRect().toJSON(),
    fit: getComputedStyle(img).objectFit,
  }))
  expect(sizing.fit).toBe('contain')
  expect(sizing.frame.height).toBeGreaterThan(150)
  expect(sizing.photo.bottom).toBeLessThanOrEqual(sizing.frame.bottom)
  expect(sizing.photo.left).toBeGreaterThanOrEqual(sizing.frame.left)
  expect(sizing.photo.right).toBeLessThanOrEqual(sizing.frame.right)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width)
})

test('dropdown supports keyboard selection, Escape, and return focus', async ({ page }) => {
  await page.goto('/#catalogo')
  const sorting = page.getByRole('combobox', { name: 'Ordenar por' })
  await sorting.focus()
  await sorting.press('ArrowDown')
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(sorting).toBeFocused()
  await sorting.press('Enter')
  await page.keyboard.press('End')
  await page.keyboard.press('Enter')
  await expect(sorting).toHaveText('Mejor relación calidad-precio')
  await expect(sorting).toBeFocused()
})

test('same-day price snapshot gives the verified retailer, spread and date', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-23T17:00:00Z'))
  await page.goto('/laptops/asus-vivobook-go-14')
  const history = page.getByRole('region', { name: 'Historial de precios' })
  await expect(history.getByRole('heading', { name: 'Precios verificados hoy' })).toBeVisible()
  await expect(history.locator('.daily-best')).toContainText('Jumbo')
  await expect(history.locator('.daily-best')).toContainText('$ 1.499.900')
  await expect(history.locator('.daily-prices time')).toHaveAttribute('dateTime', '2026-11-23')
  await expect(history.locator('.recharts-line-curve')).toHaveCount(0)
  const offers = page.getByRole('region', { name: 'Precios por tienda' })
  await expect(offers.locator('.offer-range')).toContainText('Falabella')
  await expect(offers.locator('.offer-range')).toContainText('$ 150.000')
  await page.goto('/laptops/asus-vivobook-14-x1404va')
  await expect(history.getByText(/Por ahora solo tenemos el valor verificado de hoy/)).toBeVisible()
  await expect(history.locator('.daily-prices')).toContainText('Compumarket BGA')
})

test('Vivobook preference breaks near-ties without outweighing substantially better fit', () => {
  const vivobook = laptops.find(laptop => laptop.id === 'asus-vivobook-16-x1607ca')!
  const other = { ...vivobook, brand: 'Lenovo', model: 'IdeaPad' }
  expect(laptops.filter(isVivobook)).toHaveLength(8)
  expect(recommended(vivobook) - recommended(other)).toBe(3)
  expect(recommended({ ...other, weight: 1.3 })).toBeGreaterThan(recommended(vivobook))
})
