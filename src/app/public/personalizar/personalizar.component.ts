import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { OPCIONES_MOCHILA } from '../../data/opciones-mochila';
import { OpcionesMochila } from '../../interfaces/OpcinesMochila';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var paypal: any; // importante para usar el SDK

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

  patronSeleccionado: OpcionesMochila | null = null;
  tamSeleccionado: string | null = null;
  opciones = OPCIONES_MOCHILA;
  colorSeleccionado: string | null = null;
  imagenPreview: string = '';

  mostrarModal = false;
  pagoRealizado: { monto: string, id: string, comprobante: string } | null = null;


  datosUsuario = {
    nombre: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    pais: '',
    tipoPago: '',       // abono o pago completo
    cantidadPago: '',    // valor abonado o total
    numeroOrden: '',
    comprobante: '',
  };

  costoMochila: number = 0;

  // --- Selección y vista previa ---
  seleccionarPatron(patron: OpcionesMochila) {
    this.patronSeleccionado = patron;
    this.colorSeleccionado = null;
    this.tamSeleccionado = null;
    this.imagenPreview = '';
    this.actualizarPreview();
    setTimeout(() => this.coloresSection?.nativeElement.scrollIntoView({ behavior: 'smooth' }), 200);
  }

  seleccionarMedida(tam: string) {
    this.tamSeleccionado = tam;
    setTimeout(() => this.previewSection?.nativeElement.scrollIntoView({ behavior: 'smooth' }), 200);
  }

  seleccionarColor(color: string) {
    this.colorSeleccionado = color;
    this.actualizarPreview();
    setTimeout(() => this.tamaniosSection?.nativeElement.scrollIntoView({ behavior: 'smooth' }), 200);
  }

  actualizarPreview() {
    if (this.patronSeleccionado && this.colorSeleccionado) {
      const patron = this.patronSeleccionado.patron.toLowerCase();
      const color = this.colorSeleccionado.toLowerCase();
      this.imagenPreview = `assets/opcionesMochila/${patron}-${color}.png`;
    }
  }

  // --- Modal ---
  abrirModal() {
    if (!this.tamSeleccionado) return;
    this.calcularCosto();
    this.mostrarModal = true;

  setTimeout(() => {
    if (document.getElementById('paypal-button-container')) {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
  const tasaCambio = 4000; // ejemplo fijo
  const valorUSD = (this.costoMochila / tasaCambio).toFixed(2);

  console.log("Monto enviado a PayPal:", valorUSD);

  return actions.order.create({
    purchase_units: [{
      amount: {
        currency_code: "USD",
        value: valorUSD
      }
    }]
  });
},

        onApprove: async (data: any, actions: any) => {
  const detalles = await actions.order.capture();
  console.log('Pago aprobado: ', detalles);

  // Generar comprobante (ejemplo simple con fecha + random)
  const comprobante = `COMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  this.pagoRealizado = {
    monto: detalles.purchase_units[0].amount.value,
    id: detalles.id,
    comprobante: comprobante
  };

  // guardar info de pago en los datos del usuario
  this.datosUsuario.tipoPago = 'PayPal';
  this.datosUsuario.cantidadPago = `${this.pagoRealizado.monto} USD`; 
  this.datosUsuario.numeroOrden = this.pagoRealizado.id;
  this.datosUsuario.comprobante = this.pagoRealizado.comprobante;
},

        onError: (err: any) => {
          console.error('Error en el pago:', err);
        }
      }).render('#paypal-button-container');
    }
  }, 0);
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  calcularCosto() {
    if (this.tamSeleccionado === 'Grande') this.costoMochila = 370000;
    else if (this.tamSeleccionado === 'Mediano') this.costoMochila = 330000;
    else this.costoMochila = 300000;
  }

  // --- WhatsApp ---
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
- País: ${this.datosUsuario.pais}

Pago:
- Tipo: ${this.datosUsuario.tipoPago} 
- Cantidad: ${this.datosUsuario.cantidadPago}
- Número de orden: ${this.datosUsuario.numeroOrden}
- Comprobante: ${this.datosUsuario.comprobante}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    this.cerrarModal();
  }

  
}
