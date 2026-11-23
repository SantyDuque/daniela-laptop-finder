import type { Laptop } from './types.ts'
import { extraVivobooks } from './vivobooks.ts'

const alkosto = 'https://www.alkosto.com/'
const falabella = 'https://www.falabella.com.co/falabella-co/product/'
const cdn = 'https://cdn.dam.alkosto.com/products/'
const falabellaImage = 'https://media.falabella.com/falabellaCO/'

function group(path: string, alkomprar = false): Laptop['offers'] {
  return [
    { retailerId: 'alkosto', url: alkosto + path },
    { retailerId: 'ktronix', url: 'https://www.ktronix.com/' + path },
    ...(alkomprar ? [{ retailerId: 'alkomprar' as const, url: 'https://www.alkomprar.com/' + path }] : []),
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
    offers: group(oled, true),
  },
  {
    id: 'acer-aspire-lite-15-r5tw', brand: 'Acer', model: 'Aspire Lite 15', sku: 'AL15-21P-R5TW', source: alkosto + acer,
    image: cdn + '4711474986115/4711474986115-001.webp', cpu: 'AMD Ryzen 5 40', cpuBrand: 'AMD', cpuCores: 4, ram: 16, storage: 512,
    size: 15.6, resolution: fhd, weight: 1.45, graphics: integrated, battery: 'Hasta 8 h según la ficha de la tienda',
    ports: 'USB-C, USB-A, HDMI, microSD y audio', os: home,
    reason: 'Da espacio para ver el diseño y las herramientas, y pesa 1,45 kg para llevarlo a diario.',
    pros: ['Memoria suficiente para multitarea habitual', 'Peso bajo para su tamaño'],
    cons: ['Cobertura de color sin verificar', 'Procesador de cuatro núcleos para trabajo moderado'],
    offers: group(acer),
  },
  {
    id: 'lenovo-ideapad-slim-3-14-210h', brand: 'Lenovo', model: 'IdeaPad Slim 3 14', sku: 'Falabella 73557831 · Core 5 210H',
    source: lenovo14, image: falabellaImage + '73557831_01/public', cpu: 'Intel Core 5 210H', cpuBrand: 'Intel', cpuCores: 8, ram: 16, storage: 512,
    size: 14, panel: 'IPS', resolution: wuxga, graphics: integrated, os: 'Windows 11',
    reason: 'Su pantalla de 14 pulgadas cabe en un escritorio pequeño y sus 16 GB de memoria dan margen para diseñar con varias aplicaciones abiertas.',
    pros: ['Panel IPS con espacio vertical adicional', '16 GB de RAM para alternar entre aplicaciones'],
    cons: ['Peso y autonomía sin verificar en esta configuración', 'Cobertura de color sin verificar'],
    offers: [{ retailerId: 'falabella', url: lenovo14 }],
  },
  {
    id: 'lenovo-ideapad-slim-3-15ahp10', brand: 'Lenovo', model: 'IdeaPad Slim 3 15AHP10', sku: '83KA001NLM', source: alkosto + slimAmd,
    image: cdn + '198155958762/198155958762-001.webp', cpu: 'AMD Ryzen 5 8640HS', cpuBrand: 'AMD', cpuCores: 6, ram: 24, storage: 512,
    size: 15.3, resolution: wuxga, weight: 1.59, gpu: 'AMD Radeon 760M', graphics: integrated,
    battery: 'Hasta 7,6 h según la ficha de la tienda', ports: 'USB-C, USB-A, HDMI 2.1 y lector de tarjetas', os: home,
    reason: 'Con 24 GB de memoria puedes trabajar con varios proyectos y aplicaciones abiertas.',
    pros: ['24 GB de RAM', 'Pantalla de 15,3 pulgadas con resolución 1920 × 1200'],
    cons: ['Cobertura de color sin verificar', 'Menos compacto que un portátil de 14 pulgadas'],
    offers: group(slimAmd),
  },
  {
    id: 'lenovo-ideapad-slim-3-15-320', brand: 'Lenovo', model: 'IdeaPad Slim 3 15,3″', sku: '83RR002YLM', source: alkosto + slimIntel,
    image: cdn + '199275512209/199275512209-001.webp', cpu: 'Intel Core 5 320', cpuBrand: 'Intel', cpuCores: 6, ram: 16, storage: 512,
    size: 15.3, resolution: wuxga, weight: 1.59, graphics: integrated, battery: 'Hasta 6 h según la ficha de la tienda',
    ports: 'USB-C, USB-A, HDMI, lector de tarjetas y audio', os: home,
    reason: 'La pantalla te deja ver más del diseño y sus 16 GB de memoria ayudan al alternar entre aplicaciones.',
    pros: ['16 GB de RAM para uso creativo general', 'Pantalla 16:10 para aprovechar el espacio vertical'],
    cons: ['Cobertura de color sin verificar', 'Autonomía real sin mediciones comparables'],
    offers: group(slimIntel),
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
    offers: [{ retailerId: 'falabella', url: hp }],
  },
  {
    id: 'acer-aspire-lite-16', brand: 'Acer', model: 'Aspire Lite 16', sku: 'AL16-54P-7167', source: acer16,
    image: falabellaImage + '73640954_1/public', cpu: 'Intel Core i7 (serie U)', cpuBrand: 'Intel', ram: 16, storage: 512,
    size: 16, resolution: wuxga, graphics: integrated, battery: 'Hasta 8 h según la ficha de la tienda', os: 'Windows 11',
    reason: 'La pantalla de 16 pulgadas da espacio para lienzos, líneas de tiempo y paneles de herramientas.',
    pros: ['Pantalla de 16 pulgadas y 16 GB de RAM', 'Resolución 1920 × 1200'],
    cons: ['Falta confirmar qué tan pesado es y qué tan fieles son los colores de la pantalla', 'La ficha tiene datos inconsistentes sobre el procesador exacto'],
    offers: [{ retailerId: 'falabella', url: acer16 }],
  },
  {
    id: 'asus-vivobook-15', brand: 'ASUS', model: 'Vivobook 15', sku: 'X1504VA-BQ4090W', source: asus15,
    image: falabellaImage + '73555269_01/public', cpu: 'Intel Core 5', cpuBrand: 'Intel', ram: 16, storage: 512,
    size: 15.6, resolution: fhd, graphics: integrated, battery: 'Hasta 8 h según la ficha de la tienda', os: home,
    reason: 'Sus 16 GB de memoria dan margen para diseñar y tener abiertas otras aplicaciones mientras trabajas.',
    pros: ['16 GB de RAM y SSD de 512 GB', 'Pantalla Full HD de 15,6 pulgadas'],
    cons: ['Falta confirmar el peso y si la pantalla reproduce bien los colores', 'La tienda no especifica la versión exacta del procesador'],
    offers: [{ retailerId: 'falabella', url: asus15 }],
  },
  {
    id: 'hp-victus-15-fa2009la', brand: 'HP', model: 'Victus 15', sku: '15-fa2009la · BA1U1LA',
    source: 'https://www.hp.com/ec-es/products/laptops/product-details/product-specifications/2102973335',
    image: falabellaImage + '73397256_1/public', cpu: 'Intel Core i5-13420H', cpuBrand: 'Intel', cpuCores: 8, ram: 8, storage: 512,
    size: 15.6, panel: 'IPS', resolution: fhd, gamut: { space: 'sRGB', percent: 62.5 }, weight: 2.29,
    gpu: 'NVIDIA GeForce RTX 3050 · 6 GB', graphics: 'Dedicada', battery: '52,5 Wh · 3 celdas', ports: 'USB-C, USB-A, HDMI 2.1, Ethernet y audio', os: home,
    reason: 'Sus gráficos dedicados ayudan a mover escenas 3D sencillas.',
    pros: ['GPU dedicada con 6 GB de memoria gráfica', 'Panel IPS Full HD de 144 Hz'],
    cons: ['Con 8 GB de memoria, los archivos pesados y varias aplicaciones abiertas pueden volverlo lento', '2,29 kg y cobertura de color limitada'],
    offers: [{ retailerId: 'falabella', url: victusF }, ...group(victus, true)],
  },
  {
    id: 'lenovo-loq-15', brand: 'Lenovo', model: 'LOQ 15IRX9', sku: '83DV01B1LM', source: alkosto + loq,
    image: cdn + '199272381600/199272381600-001.webp', cpu: 'Intel Core i5-13450HX', cpuBrand: 'Intel', cpuCores: 10, ram: 16, storage: 512,
    size: 15.6, resolution: fhd, weight: 2.38, gpu: 'NVIDIA GeForce RTX 3050', graphics: 'Dedicada',
    battery: 'Hasta 7,5 h según la ficha de la tienda', ports: 'USB-C, USB-A, HDMI 2.1, Ethernet y audio', os: home,
    reason: 'Sirve para explorar 3D y tiene memoria para alternar entre aplicaciones durante el trabajo.',
    pros: ['16 GB de RAM y GPU dedicada', 'Conexión Ethernet y HDMI 2.1'],
    cons: ['Pesa 2,38 kg', 'Poco práctico para llevar todos los días'],
    offers: [
      ...group(loq),
      { retailerId: 'pixelbuy', url: 'https://pixelbuy.com.co/producto/83dv01b1lm/' },
      { retailerId: 'klikken', url: 'https://klikken.com.co/tecnologia/computadores-y-movilidad/portatiles/portatil-gamer-lenovo-loq-15irx9-intel-core-i5-13450hx-16gb-ram-512gb-ssd-rtx-3050-83dv01b1lm/' },
    ],
  },
  {
    id: 'asus-vivobook-16-m1607ka', brand: 'ASUS', model: 'Vivobook 16', sku: 'M1607KA-MB150W', source: alkosto + vivobook16,
    image: cdn + '4711636208697/4711636208697-001.webp', cpu: 'AMD Ryzen AI 5 330', cpuBrand: 'AMD', cpuCores: 4, ram: 16, storage: 512,
    size: 16, resolution: wuxga, weight: 1.68, graphics: integrated, battery: 'Hasta 8 h según la ficha de la tienda', ports: 'USB-C, USB-A, HDMI y audio', os: home,
    reason: 'Su pantalla amplia deja espacio para ver el diseño y las herramientas al mismo tiempo. Sus 16 GB de memoria ayudan al cambiar de aplicación.',
    pros: ['Pantalla de 16 pulgadas y 16 GB de RAM', 'Dos conexiones USB-C según la ficha de la tienda'],
    cons: ['Con 1,68 kg es menos cómodo de llevar que los modelos más livianos', 'Cobertura de color sin verificar'],
    offers: [
      ...group(vivobook16),
      { retailerId: 'falabella', url: 'https://www.falabella.com.co/falabella-co/product/159772037/portatil-asus-vivobook-16-m1607ka-mb150w-amd-ryzen-ai-5-330-ssd-512gb-16gb-16-wuxga-win-11-home/159772038', marketplaceSeller: 'Inteco MC SAS' },
      { retailerId: 'falabella', url: 'https://www.falabella.com.co/falabella-co/product/73493742/port16vivbook16-r5-16g-512g-silver/73493742' },
      { retailerId: 'exito', url: 'https://www.exito.com/portatil-asus-vivobook-16-amd-ryzen-ai-5-330-ram-16-gb-512-gb-ssd-m1607ka-mb150w-3241891/p' },
      { retailerId: 'pronetsys', url: 'https://store.pronetsys.com.co/producto/asus-vivobook-16', paymentNote: 'El pago por pasarela puede tener un recargo.' },
      { retailerId: 'mercadolibre', url: 'https://www.mercadolibre.com.co/notebook-asus-vivobook-16-de-16-con-ryzen-ai-5-512-gb-ssd-y-16-gb-ram-gris/p/MCO79067490', marketplaceSeller: 'Ultra Gamer', officialMarketplaceStore: true },
    ],
  },
  ...extraVivobooks,
]
