import { Component, OnInit, ElementRef } from '@angular/core';
import { BoardData } from '../shared/board.interface';
import { BoardService } from '../shared/board.service';
import { TileService} from '../shared/tile.service';
import { LevelsService} from '../shared/levels.service';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'infinity-design',
  template: '<canvas id="infinity-design-canvas" width="400" height="400" touch-action></canvas>',
  styles: [
    `
    #infinity-design-canvas {
      border:1px solid black;
    }
    `
  ],
  providers: [ BoardService, TileService, LevelsService ]
})

export class InfinityDesignCanvasComponent implements OnInit {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  boardData: BoardData;

  constructor(public board: BoardService) {}
  
  ngOnInit() {
    let self = this,
      tileSize = 50;

    this.canvas = <HTMLCanvasElement>document.getElementById('infinity-design-canvas');
    if (this.canvas && this.canvas.getContext) {
      this.context = this.canvas.getContext('2d');
      this.boardData = {
        context: this.context,
        height: this.canvas.height,
        width: this.canvas.width,
        tileSize: tileSize,
        xTiles: this.canvas.width / tileSize,
        yTiles: this.canvas.height / tileSize,
        drawGrid: true,
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
