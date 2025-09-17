import { Routes } from '@angular/router';

export const routes: Routes = [
  // Carga el módulo público para cualquier ruta raíz
  { path: '', loadChildren: () => import('./public/public.module').then(m => m.PublicModule) },

  // Ruta comodín
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

