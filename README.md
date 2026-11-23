# El portátil ideal para Daniela

Guía de compra en español colombiano para comparar portátiles de aproximadamente COP $2.000.000 a $4.000.000. Está pensada para diseño gráfico, proyectos creativos, productividad y llevar el equipo a diario.

## Qué puedes hacer

- Buscar por marca, modelo o referencia y filtrar por presupuesto, características y uso.
- Comparar hasta tres configuraciones. Primero verás para quién conviene cada equipo y qué elegiría para Daniela. La tabla conserva los detalles técnicos.
- Abrir una ficha para revisar su pantalla, peso, espacio para archivos y capacidad para trabajar con varias aplicaciones.
- Comparar precios, fechas y disponibilidad registrada. Las publicaciones de un vendedor externo muestran su nombre.
- Comparar precios verificados de una sola fecha o ver cómo cambian cuando hay datos de varios días.

La selección y las preferencias se guardan en el navegador.

## Comandos

Requiere Node.js 24 y npm. La aplicación usa React, TypeScript, Vite, Tailwind CSS, React Router, Radix Select, Lucide y Recharts.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
npm run test:prices
npx playwright install chromium
npm test
```

Para usar Edge instalado en Windows, ejecuta `$env:PLAYWRIGHT_CHANNEL='msedge'` antes de `npm test`.

## Catálogo e historial

- `src/data/laptops.ts` identifica cada configuración y sus publicaciones por URL. El identificador del equipo y la referencia (`sku`) son estables.
- `src/data/retailers.ts` registra el nombre, identificador y dominio de cada tienda.
- `src/data/price-history.json` guarda observaciones de precio e inventario. El sitio estático lee este archivo en cada compilación.
- Cada registro contiene `laptopId`, `configurationId`, `retailerId`, `productUrl`, `price`, `observedAt`, `currency` y `verifiedBy`. Incluye `availability` solo si la publicación la confirma. Se usa `null` cuando se confirmó que el producto está agotado y no hay un precio válido.
- Mantén una observación por tienda, URL y día en Colombia. Se conserva la primera observación del día al importar o recolectar otra. Las marcas nuevas usan hora UTC ISO 8601. Algunos registros originales conservan solo la fecha porque así se guardaron.
- Un precio de hace 14 días o más aparece como anterior y queda fuera del cálculo de ahorros y de la recomendación. El historial conserva ese dato con su fecha original. Un precio solo sirve como oferta si el último registro de ese vendedor no indica que se agotó.

Se registran precios generales publicados, sin descuentos condicionados por tarjeta ni gastos de envío desconocidos. El precio de Pronetsys Store incluye IVA. Su pasarela puede tener un recargo. Cada precio representa una observación y puede cambiar entre consultas. Las imágenes de producto se enlazan a la ficha y tienen un estado alternativo integrado.

## Agregar tiendas, publicaciones u observaciones

1. En `src/data/retailers.ts`, registra el identificador, nombre y dominio de la tienda.
2. En `src/data/laptops.ts`, agrega la URL HTTPS directa en la configuración correspondiente. Compara referencia, procesador, memoria, almacenamiento y pantalla. Si el catálogo de la tienda ofrece varias versiones, registra el enlace exacto y conserva el nombre del vendedor para publicaciones de marketplace.
3. Abre la publicación y confirma el precio en COP, la fecha real de consulta y, si está visible, la disponibilidad. Copia la estructura de un registro real de `src/data/price-history.json` a una lista JSON de importación. Usa `"verifiedBy": "manual"` y los identificadores de tu publicación. Si no hay un precio público y tampoco se confirmó que está agotado, deja solo el enlace verificado en el catálogo.
4. Valida e importa. Si el registro de ese día requiere una corrección, edítalo en el historial y documenta el cambio en el commit.

```sh
npm run prices:update -- --dry-run --manual precios-revisados.json
npm run prices:update -- --manual precios-revisados.json
npm run prices:update -- --validate
```

La importación valida moneda, precio, fecha, enlace y correspondencia con el catálogo antes de escribir. Revisa el diff y haz commit de los datos observados. Los archivos temporales de importación quedan fuera del historial del proyecto cuando guardas solo el catálogo y el JSON final.

## Actualización automática

El workflow `Actualizar precios` se programa todos los días a las 9:23 a. m. de Colombia en la rama predeterminada de GitHub. También se puede ejecutar desde Actions en modo de simulación, activado por defecto para ejecuciones manuales.

El script `scripts/update-prices.ts` consulta las fichas de **Pronetsys Store** y **Pixel Buy**. Lee el JSON-LD público y exige una coincidencia exacta de la referencia del fabricante y la URL, una oferta inequívoca y moneda COP. Consulta `robots.txt` con un agente identificable, respeta las pausas de la tienda y usa tiempos de espera. Ante bloqueo, redirección, precio ambiguo o un problema de acceso, conserva el registro anterior con su fecha. Puedes verificarlo localmente.

```sh
npm run prices:update -- --dry-run
```

Alkosto, Ktronix, Alkomprar, Falabella, Éxito, Jumbo, Mercado Libre y Klikken Group se revisan manualmente. Las publicaciones de marketplace pueden cambiar de vendedor. Éxito y Mercado Libre bloquearon las consultas directas durante la verificación. Si una tienda bloquea solicitudes, mantén la revisión manual y anota una nueva observación únicamente cuando puedas confirmar el precio público de la referencia. Las referencias verificadas de Éxito y Mercado Libre se muestran sin precio vigente cuando la publicación bloquea la consulta.

GitHub Actions usa `GITHUB_TOKEN` con permiso de escritura de contenido en el trabajo de actualización. Guarda y publica solo `src/data/price-history.json` cuando hay cambios. Si la rama tiene protección, el repositorio debe permitir el commit del workflow o se usa la importación manual. Los logs de Actions indican fichas revisadas, omitidas o sin cambios.

## Comprar desde el exterior

AmazonGlobal ofrece envíos a Colombia según el producto, vendedor y dirección. En esta revisión no se corroboró una oferta de Amazon con precio y entrega a Colombia para las configuraciones del catálogo. Una publicación de Vivobook Go 15 para el mercado estadounidense indicaba que no enviaba al destino seleccionado en Colombia. Los precios comparados son en COP y no incluyen conversiones de moneda. Si revisas una opción internacional, confirma la referencia, el teclado, la garantía local y el total con envío e importación.

## Publicar en Vercel

En Vercel, selecciona **Add New → Project** e importa el repositorio. Usa el preset **Vite**, la raíz del repositorio, `npm run build` y el directorio de salida `dist`. No se requieren variables de entorno. Selecciona como rama de producción la que reciba las observaciones. Al llegar los commits de precios a esa rama, la integración de Git puede iniciar una nueva compilación estática. `vercel.json` permite acceder directamente a las fichas y la comparación.
