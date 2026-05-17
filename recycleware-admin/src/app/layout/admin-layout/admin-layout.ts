import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  isMobileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  cerrarSesion(event: Event) {
    event.preventDefault();
    
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
