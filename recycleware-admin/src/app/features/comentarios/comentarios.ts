import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comentarios.html'
})
export class ComentariosComponent {
  comentarios: any[] = [];

  editarComentario(comentario: any): void { comentario.isEditing = true; }
  cancelarEdicion(comentario: any): void { comentario.isEditing = false; }
  guardarComentario(comentario: any): void { comentario.isEditing = false; }
  eliminarComentario(comentario: any): void { }
}