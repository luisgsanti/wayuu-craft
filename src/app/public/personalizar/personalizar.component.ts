import { Component, ElementRef, ViewChild } from '@angular/core';
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

  pagoRealizado: { monto: string; id: string; comprobante: string } | null = null;

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
    comprobante: ''
  };

  // === Selección de opciones ===
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

  // === Actualiza la vista previa ===
  actualizarPreview() {
    if (this.patronSeleccionado && this.colorSeleccionado) {
      const patron = this.patronSeleccionado.patron.toLowerCase();
      const color = this.colorSeleccionado.toLowerCase();
      this.imagenPreview = `assets/opcionesMochila/${patron}-${color}.png`;
    }
  }

  // === Calcula el costo de la mochila ===
  calcularCosto() {
    if (!this.patronSeleccionado || !this.tamSeleccionado) return;

    const precio = this.patronSeleccionado.precios.find(
      (p: Precio) => p.tamano === this.tamSeleccionado
    );

    this.costoMochila = precio ? precio.cop : 0;
    this.costoMochilaUSD = precio ? precio.usd : 0;
  }

  // === Modal PayPal ===
  abrirModal() {
    if (!this.tamSeleccionado) return;

    this.calcularCosto();
    this.mostrarModal = true;

    // Inicializar botón de PayPal
    setTimeout(() => {
      const container = document.getElementById('paypal-button-container');
      if (container) {
        container.innerHTML = ''; // Limpia antes de renderizar otro
        paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: this.costoMochilaUSD.toFixed(2)
                  }
                }
              ]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const detalles = await actions.order.capture();
            const comprobante = `COMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            this.pagoRealizado = {
              monto: detalles.purchase_units[0].amount.value,
              id: detalles.id,
              comprobante
            };

            // Guardamos detalles del pago en el usuario
            this.datosUsuario.tipoPago = 'PayPal';
            this.datosUsuario.cantidadPago = `${this.pagoRealizado.monto} USD`;
            this.datosUsuario.numeroOrden = this.pagoRealizado.id;
            this.datosUsuario.comprobante = this.pagoRealizado.comprobante;

            // ✅ Mensaje visual
            alert(
              `✅ Pago realizado con éxito\n\n💲 Monto: ${this.pagoRealizado.monto} USD\n🧾 ID de transacción: ${this.pagoRealizado.id}`
            );
          },
          onError: (err: any) => {
            console.error('Error en el pago:', err);
            alert('❌ Hubo un error al procesar el pago. Intenta nuevamente.');
          }
        }).render('#paypal-button-container');
      }
    }, 300);
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  // === Enviar pedido a WhatsApp ===
  enviarPedidoWhatsApp(formPedido: any) {
    if (!formPedido.valid) {
      alert('⚠️ Por favor completa todos los campos antes de continuar.');
      return;
    }

    const numero = '573246563871';
    const nombreCliente = this.datosUsuario.nombre || 'Cliente';

    const pago = this.pagoRealizado
      ? `💳 *Pago realizado:*\n   • Monto: ${this.pagoRealizado.monto} USD\n   • ID Transacción: ${this.pagoRealizado.id}\n   • Comprobante: ${this.pagoRealizado.comprobante}`
      : '💵 *Aún no se ha realizado el pago.*';

    const mensaje = `
👋 *¡Hola WayuuCraft!* Soy ${nombreCliente} y deseo realizar un pedido de una mochila personalizada 🧶✨

━━━━━━━━━━━━━━━━━━━━━━━
🎨 *Detalles del diseño:*
• Patrón: ${this.patronSeleccionado?.patron}
• Color: ${this.colorSeleccionado}
• Tamaño: ${this.tamSeleccionado}
• Precio: ${this.costoMochila} COP (${this.costoMochilaUSD} USD)
━━━━━━━━━━━━━━━━━━━━━━━
🏠 *Datos de envío:*
• Nombre: ${this.datosUsuario.nombre}
• Teléfono: ${this.datosUsuario.telefono}
• Dirección: ${this.datosUsuario.direccion}
• Ciudad: ${this.datosUsuario.ciudad}
• Departamento: ${this.datosUsuario.departamento}
• País: ${this.datosUsuario.pais}
━━━━━━━━━━━━━━━━━━━━━━━
${pago}
━━━━━━━━━━━━━━━━━━━━━━━
📎 *Por favor confirma la disponibilidad o el envío de mi pedido.*
`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje.trim())}`;
    window.open(url, '_blank');

    this.cerrarModal();
  }
}
