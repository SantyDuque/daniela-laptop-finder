export const creativeIds = ['graphic', 'product', 'ux'] as const
export type CreativeId = typeof creativeIds[number]

export const creativeWork = {
  graphic: {
    title: 'Identidad visual y diseño gráfico',
    short: 'Diseño gráfico',
    examples: 'Logotipos, identidades, etiquetas y empaques en Illustrator o Photoshop.',
    priorities: 'Busca una pantalla con buena cobertura de color, memoria para abrir varias apps y un procesador que responda al trabajar con capas.',
  },
  product: {
    title: 'Diseño de producto y modelado 3D',
    short: 'Producto y 3D',
    examples: 'Objetos, modelos tridimensionales y presentaciones de producto.',
    priorities: 'Revisa memoria, procesador y gráficos. Para sesiones largas importa la refrigeración, y cada programa tiene sus propios requisitos.',
  },
  ux: {
    title: 'Diseño de interfaces y experiencias digitales',
    short: 'Diseño UX/UI',
    examples: 'Páginas web, sistemas visuales y prototipos en Figma u otras herramientas.',
    priorities: 'Una pantalla cómoda y memoria suficiente ayudan a alternar entre el prototipo, el navegador y la documentación.',
  },
} as const

export const portfolioUrl = 'https://www.behance.net/danieladuquer1'
export const portfolioProjects = [
  { name: 'P autos', discipline: 'Identidad visual', path: '255008765/P-autos-Brand-Identity-for-a-Car-Dealership' },
  { name: 'XPLOD', discipline: 'Identidad y empaque', path: '245862775/XPLOD-Energy-Drink-Branding-and-Packaging-Design' },
  { name: 'VORTEX', discipline: 'Diseño industrial', path: '252971281/VORTEX-Industrial-Design-of-a-Dental-Material-Mixer' },
  { name: 'Hospital Website UX/UI Redesign', discipline: 'Interfaces y navegación', path: '255009055/Hospital-Website-UXUI-Redesign' },
  { name: 'Vault', discipline: 'Diseño industrial', path: '243473831/Vault-Wine-Cellar-Industrial-Design-Project' },
  { name: 'LUZIERNA', discipline: 'Marca y producto', path: '238827019/LUZIERNA-BRANDING-PRODUCT-DESIGN-PROJECT' },
].map(project => ({ ...project, url: 'https://www.behance.net/gallery/' + project.path }))

export const solidworksRequirements = 'https://www.solidworks.com/support/system-requirements'
export const solidworksCertification = 'https://www.solidworks.com/support/hardware-certification/'
