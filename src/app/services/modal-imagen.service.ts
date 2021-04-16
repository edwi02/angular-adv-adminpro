import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  // tslint:disable-next-line:variable-name
  private _ocultarModal = true;
  public tipo: 'usuarios'|'medicos'|'hospitales';
  public id = '';
  public img = '';

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(): boolean {
    return this._ocultarModal;
  }

  constructor() { }

  abrirModal(
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string,
    img: string = 'no-img'
  ): void {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    this.img = img;

    // api/upload/usuarios/c50320da-36ab-4f47-a091-e6597a547572.jpg
    if ( img.includes('https' )) {
      this.img = img;
    } else {
      this.img = `${ baseUrl }/upload/${ tipo }/${ img }`;
    }
    console.log(this.img);
    
  }

  cerrarModal(): void {
    this._ocultarModal = true;
  }

}
