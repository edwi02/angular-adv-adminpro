import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';

import { Hospital } from '../../../models/hospital.model';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {


  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado: Medico;
  public hospitalSeleccionado: Hospital;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({ id }) => { this.cargarMedico(id); } );

    this.medicoForm = this.fb.group({
      nombre: ['',  Validators.required ],
      hospital: ['',  Validators.required ]
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges
      .pipe(
        delay(500)
      )
      .subscribe( hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
      });

  }

  cargarMedico( id: string ): void {

    if ( id === 'nuevo') {
      return; // no carga el medico (no existe) si estamos creando un médico
    }

    this.medicoService.obtenerMedicoPorId( id )
    .subscribe( medico => {

      const { nombre, hospital: { _id }} = medico;
      this.medicoSeleccionado = medico;

      this.medicoForm.setValue({ nombre, hospital: _id});

    }, error => {
      return this.router.navigateByUrl(`/dashboard/medicos`);
    });
  }

  cargarHospitales(): void {
    this.hospitalService.cargarHospitales()
    .subscribe( ( hospitales: Hospital[] ) => {
      this.hospitales = hospitales;
    });
  }

  guardarMedico(): void {

    const { nombre } = this.medicoForm.value;

    if ( this.medicoSeleccionado ) {
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      };

      this.medicoService.actualizarMedico( data )
        .subscribe( resp => {
          Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success');
        });
    } else {
      // Crear
      this.medicoService.crearMedico( this.medicoForm.value )
        .subscribe( (medico: Medico) => {
          Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${ medico._id }`);
        });
    }
  }

}
