import { Injectable } from '@angular/core';
import { TileService, Tile, TileConnection } from '../shared/tile.service';
import { BoardData } from './board.interface';
import { LevelsService} from '../shared/levels.service';
import * as _ from 'lodash';

class TileNeighbors {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
enum GameMode {
  play = 1,
  winAnimation,
  won
}

@Injectable()
export class BoardService {
  boardData: BoardData;
  tiles: Tile[];
  timeout: number;
  curLevel = 0;
  gameMode = GameMode.play;
  colors = {
    foreground: '#333333',
    background: '#cccccc',
    wonForeground: '#aaaaaa',
    wonBackground: '#666666'
  };
  tap:any;
  tAnimationStart: number;

  constructor(public tileService: TileService,
    public levelsService: LevelsService) {}

  init(boardData: BoardData) {
    this.boardData = boardData;
    this.tiles = [];
    this.tileService.init(boardData);
  }

  loadLevel() {
    let level = this.levelsService.getLevel(this.curLevel);
    if (level) {
      level.tiles.forEach((tile) => {
        this.setTile(tile.column, tile.row, tile.type, tile.rotation);
      });
      if (level.colors) {
        this.colors = level.colors;
      }
    } else {
      alert('No more levels');
    }
  }

  setTile(xTile:number, yTile: number, tileType: number, iRot: number) {
    this.tiles[yTile * this.boardData.xTiles + xTile] = this.tileService.createTile(tileType, iRot);
  }

  tapTile(xClick: number, yClick: number) {
    let tileSize = this.boardData.tileSize,
      xTile = Math.floor(xClick/ tileSize),
      yTile = Math.floor(yClick / tileSize),
      tile = this.tiles[yTile * this.boardData.xTiles + xTile],
      self = this;

    switch(this.gameMode) {
      case GameMode.won:
        this.curLevel++;
        this.gameMode = GameMode.play;
        this.loadLevel();
        break;
      case GameMode.play:
        this.tileService.tap(tile);
        if (this.timeout !== undefined) {
          window.clearTimeout(this.timeout);
        }
        this.timeout = window.setTimeout(() => {
          this.timeout = undefined;
          if (self.checkForWin()) {
            this.gameMode = GameMode.winAnimation;
            this.tAnimationStart = new Date().getTime();
          }
        }, 200);
        this.tap = {
          x: xClick,
          y: yClick
        };
        break;
      default:
        break;
    }
  }

  tileNeighbors(i:number) : TileNeighbors {
    let xTiles = this.boardData.xTiles,
      x = i % xTiles,
      y = Math.floor(i / xTiles);

    return {
      top:  y === 0 ? undefined : i - xTiles,
      right: (x === xTiles - 1) ? undefined : i + 1,
      bottom: (y === this.boardData.yTiles - 1) ? undefined : i + xTiles,
      left: x === 0 ? undefined : i - 1
    };
  }


  checkForWin() {
    let win: boolean;
    win = _.every(this.tiles, (tile, i) => {
      let connections : TileConnection,
        neighbors: TileNeighbors,
        retval = false;

      if (tile && tile.tileType !== 0) {
        connections = this.tileService.connections(tile);
        neighbors = this.tileNeighbors(i);
        if (connections.top === (neighbors.top !== undefined && this.tileService.connections(this.tiles[neighbors.top]).bottom) &&
          connections.right === (neighbors.right !== undefined && this.tileService.connections(this.tiles[neighbors.right]).left) &&
          connections.bottom === (neighbors.bottom !== undefined && this.tileService.connections(this.tiles[neighbors.bottom]).top) &&
          connections.left === (neighbors.left !== undefined && this.tileService.connections(this.tiles[neighbors.left]).right)
          ) {
            retval = true;
          }
      } else {
        retval = true;
      }
      return retval;
    });
    return win;
  }

  animate(t: number) {
    switch (this.gameMode) {
      case GameMode.winAnimation:
        if (t - this.tAnimationStart > this.boardData.dtWinAnimation) {
          this.gameMode = GameMode.won;
        }
        break;
    }
  }

  draw(t: number) {
    let boardData = this.boardData;
    let ctx = boardData.context;

    // erase board
    switch(this.gameMode) {
      case GameMode.play:
      case GameMode.winAnimation:
        ctx.fillStyle = this.colors.background;
        ctx.strokeStyle = this.colors.foreground;
        break;
      case GameMode.won:
        ctx.fillStyle = this.colors.wonBackground;
        ctx.strokeStyle = this.colors.wonForeground;
        break;
    }
    ctx.fillRect(0,0, 600, 600);

    if (this.gameMode === GameMode.winAnimation) {
      ctx.save();
      ctx.fillStyle = this.colors.wonBackground;
      ctx.beginPath();
      ctx.arc(this.tap.x, 
          this.tap.y, 
          (t - this.tAnimationStart) / boardData.dtWinAnimation * boardData.height,
          0, 
          Math.PI*2);
      ctx.fill();
      ctx.restore();
    }

    // draw gridlines
    if (boardData.drawGrid) {
      let x: number, y: number;

      ctx.save(); 
      ctx.fillStyle = "#cccccc"
      for(x=0; x <= boardData.width; x += boardData.tileSize) {
        ctx.fillRect(x, 0, 1, boardData.height);
      }
      for (y=0; y <= boardData.height; y += boardData.tileSize) {
        ctx.fillRect(0, y, boardData.width, 1);
      }
      ctx.restore();
    }

    // draw tiles
    this.tiles.forEach((tile, i) => {
      if (tile && tile.tileType !== 0) {
        this.tileService.animate(tile, 0);
        this.tileService.draw(tile, i);
      }
    });
  }


}