import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.mode';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public usuario: Usuario;

  constructor(private usuarioService: UsuarioService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.usuarioService.logout();
  }

  buscar( termino: string ): any {

    if (termino.length === 0) {
      return this.router.navigateByUrl('/dashboard');
    }

    this.router.navigateByUrl(`/dashboard/buscar/${ termino }`);
  }

}
