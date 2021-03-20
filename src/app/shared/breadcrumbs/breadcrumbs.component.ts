import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Data, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  titulo = '';
  tituloSubs$: Subscription;

  constructor( private router: Router, private route: ActivatedRoute ) {


    // console.log(route.snapshot.children[0].data );

    this.tituloSubs$ = this.getAgurmentosRuta()
      .subscribe( ({ titulo }) => {
        this.titulo = titulo;
        document.title = `AdminPro - ${ titulo }`;
      });
  }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getAgurmentosRuta(): Observable<Data> {

    return this.router.events
      .pipe(
        filter( event => event instanceof ActivationEnd ),
        filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
        map( (event: ActivationEnd) => event.snapshot.data )
      );
  }

}
