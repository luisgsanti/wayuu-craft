import { Component, OnInit } from '@angular/core';
import { MochilaDefinida } from '../../interfaces/MochilaDefinida';
import { MOCHILAS_DEFINIDAS } from '../../data/mochila-definida'; // ajusta la ruta según tu estructura
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var paypal: any;

@Component({
    selector: 'app-catalogo',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './catalogo.component.html',
    styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {

  mochilas: MochilaDefinida[] = [];
  mochilaSeleccionada: MochilaDefinida | null = null;
  mostrarModal: boolean = false;

  // Datos del cliente
  datosUsuario = {
    nombre: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    pais: '',
  };

  // Información del pago realizado (desde PayPal)
  pagoRealizado = {
    tipo: '',
    monto: 0,
    moneda: ''
  };

  constructor() {}

  ngOnInit(): void {
    this.mochilas = MOCHILAS_DEFINIDAS;
  }

  ngAfterViewInit(): void {}

  verDetalles(mochila: MochilaDefinida) {
    this.mochilaSeleccionada = mochila;
    this.mostrarModal = true;
    this.pagoRealizado = { tipo: '', monto: 0, moneda: '' }; // reiniciamos el estado

    setTimeout(() => this.inicializarPayPal(), 300);
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.mochilaSeleccionada = null;
  }

  realizarPedido(mochila: MochilaDefinida) {
    this.verDetalles(mochila);
  }

  colorCard(index: number): string {
    const colores = ['bg-green-100', 'bg-violet-100', 'bg-red-100'];
    return colores[index % colores.length];
  }

  // Inicializa el botón de PayPal
  inicializarPayPal() {
    if (!this.mochilaSeleccionada) return;

    const precioUSD = this.mochilaSeleccionada.precioUSD?.toFixed(2);
    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    // Limpia si ya hay uno renderizado
    container.innerHTML = '';

    paypal.Buttons({
      style: { color: 'gold', shape: 'rect', label: 'paypal', height: 40 },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: precioUSD }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {

          (this as any).lastPaypalDetails = details;
          
          const montoPagado = details.purchase_units[0].amount.value;
          const moneda = details.purchase_units[0].amount.currency_code;

          // Guardamos la información del pago
          this.pagoRealizado = {
            tipo: (Number(montoPagado) >= Number(precioUSD)) ? 'Pago total' : 'Abono',
            monto: Number(montoPagado),
            moneda: moneda
          };

          // Muestra una alerta visual
          alert(`✅ Pago registrado: ${this.pagoRealizado.tipo} de ${this.pagoRealizado.monto} ${this.pagoRealizado.moneda}`);
        });
      },
      onError: (err: any) => {
        console.error('Error PayPal:', err);
        alert('Hubo un error al procesar el pago.');
      }
    }).render('#paypal-button-container');
  }

  // Enviar pedido a WhatsApp con datos del pago
  enviarPedidoWhatsApp(form: any) {
    if (!form.valid || !this.mochilaSeleccionada) return;

    const numero = '573001112233'; // tu número de WhatsApp

    // 🧾 Bloque del comprobante (solo si se realizó pago)
    let comprobante = '';
    if (this.pagoRealizado.monto > 0 && (this as any).lastPaypalDetails) {
      const d = (this as any).lastPaypalDetails;
      comprobante =
        `🧾 *Comprobante de pago PayPal:*\n` +
        `• ID: ${d.id}\n` +
        `• Pagado por: ${d.payer.name.given_name} ${d.payer.name.surname}\n` +
        `• Email: ${d.payer.email_address}\n` +
        `• Fecha: ${new Date(d.update_time).toLocaleString()}\n`;
    }

    const datosPago = this.pagoRealizado.monto > 0
      ? `💵 *Tipo de pago:* ${this.pagoRealizado.tipo}\n💲 *Monto:* ${this.pagoRealizado.monto} ${this.pagoRealizado.moneda}`
      : '💵 *No ha realizado pago aún.*';

    const msg = encodeURIComponent(
      `👋 Hola, soy ${this.datosUsuario.nombre} y deseo realizar un pedido:\n\n` +
      `👜 *Patrón:* ${this.mochilaSeleccionada.patron}\n` +
      `🎨 *Color:* ${this.mochilaSeleccionada.color}\n` +
      `📏 *Tamaño:* ${this.mochilaSeleccionada.medida}\n` +
      `💰 *Precio:* ${this.mochilaSeleccionada.precioCOP} COP (${this.mochilaSeleccionada.precioUSD} USD)\n\n` +
      `📞 Teléfono: ${this.datosUsuario.telefono}\n` +
      `🏠 Dirección: ${this.datosUsuario.direccion}\n` +
      `🏙️ Ciudad: ${this.datosUsuario.ciudad}, ${this.datosUsuario.departamento}, ${this.datosUsuario.pais}\n\n` +
      `${datosPago}\n\n${comprobante}\n📎 *Si realizaste un abono, adjunta la captura del comprobante en este chat.*`
    );

    window.open(`https://wa.me/${numero}?text=${msg}`, '_blank');
  }
}
