import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.mode';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  // public menuItems: any[];
  public usuario: Usuario;


  constructor( public sideBarService: SidebarService,
               private usuarioService: UsuarioService ) {
    // this.menuItems = sideBarService.menu;
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.usuarioService.logout();
  }

}
