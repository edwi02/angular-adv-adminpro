import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { map, retry, take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  intervalSub: Subscription;

  constructor() {

    // this.retornaObservable()
    // .pipe(
    //   retry(1)
    // )
    // .subscribe(
    //   valor => console.log('Subs', valor),
    //   error => console.warn('Error:', error),
    //   () => console.table({msg: 'Obs terminado'})
    // );

    this.intervalSub = this.retornaIntervalo()
    // .pipe(
    //   map( val => {
    //     return val * val;
    //   })
    // )
      // .subscribe( resp => console.log(resp) );
      .subscribe( console.log );
  }

  ngOnDestroy(): void {
    this.intervalSub.unsubscribe();
  }

  ngOnInit(): void {
  }

  retornaIntervalo(): Observable<number> {
    return interval(250).pipe(
            take(20),
            map( valor =>  valor + 1 ),
            filter( (valor) => (valor % 2 === 0) ? true : false )
          );
  }

  retornaObservable(): Observable<number> {
    let i = -1;
    const obs$ = new Observable<number>( observer => {

      const intervalo = setInterval( () => {

        i++;
        observer.next(i);

        if (i === 4 ) {
          clearInterval( intervalo );
          observer.complete();
        }

        if ( i === 2) {
          console.log('i = 2 ... error ');
          observer.error('i llego al valor de 2');
        }

      }, 1000 );
    });

    return obs$;
  }


}
