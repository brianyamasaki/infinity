import { Component, OnInit, ElementRef } from '@angular/core';
import { BoardData } from './board.interface';
import { BoardService } from './board.service';
import { TileService} from './tile.service';
import { LevelsService} from '../shared/levels.service';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'infinity-canvas',
  template: '<canvas id="infinity-canvas" width="600" height="600" touch-action></canvas>',
  styleUrls: ['infinity-loop.component.css'],
  providers: [ BoardService, TileService, LevelsService ]
})

export class InfinityCanvasComponent implements OnInit {

  canvas: HTMLCanvasElement;
  boardData: BoardData;
  context: CanvasRenderingContext2D;
  tileSize = 50;
  self = this;

  constructor(public elem: ElementRef,
              public board: BoardService) {
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    let self = this;

    this.canvas = <HTMLCanvasElement>document.getElementById('infinity-canvas');
    if (this.canvas && this.canvas.getContext) {
      this.context = this.canvas.getContext('2d');
      this.boardData = {
        context: this.context,
        height: 600,
        width: 600,
        tileSize: 50,
        xTiles: 600 / 50,
        yTiles: 600 / 50,
        drawGrid: false,
        dtWinAnimation: 400
      };

      this.board.init(this.boardData);
      this.board.loadLevel();

      function drawFrame(t: number) {
        let tNow = new Date().getTime();
        window.requestAnimationFrame(drawFrame);
        self.board.animate(tNow);
        self.board.draw(tNow);
      }

      window.requestAnimationFrame(drawFrame);


      this.canvas.addEventListener('pointerdown', (event) => {

        this.board.tapTile(event.x - this.canvas.offsetLeft,
            event.y - this.canvas.offsetTop);
      });
    }
  }

}
