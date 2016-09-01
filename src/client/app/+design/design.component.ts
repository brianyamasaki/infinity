import { Component } from '@angular/core';
import { InfinityDesignCanvasComponent } from './infinity-design.component';

/**
 * This class represents the lazy loaded DesignComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-design',
  templateUrl: 'design.component.html',
  styleUrls: [],
  directives: [InfinityDesignCanvasComponent]
})
export class DesignComponent { }
