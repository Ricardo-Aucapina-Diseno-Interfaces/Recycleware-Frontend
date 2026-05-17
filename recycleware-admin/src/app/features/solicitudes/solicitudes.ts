import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para el pipe de fecha (date:'dd/MM/yyyy')
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes.html'
})
export class SolicitudesComponent {
  solicitudes: any[] = [];

  editarSolicitud(solicitud: any): void { solicitud.isEditing = true; }
  cancelarEdicion(solicitud: any): void { solicitud.isEditing = false; }
  guardarSolicitud(solicitud: any): void { solicitud.isEditing = false; }
  eliminarSolicitud(solicitud: any): void { }
}