import { Component, OnInit, ElementRef } from '@angular/core';
import { BoardData, BoardGameMode } from '../shared/board.interface';
import { BoardService } from '../shared/board.service';
import { TileService} from '../shared/tile.service';
import { LevelsService} from '../shared/levels.service';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'infinity-canvas',
  template: '<canvas id="infinity-canvas" width="400" height="400" touch-action></canvas>',
  styleUrls: ['infinity-loop.component.css'],
  providers: [ BoardService, TileService, LevelsService ]
})

export class InfinityCanvasComponent implements OnInit {

  canvas: HTMLCanvasElement;
  boardData: BoardData;
  context: CanvasRenderingContext2D;

  constructor(public board: BoardService) {
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    let self = this,
      tileSize = 50;

    this.canvas = <HTMLCanvasElement>document.getElementById('infinity-canvas');
    if (this.canvas && this.canvas.getContext) {
      this.context = this.canvas.getContext('2d');
      this.boardData = {
        context: this.context,
        height: this.canvas.height,
        width: this.canvas.width,
        boardMargins: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        },
        boardColors: {
          foreground: '#333333',
          background: '#cccccc',
          wonForeground: '#aaaaaa',
          wonBackground: '#666666',
          gridlines: '#999999'
        },
        tileSize: tileSize,
        xTiles: this.canvas.width / tileSize,
        yTiles: this.canvas.height / tileSize,
        drawGrid: false,
        boardGameMode: BoardGameMode.play,
        startLevel: 0,
        dtWinAnimation: 400
      };

      this.board.init(this.boardData);

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
