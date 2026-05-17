import { Routes } from '@angular/router';
import { adminGuard, userGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./layout/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: 'usuarios', loadComponent: () => import('./features/usuarios/usuarios').then(m => m.UsuariosComponent) },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
    ]
  },

  {
    path: 'usuario',
    canActivate: [userGuard],
    loadComponent: () => import('./features/usuario-dashboard/usuario-dashboard.component').then(m => m.UsuarioDashboardComponent)
  }
];