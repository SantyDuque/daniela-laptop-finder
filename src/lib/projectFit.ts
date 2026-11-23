import { creativeIds, type CreativeId } from '../data/creative'
import type { Laptop } from '../data/types'

export type FitLevel = 'strong' | 'good' | 'limited' | 'unknown'
type Assessment = { level: FitLevel; points: number; text: string }

export const fitLabels: Record<FitLevel, string> = {
  strong: 'Muy buena opción',
  good: 'Buena opción',
  limited: 'Con limitaciones',
  unknown: 'Información insuficiente',
}

export function hasWideGamut(laptop: Laptop) {
  const color = laptop.gamut
  return Boolean(color && (color.space === 'sRGB' || color.space === 'DCI-P3') && color.percent >= 95)
}

function graphicFit(laptop: Laptop): Assessment {
  const { gamut } = laptop
  if (laptop.ram < 16) return { level: 'limited', points: 31, text:
    `Para logotipos como P autos y retoques sencillos, sus ${laptop.ram} GB pueden alcanzar. Las piezas con muchas capas o varias apps abiertas pueden pedir más memoria.` }
  if (gamut && hasWideGamut(laptop)) return { level: 'strong', points: 92, text:
    `Para piezas como P autos o las etiquetas de XPLOD, su pantalla cubre ${gamut.percent} % de ${gamut.space} y tienes ${laptop.ram} GB para alternar entre apps. Calibra la pantalla si necesitas precisión de color.` }
  const display = laptop.gamut
    ? 'La cobertura de color documentada es limitada para trabajos que exigen tonos precisos.'
    : laptop.panel === 'OLED'
      ? 'La pantalla OLED ofrece alto contraste. La cobertura de color de esta referencia sigue por confirmar.'
      : 'Para trabajos de color preciso, falta confirmar qué colores puede reproducir la pantalla.'
  return { level: 'good', points: laptop.panel === 'IPS' || laptop.panel === 'OLED' ? 69 : 58, text:
    `Sus ${laptop.ram} GB dan espacio para trabajar en identidades o empaques de tamaño moderado. ${display}` }
}

export function solidworksCaveat(laptop: Laptop) {
  if (laptop.cpuBrand === 'Qualcomm') return 'La versión de escritorio de SOLIDWORKS requiere Intel o AMD de 64 bits. Este equipo usa ARM.'
  const ram = laptop.ram < 16 ? 'SOLIDWORKS de escritorio pide al menos 16 GB y recomienda 32 GB.' : ''
  if (laptop.os?.includes('Home')) return [ram, 'SOLIDWORKS de escritorio no admite Windows Home. Revisa también la certificación de la tarjeta gráfica y su controlador.'].filter(Boolean).join(' ')
  if (ram) return ram
  if (!laptop.os?.includes('Pro') && !laptop.os?.includes('Enterprise')) return 'Para SOLIDWORKS, confirma la edición de Windows y la certificación de la tarjeta gráfica y su controlador.'
  return 'Para SOLIDWORKS, verifica la certificación de la tarjeta gráfica y su controlador para tu versión.'
}

function productFit(laptop: Laptop): Assessment {
  if (laptop.cpuBrand === 'Qualcomm') return { level: 'limited', points: 4, text:
    `Podría servir para presentar conceptos de producto si tus herramientas funcionan en Windows ARM. ${solidworksCaveat(laptop)}` }
  if (laptop.ram < 16) return { level: 'limited', points: laptop.graphics === 'Dedicada' ? 27 : 12, text:
    `${laptop.graphics === 'Dedicada' ? 'Sus gráficos dedicados pueden ayudar a mover una escena sencilla.' : 'Puede servir para revisar bocetos y modelos sencillos.'} Con ${laptop.ram} GB tendrás menos margen para ensamblajes grandes. ${solidworksCaveat(laptop)}` }
  if (!laptop.graphics) return { level: 'unknown', points: 17, text:
    `Para proyectos como VORTEX, falta verificar qué gráficos trae esta versión y cómo se comporta durante sesiones largas. ${solidworksCaveat(laptop)}` }
  if (laptop.graphics === 'Dedicada' && laptop.gpu) return { level: 'good', points: laptop.ram >= 32 ? 92 : 79, text:
    `La ${laptop.gpu} y ${laptop.ram} GB pueden ayudar al mover modelos como los de XPLOD. ${laptop.ram >= 32 ? 'Esa memoria da más margen con archivos grandes.' : 'Para archivos grandes, 32 GB dan más margen.'} Consulta pruebas de refrigeración si vas a modelar durante sesiones largas. ${solidworksCaveat(laptop)}` }
  if (laptop.graphics === 'Dedicada') return { level: 'unknown', points: 21, text:
    `La ficha indica gráficos dedicados. Falta identificar la tarjeta para saber cuánto margen tendría al modelar. ${solidworksCaveat(laptop)}` }
  return { level: 'limited', points: laptop.ram >= 24 ? 42 : 35, text:
    `Sus gráficos integrados pueden servir para piezas sencillas y presentaciones de producto. Los gráficos pueden quedarse cortos con modelos complejos. ${solidworksCaveat(laptop)}` }
}

function uxFit(laptop: Laptop): Assessment {
  if (laptop.ram < 16) return { level: 'limited', points: 39, text:
    `Puedes explorar prototipos sencillos. Con ${laptop.ram} GB, los archivos grandes y muchas pestañas abiertas pueden sentirse lentos.` }
  const verticalSpace = Number(laptop.resolution?.split('×')[1]) >= 1200
  return { level: verticalSpace ? 'strong' : 'good', points: (verticalSpace ? 88 : 69) + (laptop.ram >= 24 ? 4 : 0), text:
    `Para un rediseño como el del hospital, sus ${laptop.ram} GB ayudan a mantener el prototipo, la documentación y el navegador abiertos. ${verticalSpace ? 'La pantalla da más espacio vertical para ver el lienzo y las herramientas.' : 'Revisa que el tamaño de pantalla te resulte cómodo para trabajar en varios paneles.'}` }
}

export function assessProjects(laptop: Laptop): Record<CreativeId, Assessment> {
  return { graphic: graphicFit(laptop), product: productFit(laptop), ux: uxFit(laptop) }
}

export function preferredProjectOrder(priorities: readonly CreativeId[]) {
  return [...priorities, ...creativeIds.filter(id => !priorities.includes(id))]
}

export function cardProjectNotes(laptop: Laptop, priorities: readonly CreativeId[]) {
  const fit = assessProjects(laptop)
  const ordered = preferredProjectOrder(priorities)
  if (priorities.length === 1) return [fit[priorities[0]].text]
  const pool = priorities.length ? priorities : ordered
  const strongest = [...pool].sort((a, b) => fit[b].points - fit[a].points)[0]
  const caution = priorities.find(id => id !== strongest && ['limited', 'unknown'].includes(fit[id].level))
  return caution ? [fit[strongest].text, fit[caution].text] : [fit[strongest].text]
}
