import type { Laptop, RetailListing } from './types.ts'

const asusS16 = 'https://www.asus.com/co/laptops/for-home/vivobook/asus-vivobook-s16-m3607/where-to-buy/'
const asusS16Specs = 'https://www.asus.com/co/laptops/for-home/vivobook/asus-vivobook-s16-m3607/techspec/'
const ion32 = 'https://www.falabella.com.co/falabella-co/product/148229502/Portatil-Asus-Vivobook-S16-Ryzen-9-270-Ram-32gb-Ssd-1tb-16-Wuxga-144Hz/148229503'
const pctel16 = 'https://www.falabella.com.co/falabella-co/product/146943580/portatil-asus-vivobook-s-m3607ha-rp111-amd-ryzen-9-270-ram-16gb-ssd-512gb-gris'
const gamingStore = 'https://www.falabella.com.co/falabella-co/product/155674543/portatil-asus-vivobook-s16-ryzen-9-270-16-wuxga-144hz-ram-32gb-ddr5-ssd-512gb-amd-xdna-ai'
const viv15 = 'https://www.falabella.com.co/falabella-co/product/73530542/port15-6vivbook-core5-16g-1tb-blue'
const pctel24 = 'https://www.falabella.com.co/falabella-co/product/155132888/portatil-asus-x1504va-bq5607-intel-core-i5-120u-ram-24gb-ssd-1tb-pantalla-15-6'
const loq = 'https://www.alkosto.com/computador-portatil-gamer-lenovo-loq-156-intel-core-i5-ram/p/199272381761'
const yoga = 'https://www.alkosto.com/computador-portatil-2-en-1-lenovo-yoga-7-14-pulgadas-amd/p/198155778049'
const vivS16 = 'https://www.alkosto.com/computador-portatil-asus-vivobook-s-16-pulgadas-m3607ha/p/4711636006330'
const vivS14 = 'https://www.alkosto.com/computador-portatil-asus-vivobook-s-14-pulgadas-m5406ka/p/4711387908259'

const falabella = (url: string, marketplaceSeller?: string): RetailListing => ({ retailerId: 'falabella', url, marketplaceSeller })
const retailGroup = (alkosto: string, alkomprar = true): RetailListing[] => [
  { retailerId: 'alkosto', url: alkosto },
  { retailerId: 'ktronix', url: alkosto.replace('www.alkosto.com', 'www.ktronix.com') },
  ...(alkomprar ? [{ retailerId: 'alkomprar' as const, url: alkosto.replace('www.alkosto.com', 'www.alkomprar.com') }] : []),
]
const alkostoImage = (gtin: string) => `https://cdn.dam.alkosto.com/products/${gtin}/${gtin}-001.webp`
const falabellaImage = (sku: string) => `https://media.falabella.com/falabellaCO/${sku}/public`
const home = 'Windows 11 Home'
const wuxga = '1920 × 1200'
const fhd = '1920 × 1080'
const amdS16 = {
  brand: 'ASUS', cpu: 'AMD Ryzen 9 270', cpuBrand: 'AMD', cpuCores: 8, size: 16,
  resolution: wuxga, graphics: 'Integrada', gpu: 'AMD Radeon Graphics',
} as const

const acerLite = 'https://www.alkosto.com/computador-portatil-acer-aspire-lite-156-pulgadas-5634/p/4711474986160'
const acerGo = 'https://www.falabella.com.co/falabella-co/product/133672631/PORTATIL-ACER-ASPIRE-INTEL-CORE-I5-13420H-SSD-1TB-RAM-32GB-LED-15%2C6-FULL-HD/133672632'
const acerTravel = 'https://www.falabella.com.co/falabella-co/product/153867451/portatil-acer-travelmate-intel-core-i7-1355u-ram-32gb-ssd-1tb-lcd-14-w11-profesional/153867452'
const officeTech = 'https://www.officetech.com.co/tienda/producto.php?p=lenovo-slim-5-14irh10-intel-core-i5-13420h-32gb-ddr5-1-tera-ssd-945'
const hpSpecs = 'https://www.hp.com/ec-es/products/laptops/product-details/product-specifications/2103743203'
const hp32 = 'https://www.falabella.com.co/falabella-co/product/158459305/portatil-hp-15-fc0371la-amd-ryzen-7-7730u-ram-32gb-ddr4-ssd-1tb-m-2-15-6-fhd-natural-silver'
const hp24 = 'https://www.falabella.com.co/falabella-co/product/158459269/portatil-hp-15-fc0371la-amd-ryzen-7-7730u-ram-24gb-ddr4-ssd-1tb-m-2-15-6-fhd-natural-silver'
const hp15 = {
  brand: 'HP', cpu: 'AMD Ryzen 7 7730U', cpuBrand: 'AMD', cpuCores: 8, size: 15.6,
  resolution: fhd, gamut: { space: 'NTSC', percent: 45 }, weight: 1.59, storage: 1024,
  graphics: 'Integrada', gpu: 'AMD Radeon Graphics', os: 'Sin Windows con licencia confirmada',
  cons: ['La referencia de origen trae FreeDOS. Confirma qué sistema y licencia entrega el vendedor', 'Pantalla de cobertura limitada para trabajos de color preciso'],
} as const


export const capacityLaptops: Laptop[] = [
  {
    ...amdS16, id: 'asus-vivobook-s16-rp050w', model: 'Vivobook S 16 Ryzen 9 · 32 GB de fábrica', sku: 'M3607HA-RP050W',
    source: vivS16, image: alkostoImage('4711636006330'), ram: 32, storage: 1024, weight: 1.56, os: home,
    memory: { origin: 'factory', source: asusS16, warranty: 'Alkosto publica 24 meses para esta referencia desde agosto de 2026.' },
    reason: '32 GB y 1 TB de fábrica dan espacio para tener abiertos los archivos de un empaque, el programa de diseño y la documentación.',
    pros: ['32 GB de memoria y SSD de 1 TB', 'Pantalla de 16 pulgadas y peso publicado de 1,56 kg'],
    cons: ['Gráficos integrados para tareas 3D sencillas', 'Falta confirmar cobertura de color en la referencia exacta'],
    offers: retailGroup(vivS16),
  },
  {
    ...amdS16, id: 'asus-vivobook-s16-rp111-32gb-1tb', model: 'Vivobook S 16 Ryzen 9 · 32 GB + 1 TB', sku: 'M3607HA-RP111 · 32 GB/1 TB · Ion Store',
    source: ion32, image: falabellaImage('148229503_001'), ram: 32, storage: 1024, panel: 'IPS', weight: 1.7, os: 'Sin Windows con licencia confirmada',
    memory: { origin: 'seller-upgraded', upgrade: { max: 32 }, source: ion32,
      warranty: 'Ion Store anuncia un año de garantía directa. Confirma por escrito la cobertura de ASUS y de los componentes añadidos.' },
    reason: 'Da espacio para guardar versiones de empaques y trabajar con varias aplicaciones. Pesa 1,7 kg según la ficha de la plataforma M3607HA.',
    pros: ['32 GB y 1 TB instalados por el vendedor', 'Pantalla de 16 pulgadas y resolución 1920 × 1200'],
    cons: ['La ficha menciona Windows de prueba. Confirma la licencia antes de comprar', 'Gráficos integrados y cobertura de color sin verificar'],
    offers: [falabella(ion32, 'Ion Store')],
  },
  {
    ...amdS16, id: 'asus-vivobook-s16-rp111-32gb-512', model: 'Vivobook S 16 Ryzen 9 · 32 GB + 512 GB', sku: 'M3607HA-RP111 · 32 GB/512 GB · Gaming Store COL',
    source: gamingStore, image: falabellaImage('155674544_001'), ram: 32, storage: 512, panel: 'IPS', weight: 1.7, os: 'Windows 11 (licencia sin verificar)',
    memory: { origin: 'seller-upgraded', upgrade: { max: 32 }, source: pctel16,
      warranty: 'Gaming Store COL publica un año de garantía con exclusiones por modificaciones. Confirma por escrito si cubre el módulo instalado.' },
    reason: 'La memoria adicional da margen para archivos con muchas capas. El SSD de 512 GB puede llenarse antes si guardas modelos y fotos localmente.',
    pros: ['32 GB de memoria en la publicación', 'Pantalla WUXGA de la familia M3607HA'],
    cons: ['El vendedor muestra datos contradictorios sobre el tamaño de pantalla. Confirma la versión de 16 pulgadas', 'Confirma la licencia de Windows y la garantía de la memoria'],
    offers: [falabella(gamingStore, 'Gaming Store COL')],
  },
  {
    ...amdS16, id: 'asus-vivobook-s16-rp111-16gb', model: 'Vivobook S 16 Ryzen 9 · 16 GB', sku: 'M3607HA-RP111',
    source: pctel16, image: falabellaImage('146943581_01'), ram: 16, storage: 512, weight: 1.7, os: 'FreeDOS',
    memory: { origin: 'factory', upgrade: { max: 32 }, source: asusS16Specs,
      warranty: 'Pide al vendedor que confirme cómo conserva la garantía si agregas memoria.' },
    reason: 'Tiene la misma familia de procesador que las variantes ampliadas. Sirve como punto de partida si prefieres pagar menos y dejar abierta una ampliación.',
    pros: ['16 GB de fábrica y ranura de memoria documentada por ASUS', 'Pantalla de 16 pulgadas con espacio vertical adicional'],
    cons: ['La configuración original se vende sin licencia de Windows', 'El SSD de 512 GB deja menos lugar para bibliotecas de modelos'],
    offers: [
      falabella(pctel16, 'PCTEL Computo'),
      { retailerId: 'efyse', url: 'https://www.tienda.efyse.com.co/4738-asus-m3607ha-rp111-amd-ryzen-9-270-16gb-ddr5-512gb-ssd-pantalla.html' },
    ],
  },
  {
    id: 'asus-vivobook-s14-m5406ka', brand: 'ASUS', model: 'Vivobook S 14 OLED Ryzen AI 7', sku: 'M5406KA-QD050W',
    source: vivS14, image: alkostoImage('4711387908259'), cpu: 'AMD Ryzen AI 7 350', cpuBrand: 'AMD', cpuCores: 8, ram: 16, storage: 1024,
    size: 14, panel: 'OLED', resolution: wuxga, weight: 1.3, gpu: 'AMD Radeon Graphics', graphics: 'Integrada', os: home,
    memory: { origin: 'factory', upgrade: 'soldered', source: 'https://www.asus.com/laptops/for-home/vivobook/asus-vivobook-s-14-oled-m5406/techspec/',
      warranty: 'Alkosto indica 24 meses desde agosto de 2026. Revisa el plazo en el vendedor elegido.' },
    reason: 'La pantalla OLED y el peso de 1,3 kg son útiles si revisas piezas gráficas fuera del escritorio. El SSD deja espacio para tus bibliotecas.',
    pros: ['Pantalla OLED de 14 pulgadas y peso de 1,3 kg', '1 TB para programas y proyectos'],
    cons: ['Los 16 GB van soldados', 'Falta confirmar la cobertura de color exacta de esta pantalla'],
    offers: [...retailGroup(vivS14), falabella('https://www.falabella.com.co/falabella-co/product/73323661/Portatil-ASUS-Vivobook-S14-OLED-AMD-Ryzen-AI7-16-GB-de-RAM-1TB-SSD-de-almacenamiento-Windows-11-14-Pulgadas-M5406KA-QD050W-Computador-portatil')],
  },
  {
    id: 'asus-vivobook-15-bq3907w', brand: 'ASUS', model: 'Vivobook 15 · 16 GB + 1 TB', sku: 'X1504VA-BQ3907W',
    source: viv15, image: falabellaImage('73530542_1'), cpu: 'Intel Core 5 120U', cpuBrand: 'Intel', ram: 16, storage: 1024,
    size: 15.6, resolution: fhd, graphics: 'Integrada', os: home,
    memory: { source: viv15, warranty: 'Falabella publica dos años de garantía del proveedor. Confirma la configuración de fábrica y la ampliación antes de comprar.' },
    reason: 'Un SSD de 1 TB cerca del extremo bajo del presupuesto para guardar recursos de identidad, empaques y prototipos.',
    pros: ['16 GB de RAM y 1 TB de SSD', 'Pantalla de 15,6 pulgadas'],
    cons: ['La cobertura de color no se documenta en la ficha', 'Gráficos integrados para escenas 3D sencillas'],
    offers: [falabella(viv15)],
  },
  {
    id: 'asus-vivobook-15-bq5607', brand: 'ASUS', model: 'Vivobook 15 · 24 GB + 1 TB', sku: 'X1504VA-BQ5607 · PCTEL 155132889',
    source: pctel24, image: falabellaImage('155132889_01'), cpu: 'Intel Core 5 120U', cpuBrand: 'Intel', ram: 24, storage: 1024,
    size: 15.6, resolution: fhd, graphics: 'Integrada',
    memory: { source: pctel24,
      warranty: 'PCTEL publica 12 meses de garantía. La ficha no dice si añadió la memoria ni quién cubriría ese módulo.' },
    reason: '24 GB y 1 TB dan más margen para abrir fotos, archivos con capas y un prototipo mientras consultas referencias.',
    pros: ['24 GB de RAM declarados en esta publicación', 'SSD de 1 TB'],
    cons: ['Origen de la memoria y licencia de Windows por confirmar', 'Sin cobertura de color documentada'],
    offers: [falabella(pctel24, 'PCTEL Computo')],
  },
  {
    id: 'lenovo-loq-15irx10-32gb', brand: 'Lenovo', model: 'LOQ 15IRX10 RTX 5050', sku: '83JE00TELM',
    source: loq, image: alkostoImage('199272381761'), cpu: 'Intel Core i5-13450HX', cpuBrand: 'Intel', cpuCores: 10, ram: 32, storage: 512,
    size: 15.6, resolution: fhd, weight: 2.4, gpu: 'NVIDIA GeForce RTX 5050 · 8 GB', graphics: 'Dedicada', os: 'Windows 11',
    memory: { source: 'https://psref.lenovo.com/Detail/LOQ_15IRX10?M=83JE00TELM', warranty: 'Alkosto publica 12 meses de garantía para esta referencia.' },
    reason: 'Su RTX 5050 y 32 GB ofrecen más margen para modelar que un portátil con gráficos integrados. El peso es más adecuado para trabajar en un escritorio.',
    pros: ['Gráficos dedicados y 32 GB de RAM', 'Pantalla Full HD de 15,6 pulgadas'],
    cons: ['Pesa 2,4 kg', 'Confirma la edición de Windows y los requisitos de tu versión de SOLIDWORKS'],
    offers: retailGroup(loq),
  },
  {
    id: 'lenovo-yoga-7-14akp10-24gb', brand: 'Lenovo', model: 'Yoga 7 14 2 en 1 OLED', sku: '83JR000FLM',
    source: yoga, image: alkostoImage('198155778049'), cpu: 'AMD Ryzen AI 7 350', cpuBrand: 'AMD', cpuCores: 8, ram: 24, storage: 1024,
    size: 14, panel: 'OLED', weight: 1.38, graphics: 'Integrada', os: 'Windows 11',
    memory: { origin: 'factory', upgrade: 'soldered', source: 'https://psref.lenovo.com/Detail/Yoga_7_2_in_1_14AKP10?M=83JR000FLM', warranty: 'Alkosto publica 12 meses de garantía.' },
    reason: 'El formato convertible y los 24 GB permiten llevar bocetos y prototipos a una revisión sin cargar un equipo pesado.',
    pros: ['24 GB y SSD de 1 TB', 'Pantalla OLED táctil y peso de 1,38 kg'],
    cons: ['La RAM va soldada', 'No trae gráficos dedicados'],
    offers: retailGroup(yoga, false),
  },
  {
    id: 'acer-aspire-lite-5634', brand: 'Acer', model: 'Aspire Lite 15 · 1 TB', sku: 'AL15-54P-5634',
    source: acerLite, image: alkostoImage('4711474986160'), cpu: 'Intel Core Ultra 5 115U', cpuBrand: 'Intel', cpuCores: 10, ram: 16, storage: 1024,
    size: 15.6, resolution: fhd, weight: 1.6, graphics: 'Integrada', os: home,
    memory: { source: acerLite, warranty: 'Alkosto publica 12 meses. La ficha no especifica la ampliación de RAM.' },
    reason: 'El SSD de 1 TB deja espacio para una biblioteca de fotos y archivos de identidad con un peso de 1,6 kg.',
    pros: ['SSD de 1 TB y 16 GB de RAM', 'Peso publicado de 1,6 kg'],
    cons: ['Cobertura de color por confirmar', 'Gráficos integrados'],
    offers: retailGroup(acerLite, false),
  },
  {
    id: 'acer-aspire-go-57kn-32gb', brand: 'Acer', model: 'Aspire Go 15 · 32 GB + 1 TB', sku: 'AG15-71P-57KN · Compumarket 133672632',
    source: acerGo, image: falabellaImage('133672632_01'), cpu: 'Intel Core i5-13420H', cpuBrand: 'Intel', cpuCores: 8, ram: 32, storage: 1024,
    size: 15.6, resolution: fhd, graphics: 'Integrada', os: 'Windows 11 (licencia sin verificar)',
    memory: { origin: 'seller-upgraded', source: 'https://www.falabella.com.co/falabella-co/product/133671719/portatil-acer-aspire-intel-core-i5-13420h-ssd-512gb-ram-8gb-led-15-6-full-hd/133671720',
      warranty: 'Compumarket publica 12 meses de cobertura directa. Confirma qué cubre Acer y qué cubre el vendedor.' },
    reason: 'Da margen para abrir varias aplicaciones de diseño y guardar proyectos grandes. La referencia base se vende con 8 GB y 512 GB.',
    pros: ['32 GB de memoria y SSD de 1 TB según la ficha del vendedor', 'Pantalla Full HD de 15,6 pulgadas'],
    cons: ['Gráficos integrados y cobertura de color por confirmar', 'Pide confirmación de la licencia de Windows'],
    offers: [falabella(acerGo, 'Compumarket BGA')],
  },
  {
    id: 'acer-travelmate-70uj-32gb', brand: 'Acer', model: 'TravelMate P2 14 · 32 GB + 1 TB', sku: 'TMP214-55-G2-70UJ · Compumarket 153867452',
    source: acerTravel, image: falabellaImage('153867452_01'), cpu: 'Intel Core i7-1355U', cpuBrand: 'Intel', cpuCores: 10, ram: 32, storage: 1024,
    size: 14, graphics: 'Integrada', os: 'Windows 11 Pro',
    memory: { origin: 'seller-upgraded', source: 'https://www.falabella.com.co/falabella-co/product/153708128/portatil-acer-travelmate-intel-core-i7-1355u-ram-16gb-ssd-512gb-lcd-14-w11-profesional/153708129',
      warranty: 'Compumarket indica 12 meses directamente con el vendedor. Pregunta por la cobertura de los componentes añadidos.' },
    reason: 'Formato compacto para trabajar en identidades y prototipos, con espacio para los recursos de ambos. La referencia base trae 16 GB y 512 GB.',
    pros: ['32 GB y 1 TB declarados por el vendedor', 'Windows 11 Pro en la ficha de la oferta'],
    cons: ['Las fichas difieren en la resolución. Confírmala antes de comprar', 'No se verificó el peso ni la cobertura de color'],
    offers: [falabella(acerTravel, 'Compumarket BGA')],
  },
  {
    id: 'lenovo-ideapad-slim-5-83hr00cdlm', brand: 'Lenovo', model: 'IdeaPad Slim 5 14 · 32 GB + 1 TB', sku: '83HR00CDLM',
    source: officeTech, image: 'https://www.officetech.com.co/tienda/fotos/20261101-53b04724.jpg', cpu: 'Intel Core i5-13420H', cpuBrand: 'Intel', cpuCores: 8,
    ram: 32, storage: 1024, size: 14, resolution: wuxga, gpu: 'Intel UHD Graphics', graphics: 'Integrada', os: 'Sin Windows',
    memory: { origin: 'factory', upgrade: { max: 32 }, source: 'https://nexsysla.com/co/tienda/computers/lenovo-laptop-ip-slim-5-14irh10-intel-core-i513420h2x-16gb-sodimm-ddr55600-32-gb-ssd-1tb-gblinux14-cosmic-blue/',
      warranty: 'OfficeTech tramita la garantía. Pregunta por el plazo y cotiza por separado la licencia de Windows si la necesitas.' },
    reason: '32 GB de fábrica, SSD de 1 TB y pantalla alta de 14 pulgadas para prototipos y archivos gráficos. El precio de OfficeTech incluye IVA.',
    pros: ['32 GB instalados en dos módulos y 1 TB de fábrica', 'Formato compacto de 14 pulgadas'],
    cons: ['Se entrega sin Windows en OfficeTech', 'Gráficos integrados y peso exacto por confirmar'],
    offers: [{ retailerId: 'officetech', url: officeTech }, falabella('https://www.falabella.com.co/falabella-co/product/151329396/portatil-lenovo-ideapad-slim-5-intel-core-i5-13420h-32gb-ram-1tb-ssd-wuxga-14/151329397', 'Compumarket BGA')],
  },
  {
    ...hp15, id: 'hp-15-fc0371la-24gb', model: '15-fc0371la · 24 GB + 1 TB', sku: '15-fc0371la · One PC Gamer 158459270',
    source: hp24, image: falabellaImage('158459270_01'), ram: 24, cons: [...hp15.cons],
    memory: { origin: 'seller-upgraded', source: hpSpecs,
      warranty: 'La ficha de HP muestra 16 GB de fábrica. Confirma por escrito quién cubre el equipo, el SSD y la RAM añadida.' },
    reason: '24 GB ayudan a pasar del navegador a archivos con capas, y 1 TB da espacio extra para tus proyectos.',
    pros: ['24 GB de RAM y 1 TB de SSD en la publicación', 'Ocho núcleos y pantalla Full HD'],
    offers: [falabella(hp24, 'One PC Gamer')],
  },
  {
    ...hp15, id: 'hp-15-fc0371la-32gb', model: '15-fc0371la · 32 GB + 1 TB', sku: '15-fc0371la · One PC Gamer 158459306',
    source: hp32, image: falabellaImage('158459306_01'), ram: 32, cons: [...hp15.cons],
    memory: { origin: 'seller-upgraded', source: hpSpecs,
      warranty: 'La ficha de HP muestra 16 GB de fábrica. Confirma por escrito quién cubre el equipo, el SSD y la RAM añadida.' },
    reason: 'Por encima de la opción de 24 GB, tienes más margen si alternas entre apps pesadas. Ambas ofrecen el mismo espacio de SSD.',
    pros: ['32 GB de memoria instalados y SSD de 1 TB según el vendedor', 'Peso de 1,59 kg en la ficha del fabricante'],
    offers: [falabella(hp32, 'One PC Gamer')],
  },

]
