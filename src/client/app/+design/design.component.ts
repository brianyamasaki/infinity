import { Component } from '@angular/core';
import { InfinityDesignCanvasComponent } from './infinity-design.component';
import { DesignToolsComponent } from './design-tools.component';
import { BoardService } from '../shared/board.service';
import { TileService } from '../shared/tile.service';
import { LevelsService} from '../shared/levels.service';

/**
 * This class represents the lazy loaded DesignComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-design',
  templateUrl: 'design.component.html',
  styleUrls: ['design.component.css'],
  directives: [InfinityDesignCanvasComponent, DesignToolsComponent],
  providers: [TileService, BoardService, LevelsService]
})
export class DesignComponent { }
