import { environment } from '../../environments/environment.prod';

const baseUrl = environment.base_url;

export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public role?: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public uid?: string
        ) { }

    get imageUrl(): string {
        // localhost:3005/api/upload/usuarios/no-image

        if ( this.img.includes('https') ) {
            return this.img;
        }

        if ( this.img ) {
            return `${ baseUrl }/upload/usuarios/${ this.img }`;
        } else {
            return `${ baseUrl }/upload/usuarios/no-image.jpg`;
        }
    }

}
