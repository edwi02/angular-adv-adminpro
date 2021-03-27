import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  public formSubmmited = false;

  public registerForm: FormGroup = this.fb.group({
    nombre: ['Test', [ Validators.required, Validators.minLength(3) ] ],
    email: ['test1@gmail.com', [ Validators.required, Validators.email ] ],
    password: ['123asd*', [ Validators.required ] ],
    password2: ['123asd*', [ Validators.required ] ],
    terminos: [ false , [ Validators.required ] ],
  }, {
    validators: this.passwordIguales( 'password', 'password2' )
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router) { }

  crearUsuario(): void {
    this.formSubmmited = true;
    console.log( this.registerForm.value );

    if ( this.registerForm.invalid ) {
      return;
    } else {
      // Realizar creación
      this.usuarioService.crearUsuario( this.registerForm.value )
          .subscribe( res => {
            // Navegar al dashboard
            this.router.navigateByUrl('/');
          }, (err) => {
            Swal.fire('Error', err.error.msg, 'error');
          });
    }
  }

  campoNoValido( campo: string ): boolean {

    if (this.registerForm.get(campo).invalid && this.formSubmmited ) {
      return true;
    } else {
      return false;
    }

  }
  contrasenasNoValidas(): boolean {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if ( (pass1 !== pass2) && this.formSubmmited ) {
      return true;
    } else {
      return false;
    }

  }

  aceptaTerminos(): boolean {
    return !this.registerForm.get('terminos').value && this.formSubmmited;
  }

  passwordIguales( pass1Name: string, pass2Name: string): any {

    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }

    }

  }


}
