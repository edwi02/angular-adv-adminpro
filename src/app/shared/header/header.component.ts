import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.mode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public usuario: Usuario;

  constructor(private usuarioService: UsuarioService) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.usuarioService.logout();
  }

}
