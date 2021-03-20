import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // const promesa = new Promise( (resolve, reject) => {

    //   console.log('Hi Edwin!!');
    //   if (false) {
    //     resolve('Texto');
    //   } else {
    //     reject('Algo salio mal');
    //   }
    // });

    // promesa
    //   .then( (mensaje) => {
    //     console.log('Hey terminado!', mensaje);
    //   })
    //   .catch( error => console.log('Error en mi promesa', error) );

    // console.log('Fin del Init');

    // this.getUsuarios( );

    this.getUsuarios().then( usuarios => {
      console.log(usuarios);
    });
  }

  getUsuarios(): any {

    return new Promise( resolve => {
      fetch('https://reqres.in/api/users?page=2')
        .then( resp => resp.json() )
        .then( body => console.log(body.data) );
    });

  }

}
