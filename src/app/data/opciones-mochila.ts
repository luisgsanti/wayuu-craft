import { OpcionesMochila } from '../interfaces/OpcinesMochila';

export const OPCIONES_MOCHILA: OpcionesMochila[] = [
  {
    patron: 'Patron1',
    colores: ['Green', 'Orange', 'Gray'],
    precios: [
      { tamano: 'Pequeño', cop: 300000, usd: 97.04 },
      { tamano: 'Mediano', cop: 330000, usd: 106.74 },
      { tamano: 'Grande', cop: 370000, usd: 119.68 },
    ],
  },
  {
    patron: 'Patron2',
    colores: ['Green', 'Violet', 'Red'],
    precios: [
      { tamano: 'Pequeño', cop: 300000, usd: 97.04 },
      { tamano: 'Mediano', cop: 330000, usd: 106.74 },
      { tamano: 'Grande', cop: 370000, usd: 119.68 },
    ],
  },
  {
    patron: 'Patron3',
    colores: ['Red', 'Violet', 'Brown', 'Green', 'Yellow'],
    precios: [
      { tamano: 'Pequeño', cop: 300000, usd: 97.04 },
      { tamano: 'Mediano', cop: 330000, usd: 106.74 },
      { tamano: 'Grande', cop: 370000, usd: 119.68 },
    ],
  },
];
