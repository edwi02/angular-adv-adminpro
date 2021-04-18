import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  get token(): string {
    return localStorage.getItem('xToken') || '';
  }

  get headers(): any  {
    return {
        'x-token': this.token
    };
  }

  constructor( private http: HttpClient ) { }

  cargarHospitales( ): Observable<Hospital[]> {

    const url = `${ baseUrl }/hospitales`;
    return this.http.get<{ ok: boolean, hospitales: Hospital[] }>(url, { headers: this.headers } )
            .pipe(
              map( (resp: { ok: boolean, hospitales: Hospital[] } ) => resp.hospitales )
            );

  }

  crearHospital( nombre: string ): Observable<Hospital> {

    const url = `${ baseUrl }/hospitales`;
    return this.http.post<Hospital>(url, { nombre } , { headers: this.headers } );

  }

  actualizarHospital( _id: string, nombre: string ): Observable<Hospital> {

    const url = `${ baseUrl }/hospitales/${ _id }`;
    return this.http.put<Hospital>(url, { nombre } , { headers: this.headers } );
  }

  eliminarHospital( _id: string ): Observable<any> {

    const url = `${ baseUrl }/hospitales/${ _id }`;
    return this.http.delete(url, { headers: this.headers } );
  }

}
