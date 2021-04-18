import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Medico } from '../models/medico.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  get token(): string {
    return localStorage.getItem('xToken') || '';
  }

  get headers(): any  {
    return {
        'x-token': this.token
    };
  }

  constructor( private http: HttpClient ) { }

  cargarMedicos(): Observable<Medico[]> {

    const url = `${ baseUrl }/medicos/`;

    return this.http.get<{ ok: boolean, medicos: Medico[]}>( url, { headers: this.headers })
        .pipe(
          map( (resp: { ok: boolean, medicos: Medico[]}) => resp.medicos )
        );
  }

  obtenerMedicoPorId( id: string): Observable<Medico> {
    const url = `${ baseUrl }/medicos/${ id }`;

    return this.http.get<{ ok: boolean, medico: Medico}>( url, { headers: this.headers })
        .pipe(
          map( (resp: { ok: boolean, medico: Medico}) => resp.medico )
        );
  }

  crearMedico( medico: Medico ): Observable<Medico> {

    const url = `${ baseUrl }/medicos`;
    return this.http.post<{ok: boolean, medico: Medico}>(url, medico , { headers: this.headers } )
      .pipe(
        map( (resp: {ok: boolean, medico: Medico}) => resp.medico )
      )

  }

  actualizarMedico( medico: Medico ): Observable<Medico> {

    const url = `${ baseUrl }/medicos/${ medico._id }`;
    return this.http.put<Medico>(url, medico, { headers: this.headers } );
  }

  eliminarMedico( _id: string ): Observable<any> {

    const url = `${ baseUrl }/medicos/${ _id }`;
    return this.http.delete(url, { headers: this.headers } );
  }


}
