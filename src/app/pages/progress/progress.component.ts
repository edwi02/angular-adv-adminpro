import { Component } from '@angular/core';

@Component({
  selector: 'app-progess',
  templateUrl: './progress.component.html',
  styleUrls: [ './progress.component.css'],
})
export class ProgressComponent {

  progreso1 = 30;
  progreso2 = 70;

  get getProgreso1(): string {
    return ` ${ this.progreso1 }%`;
  }

  get getProgreso2(): string {
    return ` ${ this.progreso2 }%`;
  }


}
