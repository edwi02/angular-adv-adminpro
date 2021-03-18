import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component implements OnInit {

  labels2: string[] = ['1', '2', '3'];
  data1 = [
    [50, 10, 70],
  ];

  constructor() { }

  ngOnInit(): void {
  }


}
