# El portátil ideal para Daniela

Guía de compra en español colombiano para comparar portátiles de aproximadamente COP $2.000.000 a $4.000.000. Está pensada para diseño gráfico, proyectos creativos, productividad y llevar el equipo a diario.

## Qué puedes hacer

- Buscar por marca, modelo o referencia y filtrar por presupuesto, especificaciones y uso. El navegador conserva las preferencias.
- Comparar hasta tres configuraciones lado a lado. La selección se guarda en el navegador.
- Consultar fichas técnicas con ventajas, compromisos y estimaciones para tareas de diseño.
- Revisar precios publicados para la misma configuración, disponibilidad en la fecha de consulta y enlaces a las tiendas.
- Consultar el historial por tienda cuando existan registros para más de una fecha.

## Tecnologías y comandos

React, TypeScript, Vite, Tailwind CSS, React Router, Lucide, Recharts y Playwright. Las fuentes se sirven con la aplicación. Se requiere Node.js 24 y npm.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

Para probar el sitio en Chromium:

```sh
npx playwright install chromium
npm test
```

En Windows, puedes usar Edge instalado mediante `$env:PLAYWRIGHT_CHANNEL='msedge'` antes de ejecutar las pruebas.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `src/pages` | Catálogo, ficha individual y comparación |
| `src/components` | Filtros, imágenes, controles e historial |
| `src/data` | Tipos, fichas, ofertas y observaciones anteriores |
| `src/lib/catalog.ts` | Filtros, orden, formato COP y preferencias |
| `public/images` | Imagen editorial de la portada |
| `tests` | Pruebas de navegación, comparación e historial |

## Mantener el catálogo

1. Agrega una ficha a `src/data/laptops.ts` con un ID estable y una referencia única. Verifica CPU, RAM, SSD y pantalla en la ficha del fabricante o en la publicación de la variante. Omite los campos opcionales que no puedas corroborar.
2. Agrega cada oferta con tienda, enlace directo, fecha de consulta (`AAAA-MM-DD`) y precio en COP como entero. Registra stock solo cuando la publicación lo confirme. Que dos equipos compartan nombre comercial no basta para combinar sus ofertas.
3. Antes de sustituir un precio, guarda su registro fechado en `archivedObservations` de `src/data/priceHistory.ts` con `retailer`, `price`, `date` y `source`. Conserva la URL de la evidencia y una observación por fecha y tienda. Las ofertas actuales con precio ya se incorporan al historial automáticamente.
4. Edita individualmente el precio y `checkedAt` de las ofertas revisadas. Si usas las funciones auxiliares del catálogo, indica el día real de consulta. La fecha general se calcula a partir de la consulta más reciente.
5. Ejecuta las validaciones y revisa el enlace de compra, el filtro de presupuesto y la ficha nueva.

## Alcance de los precios y las especificaciones

Los precios son observaciones estáticas en las fechas indicadas. Se toma el precio web general publicado, sin descuentos condicionados por tarjeta, y se excluyen los costos de envío que no se han verificado. La disponibilidad puede variar según la ciudad. La carga inicial contiene observaciones de una sola fecha por equipo, así que las fichas muestran el registro disponible sin trazar una curva. La app no prueba la autonomía ni el rendimiento de las aplicaciones de diseño. Las imágenes de producto se enlazan a las publicaciones de las tiendas y tienen un estado alternativo integrado. La portada utiliza una imagen generada. La licencia del código no cubre las imágenes de terceros.

## Publicar en Vercel

1. En Vercel, selecciona **Add New → Project**, importa `daniela-laptop-finder` y elige la rama `main`.
2. Usa el preset **Vite**, la raíz del repositorio, `npm run build` y el directorio de salida `dist`. El proyecto no requiere variables de entorno.
3. Selecciona **Deploy**. `vercel.json` permite abrir directamente las rutas de fichas y comparación.
