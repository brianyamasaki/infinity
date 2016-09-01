import { Component} from '@angular/core';
import { InfinityCanvasComponent } from './infinity-loop.component';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  directives: [ InfinityCanvasComponent ]
})

export class HomeComponent {

  constructor() {}


}
