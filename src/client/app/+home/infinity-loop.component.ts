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
    let x: number,
      y: number,
      i: number,
      boardData = this.boardData,
      self = this;

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
        drawGrid: false
      };

      this.board.init(this.boardData);
      this.board.loadLevel(1);

      function drawFrame(t: number) {

        window.requestAnimationFrame(drawFrame);
        self.board.draw(t);
      }

      window.requestAnimationFrame(drawFrame);


      this.canvas.addEventListener('pointerdown', (event) =>{
        let xTile = Math.floor((event.x - this.canvas.offsetLeft)/ this.tileSize),
          yTile = Math.floor((event.y - this.canvas.offsetTop) / this.tileSize);
        
        this.board.tapTile(xTile, yTile);
      });
    }
  }

}
