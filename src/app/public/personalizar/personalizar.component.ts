import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  OPCIONES_MOCHILA
} from '../../data/opciones-mochila';
import {
  OpcionesMochila
} from '../../interfaces/OpcinesMochila';
import {
  CommonModule
} from '@angular/common';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-personalizar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule   
  ],
  templateUrl: './personalizar.component.html',
  styleUrl: './personalizar.component.css'
})
export class PersonalizarComponent {

  @ViewChild('coloresSection') coloresSection!: ElementRef;
  @ViewChild('tamaniosSection') tamaniosSection!: ElementRef;
  @ViewChild('previewSection') previewSection!: ElementRef;


  patronSeleccionado: OpcionesMochila | null = null;
  tamSeleccionado: string | null = null;
  opciones = OPCIONES_MOCHILA;
  colorSeleccionado: string | null = null;
  imagenPreview: string = ''; // ruta de la imagen mostrada



  seleccionarPatron(patron: OpcionesMochila) {
    this.patronSeleccionado = patron;
    this.colorSeleccionado = null;
    this.tamSeleccionado = null;
    this.imagenPreview = ''; // resetear preview
    this.actualizarPreview();
    setTimeout(() => this.coloresSection ?.nativeElement.scrollIntoView({
      behavior: 'smooth'
    }), 200);

  }

  seleccionarMedida(tam: string) {
    this.tamSeleccionado = tam;
    setTimeout(() => this.previewSection ?.nativeElement.scrollIntoView({
      behavior: 'smooth'
    }), 200);


  }

  seleccionarColor(color: string) {
    this.colorSeleccionado = color;
    this.actualizarPreview();
    setTimeout(() => this.tamaniosSection ?.nativeElement.scrollIntoView({
      behavior: 'smooth'
    }), 200);

  }

  actualizarPreview() {
    if (this.patronSeleccionado && this.colorSeleccionado) {
      // Aquí puedes crear la lógica para generar la ruta de la imagen
      // Ejemplo: assets/preview/patron-color-medida.png
      const patron = this.patronSeleccionado.patron.toLowerCase();
      const color = this.colorSeleccionado.toLowerCase();

      this.imagenPreview = `assets/opcionesMochila/${patron}-${color}.png`;
    }
  }

  /*
  enviarPedidoWhatsApp() {
    const numero = "573045493793"; // Número en formato internacional
    const mensaje =
      "Hola, quisiera realizar un pedido de una mochila:\n" +
      `* Patrón: ${this.patronSeleccionado?.patron}\n` +
      `* Color: ${this.colorSeleccionado}\n` +
      `* Tamaño: ${this.tamSeleccionado}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  }*/


  //MODAL

  mostrarModal = false;

datosUsuario = {
  nombre: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  departamento: '',
  pais: ''
};

costoMochila: number = 0;

abrirModal() {
  if (!this.tamSeleccionado) return;
  this.calcularCosto();
  this.mostrarModal = true;
}

cerrarModal() {
  this.mostrarModal = false;
}

calcularCosto() {
  if (this.tamSeleccionado === 'Grande') this.costoMochila = 370000;
  else if (this.tamSeleccionado === 'Mediano') this.costoMochila = 330000;
  else this.costoMochila = 300000;
}

enviarPedidoWhatsApp() {
  const numero = "573045493793";
  const mensaje = `Hola, quisiera realizar un pedido de mochila:
- Patrón: ${this.patronSeleccionado?.patron}
- Color: ${this.colorSeleccionado}
- Tamaño: ${this.tamSeleccionado}
- Costo: ${this.costoMochila} COP

Datos de envío:
- Nombre: ${this.datosUsuario.nombre}
- Teléfono: ${this.datosUsuario.telefono}
- Dirección: ${this.datosUsuario.direccion}
- Ciudad: ${this.datosUsuario.ciudad}
- Departamento: ${this.datosUsuario.departamento}
- País: ${this.datosUsuario.pais}`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
  this.cerrarModal();
}






}
