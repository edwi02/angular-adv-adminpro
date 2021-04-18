import { Component, OnInit, OnDestroy } from '@angular/core';


import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from '../../../models/medico.model';
import { MedicoService } from '../../../services/medico.service';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {


  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];

  public cargando = true;

  private imgSub: Subscription;

  constructor( private medicoService: MedicoService,
               private busquedasService: BusquedasService,
               private modalImagenService: ModalImagenService) { }
  ngOnDestroy(): void {
    this.imgSub.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarMedicos();

    this.imgSub = this.modalImagenService.nuevaImagen
      .pipe(
        delay(500)
      )
      .subscribe( img => this.cargarMedicos() )
  }

  cargarMedicos(): void {

    this.cargando = true;

    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
        this.medicosTemp = medicos;
        console.log(medicos);
      });
  }

  buscar( termino: string ): Medico[] {
    if ( termino.length === 0 ) {
      return this.medicos = this.medicosTemp;
    }

    this.busquedasService.buscar('medicos' , termino)
      .subscribe( medicos => {
        this.medicos = medicos;
      });
  }


  abrirModal( medico: Medico ): void {
    this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img );
  }

  borrarMedico( medico: Medico ): void {

    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico( medico._id )
          .subscribe( resp => {

            this.cargarMedicos();

            Swal.fire(
              'Médico borrado',
              `${ medico.nombre } fue elminado correctamente`,
              'success'
            );

          });
      }
    });
  }

}
