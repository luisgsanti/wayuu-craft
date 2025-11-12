import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';

//pages
import { HomeComponent } from './home/home.component';
import { PersonalizarComponent } from './personalizar/personalizar.component';
import { CatalogoComponent } from './catalogo/catalogo.component';


const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'personalizar', component: PersonalizarComponent },
      { path: 'catalogo', component: CatalogoComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
