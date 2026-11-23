import type { Laptop, Offer, Retailer } from './types'

const initialReview = '2026-11-23'

const alkosto = 'https://www.alkosto.com/'
const falabella = 'https://www.falabella.com.co/falabella-co/product/'
const cdn = 'https://cdn.dam.alkosto.com/products/'
const falabellaImage = 'https://media.falabella.com/falabellaCO/'

function offer(retailer: Retailer, url: string, price?: number, checkedAt = initialReview): Offer {
  return { retailer, url, price, checkedAt, availability: price === undefined ? 'sold-out' : 'available' }
}

function group(path: string, price?: number, alkomprar = false, checkedAt = initialReview) {
  return [
    offer('Alkosto', alkosto + path, price, checkedAt),
    offer('Ktronix', 'https://www.ktronix.com/' + path, price, checkedAt),
    ...(alkomprar ? [offer('Alkomprar', 'https://www.alkomprar.com/' + path, price, checkedAt)] : []),
  ]
}

const oled = 'computador-portatil-asus-vivobook-s-14-pulgadas-s5406a/p/4711636595759'
const acer = 'computador-portatil-acer-aspire-156-pulgadas-r5tw-amd/p/4711474986115'
const slimAmd = 'computador-portatil-lenovo-ideapad-slim-3-153-pulgadas/p/198155958762'
const slimIntel = 'computador-portatil-lenovo-ideapad-slim-3-153-pulgadas/p/199275512209'
const vivobook16 = 'computador-portatil-asus-vivobook-16-pulgadas-m1607ka/p/4711636208697'
const loq = 'computador-portatil-gamer-lenovo-loq-156-intel-core-i5-ram/p/199272381600'
const victus = 'computador-portatil-gamer-hp-victus-15-fa2009la-intel-core/p/198990788418'
const hp = falabella + '73729043/laphp-14-hy0050lar5-8g512g-2k14/73729043'
const lenovo14 = falabella + '73557831/port-14-ip-slim3-core5-16gb-512gb/73557831'
const acer16 = falabella + '73640954/port-16-wuxga-ci7-7167-8gb-512gb'
const asus15 = falabella + '73555269/port15-6vivobook-i5-16g-512gb-blue'
const victusF = falabella + '73397256/Laptop-Gaming-Victus-15-Fa2009La,-Intel-Core-I5,-8-Gb,-512-Gb-Ssd,-15.6,-Fhd-Windows-11-Home'
const home = 'Windows 11 Home'
const integrated = 'Integrada' as const
const wuxga = '1920 × 1200'
const fhd = '1920 × 1080'

export const laptops: Laptop[] = [
  {
    id: 'asus-vivobook-s14-oled', brand: 'ASUS', model: 'Vivobook S 14 OLED', sku: 'S5406SAL-SF312W', source: alkosto + oled,
    image: cdn + '4711636595759/4711636595759-001.webp', cpu: 'Intel Core Ultra 5 226V', cpuBrand: 'Intel', cpuCores: 8, ram: 16, storage: 512,
    size: 14, panel: 'OLED', resolution: wuxga, gamut: { space: 'DCI-P3', percent: 95 }, weight: 1.3,
    gpu: 'Intel Arc 130V', graphics: integrated, battery: 'Hasta 8 h según la ficha de la tienda', ports: 'USB-C, USB 3.2, HDMI y audio', os: home,
    reason: 'La pantalla OLED de amplia cobertura de color y el peso de 1,3 kg lo hacen atractivo para diseñar y llevar a diario.',
    pros: ['Cobertura de 95 % DCI-P3 documentada para la referencia', '16 GB de RAM en un equipo de 1,3 kg'],
    cons: ['512 GB pueden quedarse cortos para una biblioteca grande de video', 'Gráficos integrados para cargas gráficas moderadas'],
    offers: group(oled, 3_849_050, true),
  },
  {
    id: 'acer-aspire-lite-15-r5tw', brand: 'Acer', model: 'Aspire Lite 15', sku: 'AL15-21P-R5TW', source: alkosto + acer,
    image: cdn + '4711474986115/4711474986115-001.webp', cpu: 'AMD Ryzen 5 40', cpuBrand: 'AMD', cpuCores: 4, ram: 16, storage: 512,
    size: 15.6, resolution: fhd, weight: 1.45, graphics: integrated, battery: 'Hasta 8 h según la ficha de la tienda',
    ports: 'USB-C, USB-A, HDMI, microSD y audio', os: home,
    reason: 'Ofrece 16 GB de RAM y una pantalla de 15,6 pulgadas en un equipo de 1,45 kg.',
    pros: ['Memoria suficiente para multitarea habitual', 'Peso bajo para su tamaño'],
    cons: ['Cobertura de color sin verificar', 'Procesador de cuatro núcleos para trabajo moderado'],
    offers: group(acer, 2_299_030),
  },
  {
    id: 'lenovo-ideapad-slim-3-14-210h', brand: 'Lenovo', model: 'IdeaPad Slim 3 14', sku: 'Falabella 73557831 · Core 5 210H',
    source: lenovo14, image: falabellaImage + '73557831_01/public', cpu: 'Intel Core 5 210H', cpuBrand: 'Intel', cpuCores: 8, ram: 16, storage: 512,
    size: 14, panel: 'IPS', resolution: wuxga, graphics: integrated, os: 'Windows 11',
    reason: 'Combina un formato compacto de 14 pulgadas, una pantalla IPS y 16 GB de RAM para diseño y productividad.',
    pros: ['Panel IPS con espacio vertical adicional', '16 GB de RAM para alternar entre aplicaciones'],
    cons: ['Peso y autonomía sin verificar en esta configuración', 'Cobertura de color sin verificar'],
    offers: [offer('Falabella', lenovo14, 2_599_900)],
  },
  {
    id: 'lenovo-ideapad-slim-3-15ahp10', brand: 'Lenovo', model: 'IdeaPad Slim 3 15AHP10', sku: '83KA001NLM', source: alkosto + slimAmd,
    image: cdn + '198155958762/198155958762-001.webp', cpu: 'AMD Ryzen 5 8640HS', cpuBrand: 'AMD', cpuCores: 6, ram: 24, storage: 512,
    size: 15.3, resolution: wuxga, weight: 1.59, gpu: 'AMD Radeon 760M', graphics: integrated,
    battery: 'Hasta 7,6 h según la ficha de la tienda', ports: 'USB-C, USB-A, HDMI 2.1 y lector de tarjetas', os: home,
    reason: 'Los 24 GB de RAM dan margen para trabajar con varios proyectos y aplicaciones abiertas.',
    pros: ['24 GB de RAM', 'Pantalla de 15,3 pulgadas con resolución 1920 × 1200'],
    cons: ['Cobertura de color sin verificar', 'Menos compacto que un portátil de 14 pulgadas'],
    offers: group(slimAmd, 3_699_070),
  },
  {
    id: 'lenovo-ideapad-slim-3-15-320', brand: 'Lenovo', model: 'IdeaPad Slim 3 15,3″', sku: '83RR002YLM', source: alkosto + slimIntel,
    image: cdn + '199275512209/199275512209-001.webp', cpu: 'Intel Core 5 320', cpuBrand: 'Intel', cpuCores: 6, ram: 16, storage: 512,
    size: 15.3, resolution: wuxga, weight: 1.59, graphics: integrated, battery: 'Hasta 6 h según la ficha de la tienda',
    ports: 'USB-C, USB-A, HDMI, lector de tarjetas y audio', os: home,
    reason: 'Su pantalla de 15,3 pulgadas y sus 16 GB de RAM dan espacio para organizar herramientas y archivos.',
    pros: ['16 GB de RAM para uso creativo general', 'Pantalla 16:10 para aprovechar el espacio vertical'],
    cons: ['Cobertura de color sin verificar', 'Autonomía real sin mediciones comparables'],
    offers: group(slimIntel, 2_618_070),
  },
  {
    id: 'hp-omnibook-3-14', brand: 'HP', model: 'OmniBook 3 14', sku: '14-hy0050la · D6ZG3LA',
    source: 'https://www.hp.com/ec-es/products/laptops/product-details/product-specifications/2103792551',
    image: falabellaImage + '73729043_1/public', cpu: 'AMD Ryzen 5 40', cpuBrand: 'AMD', cpuCores: 4, ram: 8, storage: 512,
    size: 14, panel: 'IPS', resolution: wuxga, gamut: { space: 'sRGB', percent: 62.5 }, weight: 1.42, gpu: 'AMD Radeon 610M', graphics: integrated,
    battery: '41 Wh · 3 celdas', ports: 'USB-C, USB-A, HDMI y audio', os: home,
    reason: 'Una opción compacta para llevar a diario y trabajar con Canva, Figma y archivos sencillos.',
    pros: ['1,42 kg y pantalla IPS de 14 pulgadas', 'SSD de 512 GB'],
    cons: ['8 GB limitan los archivos grandes y la multitarea', '62,5 % sRGB según HP, limitado para color crítico'],
    offers: [offer('Falabella', hp, 2_099_000)],
  },
  {
    id: 'acer-aspire-lite-16', brand: 'Acer', model: 'Aspire Lite 16', sku: 'AL16-54P-7167', source: acer16,
    image: falabellaImage + '73640954_1/public', cpu: 'Intel Core i7 (serie U)', cpuBrand: 'Intel', ram: 16, storage: 512,
    size: 16, resolution: wuxga, graphics: integrated, battery: 'Hasta 8 h según la ficha de la tienda', os: 'Windows 11',
    reason: 'La pantalla de 16 pulgadas da espacio para lienzos, líneas de tiempo y paneles de herramientas.',
    pros: ['Pantalla de 16 pulgadas y 16 GB de RAM', 'Resolución 1920 × 1200'],
    cons: ['Peso y cobertura de color sin verificar', 'La ficha tiene datos inconsistentes sobre el procesador exacto'],
    offers: [offer('Falabella', acer16, 2_599_000)],
  },
  {
    id: 'asus-vivobook-15', brand: 'ASUS', model: 'Vivobook 15', sku: 'X1504VA-BQ4090W', source: asus15,
    image: falabellaImage + '73555269_01/public', cpu: 'Intel Core 5', cpuBrand: 'Intel', ram: 16, storage: 512,
    size: 15.6, resolution: fhd, graphics: integrated, battery: 'Hasta 8 h según la ficha de la tienda', os: home,
    reason: 'Los 16 GB de RAM y el precio publicado lo hacen una alternativa para proyectos gráficos de tamaño moderado.',
    pros: ['16 GB de RAM y SSD de 512 GB', 'Pantalla Full HD de 15,6 pulgadas'],
    cons: ['Modelo exacto del Core 5 sin verificar', 'Peso y cobertura de color sin verificar'],
    offers: [offer('Falabella', asus15, 2_399_900)],
  },
  {
    id: 'hp-victus-15-fa2009la', brand: 'HP', model: 'Victus 15', sku: '15-fa2009la · BA1U1LA',
    source: 'https://www.hp.com/ec-es/products/laptops/product-details/product-specifications/2102973335',
    image: falabellaImage + '73397256_1/public', cpu: 'Intel Core i5-13420H', cpuBrand: 'Intel', cpuCores: 8, ram: 8, storage: 512,
    size: 15.6, panel: 'IPS', resolution: fhd, gamut: { space: 'sRGB', percent: 62.5 }, weight: 2.29,
    gpu: 'NVIDIA GeForce RTX 3050 · 6 GB', graphics: 'Dedicada', battery: '52,5 Wh · 3 celdas', ports: 'USB-C, USB-A, HDMI 2.1, Ethernet y audio', os: home,
    reason: 'La RTX 3050 ayuda a explorar 3D básico. Los 8 GB de RAM y el peso de 2,29 kg son compromisos importantes.',
    pros: ['GPU dedicada con 6 GB de memoria gráfica', 'Panel IPS Full HD de 144 Hz'],
    cons: ['8 GB de RAM de fábrica', '2,29 kg y cobertura de color limitada'],
    offers: [offer('Falabella', victusF, 3_699_000), ...group(victus, 3_699_070, true)],
  },
  {
    id: 'lenovo-loq-15', brand: 'Lenovo', model: 'LOQ 15IRX9', sku: '83DV01B1LM', source: alkosto + loq,
    image: cdn + '199272381600/199272381600-001.webp', cpu: 'Intel Core i5-13450HX', cpuBrand: 'Intel', cpuCores: 10, ram: 16, storage: 512,
    size: 15.6, resolution: fhd, weight: 2.38, gpu: 'NVIDIA GeForce RTX 3050', graphics: 'Dedicada',
    battery: 'Hasta 7,5 h según la ficha de la tienda', ports: 'USB-C, USB-A, HDMI 2.1, Ethernet y audio', os: home,
    reason: 'Tiene 16 GB de RAM y GPU dedicada para explorar 3D, a cambio de más peso y un precio por encima del presupuesto inicial.',
    pros: ['16 GB de RAM y GPU dedicada', 'Conexión Ethernet y HDMI 2.1'],
    cons: ['Pesa 2,38 kg', 'Precio por encima del presupuesto inicial'],
    offers: group(loq, 4_399_070),
  },
  {
    id: 'asus-vivobook-16-m1607ka', brand: 'ASUS', model: 'Vivobook 16', sku: 'M1607KA-MB150W', source: alkosto + vivobook16,
    image: cdn + '4711636208697/4711636208697-001.webp', cpu: 'AMD Ryzen AI 5 330', cpuBrand: 'AMD', cpuCores: 4, ram: 16, storage: 512,
    size: 16, resolution: wuxga, weight: 1.68, graphics: integrated, battery: 'Hasta 8 h según la ficha de la tienda', ports: 'USB-C, USB-A, HDMI y audio', os: home,
    reason: 'Vale la pena tenerlo en cuenta si vuelve a estar disponible y quieres una pantalla amplia con 16 GB de RAM.',
    pros: ['Pantalla de 16 pulgadas y 16 GB de RAM', 'Dos conexiones USB-C según la ficha de la tienda'],
    cons: ['Agotado en las tiendas consultadas', 'Cobertura de color sin verificar'],
    offers: group(vivobook16),
  },
]

export const updated = laptops.flatMap(laptop => laptop.offers.map(offer => offer.checkedAt)).sort().at(-1) ?? initialReview
