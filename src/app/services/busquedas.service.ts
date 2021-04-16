import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.mode';


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

            default:
              return [];
          }
        } )
      );
  }

}
