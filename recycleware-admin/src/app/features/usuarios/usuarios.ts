import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../core/services/usuario.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss',
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];

  usuariosOriginales: { [id: number]: any } = {};
  
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data.map(user => ({
          ...user,
          estado: user.estado || 'PENDIENTE',
          isEditing: false
        }));
      },
      error: (error) => {
        Swal.fire('Error','Error al obtener los usuarios.');
      }
    });
  }

  editarUsuario(user: any): void {
    user.isEditing = true;
    this.usuariosOriginales[user.id] = { ...user };
  }

  cancelarEdicion(user: any): void {
    user.isEditing = false;
    Object.assign(user, this.usuariosOriginales[user.id]);
  }

  guardarUsuario(user: any): void {
    this.usuarioService.actualizarUsuario(user.id, user).subscribe({
      next: () => {
        user.isEditing = false; 
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Usuario actualizado',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
      }
    });
  }

  eliminarUsuario(user: any): void {

    if (user.estado.toUpperCase() !== 'INACTIVO') {
      Swal.fire({
        title: 'Acción no permitida',
        text: 'Para eliminar físicamente a un usuario, primero debes cambiar su estado a "Inactivo" en el menú desplegable.',
        icon: 'info',
        confirmButtonColor: 'var(--secondary)'
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario(user.id).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter(u => u.id !== user.id);
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