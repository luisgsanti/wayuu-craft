import { Component , ElementRef, ViewChild} from '@angular/core';
import { OPCIONES_MOCHILA } from '../../data/opciones-mochila';
import { OpcionesMochila } from '../../interfaces/OpcinesMochila';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-personalizar',
  standalone: true,
  imports: [
    CommonModule
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
      // Aquí puedes crear la lógica para generar la ruta de la imagen
      // Ejemplo: assets/preview/patron-color-medida.png
      const patron = this.patronSeleccionado.patron.toLowerCase();
      const color = this.colorSeleccionado.toLowerCase();

      this.imagenPreview = `assets/opcionesMochila/${patron}-${color}.png`;
    }
  }


}
