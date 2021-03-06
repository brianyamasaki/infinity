import { Injectable } from '@angular/core';
import { BoardData } from '../shared/board.interface';

export interface Tile {
  tileType: number;
  rotationCur: number;
  iRotation: number;
  color?: string;
  background?: string;
  isSelected?: boolean;
}

export interface TileConnection {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

@Injectable()
export class TileService {
  boardData: BoardData;
  twoPi = Math.PI * 2;
  mpiRotRotation = [
    0,
    Math.PI / 2,
    Math.PI,
    Math.PI * 3 / 2,
    Math.PI * 2
  ];
  rgTileConstants = [
    { // 0: empty tile

    },
    { // 1 : circle with line
      mpRotConnections: [
        { // rotation 0
          top: true,
          right: false,
          bottom: false,
          left: false
        },
        { // rotation 1
          top: false,
          right: true,
          bottom: false,
          left: false
        },
        { // rotation 2
          top: false,
          right: false,
          bottom: true,
          left: false
        },
        { // rotation 3
          top: false,
          right: false,
          bottom: false,
          left: true
        },
      ]
    },
    { // 2 : full length line
      mpRotConnections: [
        { // rotation 0
          top: true,
          right: false,
          bottom: true,
          left: false
        },
        { // rotation 1
          top: false,
          right: true,
          bottom: false,
          left: true
        },
        { // rotation 2
          top: true,
          right: false,
          bottom: true,
          left: false
        },
        { // rotation 3
          top: false,
          right: true,
          bottom: false,
          left: true
        },
      ]
    },
    { // 3 : single curve
      mpRotConnections: [
        { // rotation 0
          top: true,
          right: false,
          bottom: false,
          left: true
        },
        { // rotation 1
          top: true,
          right: true,
          bottom: false,
          left: false
        },
        { // rotation 2
          top: false,
          right: true,
          bottom: true,
          left: false
        },
        { // rotation 3
          top: false,
          right: false,
          bottom: true,
          left: true
        },
      ]
    },
      { // 4 : double curve
      mpRotConnections: [
        { // rotation 0
          top: true,
          right: false,
          bottom: true,
          left: true
        },
        { // rotation 1
          top: true,
          right: true,
          bottom: false,
          left: true
        },
        { // rotation 2
          top: true,
          right: true,
          bottom: true,
          left: false
        },
        { // rotation 3
          top: false,
          right: true,
          bottom: true,
          left: true
        },
      ]
    },
    { // 5 : triple curve
      mpRotConnections: [
        { // rotation 0
          top: true,
          right: true,
          bottom: true,
          left: true
        },
        { // rotation 1
          top: true,
          right: true,
          bottom: true,
          left: true
        },
        { // rotation 2
          top: true,
          right: true,
          bottom: true,
          left: true
        },
        { // rotation 3
          top: true,
          right: true,
          bottom: true,
          left: true
        },
      ]
    },
    { // 6 : quad curve
      mpRotConnections: [
        { // rotation 0
          top: true,
          right: true,
          bottom: true,
          left: true
        },
        { // rotation 1
          top: true,
          right: true,
          bottom: true,
          left: true
        },
        { // rotation 2
          top: true,
          right: true,
          bottom: true,
          left: true
        },
        { // rotation 3
          top: true,
          right: true,
          bottom: true,
          left: true
        },
      ]
    }

  ];

  init(boardData: BoardData) {
    this.boardData = boardData;
  }

  createTile(tileType: number, iRot: number, color?:string, background?:string) : Tile {
    let tile : Tile = {
      tileType: tileType,
      rotationCur: this.mpiRotRotation[iRot],
      iRotation: iRot,
    }
    if (color) {
      tile.color = color;
    }
    if (background) {
      tile.background = background;
    }
    return tile;
  }

  tap(tile: Tile) {
    if (tile && tile.tileType !== 0) {
      tile.iRotation = (tile.iRotation + 1) % 4;
    }
  }

  connections(tile: Tile) : TileConnection {
    if (!tile) {
      return {
        top: false,
        right: false,
        bottom: false,
        left: false
      };
    }
    return this.rgTileConstants[tile.tileType].mpRotConnections[tile.iRotation];
  }

  animate(tile: Tile, dt: number) {
    let rotNext: number,
      rotationFinal: number;
    rotationFinal = this.mpiRotRotation[tile.iRotation];
    if (tile.iRotation === 0 && tile.rotationCur > 0) {
      rotationFinal = this.twoPi;
    }
    if (tile && rotationFinal !== tile.rotationCur) {
      rotNext = tile.rotationCur + 0.2;
      if (rotNext < rotationFinal) {
        tile.rotationCur = rotNext;
      } else if (rotNext > rotationFinal) {
        tile.rotationCur = rotationFinal % this.twoPi;
      }
    }
  }

  draw(tile: Tile, iTile: number) {
    let boardData = this.boardData,
        halfTile = boardData.tileSize / 2,
        radius = halfTile / 2,
        xTile = iTile % boardData.xTiles,
        yTile = Math.floor(iTile / boardData.xTiles);
    let context = boardData.context;
    if (tile.tileType === 0) {
      return;
    }
    context.save();
    context.translate(
      boardData.boardMargins.left + xTile * boardData.tileSize + halfTile, 
      boardData.boardMargins.top + yTile * boardData.tileSize + halfTile);
    context.rotate(tile.rotationCur);
    context.lineWidth = 2;
    if (tile.color) {
      context.strokeStyle = tile.color;
    }
    if (tile.background) {
      context.fillStyle = tile.background;
      if (!tile.isSelected) {
        context.fillRect(-halfTile, -halfTile, boardData.tileSize, boardData.tileSize);
      }
      context.strokeRect(-halfTile, -halfTile, boardData.tileSize, boardData.tileSize);
    }
    context.beginPath();
    // we pretend to draw on a tile centered on 0,0 - the translate and rotate will draw where we want it
    switch(tile.tileType) {
      case -1:
        context.fillStyle = context.strokeStyle;
        context.font = '30px glyphicon';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(String.fromCharCode(0xe221), 0, 0);
        break;
      case 0:
        break;
      case 1:
        // circle with line
        context.arc(0, 0, radius, 0, Math.PI*2);
        context.moveTo(0, -halfTile / 2);
        context.lineTo(0, -halfTile);
        break;
      case 2:
        // straight line
        context.moveTo(0, -halfTile);
        context.lineTo(0, halfTile);
        break;
      case 3:
        // quarter circle
        context.arc(-halfTile, -halfTile, halfTile, 0, Math.PI / 2, false);
        break;
      case 4:
        // two quarter circles
        context.arc(-halfTile, -halfTile, halfTile, 0, Math.PI / 2, false);
        context.arc(-halfTile, halfTile, halfTile, Math.PI * 3 / 2, 0, false);
        break;
      case 5:
        // three quarter circles
        context.arc(-halfTile, -halfTile, halfTile, 0, Math.PI / 2, false);
        context.arc(-halfTile, halfTile, halfTile, Math.PI * 3 / 2, 0, false);
        context.arc(halfTile, halfTile, halfTile, Math.PI, Math.PI * 3 / 2, false);
        break;
      case 6:
        // four quarter circles
        context.arc(-halfTile, -halfTile, halfTile, 0, Math.PI / 2, false);
        context.arc(-halfTile, halfTile, halfTile, Math.PI * 3 / 2, 0, false);
        context.arc(halfTile, halfTile, halfTile, Math.PI, Math.PI * 3 / 2, false);
        context.arc(halfTile, -halfTile, halfTile, Math.PI / 2, Math.PI, false);
        break;
    }
    context.stroke();
    context.restore();
  }
};
