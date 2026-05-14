import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../core/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  imports: [],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    });
  }

  eliminarUsuario(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter(user => user.id !== id);
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El usuario ha sido borrado.',
              icon: 'success'
            });
          },
          error: (err) => {
            if (err.status === 409) {
              Swal.fire({
                title: 'No se puede eliminar',
                text: 'Este usuario tiene actividad registrada (donaciones, solicitudes, etc.). Te recomendamos cambiar su estado a "Inactivo" en lugar de eliminarlo.',
                icon: 'warning'
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al intentar eliminar el usuario.',
                icon: 'error'
              });
            }
          }
        });
      }
    });
  }
}