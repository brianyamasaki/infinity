import { Component, OnInit } from '@angular/core';
import { BoardData, BoardGameMode } from '../shared/board.interface';
import { BoardService } from '../shared/board.service';

@Component({
  moduleId: module.id,
  selector: 'design-tools',
  templateUrl: 'design-tools.component.html',
  styleUrls: ['design-tools.component.css'],
  directives: [],
})

export class DesignToolsComponent implements OnInit {
  canvas: HTMLCanvasElement;
  boardData: BoardData;
  context: CanvasRenderingContext2D;

  constructor(public board: BoardService)
  {}

  ngOnInit() {
    let self = this,
      tileSize = 50,
      color = '#333399',
      background = '#6699ff',
      board = this.board;

    this.canvas = <HTMLCanvasElement>document.getElementById('design-tools-canvas');
    if (this.canvas && this.canvas.getContext) {
      this.context = this.canvas.getContext('2d');
      this.boardData = {
        context: this.context,
        height: this.canvas.height,
        width: this.canvas.width,
        boardMargins: {
          top: 2,
          left: 50,
          bottom: 2,
          right: 50
        },
        boardColors: {
          foreground: '#333333',
          background: '#ffffff',
          wonForeground: '#aaaaaa',
          wonBackground: '#666666',
          gridlines: '#333333'
        },
        tileSize: tileSize,
        xTiles: 6,
        yTiles: 1,
        drawGrid: false,
        boardGameMode: BoardGameMode.toolbar,
        startLevel: 0,
        dtWinAnimation: 400
      };

      board.init(this.boardData);

      board.setTile(0, 0, 1, 0, color, background);
      board.setTile(1, 0, 2, 0, color, background);
      board.setTile(2, 0, 3, 0, color, background);
      board.setTile(3, 0, 4, 0, color, background);
      board.setTile(4, 0, 6, 0, color, background);
      board.setTile(5, 0, -1, 0, color, background);

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