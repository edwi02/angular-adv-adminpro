import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [];

  cargarMenu(): any {
    return this.menu = JSON.parse(localStorage.getItem('menu')) || [];

    // Si el menú no carga. Validar si se redirecciona al usuario
    if (this.menu.length === 0 ) {

    }
  }
  // menu: any[] = [
  //   {
  //     titulo: 'Dashboard',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Main', url: '/' },
  //       { titulo: 'Gráfica', url: 'grafica1' },
  //       { titulo: 'ProgressBar', url: 'progress' },
  //       { titulo: 'Promesas', url: 'promesas' },
  //       { titulo: 'RxJs', url: 'rxjs' },
  //     ]
  //   },

  //   {
  //     titulo: 'Mantenimientos',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url: 'usuarios' },
  //       { titulo: 'Hospitales', url: 'hospitales' },
  //       { titulo: 'Medicos', url: 'medicos' }
  //     ]
  //   }
  // ];

  constructor() { }
}
