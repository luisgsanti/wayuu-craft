import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

//pages

//router
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicModule { 
  constructor() {
    console.log('✅ PublicModule cargado');
  }
}

