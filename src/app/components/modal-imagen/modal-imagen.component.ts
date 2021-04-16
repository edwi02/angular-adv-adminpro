import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-model-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  // public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor( public modalImagenService: ModalImagenService,
               public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal(): void {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen( file: File ): void {
    this.imagenSubir = file;

    if ( !file ) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result);
    };
  }

  subirImagen(): void {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;


    this.fileUploadService
      .actualizarFoto( this.imagenSubir, tipo, id )
      .then( img => {

        Swal.fire('Guardado', 'Imagen actializada.', 'success');

        this.modalImagenService.nuevaImagen.emit(img);

        this.cerrarModal();

      }).catch( err => {
        console.log(err);
      });
  }




}
