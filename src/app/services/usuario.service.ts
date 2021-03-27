import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { LoginForm } from '../interfaces/login-form.interface';

import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

const baseUrl = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  public auth2: any;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone) {
    this.googleInit();
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('xToken') || '';

    console.log('xToken del servicio');

    return this.http.get<any>(`${ baseUrl }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( resp => {
        localStorage.setItem('xToken', resp.token);
      }),
      map( resp => true ),
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
}
