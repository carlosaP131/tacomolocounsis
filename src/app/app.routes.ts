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
    path: 'menulocal', 
    loadComponent: () => import('./menulocal/menulocal.component').then(m => m.MenuLocalComponent) 
  }, 
  { 
    path: 'menu', 
    loadComponent: () => import('./menu/menu.component').then(m => m.MenuComponent) 
  }, 
  { 
    path: 'ubi', 
    loadComponent: () => import('./ubicacion/ubicacion.component').then(m => m.UbicacionComponent) 
  },
  // 🔥 AGREGAMOS LA NUEVA RUTA PARA EL TRABAJADOR AQUÍ:
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent)
  },
  { 
    path: '**', 
    redirectTo: 'home' 
  }
];