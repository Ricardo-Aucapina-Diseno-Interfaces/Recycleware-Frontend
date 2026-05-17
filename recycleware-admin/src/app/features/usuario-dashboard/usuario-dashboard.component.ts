import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-usuario-dashboard',
  standalone: true,
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f4f6f8; font-family: sans-serif;">
      <h1>Bienvenido a la Interfaz de Usuario</h1>
      <p style="color: #666; margin-bottom: 2rem;">Esta sección está en construcción para PARTICULARES y EMPRESAS.</p>
      <button (click)="cerrarSesion()" style="padding: 0.8rem 1.5rem; background-color: #e76f51; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
        Cerrar Sesión
      </button>
    </div>
  `
})
export class UsuarioDashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  cerrarSesion(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('userRole');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('userRole');
        this.router.navigate(['/login']);
      }
    });
  }
}