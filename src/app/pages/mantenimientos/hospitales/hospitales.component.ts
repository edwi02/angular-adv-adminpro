import { Component, OnInit, OnDestroy } from '@angular/core';

import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando = true;

  public imgSubs: Subscription;


  constructor( private hospitalService: HospitalService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(500)
    )
    .subscribe(img => this.cargarHospitales() );
  }

  cargarHospitales(): void {

    this.cargando = true;

    this.hospitalService.cargarHospitales()
      .subscribe( hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
        // console.log(hospitales);
      });
  }

  guardarCambios(hospital: Hospital): void {

    this.hospitalService.actualizarHospital( hospital._id, hospital.nombre )
    .subscribe( (resp) => {
      Swal.fire('Actualizado', hospital.nombre, 'success');
      console.log(resp);
    });

  }

  eliminarHospital( hospital: Hospital): void {
    this.hospitalService.eliminarHospital( hospital._id )
      .subscribe( resp => {
        Swal.fire('Borrado', hospital.nombre, 'success' );
        this.cargarHospitales();
      });
  }

  async abrirSweetAlert(): Promise<void> {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombrel nuevo Hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Crear'
    });

    if ( value.trim().length > 0 ){
      this.hospitalService.crearHospital( value )
        .subscribe( (resp: any) => {
          Swal.fire('Hopistal creado', value, 'success');
          // this.cargarHospitales();
          this.hospitales.push( resp.hospital );
        });
    }

  }

  abrirModal( hospital: Hospital ): void {
    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img );
  }

  buscar( termino: string ): Hospital[] {

    if ( termino.length === 0) {
      return this.hospitales = this.hospitalesTemp;
    }

    this.busquedasService.buscar('hospitales', termino)
      .subscribe( hospitales => {
        this.hospitales = hospitales;
      });
  }


}
