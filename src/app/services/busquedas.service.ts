import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.mode';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';


const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('xToken') || '';
  }

  get headers(): any  {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  private transformarUsuarios( resultados: any[] ): Usuario[] {

    return resultados.map(
      user => new Usuario( user.nombre, user.email, user.role, '', user.img, user.google, user.uid )
    );
  }

  private transformarHospitales(resultados: Hospital[] ): Hospital[] {
    return resultados;
    /* return resultados.map(
      hospital => new Hospital( hospital.nombre, hospital._id, hospital.img, hospital.Usuario )
    ); */
  }

  private transformarMedicos( resultados: Medico[] ): Medico[] {
    return resultados;
  }

  buscar(
    tipo: 'usuarios'|'medicos'|'hospitales',
    termino: string
    ): Observable<any[]> {
    const url = `${ baseUrl }/todo/coleccion/${ tipo }/${ termino }`;

    return this.http.get<any[]>(url, this.headers )
      .pipe(
        map( ( resp: any ) => {
          switch ( tipo ) {
            case 'usuarios':
              return this.transformarUsuarios( resp.resultados );

            case 'hospitales':
              return this.transformarHospitales( resp.resultados );

            case 'medicos':
              return this.transformarMedicos( resp.resultados );

            default:
              return [];
          }
        } )
      );
  }

}
