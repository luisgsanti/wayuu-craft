export interface MochilaDefinida {
  id: number;          // identificador único
  patron: string;
  color: string;
  medida: string;
  precio?: number;     // opcional si manejas precios
}
