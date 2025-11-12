import { Component, OnInit } from '@angular/core';
import { MochilaDefinida } from '../../interfaces/MochilaDefinida';
import { MOCHILAS_DEFINIDAS } from '../../data/mochila-definida'; // ajusta la ruta según tu estructura
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-catalogo',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './catalogo.component.html',
    styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {

  mochilas: MochilaDefinida[] = [];

  constructor() {}

  ngOnInit(): void {
    // aquí cargamos las mochilas definidas
    this.mochilas = MOCHILAS_DEFINIDAS;
  }

  // por ahora solo mostramos logs, luego haremos las acciones reales
  verDetalles(mochila: MochilaDefinida) {
    console.log('Ver detalles:', mochila);
  }

  realizarPedido(mochila: MochilaDefinida) {
    console.log('Realizar pedido:', mochila);
  }

  // alterna colores de cards (verde, violeta, rojo)
  colorCard(index: number): string {
    const colores = ['bg-green-100', 'bg-violet-100', 'bg-red-100'];
    return colores[index % colores.length];
  }
}
