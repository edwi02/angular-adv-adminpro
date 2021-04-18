import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const baseUrl = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform( img: string, tipo: 'usuarios'|'medicos'|'hospitales'): string {

    if ( !img ) {
      return `${ baseUrl }/upload/${ tipo }/no-image.jpg`;
  } else if ( img.includes('https') ) {
      return img;
  } else if ( img ) {
      return `${ baseUrl }/upload/${ tipo }/${ img }`;
  } else {
      return `${ baseUrl }/upload/${ tipo }/no-image.jpg`;
  }

  }

}
