import type { Laptop } from '../data/types'
import { best, cop, DEFAULT_MAX, DEFAULT_MIN, designScreen, portable, recommended, storage, threeD, weight } from './catalog'

export function practicalFacts(laptop: Laptop) {
  return {
    carrying: laptop.weight === undefined ? 'El peso de esta versión sigue por confirmar.'
      : portable(laptop) ? `Con ${weight(laptop.weight)}, es fácil de llevar a diario.`
      : laptop.weight >= 2 ? `Pesa ${weight(laptop.weight)}. Se siente más cómodo si trabajas principalmente en un escritorio.`
      : `Pesa ${weight(laptop.weight)}. Se puede llevar, aunque se siente más en el morral que uno de 14 pulgadas liviano.`,
    memory: laptop.ram >= 16 ? `${laptop.ram} GB de memoria para trabajar con varias aplicaciones abiertas.`
      : `${laptop.ram} GB de memoria para tareas sencillas. Muchas pestañas o archivos con capas pueden hacer que se sienta lento.`,
    space: `${storage(laptop.storage)} de almacenamiento para programas, documentos y proyectos.`,
    display: designScreen(laptop) ? (laptop.panel === 'OLED'
      ? 'Pantalla OLED de alto contraste y amplia cobertura de color. Para trabajos donde el color deba ser exacto, conviene calibrarla.'
      : 'La pantalla reproduce una gama amplia de colores. Conviene calibrarla si necesitas que el color sea exacto.')
      : laptop.gamut ? 'La pantalla sirve para uso diario. Su cobertura de color es limitada para trabajos que exigen tonos precisos.'
      : laptop.panel === 'IPS' ? 'Pantalla IPS con una imagen más estable al mirarla de lado. Falta confirmar qué tan fieles son sus colores.'
      : 'Sirve para revisar diseños y documentos. Falta confirmar qué tan fieles son sus colores.',
    work: threeD(laptop) ? 'Sus gráficos dedicados ayudan a mover escenas 3D sencillas. La memoria y el tamaño del proyecto marcan el límite.'
      : laptop.ram >= 16 ? 'Buena base para Canva, Figma y archivos de Photoshop o Illustrator de tamaño moderado.'
      : 'Adecuado para Canva, Figma y retoques sencillos. Los proyectos más pesados pueden exigir más memoria.',
    buyer: threeD(laptop) ? 'Quien quiera explorar 3D básico y trabaje sobre todo en un escritorio.'
      : designScreen(laptop) ? 'Quien quiera revisar colores en sus diseños y priorice la pantalla.'
      : portable(laptop) ? 'Quien lleve el portátil a diario y haga diseño o trabajo de oficina.'
      : laptop.size >= 15 ? 'Quien prefiera espacio para tener el lienzo y las herramientas a la vista.'
      : 'Quien busque un equipo compacto para diseñar y trabajar con documentos.',
  }
}

export function priceAdvice(laptop: Laptop) {
  const offer = best(laptop)
  if (!offer) return 'Falta un precio de tienda para saber si vale la pena.'
  if (offer.stale) return 'Confirma el precio en la tienda antes de decidir si vale la pena.'
  if (offer.price > DEFAULT_MAX) return 'Supera el presupuesto de Daniela. Conviene comparar con alternativas que cubran el mismo uso.'
  if (offer.price <= 2_600_000 && laptop.ram >= 16) return 'Cerca del extremo bajo del presupuesto, con memoria suficiente para diseño cotidiano.'
  if (offer.price <= 2_600_000) return 'Deja margen en el presupuesto si tu trabajo se concentra en tareas sencillas.'
  if (designScreen(laptop)) return 'El precio tiene más sentido si vas a aprovechar la calidad de la pantalla.'
  if (threeD(laptop)) return 'El precio tiene más sentido si vas a aprovechar los gráficos para 3D.'
  return 'Cabe en el presupuesto. Compara su pantalla y peso con otros equipos antes de pagar más.'
}

export function comparePrice(laptop: Laptop, selected: Laptop[]) {
  const price = best(laptop)
  const others = selected.filter(item => item.id !== laptop.id)
    .flatMap(item => {
      const offer = best(item)
      return offer && !offer.stale ? [{ item, price: offer.price }] : []
    }).sort((a, b) => a.price - b.price)
  if (!price || price.stale) return 'Falta un precio reciente para compararlo con los demás.'
  if (!others.length) return 'Un segundo precio revisado permitiría comparar cuánto pagarías.'
  const other = others[0]
  const delta = price.price - other.price
  const name = `${other.item.brand} ${other.item.model}`
  if (Math.abs(delta) < 1_000) return `Cuesta casi lo mismo que el ${name}.`
  return `En los precios revisados, cuesta ${cop(Math.abs(delta))} ${delta > 0 ? 'más' : 'menos'} que el ${name}.`
}

export function pickForDaniela(selected: Laptop[]) {
  const eligible = selected.flatMap(laptop => {
    const offer = best(laptop)
    return offer && !offer.stale && offer.price >= DEFAULT_MIN && offer.price <= DEFAULT_MAX
      ? [{ laptop, price: offer.price }] : []
  }).sort((a, b) => recommended(b.laptop) - recommended(a.laptop))
  const everyday = eligible.filter(({ laptop }) => laptop.ram >= 16 && laptop.weight !== undefined && laptop.weight < 2)
  const pick = everyday[0] ?? eligible.find(({ laptop }) => laptop.ram >= 16) ?? eligible[0]
  if (!pick) return
  const cheaper = eligible.filter(item => item.price < pick.price).sort((a, b) => a.price - b.price)
  const alternative = cheaper.find(item => everyday.includes(item)) ?? cheaper[0]
  const screenAlternative = eligible.find(item => item.laptop.id !== pick.laptop.id && designScreen(item.laptop))
  return { ...pick, alternative, screenAlternative: designScreen(pick.laptop) ? undefined : screenAlternative }
}
