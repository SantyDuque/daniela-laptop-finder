import { expect, test } from '@playwright/test'
import { laptops } from '../src/data/laptops'
import { observationsFor } from '../src/data/priceHistory'
import { best, defaultFilters, filterCatalog } from '../src/lib/catalog'

test('catalog filters, reset and preference persistence', async ({ page, isMobile }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Explorar portátiles' }).click()
  await expect(page).toHaveURL(/#catalogo/)
  const products = page.locator('.product-card')
  await expect(products).toHaveCount(9)

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
  await expect(products).toHaveCount(9)
  await page.getByRole('combobox', { name: 'Ordenar por' }).selectOption('low')
  await expect(products.first()).toContainText('OmniBook 3 14')
})

test('comparison limit, persistence, removal and mobile scrolling', async ({ page, isMobile }) => {
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
  if (isMobile) {
    const region = page.getByRole('region', { name: /Tabla de comparación/ })
    expect(await region.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width)
  }
  await page.getByRole('button', { name: /^Quitar / }).first().click()
  await expect(table.getByRole('columnheader')).toHaveCount(3)
  await page.getByRole('button', { name: 'Limpiar comparación' }).click()
  await expect(page.getByText('Tu comparación está vacía')).toBeVisible()
})

test('details, verified offer links and price snapshot', async ({ page }) => {
  await page.goto('/laptops/hp-victus-15-fa2009la')
  await expect(page.getByRole('heading', { name: 'Victus 15', exact: true })).toBeVisible()
  const links = page.getByRole('link', { name: /^Ver oferta/ })
  await expect(links).toHaveCount(4)
  await expect(links.first()).toHaveAttribute('href', /^https:\/\/www\.falabella\.com\.co\//)
  await expect(links.first()).toHaveAttribute('target', '_blank')
  await expect(page.getByText('Diferencia entre la oferta más baja y la más alta: $ 70.')).toBeVisible()
  await expect(page.getByText('Aún no hay suficientes registros para mostrar la evolución del precio.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Para tu trabajo creativo' })).toBeVisible()
  await page.goto('/laptops/asus-vivobook-16-m1607ka')
  await expect(page.getByText('Agotado al consultar', { exact: false })).toHaveCount(2)
  await expect(page.getByText('Aún no hay suficientes registros para mostrar la evolución del precio.')).toBeVisible()
  await page.goto('/laptops/no-existe')
  await expect(page.getByRole('heading', { name: 'No encontramos este portátil' })).toBeVisible()
})

test('chart renders multiple retailers, data points and date-range controls', async ({ page }) => {
  await page.goto('/tests/chart.html')
  await expect(page.getByText('Mínimo observado')).toBeVisible()
  await expect(page.locator('.recharts-line-curve')).toHaveCount(2)
  await expect(page.getByRole('listitem').filter({ hasText: 'Alkosto' })).toBeVisible()
  await page.getByRole('combobox', { name: 'Periodo' }).selectOption('30')
  await expect(page.getByText('Hay un solo registro en el periodo elegido.')).toBeVisible()
  await page.getByRole('combobox', { name: 'Periodo' }).selectOption('0')
  await expect(page.locator('.recharts-dot')).not.toHaveCount(0)
})

test('dataset keeps prices and observations attached to the exact listing', () => {
  expect(new Set(laptops.map(laptop => laptop.id)).size).toBe(laptops.length)
  expect(filterCatalog(laptops, { ...defaultFilters, gpu: 'Dedicada' }).map(laptop => laptop.id)).toEqual(['hp-victus-15-fa2009la'])
  expect(best(laptops.find(laptop => laptop.id === 'asus-vivobook-16-m1607ka')!)).toBeUndefined()
  for (const laptop of laptops) {
    expect(new Set(laptop.offers.map(item => item.url)).size).toBe(laptop.offers.length)
    for (const item of observationsFor(laptop)) {
      expect(new URL(item.source).protocol).toBe('https:')
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isSafeInteger(item.price) && item.price > 0).toBe(true)
    }
  }
})
