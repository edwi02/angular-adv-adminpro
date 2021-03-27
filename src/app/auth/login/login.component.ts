import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmmited = false;
  public auth2: any;

  public loginForm: FormGroup = this.fb.group({
    email: [ localStorage.getItem('email') || 'test1@gmail.com', [ Validators.required, Validators.email ] ], // test1@gmail.com
    password: ['123asd*', [ Validators.required ] ], // 123asd*
    remember: [ false ]
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone ) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login(): void {
    this.usuarioService.login( this.loginForm.value )
      .subscribe( resp => {

        if ( this.loginForm.get('remember').value ) {
          localStorage.setItem('email', this.loginForm.get('email').value );
        } else {
          localStorage.removeItem('email');
        }

        // Navegar al dashboard
        this.router.navigateByUrl('/');

      }, (err) => {
        // Si sucede un error
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error');
      });

  }

/*   onSuccess(googleUser): void {
    const id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);

    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  }

  onFailure(error): void {
    console.log(error);
  }
 */

  renderButton(): void {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark'
    });

    this.startApp();
  }

  async startApp(): Promise<void> {

    this.auth2 = await this.usuarioService.googleInit();

    this.attachSignin( document.getElementById('my-signin2') );
  }

  attachSignin(element): void {

    this.auth2.attachClickHandler(element, {},
        (googleUser) => {

          const id_token = googleUser.getAuthResponse().id_token;
          // console.log(id_token);
          this.usuarioService.loginGoogle( id_token ).subscribe( resp => {
            // Navegar al dashboard
            this.ngZone.run( () => {
              this.router.navigateByUrl('/');
            })
          });

        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
