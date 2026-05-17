import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../core/services/usuario.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CustomValidators } from '../../core/utils/validators';

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

  sanitizeLetras(value: string): string {
    if (!value) return '';
    return value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ ]/g, '');
  }

  sanitizeNumeros(value: string): string {
    if (!value) return '';
    return value.replace(/[^0-9]/g, '');
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
        Swal.fire('Error', 'Error al obtener los usuarios.');
      }
    });
  }

  editarUsuario(user: any): void {
    user.isEditing = true;
    this.usuariosOriginales[user.id] = { ...user };
  }

  cancelarEdicion(user: any): void {
    if (user.isNew) {
      this.usuarios = this.usuarios.filter(u => u !== user);
    } else {
      Object.assign(user, this.usuariosOriginales[user.id]);
      user.isEditing = false;
    }
  }

  crearNuevoUsuario(): void {
    if (this.usuarios.some(u => u.isNew)) {
      Swal.fire('Atención', 'Ya tienes una fila nueva sin guardar.', 'warning');
      return;
    }

    const nuevoUsuario = {
      id: null,
      nombre: '',
      dni: '',
      correo: '',
      password: '',
      telefono: '',
      direccion: '',
      localidad: '',
      codigoPostal: '',
      rol: 'PARTICULAR',
      razonSocial: '',
      nombreContacto: '',
      estado: 'PENDIENTE',
      isEditing: true,
      isNew: true
    };

    this.usuarios.unshift(nuevoUsuario);
  }

  guardarUsuario(user: any): void {

    if (user.dni) {
      user.dni = user.dni.toUpperCase();
    }

    if (user.isNew) {
      if (!user.nombre || !user.dni || !user.correo || !user.password) {
        Swal.fire('Error', 'Nombre, DNI, Correo y Contraseña son obligatorios', 'error');
        return;
      }
      if (user.password.length < 8) {
        Swal.fire('Contraseña débil', 'La contraseña debe tener al menos 8 caracteres.', 'warning');
        return;
      }
    } else {
      if (!user.nombre || !user.correo) {
        Swal.fire('Error', 'El Nombre y el Correo no pueden estar vacíos', 'error');
        return;
      }
    }

    if (!CustomValidators.isValidEmail(user.correo)) {
      Swal.fire('Correo Inválido', 'El correo debe tener un formato válido (ejemplo: usuario@dominio.com)', 'warning');
      return;
    }

    if (user.isNew && !CustomValidators.isValidDniNieCif(user.dni)) {
      Swal.fire('DNI/NIE/CIF Inválido', 'El formato del documento no es correcto (Ej válido: 12345678X)', 'warning');
      return;
    }

    if (user.isNew) {
      this.usuarioService.crearUsuario(user).subscribe({
        next: (res: any) => {
          user.id = res.insertUsuario.id;
          user.isEditing = false;
          user.isNew = false;
          Swal.fire('¡Creado!', 'Usuario registrado correctamente en estado PENDIENTE.', 'success');
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo crear el usuario. Verifica los campos.', 'error');
        }
      });
    } else {
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
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
        }
      });
    }
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