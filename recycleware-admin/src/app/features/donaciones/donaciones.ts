import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donaciones.html'
})
export class DonacionesComponent {
  donaciones: any[] = [];

  editarDonacion(donacion: any): void { donacion.isEditing = true; }
  cancelarEdicion(donacion: any): void { donacion.isEditing = false; }
  guardarDonacion(donacion: any): void { donacion.isEditing = false; }
  eliminarDonacion(donacion: any): void { }
}