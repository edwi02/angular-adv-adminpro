import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.mode';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private busquedasService: BusquedasService ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe( ({ termino }) => this.busquedaGlobal( termino ));
  }

  busquedaGlobal( termino: string ): void {
    this.busquedasService.busquedaGlobal( termino )
      .subscribe( resp => {
        console.log(resp);

        this.usuarios   = resp.usuarios;
        this.medicos    = resp.medicos;
        this.hospitales = resp.hospitales;
      });
  }

  abrirMedico( medico: Medico ): any {
    console.log("mEidoc", medico);
    
  }

}
