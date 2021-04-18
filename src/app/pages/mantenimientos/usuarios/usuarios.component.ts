import { Component, OnInit, OnDestroy } from '@angular/core';

import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';

import { Usuario } from '../../../models/usuario.mode';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde = 0;
  public cargando = true;

  public imgSubs: Subscription;

  constructor( private usuarioService: UsuarioService,
               private busquedaService: BusquedasService,
               private modalImagenService: ModalImagenService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(500)
    )
    .subscribe( img => this.cargarUsuarios() );
  }

  cargarUsuarios(): void {
    this.cargando = true;

    this.usuarioService.cargarUsuarios( this.desde )
      .subscribe( ({ total, usuarios }) => {
        // console.log(usuarios);
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;

      });
  }



  cambiarPagina( valor: number): void {
    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde > this.totalUsuarios ) {
      this.desde -=  valor;
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ): any {

    if ( termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.buscar( 'usuarios', termino )
    .subscribe( resultados => {
      this.usuarios = resultados;
    });

  }

  eliminarUsuario( usuario: Usuario ): any {

    if ( usuario.uid === this.usuarioService.uid ) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario )
          .subscribe( resp => {

            this.cargarUsuarios();

            Swal.fire(
              'Usuario borrado',
              `${ usuario.nombre } fue elminado correctamente`,
              'success'
            );

          });
      }
    });

  }

  cambiarRole( usuario: Usuario ): void {
    this.usuarioService.guardarUsuario( usuario )
    .subscribe( resp => console.log(resp) );
  }

  abrirModal(usuario: Usuario): void {
    this.modalImagenService.abrirModal( 'usuarios', usuario.uid, usuario.img );
  }

}

