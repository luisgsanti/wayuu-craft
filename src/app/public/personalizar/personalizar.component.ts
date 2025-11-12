import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { OPCIONES_MOCHILA } from '../../data/opciones-mochila';
import { OpcionesMochila, Precio } from '../../interfaces/OpcinesMochila';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var paypal: any;

@Component({
  selector: 'app-personalizar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personalizar.component.html',
  styleUrl: './personalizar.component.css'
})
export class PersonalizarComponent {
  @ViewChild('coloresSection') coloresSection!: ElementRef;
  @ViewChild('tamaniosSection') tamaniosSection!: ElementRef;
  @ViewChild('previewSection') previewSection!: ElementRef;

  opciones = OPCIONES_MOCHILA;
  patronSeleccionado: OpcionesMochila | null = null;
  colorSeleccionado: string | null = null;
  tamSeleccionado: string | null = null;

  imagenPreview = '';
  mostrarModal = false;

  costoMochila = 0;
  costoMochilaUSD = 0;

  pagoRealizado: { monto: string, id: string, comprobante: string } | null = null;

  datosUsuario = {
    nombre: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    pais: '',
    tipoPago: '',
    cantidadPago: '',
    numeroOrden: '',
    comprobante: '',
  };

  seleccionarPatron(patron: OpcionesMochila) {
    this.patronSeleccionado = patron;
    this.colorSeleccionado = null;
    this.tamSeleccionado = null;
    this.imagenPreview = '';
    this.actualizarPreview();
    setTimeout(() => this.coloresSection?.nativeElement.scrollIntoView({ behavior: 'smooth' }), 200);
  }

  seleccionarColor(color: string) {
    this.colorSeleccionado = color;
    this.actualizarPreview();
    setTimeout(() => this.tamaniosSection?.nativeElement.scrollIntoView({ behavior: 'smooth' }), 200);
  }

  seleccionarMedida(tam: string) {
    this.tamSeleccionado = tam;
    this.calcularCosto();
    setTimeout(() => this.previewSection?.nativeElement.scrollIntoView({ behavior: 'smooth' }), 200);
  }

  actualizarPreview() {
    if (this.patronSeleccionado && this.colorSeleccionado) {
      const patron = this.patronSeleccionado.patron.toLowerCase();
      const color = this.colorSeleccionado.toLowerCase();
      this.imagenPreview = `assets/opcionesMochila/${patron}-${color}.png`;
    }
  }

  abrirModal() {
    if (!this.tamSeleccionado) return;
    this.calcularCosto();
    this.mostrarModal = true;

    setTimeout(() => {
      if (document.getElementById('paypal-button-container')) {
        paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: "USD",
                  value: this.costoMochilaUSD.toFixed(2)
                }
              }]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const detalles = await actions.order.capture();
            const comprobante = `COMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            this.pagoRealizado = {
              monto: detalles.purchase_units[0].amount.value,
              id: detalles.id,
              comprobante: comprobante
            };

            this.datosUsuario.tipoPago = 'PayPal';
            this.datosUsuario.cantidadPago = `${this.pagoRealizado.monto} USD`;
            this.datosUsuario.numeroOrden = this.pagoRealizado.id;
            this.datosUsuario.comprobante = this.pagoRealizado.comprobante;
          },
          onError: (err: any) => console.error('Error en el pago:', err)
        }).render('#paypal-button-container');
      }
    }, 0);
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  calcularCosto() {
    if (!this.patronSeleccionado || !this.tamSeleccionado) return;

    const precio = this.patronSeleccionado.precios.find(
      (p: Precio) => p.tamano === this.tamSeleccionado
    );

    this.costoMochila = precio ? precio.cop : 0;
    this.costoMochilaUSD = precio ? precio.usd : 0;
  }

  enviarPedidoWhatsApp(formPedido: any) {
    if (!formPedido.valid) {
      alert("⚠️ Por favor completa todos los campos antes de continuar.");
      return;
    }

    const numero = "573045493793";
    const mensaje = `Hola, quisiera realizar un pedido de mochila:
  - Patrón: ${this.patronSeleccionado?.patron}
  - Color: ${this.colorSeleccionado}
  - Tamaño: ${this.tamSeleccionado}
  - Costo: ${this.costoMochila} COP / ${this.costoMochilaUSD} USD
  - Nombre: ${this.datosUsuario.nombre}
  - Teléfono: ${this.datosUsuario.telefono}
  - Dirección: ${this.datosUsuario.direccion}
  - Ciudad: ${this.datosUsuario.ciudad}
  - Departamento: ${this.datosUsuario.departamento}
  - País: ${this.datosUsuario.pais}
  - Tipo de pago: ${this.datosUsuario.tipoPago}
  - Cantidad pagada: ${this.datosUsuario.cantidadPago}
  - Número de orden: ${this.datosUsuario.numeroOrden}
  - Comprobante: ${this.datosUsuario.comprobante}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    this.cerrarModal();
  }
}
