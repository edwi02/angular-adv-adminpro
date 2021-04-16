import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';

import { Observable, of, pipe } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.mode';

const baseUrl = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  public auth2: any;
  public usuario: Usuario;

  get token(): string {
    return localStorage.getItem('xToken') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers(): any  {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone) {
    this.googleInit();
  }

  validarToken(): Observable<boolean> {

    console.log('xToken del servicio');

    return this.http.get<any>(`${ baseUrl }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( resp => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        console.log('Usuario', resp.usuario);
        this.usuario = new Usuario(nombre, email, role, '', img, google, uid );
        localStorage.setItem('xToken', resp.token);

        return true;
      }),
      catchError( error => of(false) )
    );

  }


  crearUsuario( formData: RegisterForm ): Observable<any>  {

    return this.http.post<any>(`${ baseUrl }/usuarios`, formData )
              .pipe(
                tap( resp => {
                  localStorage.setItem('xToken', resp.token);
                })
            );

  }

  actualizarPerfil( data: { email: string, nombre: string, role: string } ): Observable<any> {

    data = {
      ...data ,
      role: this.usuario.role
    };

    return this.http.put<any>(`${ baseUrl }/usuarios/${ this.uid }`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }


  logout(): void {
    localStorage.removeItem('xToken');
    this.auth2.signOut().then( () => {

      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      });

    });
  }

  login( formData: LoginForm ): Observable<any> {
    return this.http.post<any>(`${ baseUrl }/login`, formData )
          .pipe(
            tap( resp => {
              localStorage.setItem('xToken', resp.token);
            })
          );
  }

  googleInit(): any {

    return new Promise( resolve => {

      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '4321327710-l5f1g6gmaq3klj410unkaco462q08r4m.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          // scope: 'additional_scope'
        });

        resolve( this.auth2 );
      });

    });

  }

  loginGoogle( token: string ): Observable<any> {
    return this.http.post<any>(`${ baseUrl }/login/google`, { token } )
          .pipe(
            tap( resp => {
              localStorage.setItem('xToken', resp.token);
            })
          );
  }

  cargarUsuarios( desde: number = 0 ): Observable<any> {
    const url = `${ baseUrl }/usuarios?desde=${ desde }`;

    return this.http.get<CargarUsuario>(url, this.headers )
            .pipe(
              map( resp => {
                console.log(resp);

                // tslint:disable-next-line:no-string-literal
                const usuarios = resp['usuarios'].map(
                  user => new Usuario( user.nombre, user.email, user.role, '', user.img, user.google, user.uid )
                );

                console.log('Usrs', usuarios);

                return {
                  // tslint:disable-next-line:no-string-literal
                  total: resp['total'],
                  usuarios
                };

                // return resp;
              })
            );
    // return this.http.get<CargarUsuario>(url );
  }

  eliminarUsuario( usuario: Usuario ): Observable<any> {

    const url = `${ baseUrl }/usuarios/${ usuario.uid }`;

    return this.http.delete( url, this.headers );
  }

  guardarUsuario( usuario: Usuario ): Observable<any> {

    /* data = {
      ...data ,
      role: this.usuario.role
    }; */

    return this.http.put<Usuario>(`${ baseUrl }/usuarios/${ usuario.uid }`, usuario, this.headers );
  }
}
