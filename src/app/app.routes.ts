import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'nosotros', 
    loadComponent: () => import('./nosotros/nosotros.component').then(m => m.NosotrosComponent) 
  },
  { 
    path: 'menulocal', // <-- Cambiado el path de acceso
    loadComponent: () => import('./menulocal/menulocal.component').then(m => m.MenuLocalComponent) // <-- Nueva ruta e importación
  }, { 
    path: 'menu', // <-- Cambiado el path de acceso
    loadComponent: () => import('./menu/menu.component').then(m => m.MenuComponent) // <-- Nueva ruta e importación
  },
  { 
    path: '**', 
    redirectTo: 'home' 
  }
];