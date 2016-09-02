import { Injectable } from '@angular/core';
import { TileService, Tile, TileConnection } from '../shared/tile.service';
import { BoardData, BoardGameMode } from './board.interface';
import { LevelsService} from '../shared/levels.service';
import * as _ from 'lodash';

class TileNeighbors {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

@Injectable()
export class BoardService {
  boardData: BoardData;
  tiles: Tile[];
  timeout: number;
  curLevel: number;
  tap:any;
  tAnimationStart: number;
  selectedTile: Tile;

  constructor(public tileService: TileService,
    public levelsService: LevelsService) {}

  init(boardData: BoardData) {
    this.boardData = boardData;
    this.tiles = [];
    this.curLevel = boardData.startLevel;
    this.tileService.init(boardData);
    switch(boardData.boardGameMode) {
      case BoardGameMode.play:
        this.loadLevel();
        boardData.boardGameMode = BoardGameMode.play;
        break;
      default: 
        break;
    }
  }

  loadLevel() {
    let level = this.levelsService.getLevel(this.curLevel);
    if (level) {
      level.tiles.forEach((tile) => {
        this.setTile(tile.column, tile.row, tile.type, tile.rotation);
      });
      if (level.colors) {
        this.boardData.boardColors = level.colors;
      }
    } else {
      alert('No more levels');
    }
  }

  setTile(xTile:number, yTile: number, tileType: number, iRot: number, color?: string, background?: string) {
    this.tiles[yTile * this.boardData.xTiles + xTile] = this.tileService.createTile(tileType, iRot, color, background);
  }

  tapTile(xClick: number, yClick: number) {
    let boardData = this.boardData,
      tileSize = this.boardData.tileSize,
      xTile = Math.floor((xClick - boardData.boardMargins.left) / tileSize),
      yTile = Math.floor((yClick - boardData.boardMargins.top) / tileSize),
      tile = this.tiles[yTile * this.boardData.xTiles + xTile],
      self = this;

    switch(boardData.boardGameMode) {
      case BoardGameMode.won:
        this.curLevel++;
        boardData.boardGameMode = BoardGameMode.play;
        this.loadLevel();
        break;
      case BoardGameMode.play:
        this.tileService.tap(tile);
        if (this.timeout !== undefined) {
          window.clearTimeout(this.timeout);
        }
        this.timeout = window.setTimeout(() => {
          this.timeout = undefined;
          if (self.checkForWin()) {
            boardData.boardGameMode = BoardGameMode.winAnimation;
            this.tAnimationStart = new Date().getTime();
          }
        }, 200);
        this.tap = {
          x: xClick,
          y: yClick
        };
        break;
      case BoardGameMode.toolbar:
        if (this.selectedTile) {
          this.selectedTile.isSelected = false;
        }
        this.selectedTile = tile;
        tile.isSelected = true;
        break;
      case BoardGameMode.design:
        let tileT = this.tiles[yTile * boardData.xTiles + xTile]; 
        if (tileT) {
          tileT.iRotation = (tileT.iRotation + 1) % 4;
        } else {
          this.setTile(xTile, yTile, 3, 0);
        }
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
    switch (this.boardData.boardGameMode) {
      case BoardGameMode.winAnimation:
        if (t - this.tAnimationStart > this.boardData.dtWinAnimation) {
          this.boardData.boardGameMode = BoardGameMode.won;
        }
        break;
    }
  }

  draw(t: number) {
    let boardData = this.boardData;
    let ctx = boardData.context;

    // erase board
    switch(boardData.boardGameMode) {
      case BoardGameMode.play:
      case BoardGameMode.winAnimation:
      case BoardGameMode.design:
      case BoardGameMode.toolbar:
        ctx.fillStyle = boardData.boardColors.background;
        ctx.strokeStyle = boardData.boardColors.foreground;
        break;
      case BoardGameMode.won:
        ctx.fillStyle = boardData.boardColors.wonBackground;
        ctx.strokeStyle = boardData.boardColors.wonForeground;
        break;
    }
    ctx.fillRect(0,0, 600, 600);

    // draw the expanding circle for the game win animation
    if (boardData.boardGameMode === BoardGameMode.winAnimation) {
      ctx.save();
      ctx.fillStyle = boardData.boardColors.wonBackground;
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
      let x: number,
        y: number,
        i: number,
        yTop: number = boardData.boardMargins.top,
        xLeft: number = boardData.boardMargins.left,
        gridHeight = boardData.height - boardData.boardMargins.top - boardData.boardMargins.bottom,
        gridWidth = boardData.width - boardData.boardMargins.left - boardData.boardMargins.right;

      ctx.save();
      ctx.fillStyle = boardData.boardColors.gridlines;
      for(i = 0, x=boardData.boardMargins.left; i <= boardData.xTiles; x += boardData.tileSize, i++) {
        ctx.fillRect(x, yTop, 1, gridHeight);
      }
      for (i = 0, y=boardData.boardMargins.top; i <= boardData.yTiles; y += boardData.tileSize, i++) {
        ctx.fillRect(xLeft, y, gridWidth, 1);
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