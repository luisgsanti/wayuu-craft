export interface Precio {
  tamano: 'Pequeño' | 'Mediano' | 'Grande';
  cop: number;
  usd: number;
}

export interface OpcionesMochila {
  patron: string;
  colores: string[];
  precios: Precio[];
}
